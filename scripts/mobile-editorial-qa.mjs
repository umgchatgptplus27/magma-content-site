import fs from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] ?? "https://www.eurachoachoa.com";
const out = process.argv[3] ?? "/tmp/magma-mobile-qa";
await fs.mkdir(out, { recursive: true });
const targets = await (await fetch("http://127.0.0.1:9399/json/list")).json();
const target = targets.find(t => t.type === "page");
if (!target) throw new Error("No isolated Chrome page");
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let id = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject, timer } = pending.get(message.id);
    clearTimeout(timer); pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error))); else resolve(message.result);
  }
};
function cdp(method, params = {}) {
  const requestId = ++id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 45000);
    pending.set(requestId, { resolve, reject, timer });
    ws.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const urls = ["/", "/about", "/blog", "/blog/page/2", "/blog/page/10", "/blog/mens-tshirt-neckline-care-guide", "/blog/mens-autumn-minimal-office-set-up-guide"];
const allPosts = process.env.ALL_POSTS === '1';
if (allPosts) {
  const audit = JSON.parse(await fs.readFile('docs/content-overlap-audit.json', 'utf8'));
  urls.splice(0, urls.length, ...audit.nearest.map(entry => '/blog/' + entry.slug));
  if (new Set(urls).size !== audit.publicCount) throw new Error('Inventory count mismatch');
}
const records = [];
try {
  await cdp("Page.enable");
  for (const width of (allPosts ? [320] : [320, 390, 768])) {
    await cdp("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: 1, mobile: true });
    for (const url of urls) {
      const nav = await cdp("Page.navigate", { url: base + url });
      if (nav.errorText) throw new Error(nav.errorText);
      await evaluate(`new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          if (location.pathname === ${JSON.stringify(url)} && document.readyState === 'complete') resolve(true);
          else if (Date.now()-start > 30000) reject(new Error('Load timeout'));
          else setTimeout(check, 100);
        }; check();
      })`);
      await evaluate("document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))");
      await evaluate(`Promise.all([...document.images].map(async img => { img.loading = 'eager'; await Promise.race([img.decode().catch(()=>null), new Promise(r=>setTimeout(r,10000))]); }))`);
      const metrics = await evaluate(`({url:location.href, width:innerWidth, documentWidth:document.documentElement.scrollWidth,
        h1:document.querySelector('h1')?.textContent,
        overflowElements:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect(); return r.width > 0 && (r.right>innerWidth+1 || r.left < -1);}).slice(0,12).map(el=>({tag:el.tagName,cls:el.className})),
        tables:[...document.querySelectorAll('table')].map(t=>({width:t.getBoundingClientRect().width,scroll:t.scrollWidth})),
        tableControls:[...document.querySelectorAll('.table-scroll')].map(el=>{el.focus();const focused=document.activeElement===el;el.scrollLeft=100;const moved=el.scrollLeft>0;el.scrollLeft=0;return {focused,moved,needsScroll:el.scrollWidth>el.clientWidth,label:el.getAttribute('aria-label')};}),
        navigation:[...document.querySelectorAll('header a')].map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent,href:el.getAttribute('href'),visible:r.width>0&&r.left>=0&&r.right<=innerWidth};}),
        unloadedImages:[...document.images].filter(i=>!i.complete).map(i=>i.getAttribute('src')),
        brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src'))})`);
      const name = `${width}-${url.replaceAll('/', '_') || 'home'}`;
      if (!allPosts) {
        await evaluate('window.scrollTo(0,0)');
        const shot = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        await fs.writeFile(path.join(out, name + ".png"), Buffer.from(shot.data, "base64"));
        if (metrics.tableControls.some(t=>t.needsScroll)) {
          await evaluate("(()=>{const el=[...document.querySelectorAll('.table-scroll')].find(e=>e.scrollWidth>e.clientWidth); el.focus(); el.scrollLeft=0;})()");
          await cdp('Input.dispatchKeyEvent', {type:'keyDown', key:'ArrowRight', code:'ArrowRight', windowsVirtualKeyCode:39});
          await cdp('Input.dispatchKeyEvent', {type:'keyUp', key:'ArrowRight', code:'ArrowRight', windowsVirtualKeyCode:39});
          await evaluate('new Promise(r=>setTimeout(r,250))');
          metrics.tableKeyboard = await evaluate("document.activeElement.classList.contains('table-scroll') && document.activeElement.scrollLeft > 0");
          const tableShot = await cdp('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
          await fs.writeFile(path.join(out, name + '-table.png'), Buffer.from(tableShot.data, 'base64'));
        }
        if (url === '/') {
          metrics.navigationClicks = [];
          for (const destination of ['/about','/blog']) {
            const point = await evaluate(`(()=>{const r=document.querySelector('header a[href="${destination}"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
            await cdp('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...point});
            await cdp('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...point});
            const reached = await evaluate(`new Promise(resolve=>{const start=Date.now();const check=()=>{if(location.pathname==='${destination}'&&document.querySelector('h1'))resolve(true);else if(Date.now()-start>10000)resolve(false);else setTimeout(check,100)};check()})`);
            metrics.navigationClicks.push({destination,reached});
          }
        }
      }
      const passed = metrics.width === width && metrics.documentWidth <= width && metrics.brokenImages.length === 0 && metrics.unloadedImages.length === 0 && metrics.navigation.every(n=>n.visible) && metrics.tableControls.every(t=>t.focused && (!t.needsScroll || t.moved)) && metrics.tableKeyboard !== false && (metrics.navigationClicks ?? []).every(n=>n.reached);
      records.push({ ...metrics, passed, screenshot: allPosts ? null : path.join(out, name + ".png") });
      await fs.writeFile(path.join(out, "results.json"), JSON.stringify(records, null, 2));
      console.log(JSON.stringify({ width, url, documentWidth:metrics.documentWidth, actualWidth:metrics.width, passed }));
    }
  }
} finally { ws.close(); }
if (records.some(r => !r.passed)) process.exitCode = 1;
