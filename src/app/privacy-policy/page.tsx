import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "개인정보처리방침",
  description: "MAGMA의 개인정보 수집·이용, 처리 위탁과 국외 이전, 광고 쿠키, 이용자 권리와 행사 방법을 안내합니다.",
  path: "/privacy-policy",
});

const EMAIL = "gitarsde@gmail.com";
const link = "text-primary underline underline-offset-2";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY POLICY"
      title="개인정보처리방침"
      summary="MAGMA(www.eurachoachoa.com, 이하 “사이트”)는 「개인정보 보호법」 등 관련 법령을 지키며, 이용자의 개인정보를 어떻게 수집·이용·보관·파기하는지 이 방침으로 안내합니다."
      updatedAt="2026년 9월 27일"
      sections={[
        {
          title: "수집하는 정보와 수집 방법",
          content: (
            <>
              <p>사이트는 회원가입이나 로그인 기능이 없으며, 이용자가 직접 입력하는 개인정보를 수집하지 않습니다. 다만 다음 정보가 자동으로 생성·수집될 수 있습니다.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>접속 일시, IP 주소, 브라우저·기기 정보, 방문한 페이지와 유입 경로 등 서비스 이용 기록(호스팅 서버 로그)</li>
                <li>광고 제공과 성과 측정을 위해 제3자 광고 사업자가 설정하는 쿠키 및 유사 기술의 식별자</li>
              </ul>
              <p>이메일로 문의하는 경우, 답변에 필요한 이메일 주소와 문의 내용을 받게 됩니다.</p>
            </>
          ),
        },
        {
          title: "이용 목적",
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>사이트 운영, 보안 유지, 오류 확인</li>
              <li>콘텐츠 이용 현황 파악과 서비스 개선</li>
              <li>문의·정정 요청·저작권 관련 요청의 확인과 답변</li>
              <li>광고 게재, 광고 성과 측정, 부정 클릭 등 부정 이용 방지</li>
            </ul>
          ),
        },
        {
          title: "보유 기간과 파기",
          content: (
            <>
              <p>개인정보는 이용 목적이 달성되면 지체 없이 파기합니다. 이메일 문의 내용은 답변 완료 후 1년 이내에 삭제하며, 관계 법령에서 보존을 요구하는 경우에는 그 기간 동안만 보관합니다.</p>
              <p>전자 파일은 복구할 수 없는 방법으로 삭제하고, 출력물은 분쇄하거나 소각합니다. 호스팅 서버 로그와 광고 쿠키는 아래 수탁자·광고 사업자가 정한 기간에 따라 자동 삭제됩니다.</p>
            </>
          ),
        },
        {
          title: "처리 위탁과 국외 이전",
          content: (
            <>
              <p>사이트는 운영을 위해 다음 사업자의 서비스를 이용하며, 이 과정에서 접속 기록과 쿠키 정보가 해외 서버에서 처리될 수 있습니다.</p>
              <div className="post-body"><div className="table-scroll" role="region" aria-label="처리 위탁 및 국외 이전 현황" tabIndex={0}>
                <table>
                  <thead>
                    <tr><th>수탁자·제공받는 자</th><th>국가</th><th>처리 항목</th><th>목적</th><th>보유 기간</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Vercel Inc.</td><td>미국</td><td>접속 기록(IP, 브라우저 정보, 요청 로그)</td><td>웹사이트 호스팅·전송</td><td>Vercel 정책에 따름</td></tr>
                    <tr><td>Google LLC</td><td>미국</td><td>쿠키 식별자, 광고 조회·클릭 기록, 기기 정보</td><td>광고 게재·측정(Google AdSense)</td><td>Google 정책에 따름</td></tr>
                    <tr><td>Google LLC (Gmail)</td><td>미국</td><td>문의 이메일 주소와 내용</td><td>문의 수신·답변</td><td>답변 후 1년 이내</td></tr>
                  </tbody>
                </table>
              </div></div>
              <p>정보는 이용자가 사이트에 접속하거나 이메일을 보내는 시점에 네트워크를 통해 전송됩니다. 국외 이전을 원하지 않으면 브라우저에서 쿠키를 거부하거나 이메일 문의를 하지 않을 수 있으며, 이 경우에도 콘텐츠 열람은 가능합니다.</p>
            </>
          ),
        },
        {
          title: "광고와 쿠키",
          content: (
            <>
              <p>
                사이트는 Google AdSense 광고를 게재할 수 있습니다. Google 등 제3자 광고 사업자는 쿠키를 사용해 이용자가 이 사이트와 다른 사이트를 방문한 기록을 바탕으로 광고를 표시하고 성과를 측정할 수 있습니다. Google이 광고 쿠키를 쓰는 방식은{" "}
                <a className={link} href="https://policies.google.com/technologies/ads?hl=ko" target="_blank" rel="noreferrer">Google 광고 기술 안내</a>와{" "}
                <a className={link} href="https://policies.google.com/technologies/partner-sites?hl=ko" target="_blank" rel="noreferrer">Google 파트너 사이트 데이터 사용 안내</a>에서 확인할 수 있습니다.
              </p>
              <p>
                맞춤 광고는 <a className={link} href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google 광고 설정</a>에서 끌 수 있고, 일부 제3자 광고 쿠키는{" "}
                <a className={link} href="https://optout.aboutads.info/" target="_blank" rel="noreferrer">aboutads.info</a>에서 거부할 수 있습니다.
              </p>
              <p>쿠키 저장은 브라우저에서 직접 거부하거나 삭제할 수 있습니다.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Chrome: 설정 → 개인정보 보호 및 보안 → 서드파티 쿠키</li>
                <li>Safari: 설정 → 개인정보 보호 → 크로스 사이트 추적 방지</li>
                <li>Edge: 설정 → 쿠키 및 사이트 권한 → 쿠키 및 사이트 데이터 관리</li>
              </ul>
              <p>쿠키를 거부해도 글은 그대로 읽을 수 있으며, 광고가 덜 관련성 있게 표시될 수 있습니다.</p>
            </>
          ),
        },
        {
          title: "이용자의 권리와 행사 방법",
          content: (
            <>
              <p>이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다. 아래 이메일로 요청하시면 본인 여부를 확인한 뒤 지체 없이(10일 이내) 조치하고 결과를 알려 드립니다.</p>
              <p>광고 쿠키에 관한 권리는 위 &lsquo;광고와 쿠키&rsquo;의 설정 경로나 Google에 직접 요청하여 행사할 수 있습니다.</p>
            </>
          ),
        },
        {
          title: "만 14세 미만 아동",
          content: <p>사이트는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 알면서 수집하지 않습니다.</p>,
        },
        {
          title: "안전성 확보 조치",
          content: (
            <p>사이트는 모든 연결을 HTTPS로 암호화하고, 문의 메일 등 개인정보에 접근할 수 있는 권한을 운영자로 제한하며, 개인정보를 필요한 범위에서만 다룹니다.</p>
          ),
        },
        {
          title: "개인정보 보호책임자",
          content: (
            <>
              <p>
                개인정보 보호책임자: {siteConfig.author?.name ?? "MAGMA 운영자"} ({siteConfig.author?.role ?? "운영자"})
                <br />
                연락처: <a className={link} href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
              <p>개인정보 침해에 대한 상담이나 구제가 필요하면 아래 기관에도 문의할 수 있습니다.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>개인정보침해신고센터: 국번 없이 118 (<a className={link} href="https://privacy.kisa.or.kr" target="_blank" rel="noreferrer">privacy.kisa.or.kr</a>)</li>
                <li>개인정보분쟁조정위원회: 1833-6972 (<a className={link} href="https://www.kopico.go.kr" target="_blank" rel="noreferrer">www.kopico.go.kr</a>)</li>
                <li>대검찰청: 국번 없이 1301 · 경찰청: 국번 없이 182</li>
              </ul>
            </>
          ),
        },
        {
          title: "방침의 변경",
          content: (
            <p>이 방침은 법령이나 사이트 운영 방식(사용하는 광고·호스팅 서비스 등)이 바뀌면 수정하며, 변경 내용과 시행일을 이 페이지에 게시합니다. 이전 방침 시행일: 2026년 8월 22일.</p>
          ),
        },
      ]}
    />
  );
}
