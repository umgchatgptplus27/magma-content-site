import Image from "next/image";

/**
 * 룩북·비주얼 이미지 자리.
 * 수강생이 자체 룩북/제품 이미지를 만들면 src 만 교체해 브랜드 비주얼 슬롯을 완성합니다.
 */
export default function ImageSlot({
  ratio = "4/5",
  label = "이미지",
  src = "/images/magma-lookbook.png",
  className = "",
  showLabel = true,
}: {
  ratio?: string;
  label?: string;
  src?: string;
  className?: string;
  /** false 면 이미지 위 라벨 오버레이 없이 alt 로만 쓴다. */
  showLabel?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-line bg-card ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={label}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
      />
      {showLabel && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/85 to-transparent p-5">
          <span className="font-display text-sm tracking-[0.2em] text-primary/85">{label}</span>
        </div>
      )}
    </div>
  );
}
