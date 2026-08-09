import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "면책조항",
  description: "MAGMA 콘텐츠의 정보 제공 범위와 이용자 책임을 안내합니다.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="DISCLAIMER"
      title="면책조항"
      summary="본 면책조항은 MAGMA가 제공하는 정보의 적용 범위와 이용자의 책임을 안내합니다."
      updatedAt="2026년 8월 9일"
      sections={[
        {
          title: "정보 제공의 범위",
          content: (
            <p>
              MAGMA의 모든 글과 자료는 일반적인 정보 제공 목적으로 작성됩니다. 운영자는 정보의 완전성, 정확성 또는 최신성을 보장하지 않습니다. 게시물의 내용은 개인별 상황, 제품 상태, 시점 및 외부 환경에 따라 달라질 수 있습니다.
            </p>
          ),
        },
        {
          title: "이용자 책임",
          content: (
            <p>
              본 블로그의 콘텐츠는 법률, 의료, 재무, 안전, 수선 또는 기타 전문 영역에 대한 개별적인 조언이나 진단을 대신하지 않습니다. 이용자는 필요한 경우 관련 분야의 자격 있는 전문가 또는 제품·서비스 제공자에게 확인해야 합니다. 블로그 정보를 바탕으로 내린 결정 및 행위로 발생한 직간접적인 손실이나 손해에 대하여 운영자는 법적 책임을 지지 않습니다.
            </p>
          ),
        },
        {
          title: "외부 링크",
          content: (
            <p>
              MAGMA는 참고를 위해 외부 웹사이트 링크를 포함할 수 있습니다. 해당 링크를 통해 방문한 외부 사이트의 내용, 정확성, 보안, 개인정보처리방침 및 운영 방식에 대하여 MAGMA는 책임을 지지 않습니다. 외부 사이트 이용 전 해당 사이트의 약관과 정책을 확인하시기 바랍니다.
            </p>
          ),
        },
      ]}
    />
  );
}
