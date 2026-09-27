import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SizeCompareTool from "@/components/SizeCompareTool";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "옷 사이즈 비교 계산기와 신발·셔츠·바지 사이즈 환산표",
  description:
    "잘 맞는 내 옷의 실측과 사려는 옷의 사이즈표를 입력하면 항목별 차이와 판단을 보여 주는 옷 사이즈 비교 계산기입니다. 신발 US·UK·EU·mm, 셔츠 목둘레, 바지 허리 인치 환산표도 함께 정리했습니다.",
  path: "/tools/size-compare",
});

// Nike 남성 신발 사이즈표(nike.com/size-fit/mens-footwear) 기준. 브랜드마다 다를 수 있다.
const SHOES = [
  ["240", "6", "5.5", "38.5"],
  ["245", "6.5", "6", "39"],
  ["250", "7", "6.5", "40"],
  ["255", "7.5", "7", "40.5"],
  ["260", "8", "7.5", "41"],
  ["265", "8.5", "8", "42"],
  ["270", "9", "8.5", "42.5"],
  ["275", "9.5", "9", "43"],
  ["280", "10", "9.5", "44"],
  ["285", "10.5", "10", "44.5"],
  ["290", "11", "10.5", "45"],
];
const NECK_INCH = [14.5, 15, 15.5, 16, 16.5, 17, 17.5];
const WAIST_INCH = [28, 29, 30, 31, 32, 33, 34, 36, 38, 40];
const cm = (inch: number) => (inch * 2.54).toFixed(1);

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "옷 사이즈 비교 계산기",
  url: absoluteUrl("/tools/size-compare"),
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  inLanguage: "ko-KR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

export default function SizeComparePage() {
  return (
    <article className="reading py-20">
      <p className="eyebrow mb-2">도구</p>
      <h1 className="font-display text-3xl font-bold leading-snug text-primary sm:text-4xl">옷 사이즈 비교 계산기</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-sub">
        사이즈 표기(M, 100, 32)는 브랜드마다 뜻이 다릅니다. 가장 정확한 방법은 <strong className="text-primary">지금 잘 맞는 내 옷을 재서 사려는 옷의 실측과 비교</strong>하는 것입니다.
        아래에 두 값을 넣으면 항목별 차이와 수선 가능성을 바로 보여 드립니다.
      </p>

      <div className="mt-10">
        <SizeCompareTool />
      </div>

      <div className="post-body mt-14">
        <h2>내 옷을 재는 법</h2>
        <p>
          옷을 단추나 지퍼를 모두 잠근 상태로 바닥이나 탁자에 평평하게 놓고, 주름을 손으로 펴서 줄자로 잽니다. 쇼핑몰 사이즈표의 &lsquo;단면&rsquo;은 앞판 한 면의 좌우 폭이므로, 둘레로 바꾸려면 2를 곱합니다.
          니트나 저지처럼 늘어나는 옷은 당기지 말고 놓인 그대로 잽니다.
        </p>
        <ul>
          <li><strong>어깨너비</strong>: 한쪽 어깨 봉제선 끝에서 반대쪽 끝까지 직선으로 잽니다.</li>
          <li><strong>가슴단면</strong>: 겨드랑이 봉제선 바로 아래에서 좌우 끝까지 잽니다.</li>
          <li><strong>총장</strong>: 뒷목 칼라가 붙는 곳에서 밑단까지 수직으로 잽니다. 브랜드에 따라 어깨 가장 높은 곳에서 재기도 하니 사이즈표의 측정 위치 그림을 확인하세요.</li>
          <li><strong>바지 앞밑위</strong>: 허리밴드 위쪽에서 가랑이 봉제선이 만나는 곳까지 잽니다.</li>
        </ul>
        <p>
          부위별로 어느 정도가 잘 맞는 것인지는 <Link href="/blog/mens-shirt-fit-guide">셔츠 사이즈 고르는 법</Link>,{" "}
          <Link href="/blog/mens-trouser-fit-guide">슬랙스 핏 보는 법</Link>, <Link href="/blog/mens-jacket-fit-guide">재킷 사이즈 고르는 법</Link>에 정리했습니다.
          온라인 구매 전 확인 순서와 반품 기준은 <Link href="/blog/mens-online-clothing-measurement-guide">옷 사이즈 실측 비교법</Link>을 참고하세요.
        </p>

        <h2>계산기가 차이를 읽는 기준</h2>
        <p>
          계산기의 판단은 MAGMA 가이드에서 쓰는 일반적인 여유 기준입니다. 단면 1cm 안쪽 차이는 측정 오차와 원단 차이로 보고 &lsquo;거의 같음&rsquo;으로 판단합니다.
          둘레 차이가 5cm를 넘으면(단면 2.5cm 초과) 대개 한 사이즈 차이에 가깝습니다. 어깨는 수선이 가장 어려운 부위라 1.5cm만 넘어도 다른 사이즈를 권하고,
          소매·총장처럼 길이 항목은 3cm 안쪽이면 수선 가능 여부를 먼저 확인하도록 안내합니다. 브랜드 패턴과 소재에 따라 체감은 달라질 수 있으니, 차이가 큰 항목이 있으면 입어 보고 결정하세요.
        </p>

        <h2>신발 사이즈 환산표 (한국 mm · US · UK · EU)</h2>
        <p>Nike 남성 신발 사이즈표 기준입니다. 브랜드와 라스트(구두 틀)에 따라 반 치수 정도 달라질 수 있어, 처음 사는 브랜드는 발 길이(mm)로 비교하는 편이 정확합니다.</p>
        <div className="table-scroll" role="region" aria-label="신발 사이즈 환산표" tabIndex={0}>
          <table>
            <thead>
              <tr><th>한국(mm)</th><th>US</th><th>UK</th><th>EU</th></tr>
            </thead>
            <tbody>
              {SHOES.map(([mm, us, uk, eu]) => (
                <tr key={mm}><td>{mm}</td><td>{us}</td><td>{uk}</td><td>{eu}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>셔츠 목둘레 환산표 (인치 · cm)</h2>
        <p>해외 드레스 셔츠는 목둘레를 인치로 표기합니다(1인치 = 2.54cm). 목 단추를 채우고 손가락 1–2개가 들어가는 치수가 기준입니다.</p>
        <div className="table-scroll" role="region" aria-label="셔츠 목둘레 환산표" tabIndex={0}>
          <table>
            <thead>
              <tr><th>인치</th>{NECK_INCH.map((n) => <th key={n}>{n}</th>)}</tr>
            </thead>
            <tbody>
              <tr><td>cm</td>{NECK_INCH.map((n) => <td key={n}>{cm(n)}</td>)}</tr>
            </tbody>
          </table>
        </div>

        <h2>바지 허리 사이즈 환산표 (인치 · cm)</h2>
        <p>
          국내에서 흔히 쓰는 바지 사이즈 30·32·34는 허리둘레 인치 표기입니다. 표기는 몸 치수이고 실제 옷 허리는 핏과 브랜드에 따라 여유가 다르니, 구매 전에는 사이즈표의 허리단면에 2를 곱해 비교하세요.
        </p>
        <div className="table-scroll" role="region" aria-label="바지 허리 사이즈 환산표" tabIndex={0}>
          <table>
            <thead>
              <tr><th>인치</th>{WAIST_INCH.map((n) => <th key={n}>{n}</th>)}</tr>
            </thead>
            <tbody>
              <tr><td>cm</td>{WAIST_INCH.map((n) => <td key={n}>{cm(n)}</td>)}</tr>
            </tbody>
          </table>
        </div>

        <h2>자주 묻는 질문</h2>
        <h3>사이즈표에 단면이 아니라 둘레가 적혀 있으면 어떻게 하나요?</h3>
        <p>둘레 값을 2로 나눠 단면으로 바꾼 뒤 입력하면 됩니다. 계산기는 단면 기준으로 차이를 계산하고, 폭 항목은 결과에 둘레 차이도 함께 보여 줍니다.</p>
        <h3>입력한 치수는 어디에 저장되나요?</h3>
        <p>지금 쓰는 브라우저에만 저장되고 서버로 보내지지 않습니다. 다음에 방문하면 내 옷 치수가 그대로 남아 있어 사려는 옷 값만 바꿔 넣으면 됩니다. 브라우저 데이터를 지우면 함께 사라집니다.</p>
        <h3>차이가 모두 1cm 안쪽인데도 입어 보면 다를 수 있나요?</h3>
        <p>그럴 수 있습니다. 같은 치수라도 원단의 신축성, 어깨 경사, 암홀 깊이처럼 사이즈표에 없는 요소가 착용감을 바꿉니다. 실측이 비슷하면 실패 확률이 크게 줄어드는 정도로 이해하시면 됩니다.</p>

        <h2>참고 자료</h2>
        <ul>
          <li><a href="https://www.nike.com/size-fit/mens-footwear">Nike — Men&apos;s Footwear Size Chart</a></li>
          <li><a href="https://propercloth.com/reference/how-the-dress-shirt-collar-should-fit/">Proper Cloth — How the Dress Shirt Collar Should Fit</a></li>
        </ul>
      </div>
      <JsonLd data={toolSchema} />
    </article>
  );
}
