import Image from "next/image";
import { siteConfig } from "@config";

/**
 * 홈 히어로 배경.
 * 배경 영상은 코드를 고치지 않고 site.config.ts 의 hero 슬롯만 바꿔 넣습니다:
 *   1) 모션그래픽을 만들어 public/hero.mp4 로 저장
 *   2) site.config.ts 에서 hero.video 를 "/hero.mp4" 로 (기본값은 null)
 * hero.video 가 null 이면 poster 이미지만으로 완전히 동작합니다.
 * → 6.5 「모션그래픽 생성 — 히어로 모션」 실습.
 */
export default function HeroMedia() {
  const { video, poster } = siteConfig.hero;
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="h-full w-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          preload
          quality={70}
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/70 via-canvas/35 to-canvas/15" />
    </div>
  );
}
