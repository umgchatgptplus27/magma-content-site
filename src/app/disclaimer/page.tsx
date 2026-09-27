import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "면책조항",
  description: "MAGMA 패션·의류 관리 가이드의 정보 범위, 치수·세탁 기준의 성격, 예시 이미지, 광고와 외부 링크, 상표 표기에 관한 안내입니다.",
  path: "/disclaimer",
});

const link = "text-primary underline underline-offset-2";

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="DISCLAIMER"
      title="면책조항"
      summary="MAGMA가 제공하는 정보의 성격과 적용 범위, 이용자가 판단할 때 함께 확인해야 할 사항을 안내합니다."
      updatedAt="2026년 9월 27일"
      sections={[
        {
          title: "일반 정보 제공",
          content: (
            <p>
              MAGMA의 글은 옷을 고르고 관리하는 데 참고할 일반 정보를 제공합니다. 정확하고 최신의 내용을 담기 위해 노력하지만, 모든 정보의 완전성·정확성·최신성을 보장하지는 않습니다. 브랜드 정책, 매장 안내, 공공 기준은 사전 예고 없이 바뀔 수 있습니다.
            </p>
          ),
        },
        {
          title: "치수·세탁·수선 기준의 성격",
          content: (
            <>
              <p>
                글에 나오는 치수 범위, 세탁 온도, 수선 가능 범위는 테일러링 관례, 제조사 안내, 섬유·세탁 표준에서 널리 쓰이는 일반 기준입니다. 체형, 브랜드의 패턴과 치수 체계, 원단과 가공 방식에 따라 결과가 달라질 수 있습니다.
              </p>
              <p>
                실제 구매와 관리에서는 해당 제품의 실측표, 케어라벨, 제조사 안내를 우선해 주세요. 값비싼 옷이나 손상이 걱정되는 소재는 세탁 전문점이나 수선 전문가와 상의하시기 바랍니다.
              </p>
            </>
          ),
        },
        {
          title: "이미지",
          content: (
            <p>
              글 속 스타일 이미지는 설명을 돕기 위한 예시입니다. 특정 상품의 실제 사진이나 색상·소재·성능의 증거가 아니며, 화면과 조명에 따라 색이 다르게 보일 수 있습니다.
            </p>
          ),
        },
        {
          title: "전문 조언의 대체 불가",
          content: (
            <p>
              피부 질환, 알레르기, 발 통증 등 건강 문제와 법률·소비자 분쟁에 관한 내용은 개별 상황에 맞는 전문 조언을 대신하지 않습니다. 필요한 경우 의사, 약사, 한국소비자원 등 관련 기관에 확인해 주세요. 사이트 정보를 바탕으로 한 결정과 그 결과에 대해 운영자는 법령이 허용하는 범위에서 책임을 지지 않습니다.
            </p>
          ),
        },
        {
          title: "광고",
          content: (
            <p>
              사이트에는 Google AdSense 등 제3자 광고가 표시될 수 있습니다. 광고는 광고 사업자가 자동으로 게재하며, 광고에 나오는 상품·서비스의 품질이나 내용을 MAGMA가 보증하지 않습니다. 광고 쿠키에 관한 내용은{" "}
              <Link href="/privacy-policy" className={link}>개인정보처리방침</Link>을 참고해 주세요.
            </p>
          ),
        },
        {
          title: "외부 링크와 상표",
          content: (
            <>
              <p>
                글에는 근거 확인을 위한 외부 사이트 링크가 포함됩니다. 외부 사이트의 내용, 보안, 개인정보 처리에 대해서는 해당 사이트의 정책이 적용되며 MAGMA는 책임을 지지 않습니다.
              </p>
              <p>
                글에 언급된 브랜드명과 상표는 각 권리자의 것이며, 정보를 설명하기 위해 식별 목적으로만 사용합니다. 언급이 해당 브랜드와의 제휴나 보증을 뜻하지는 않습니다.
              </p>
            </>
          ),
        },
        {
          title: "오류 신고와 정정",
          content: (
            <p>
              잘못된 정보나 오래된 링크를 발견하시면 <a className={link} href="mailto:gitarsde@gmail.com">gitarsde@gmail.com</a>으로 알려 주세요. 확인 후 본문을 고치고 글 상단의 업데이트 날짜를 갱신합니다.
            </p>
          ),
        },
      ]}
    />
  );
}
