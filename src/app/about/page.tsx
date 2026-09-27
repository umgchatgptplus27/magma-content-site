import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@config";
import { BLOG_TOPICS } from "@/lib/blog-topics";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MAGMA 소개 및 문의",
  description: "3040 남성의 옷 선택과 관리 기준을 정리하는 MAGMA의 운영자, 글을 만드는 방식, 수정 원칙과 문의 방법을 안내합니다.",
  path: "/about",
});

const author = siteConfig.author;

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT & CONTACT"
      title="소개 및 문의"
      summary="MAGMA는 3040 남성이 자신에게 맞는 옷을 고르고 오래 입을 수 있도록 핏·조합·경조사 옷차림·의류 관리의 기준을 정리하는 정보 사이트입니다."
      updatedAt="2026년 9월 27일"
      sections={[
        {
          title: "MAGMA가 다루는 것",
          content: (
            <>
              <p>
                옷을 고를 때 막히는 지점은 대개 비슷합니다. 사이즈표의 숫자를 어떻게 읽어야 하는지, 셔츠 소매와 바지 기장은 어디까지가 적당한지,
                결혼식과 조문, 상견례에는 무엇을 입어야 하는지, 니트 보풀이나 셔츠 얼룩은 어떻게 다뤄야 하는지 같은 질문입니다.
              </p>
              <p>
                MAGMA는 이런 질문에 한 주제당 한 편의 충분한 글로 답합니다. 같은 질문을 여러 글로 쪼개지 않고, 한 글 안에서 치수 기준·판단표·흔한 실수·자주 묻는 질문까지 정리해
                그 글만 읽어도 결정을 내릴 수 있게 하는 것이 목표입니다.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {BLOG_TOPICS.map((topic) => (
                  <li key={topic.slug}>
                    <Link href={`/blog/topic/${topic.slug}`} className="text-primary underline underline-offset-2">{topic.label}</Link>
                    {" — "}
                    {topic.description}
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        ...(author
          ? [
              {
                id: "author",
                title: "운영자 소개",
                content: (
                  <>
                    <p>
                      <strong className="text-primary">{author.name}</strong> · {author.role}
                    </p>
                    <p>{author.bio}</p>
                  </>
                ),
              },
            ]
          : []),
        {
          title: "글을 만드는 방식",
          content: (
            <>
              <p>
                각 가이드는 테일러링·제조사의 치수 안내, 섬유·세탁 표준 기관(GINETEX, 울마크 등), 국가기술표준원과 같은 공공 자료, 오래 검증된 복식 매체의 설명을 확인해
                3040 남성의 출근·경조사·주말 생활에 맞게 정리합니다. 공개 전에는 운영자가 내용과 출처를 검토합니다.
              </p>
              <p>
                수치는 널리 쓰이는 일반 기준으로 제시합니다. 체형과 브랜드마다 치수 체계가 다르므로 최종 판단은 해당 제품의 실측표와 케어라벨을 우선해 주세요.
                글 속 스타일 이미지는 설명을 돕기 위한 예시이며 특정 상품의 사진이 아닙니다.
              </p>
              <p>MAGMA는 옷을 제조하거나 판매하지 않습니다.</p>
            </>
          ),
        },
        {
          title: "업데이트와 정정",
          content: (
            <>
              <p>
                계절이 바뀌거나 참고 자료가 갱신되면 기존 글을 보강하고, 글 상단에 최종 업데이트 날짜를 표시합니다. 새 주제가 기존 글과 겹치면 새 글을 만들기보다 기존 글을 보강합니다.
              </p>
              <p>
                잘못된 정보나 오래된 링크를 발견하시면 아래 이메일로 알려 주세요. 확인 후 본문을 고치고 업데이트 날짜를 갱신합니다.
              </p>
            </>
          ),
        },
        {
          title: "문의 안내",
          content: (
            <>
              <p>콘텐츠 피드백, 정정 요청, 제휴·저작권 문의는 아래 이메일로 보내 주시기 바랍니다.</p>
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
