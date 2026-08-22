import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MAGMA 소개 및 문의",
  description: "3040 남성 패션 정보와 의류 선택·관리 가이드를 운영하는 MAGMA의 콘텐츠 원칙과 문의 방법을 안내합니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT & CONTACT"
      title="소개 및 문의"
      summary="MAGMA는 3040 남성을 위한 패션 정보와 옷을 오래 입기 위한 관리·선택 가이드를 다루는 정보성 콘텐츠 공간입니다."
      updatedAt="2026년 8월 22일"
      sections={[
        {
          title: "MAGMA 소개",
          content: (
            <>
              <p>
                MAGMA는 유행을 그대로 따라가기보다 자신의 생활과 기준에 맞는 옷을 고르는 데 도움이 되는 정보를 제공합니다. 스타일링, 핏과 소재의 이해, 의류 관리, 구매 전 확인할 사항 등 일상에서 활용할 수 있는 주제를 중심으로 다룹니다.
              </p>
              <p>
                콘텐츠는 일반적인 정보 제공을 목적으로 하며, 제품·상황·개인의 조건에 따라 결과가 달라질 수 있는 내용은 그 한계와 확인 방법을 함께 안내하고자 합니다.
              </p>
            </>
          ),
        },
        {
          title: "운영 목적과 원칙",
          content: (
            <>
              <p>
                MAGMA는 독자가 일상에 적용할 수 있는 정확하고 이해하기 쉬운 가이드를 제공하여, 옷을 선택하고 관리하는 과정에 유익한 가치를 더하는 것을 목적으로 합니다.
              </p>
              <p>
                정보의 출처와 적용 범위를 구분해 설명하려 노력하며, 확인이 필요한 내용은 단정적으로 표현하지 않습니다. 콘텐츠의 오류나 보완할 점을 알려 주시면 검토하여 반영하겠습니다.
              </p>
            </>
          ),
        },
        {
          title: "편집·출처·수정 원칙",
          content: (
            <>
              <p>
                글은 독자가 실제로 마주한 옷차림과 관리의 판단을 돕는 것을 목표로 합니다. 소재 기능, 세탁·건조 조건, 행사 안내처럼 확인이 필요한 내용은 제조사 안내, 케어라벨, 공식 기관 또는 원문 자료를 우선 확인합니다.
              </p>
              <p>
                일반적인 정보와 제품별 지침은 구분합니다. 글의 제안이 특정 제품의 라벨이나 제조사 안내와 다르면 제품 안내를 우선하며, 확인 범위가 제한된 내용은 그 한계와 다음 확인 방법을 함께 적습니다.
              </p>
              <p>
                오류, 오래된 링크 또는 보완할 점을 알려 주시면 관련 자료와 함께 검토합니다. 수정이 필요한 경우에는 본문·출처·안내 문구를 갱신해 독자가 현재 기준을 확인할 수 있도록 하겠습니다.
              </p>
            </>
          ),
        },
        {
          title: "문의 안내",
          content: (
            <>
              <p>제휴 제안, 콘텐츠 피드백, 저작권 및 기타 문의는 아래 이메일로 보내 주시기 바랍니다.</p>
              <p>
                이메일: <a className="text-primary underline underline-offset-2" href="mailto:gitarsde@gmail.com">gitarsde@gmail.com</a>
              </p>
              <p>문의 내용과 관련 페이지 주소를 함께 알려 주시면 확인에 도움이 됩니다.</p>
            </>
          ),
        },
      ]}
    />
  );
}
