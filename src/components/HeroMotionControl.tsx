"use client";

import { useEffect, useState } from "react";

const DESKTOP_MEDIA = "(min-width: 768px)";
const DEFAULT_SOURCE_MEDIA =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export default function HeroMotionControl() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = document.getElementById("hero-motion-video") as HTMLVideoElement | null;
    const source = video?.querySelector("source");
    if (!video || !source) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlaybackState = () => setIsPlaying(!video.paused);
    const applyPreference = () => {
      if (motionPreference.matches) {
        video.pause();
        video.classList.add("motion-reduce:hidden");
        source.media = DEFAULT_SOURCE_MEDIA;
        video.load();
        setIsPlaying(false);
        return;
      }

      video.classList.remove("motion-reduce:hidden");
      source.media = DEFAULT_SOURCE_MEDIA;
      video.load();
      video.play().catch(() => setIsPlaying(false));
    };

    video.addEventListener("play", syncPlaybackState);
    video.addEventListener("pause", syncPlaybackState);
    motionPreference.addEventListener("change", applyPreference);
    syncPlaybackState();

    return () => {
      video.removeEventListener("play", syncPlaybackState);
      video.removeEventListener("pause", syncPlaybackState);
      motionPreference.removeEventListener("change", applyPreference);
    };
  }, []);

  const toggleMotion = () => {
    const video = document.getElementById("hero-motion-video") as HTMLVideoElement | null;
    const source = video?.querySelector("source");
    if (!video || !source) return;

    if (!video.paused) {
      video.pause();
      return;
    }

    video.classList.remove("motion-reduce:hidden");
    source.media = DESKTOP_MEDIA;
    video.load();
    video.play().catch(() => setIsPlaying(false));
  };

  return (
    <button
      type="button"
      onClick={toggleMotion}
      className="absolute bottom-7 right-7 z-10 hidden rounded-full border border-primary/30 bg-canvas/55 px-3 py-2 text-xs tracking-[0.08em] text-primary/85 backdrop-blur-sm transition hover:bg-canvas/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:inline-flex"
      aria-label={isPlaying ? "배경 모션 일시정지" : "배경 모션 재생"}
      aria-pressed={isPlaying}
    >
      {isPlaying ? "모션 정지" : "모션 재생"}
    </button>
  );
}
