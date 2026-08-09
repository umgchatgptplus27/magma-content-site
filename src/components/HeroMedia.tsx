"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { siteConfig } from "@config";

interface HeroMediaProps {
  motionEnabled: boolean;
  motionPlaying: boolean;
  onPlaybackBlocked: () => void;
}

/**
 * 홈 히어로 배경. poster는 항상 LCP 이미지로 유지하고, 데스크톱에서만
 * 사용자가 허용한 경우에 한해 배경 동영상을 재생한다.
 */
export default function HeroMedia({
  motionEnabled,
  motionPlaying,
  onPlaybackBlocked,
}: HeroMediaProps) {
  const { video, poster } = siteConfig.hero;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    if (!motionPlaying) {
      element.pause();
      return;
    }

    element.play().catch(onPlaybackBlocked);
  }, [motionPlaying, onPlaybackBlocked]);

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
      {video && motionEnabled && (
        <video
          ref={videoRef}
          autoPlay={motionPlaying}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="hidden h-full w-full object-cover md:block"
        >
          <source media="(min-width: 768px)" src={video} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/70 via-canvas/35 to-canvas/15" />
    </div>
  );
}
