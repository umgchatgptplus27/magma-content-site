import Image from "next/image";
import { siteConfig } from "@config";

/**
 * 홈 히어로 배경. 데스크톱 기본 동영상은 서버 HTML에서 바로 렌더해
 * hydration 지연과 무관하게 재생한다. reduced-motion과 모바일은 poster를 사용한다.
 */
export default function HeroMedia() {
  const { video, poster } = siteConfig.hero;
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={poster}
        alt=""
        fill
        preload
        quality={70}
        sizes="100vw"
        className="object-cover"
      />
      {video && (
        <video
          id="hero-motion-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="hidden h-full w-full object-cover md:block motion-reduce:hidden"
        >
          <source
            media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
            src={video}
            type="video/mp4"
          />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/70 via-canvas/35 to-canvas/15" />
    </div>
  );
}
