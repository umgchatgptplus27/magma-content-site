import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "개인정보처리방침",
  description: "MAGMA 웹사이트의 개인정보 수집·이용, 광고 쿠키 및 Google AdSense 처리 기준과 이용자의 선택 방법을 안내합니다.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY POLICY"
      title="개인정보처리방침"
      summary="MAGMA는 이용자의 개인정보를 중요하게 여기며, 본 방침은 www.eurachoachoa.com의 개인정보 처리 기준을 안내합니다."
      updatedAt="2026년 8월 9일"
      sections={[
        {
          title: "수집하는 정보",
          content: (
            <>
              <p>MAGMA는 서비스 제공과 이용 현황 분석을 위해 다음과 같은 정보를 자동으로 수집할 수 있습니다.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>쿠키 및 유사 기술을 통해 생성되는 식별자</li>
                <li>접속 일시, 방문·열람 기록, 유입 경로 및 이용 기기·브라우저 정보</li>
                <li>IP 주소 및 서비스 이용 과정에서 생성되는 로그 정보</li>
              </ul>
              <p>이메일로 문의할 경우에는 답변과 문의 처리에 필요한 이메일 주소 및 문의 내용이 수집될 수 있습니다.</p>
            </>
          ),
        },
        {
          title: "수집·이용 목적",
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>웹사이트 운영, 보안 유지 및 오류 분석</li>
              <li>콘텐츠 이용 현황과 관심 주제 분석을 통한 서비스 개선</li>
              <li>이용자 문의, 저작권 관련 요청 및 피드백의 확인·처리</li>
              <li>광고 표시, 광고 성과 측정 및 부정 이용 방지</li>
            </ul>
          ),
        },
        {
          title: "구글 애드센스 및 제3자 쿠키",
          content: (
            <>
              <p>
                MAGMA는 Google AdSense를 포함한 제3자 광고 서비스를 사용할 수 있습니다. 이들 서비스 제공자는 쿠키, 웹 비콘 또는 유사 기술을 사용하여 이용자의 이전 방문 기록을 바탕으로 광고를 제공하거나 광고 성과를 측정할 수 있습니다. Google은 DART 쿠키를 사용하여 이용자의 본 사이트 및 다른 사이트 방문을 기반으로 광고를 제공할 수 있습니다.
              </p>
              <p>
                이용자는 <a className="text-primary underline underline-offset-2" href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google 광고 설정</a>에서 개인 맞춤 광고를 관리하거나 해제할 수 있습니다. 또한 브라우저 설정에서 쿠키 저장을 차단하거나 삭제할 수 있으며, Network Advertising Initiative의 <a className="text-primary underline underline-offset-2" href="https://optout.networkadvertising.org/" target="_blank" rel="noreferrer">광고 쿠키 거부 페이지</a>를 통해 일부 제3자 맞춤 광고를 관리할 수 있습니다. 쿠키를 제한할 경우 일부 서비스 기능이나 개인화된 광고 제공 방식이 달라질 수 있습니다.
              </p>
            </>
          ),
        },
        {
          title: "보유 및 이용 기간",
          content: (
            <p>
              개인정보는 수집·이용 목적이 달성되면 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우에는 해당 법령이 정한 기간 동안 보관할 수 있습니다.
            </p>
          ),
        },
        {
          title: "문의 및 방침 변경",
          content: (
            <>
              <p>개인정보 처리에 관한 문의는 <a className="text-primary underline underline-offset-2" href="mailto:gitarsde@gmail.com">gitarsde@gmail.com</a>으로 보내 주시기 바랍니다.</p>
              <p>본 방침은 서비스 또는 관련 법령의 변경에 따라 수정될 수 있으며, 변경 사항은 이 페이지에 게시합니다.</p>
            </>
          ),
        },
      ]}
    />
  );
}
