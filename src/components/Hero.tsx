"use client";

import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@config";
import HeroMedia from "@/components/HeroMedia";
import CtaSlot from "@/components/CtaSlot";

export default function Hero() {
  const hasVideo = Boolean(siteConfig.hero.video);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [motionPlaying, setMotionPlaying] = useState(false);

  useEffect(() => {
    if (!hasVideo) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      const shouldPlay = !mediaQuery.matches;
      setMotionEnabled(shouldPlay);
      setMotionPlaying(shouldPlay);
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, [hasVideo]);

  const handlePlaybackBlocked = useCallback(() => {
    setMotionPlaying(false);
  }, []);

  const toggleMotion = () => {
    if (!motionEnabled) {
      setMotionEnabled(true);
      setMotionPlaying(true);
      return;
    }
    setMotionPlaying((playing) => !playing);
  };

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <HeroMedia
        motionEnabled={motionEnabled}
        motionPlaying={motionPlaying}
        onPlaybackBlocked={handlePlaybackBlocked}
      />
      {/* 가독성 오버레이 */}
      <div className="absolute inset-0 -z-10 bg-black/25" />
      <div className="container-page py-24">
        <p className="mb-4 text-sm font-bold tracking-[0.2em] text-accent-light">
          {siteConfig.company.name}
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-primary sm:text-6xl">
          {siteConfig.company.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary/80">
          {siteConfig.company.description}
        </p>
        <CtaSlot className="mt-10" />
      </div>
      {hasVideo && (
        <button
          type="button"
          onClick={toggleMotion}
          className="absolute bottom-7 right-7 z-10 hidden rounded-full border border-primary/30 bg-canvas/55 px-3 py-2 text-xs tracking-[0.08em] text-primary/85 backdrop-blur-sm transition hover:bg-canvas/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:inline-flex"
          aria-label={motionPlaying ? "배경 모션 일시정지" : "배경 모션 재생"}
          aria-pressed={motionPlaying}
        >
          {motionPlaying ? "모션 정지" : "모션 재생"}
        </button>
      )}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-primary/55">
        SCROLL
      </div>
    </section>
  );
}
