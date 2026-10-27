"use client";

import { useEffect, useMemo, useState } from "react";
import { measurementDifference, parseSavedMeasurements } from "@/lib/size-compare.mjs";

type Kind = "width" | "length";
type Field = { key: string; label: string; kind: Kind; hint: string };

const ITEMS: Record<string, { label: string; fields: Field[] }> = {
  shirt: {
    label: "셔츠·티셔츠",
    fields: [
      { key: "shoulder", label: "어깨너비", kind: "length", hint: "양쪽 어깨 봉제선 끝 사이" },
      { key: "chest", label: "가슴단면", kind: "width", hint: "겨드랑이 아래 1cm, 좌우 끝 사이" },
      { key: "length", label: "총장", kind: "length", hint: "뒷목 칼라 아래 ~ 밑단" },
      { key: "sleeve", label: "소매길이", kind: "length", hint: "어깨 봉제선 ~ 소매 끝" },
    ],
  },
  jacket: {
    label: "재킷·코트",
    fields: [
      { key: "shoulder", label: "어깨너비", kind: "length", hint: "양쪽 어깨 봉제선 끝 사이" },
      { key: "chest", label: "가슴단면", kind: "width", hint: "단추를 잠그고 겨드랑이 아래" },
      { key: "length", label: "총장", kind: "length", hint: "뒷목 칼라 아래 ~ 밑단" },
      { key: "sleeve", label: "소매길이", kind: "length", hint: "어깨 봉제선 ~ 소매 끝" },
    ],
  },
  trouser: {
    label: "바지",
    fields: [
      { key: "waist", label: "허리단면", kind: "width", hint: "단추를 잠그고 허리밴드 위쪽" },
      { key: "hip", label: "엉덩이단면", kind: "width", hint: "밑위 끝에서 가장 넓은 곳" },
      { key: "rise", label: "앞밑위", kind: "length", hint: "허리밴드 위 ~ 가랑이 봉제선" },
      { key: "thigh", label: "허벅지단면", kind: "width", hint: "가랑이 바로 아래" },
      { key: "hem", label: "밑단단면", kind: "width", hint: "밑단 끝 좌우" },
      { key: "outseam", label: "총장", kind: "length", hint: "허리밴드 위 ~ 밑단(바깥 옆선)" },
    ],
  },
};

const STORAGE_KEY = "magma-size-compare-v1";

type Values = Record<string, Record<string, { mine: string; target: string }>>;

function comparisonText(field: Field, diff: number): string {
  if (diff === 0) return "0.1cm 단위로 반올림한 차이가 0입니다. 착용감이 같다는 뜻은 아닙니다.";
  const direction = diff > 0 ? "더 큽니다" : "더 작습니다";
  return field.kind === "width"
    ? `단면이 ${Math.abs(diff).toFixed(1)}cm ${direction}. 단면을 두 배 한 둘레 차이는 약 ${(Math.abs(diff) * 2).toFixed(1)}cm입니다.`
    : `측정 길이가 ${Math.abs(diff).toFixed(1)}cm ${diff > 0 ? "더 깁니다" : "더 짧습니다"}.`;
}

export default function SizeCompareTool() {
  const [item, setItem] = useState<keyof typeof ITEMS>("shirt");
  const [values, setValues] = useState<Values>({});
  const [restored, setRestored] = useState(false);

  // 내 기준 옷 치수는 이 브라우저에만 저장한다(재방문 시 다시 입력하지 않도록).
  // 서버 렌더와 첫 화면을 같게 두고, 하이드레이션 직후 한 번만 복원한다.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setValues(parseSavedMeasurements(saved));
      } catch {
        /* 저장소를 쓸 수 없는 환경에서는 빈 값으로 시작한다. */
      }
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      if (Object.keys(values).length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      }
    } catch {
      /* 무시 */
    }
  }, [values, restored]);

  const fields = ITEMS[item].fields;
  const rows = useMemo(
    () =>
      fields.map((field) => {
        const v = values[item]?.[field.key];
        const mine = Number(v?.mine);
        const target = Number(v?.target);
        const ready = Number.isFinite(mine) && mine > 0 && Number.isFinite(target) && target > 0;
        return { field, v, ready, diff: ready ? measurementDifference(mine, target) : 0 };
      }),
    [fields, values, item],
  );
  const filled = rows.filter((r) => r.ready);

  function update(key: string, side: "mine" | "target", value: string) {
    setValues((prev) => ({
      ...prev,
      [item]: { ...prev[item], [key]: { ...{ mine: "", target: "" }, ...prev[item]?.[key], [side]: value } },
    }));
  }

  function clearTarget() {
    setValues((prev) => ({
      ...prev,
      [item]: Object.fromEntries(Object.entries(prev[item] ?? {}).map(([k, v]) => [k, { ...v, target: "" }])),
    }));
  }

  return (
    <div className="rounded-card border border-line bg-card p-5 sm:p-8">
      <div role="tablist" aria-label="품목 선택" className="flex flex-wrap gap-2">
        {Object.entries(ITEMS).map(([key, def]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={item === key}
            onClick={() => setItem(key as keyof typeof ITEMS)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              item === key ? "border-primary bg-primary text-canvas" : "border-line text-ink-sub hover:border-primary hover:text-primary"
            }`}
          >
            {def.label}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink-sub">
        옷을 평평하게 놓고 잰 <strong className="text-primary">단면 실측(cm)</strong>을 입력하세요. 왼쪽은 가장 잘 맞는 내 옷, 오른쪽은 사려는 옷의 사이즈표 값입니다.
        입력한 두 옷의 치수는 이 브라우저에 저장되어 다음 방문 때 다시 표시됩니다. 모든 품목의 값을 지우려면 아래의 전체 삭제 버튼을 사용하세요. 측정 위치와 단위를 먼저 맞춰 주세요.
      </p>

      <div className="mt-6 space-y-4">
        {rows.map(({ field, v, ready, diff }) => {
          const result = ready ? comparisonText(field, diff) : null;
          return (
            <div key={field.key} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[9rem_1fr_1fr] sm:items-end">
              <div>
                <p className="font-semibold text-primary">{field.label}</p>
                <p className="text-xs text-ink-muted">{field.hint}</p>
              </div>
              {(["mine", "target"] as const).map((side) => (
                <label key={side} className="block text-xs text-ink-muted">
                  {side === "mine" ? "내 옷" : "사려는 옷"}
                  <input
                    inputMode="decimal"
                    value={v?.[side] ?? ""}
                    onChange={(e) => update(field.key, side, e.target.value)}
                    aria-label={`${field.label} ${side === "mine" ? "내 옷" : "사려는 옷"} (cm)`}
                    aria-invalid={Boolean(v?.[side]) && !(Number.isFinite(Number(v?.[side])) && Number(v?.[side]) > 0)}
                    placeholder="cm"
                    className="mt-1 w-full rounded-ui border border-line bg-canvas px-3 py-2 text-base text-ink outline-none focus:border-primary"
                  />
                </label>
              ))}
              {(["mine", "target"] as const).some((side) => Boolean(v?.[side]) && !(Number.isFinite(Number(v?.[side])) && Number(v?.[side]) > 0)) && (
                <p className="text-sm text-accent sm:col-span-3" role="alert">0보다 큰 숫자를 입력하세요. 단위는 cm입니다.</p>
              )}
              {result && (
                <p className="text-sm text-primary sm:col-span-3" aria-live="polite">
                  {result}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-ui border border-line bg-canvas p-4 text-sm leading-relaxed text-ink-sub" aria-live="polite">
        {filled.length === 0
          ? "두 칸을 모두 채운 항목부터 차이를 보여 드립니다. 어깨(셔츠·재킷)나 허리·엉덩이(바지)를 먼저 비교하세요."
          : `${filled.length}개 항목을 비교했습니다. 치수 차이만으로 맞는 사이즈나 수선 가능 여부를 정할 수 없습니다. 같은 측정 위치인지 확인하고 소재·핏·시접을 함께 살펴보세요.`}
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <button type="button" onClick={clearTarget} className="text-sm text-ink-muted underline underline-offset-2 hover:text-primary">
          사려는 옷 값만 지우기
        </button>
        <button type="button" onClick={() => setValues({})} disabled={!restored} className="text-sm text-ink-muted underline underline-offset-2 hover:text-primary disabled:opacity-50">
          모든 품목의 저장값 삭제
        </button>
      </div>
    </div>
  );
}
