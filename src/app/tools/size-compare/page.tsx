import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SizeCompareTool from "@/components/SizeCompareTool";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "옷 사이즈 비교 계산기와 신발·셔츠·바지 사이즈 환산표",
  description:
    "잘 맞는 내 옷 실측과 사이즈표를 비교해 차이를 알려 주는 옷 사이즈 계산기와 신발·셔츠·바지 사이즈 환산표입니다.",
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
        사이즈 표기(M, 100, 32)는 브랜드마다 뜻이 다릅니다. 구매 전에 할 수 있는 비교는 <strong className="text-primary">지금 잘 맞는 내 옷을 재서 사려는 옷의 실측과 비교</strong>하는 것입니다.
        아래에 두 값을 넣으면 항목별 치수 차이를 보여 드립니다. 착용감이나 수선 가능 여부를 자동 판정하지 않습니다.
      </p>

      <div className="mt-10">
        <SizeCompareTool />
      </div>

      <div className="post-body mt-14">
        <h2>내 옷을 재는 법</h2>
        <p>
          옷을 단추나 지퍼를 모두 잠근 상태로 바닥이나 탁자에 평평하게 놓고, 주름을 손으로 펴서 줄자로 잽니다. 쇼핑몰 사이즈표의 &lsquo;단면&rsquo;은 평평하게 놓은 옷의 좌우 폭을 뜻합니다. 같은 위치의 단면에 2를 곱한 값은 둘레의 근사값이며, 입체적인 재단에서는 실제 둘레와 차이가 날 수 있습니다.
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
          차이는 ‘사려는 옷 − 내 옷’으로 계산해 0.1cm 단위로 반올림합니다. 가슴·허리 같은 폭은 단면 차이와 그 두 배인 둘레 차이를 함께 표시하고, 소매·총장은 길이 차이만 표시합니다.
          한 사이즈에 해당하는 cm나 수선 가능한 길이는 브랜드·패턴·시접에 따라 달라 일률적인 합격선을 두지 않습니다. 입력값이 같아도 소재와 측정 위치가 다르면 착용감은 달라집니다.

        </p>

        <h2>숫자가 같아도 비교하면 안 되는 경우</h2>
        <ul>
          <li>신체 가슴둘레와 제품 가슴단면: 신체 치수를 반으로 나눠 넣어도 옷에 필요한 여유를 알 수 없습니다. 두 칸 모두 제품 실측을 넣습니다.</li>
          <li>어깨 끝에서 잰 소매와 뒷목 중심에서 잰 소매: 출발점이 다릅니다. 판매처의 측정 그림에 맞춰 기준 옷을 다시 잽니다.</li>
          <li>어깨 최고점 총장과 칼라 아래 총장: 같은 이름이어도 시작점이 다릅니다. 임의의 보정값을 더하거나 빼지 않습니다.</li>
          <li>드롭 숄더와 일반 셔츠, 니트와 직물 셔츠: 숫자를 계산할 수 있어도 같은 핏이라고 판단할 수 없습니다.</li>
        </ul>
        <h2>계산 예: 가슴단면과 소매를 따로 읽기</h2>
        <p>아래는 계산 방법을 설명하기 위해 정한 숫자이며 실제 제품의 측정 결과가 아닙니다.</p>
        <ul>
          <li>내 셔츠 가슴단면 54cm, 구매 후보 56cm → 단면 +2cm, 두 배로 환산한 둘레 약 +4cm.</li>
          <li>같은 셔츠 소매 61cm, 구매 후보 60cm → 소매 −1cm. 소매 길이에 2를 곱하지 않습니다.</li>
          <li>이 후보는 몸통이 더 넓고 소매는 더 짧습니다. 전체를 ‘한 사이즈 큼’으로 요약하면 이 차이를 놓칩니다.</li>
        </ul>
        <p><Link href="/blog/mens-online-clothing-measurement-guide">실측 비교 가이드</Link>에서 측정 조건 확인과 시착 순서를 이어서 볼 수 있습니다.</p>

        <h2>신발 사이즈 환산표 (한국 mm · US · UK · EU)</h2>
        <p>Nike 남성 표의 US 6–11 구간을 옮겼습니다(2026년 10월 23일 확인). 첫 열은 상자·라벨의 CM/JP 호칭을 mm로 표현한 것이며 실제 발 길이가 아닙니다. 발을 재서 고를 때는 Nike 원문의 Foot Length 항목을 이용하고, 다른 브랜드에는 그 브랜드 표를 적용하세요.</p>
        <div className="table-scroll" role="region" aria-label="신발 사이즈 환산표" tabIndex={0}>
          <table>
            <thead>
              <tr><th>라벨 CM/JP × 10 (mm)</th><th>US</th><th>UK</th><th>EU</th></tr>
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

        <h2>허리 치수 단위 환산표 (인치 · cm)</h2>
        <p>
          아래는 인치를 cm로 바꾸는 단위 환산표이며, 특정 브랜드의 추천 사이즈표가 아닙니다. 바지 라벨의 30·32·34가 신체 허리둘레나 완성된 바지의 실제 둘레와 정확히 같다는 뜻은 아닙니다. 구매할 브랜드의 신체 치수표와 제품 실측표를 구분해 확인하세요.
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

        <p>예를 들어 Levi&apos;s 미국 남성 하의 표는 라벨 32에 신체 허리 32.5–33인치를 대응시킵니다(2026년 10월 27일 확인). 32 × 2.54 = 81.3cm라는 단위 계산만으로 그 바지의 실측이나 권장 신체 치수를 알 수 없는 이유입니다.</p>

        <h2>자주 묻는 질문</h2>
        <h3>사이즈표에 단면이 아니라 둘레가 적혀 있으면 어떻게 하나요?</h3>
        <p>먼저 제품의 완성 둘레인지, 착용자에게 권장하는 신체 둘레인지 확인합니다. 같은 위치에서 잰 제품 둘레라면 2로 나눈 값을 단면의 근사값으로 비교할 수 있지만, 신체 둘레나 라벨의 호칭은 나눠 넣지 않습니다. 측정 위치나 입체 재단 때문에 단면으로 환산하기 어렵다면 판매처에 단면 실측을 문의합니다.</p>
        <h3>입력한 치수는 어디에 저장되나요?</h3>
        <p>입력한 내 옷과 구매 후보의 치수는 지금 쓰는 브라우저에 저장되며, 이 도구의 저장 기능으로 서버에 전송하지 않습니다. 삭제하려면 계산기의 ‘모든 품목의 저장값 삭제’를 누르세요. 브라우저 사이트 데이터를 삭제해도 사라집니다.</p>
        <h3>차이가 모두 1cm 안쪽인데도 입어 보면 다를 수 있나요?</h3>
        <p>그럴 수 있습니다. 같은 치수라도 원단의 신축성, 어깨 경사, 암홀 깊이처럼 사이즈표에 없는 요소가 착용감을 바꿉니다. 이 도구는 치수 차이를 계산하며, 구매 성공률이나 착용감을 예측하지 않습니다.</p>

        <h2>참고 자료</h2>
        <ul>
          <li><a href="https://www.levi.com/US/en_US/info/sizeguide">Levi&apos;s — 남성 하의 라벨 호칭과 신체 치수표</a></li>
          <li><a href="https://propercloth.com/reference/how-to-measure-a-dress-shirt/">Proper Cloth — 셔츠 실측 방법</a></li>
          <li><a href="https://www.nike.com/size-fit/mens-footwear">Nike — Men&apos;s Footwear Size Chart</a></li>
          <li><a href="https://propercloth.com/reference/how-the-sleeve-length-should-fit/">Proper Cloth — 소매 측정 시작점과 커프 조건</a></li>
          <li><a href="https://propercloth.com/reference/how-the-dress-shirt-collar-should-fit/">Proper Cloth — How the Dress Shirt Collar Should Fit</a></li>
        </ul>
      </div>
      <JsonLd data={toolSchema} />
    </article>
  );
}
