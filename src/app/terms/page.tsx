import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "이용약관",
  description: "MAGMA 웹사이트 콘텐츠의 이용 조건, 저작권과 인용·링크 기준, 이용자 의무, 광고, 서비스 변경과 준거법을 안내합니다.",
  path: "/terms",
});

const link = "text-primary underline underline-offset-2";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="TERMS & CONDITIONS"
      title="이용약관"
      summary="이 약관은 MAGMA(www.eurachoachoa.com, 이하 “사이트”)가 제공하는 콘텐츠의 이용 조건과 운영자·이용자의 권리와 의무를 정합니다."
      updatedAt="2026년 9월 27일"
      sections={[
        {
          title: "목적과 적용",
          content: (
            <p>
              이 약관은 사이트에 접속해 콘텐츠를 열람하는 모든 이용자에게 적용됩니다. 사이트는 회원가입 없이 이용할 수 있으며, 사이트를 이용하면 이 약관에 동의한 것으로 봅니다.
            </p>
          ),
        },
        {
          title: "콘텐츠 저작권",
          content: (
            <p>
              사이트의 글, 표, 이미지, 디자인 등 콘텐츠의 저작권은 별도 표시가 없는 한 운영자에게 있습니다. 운영자의 사전 동의 없이 콘텐츠의 전부 또는 상당 부분을 복제·전재·배포·수정하거나 상업적으로 이용할 수 없습니다. 외부 자료의 권리는 각 권리자에게 있습니다.
            </p>
          ),
        },
        {
          title: "인용과 링크",
          content: (
            <>
              <p>글의 주소(URL)를 공유하거나 링크하는 것은 자유롭게 할 수 있습니다.</p>
              <p>
                비상업적 목적으로 글의 일부를 인용할 때는 저작권법이 허용하는 범위 안에서 출처(MAGMA와 해당 글 주소)를 밝혀 주세요. 글 전체나 표·이미지를 통째로 옮기는 것은 인용으로 보지 않습니다.
              </p>
            </>
          ),
        },
        {
          title: "이용자의 의무",
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>자동화된 수단으로 콘텐츠를 대량 수집하거나 서버에 과도한 부하를 주는 행위를 해서는 안 됩니다.</li>
              <li>광고를 부정하게 클릭하거나 클릭을 유도하는 행위를 해서는 안 됩니다.</li>
              <li>문의 기능을 이용해 스팸이나 반복적인 광고성 메시지를 보내서는 안 됩니다.</li>
              <li>타인의 저작권, 초상권, 개인정보 등 권리를 침해하거나 법령에 반하는 방식으로 사이트를 이용해서는 안 됩니다.</li>
            </ul>
          ),
        },
        {
          title: "광고",
          content: (
            <p>
              사이트에는 Google AdSense 등 제3자 광고가 게재될 수 있습니다. 광고를 통해 연결되는 외부 사이트와 거래는 이용자와 해당 광고주 사이의 일이며, 운영자는 그 거래에 관여하지 않습니다.
            </p>
          ),
        },
        {
          title: "면책과 개인정보",
          content: (
            <p>
              콘텐츠의 성격과 운영자 책임의 범위는 <Link href="/disclaimer" className={link}>면책조항</Link>을, 개인정보와 쿠키 처리는{" "}
              <Link href="/privacy-policy" className={link}>개인정보처리방침</Link>을 따릅니다.
            </p>
          ),
        },
        {
          title: "서비스 변경과 중단",
          content: (
            <p>
              운영자는 콘텐츠 개선, 시스템 점검 등 합리적인 사유로 사이트의 전부 또는 일부를 변경하거나 중단할 수 있습니다. 글을 통합하거나 주소를 바꿀 때는 가능한 한 기존 주소가 새 글로 연결되도록 합니다.
            </p>
          ),
        },
        {
          title: "약관의 변경과 준거법",
          content: (
            <>
              <p>
                운영자는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경된 약관은 이 페이지에 게시한 날부터 적용됩니다. 이전 약관 시행일: 2026년 8월 9일.
              </p>
              <p>
                이 약관은 대한민국 법률에 따라 해석되며, 사이트 이용과 관련한 분쟁은 「민사소송법」에 따른 관할 법원에서 해결합니다. 문의:{" "}
                <a className={link} href="mailto:gitarsde@gmail.com">gitarsde@gmail.com</a>
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
