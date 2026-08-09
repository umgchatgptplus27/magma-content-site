import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "이용약관",
  description: "MAGMA 웹사이트 이용 조건을 안내합니다.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="TERMS & CONDITIONS"
      title="이용약관"
      summary="본 약관은 MAGMA가 제공하는 웹사이트 및 콘텐츠 서비스의 이용 조건을 규정합니다."
      updatedAt="2026년 8월 9일"
      sections={[
        {
          title: "목적",
          content: (
            <p>
              본 약관은 MAGMA(이하 “블로그”)가 제공하는 콘텐츠 및 관련 서비스의 이용 조건과 블로그 및 이용자의 권리·의무 및 책임 사항을 규정하는 것을 목적으로 합니다.
            </p>
          ),
        },
        {
          title: "콘텐츠 저작권",
          content: (
            <p>
              블로그 내 글, 이미지, 디자인 및 기타 콘텐츠의 저작권은 별도 표시가 없는 한 운영자에게 있습니다. 관련 법령에서 허용하는 범위를 제외하고 운영자의 사전 서면 동의 없이 콘텐츠를 복제, 전재, 배포, 수정하거나 상업적으로 이용할 수 없습니다. 외부 출처 콘텐츠의 권리는 각 권리자에게 있습니다.
            </p>
          ),
        },
        {
          title: "이용자의 의무",
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>스팸, 광고성 또는 반복적인 댓글·문의 등 서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
              <li>법령 또는 공서양속에 반하는 방식으로 블로그를 이용해서는 안 됩니다.</li>
              <li>타인의 저작권, 초상권, 개인정보 및 기타 권리를 침해해서는 안 됩니다.</li>
              <li>블로그의 정상적인 운영을 방해하거나 보안을 침해하는 행위를 해서는 안 됩니다.</li>
            </ul>
          ),
        },
        {
          title: "서비스 변경 및 중단",
          content: (
            <p>
              운영자는 서비스 개선, 시스템 점검, 콘텐츠 운영 또는 기타 합리적인 사유에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다. 운영자는 가능한 범위에서 변경 또는 중단 사항을 안내합니다.
            </p>
          ),
        },
        {
          title: "약관의 변경",
          content: (
            <p>
              운영자는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 이 페이지에 게시한 날부터 적용됩니다.
            </p>
          ),
        },
      ]}
    />
  );
}
