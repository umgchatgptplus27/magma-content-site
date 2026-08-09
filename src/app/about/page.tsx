import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "소개 및 문의",
  description: "MAGMA의 콘텐츠 운영 원칙과 문의 방법을 안내합니다.",
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT & CONTACT"
      title="소개 및 문의"
      summary="MAGMA는 3040 남성을 위한 패션 정보와 옷을 오래 입기 위한 관리·선택 가이드를 다루는 정보성 콘텐츠 공간입니다."
      updatedAt="2026년 8월 9일"
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
