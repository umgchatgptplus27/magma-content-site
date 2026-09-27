"use client";

import { useEffect, useMemo, useState } from "react";

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

function verdict(field: Field, diff: number): { text: string; tone: "ok" | "mid" | "far" } {
  const abs = Math.abs(diff);
  const dir = diff > 0 ? "큽니다" : "작습니다";
  if (abs <= 1) return { text: "거의 같습니다", tone: "ok" };
  if (field.key === "shoulder") {
    return abs <= 1.5
      ? { text: `조금 ${dir}. 어깨는 수선이 어려우니 입어 보고 판단하세요`, tone: "mid" }
      : { text: `${abs.toFixed(1)}cm ${dir}. 어깨는 고치기 어려워 다른 사이즈를 권합니다`, tone: "far" };
  }
  if (field.kind === "width") {
    return abs <= 2.5
      ? { text: `둘레로 약 ${(abs * 2).toFixed(1)}cm ${dir}`, tone: "mid" }
      : { text: `둘레로 약 ${(abs * 2).toFixed(1)}cm ${dir}. 한 사이즈 차이에 가깝습니다`, tone: "far" };
  }
  return abs <= 3
    ? { text: `${abs.toFixed(1)}cm ${dir}. ${diff > 0 ? "줄이는 수선이 가능한지 확인하세요" : "늘릴 시접이 있는지 확인하세요"}`, tone: "mid" }
    : { text: `${abs.toFixed(1)}cm ${dir}. 수선보다 다른 사이즈를 먼저 보세요`, tone: "far" };
}

const toneClass = { ok: "text-primary", mid: "text-accent", far: "text-ink" };

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
        if (saved) setValues(JSON.parse(saved));
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      /* 무시 */
    }
  }, [values, restored]);

  const fields = ITEMS[item].fields;
  const rows = useMemo(
    () =>
      fields.map((field) => {
        const v = values[item]?.[field.key];
        const mine = Number.parseFloat(v?.mine ?? "");
        const target = Number.parseFloat(v?.target ?? "");
        const ready = Number.isFinite(mine) && Number.isFinite(target);
        return { field, v, ready, diff: ready ? target - mine : 0 };
      }),
    [fields, values, item],
  );
  const filled = rows.filter((r) => r.ready);
  const far = filled.filter((r) => verdict(r.field, r.diff).tone === "far");

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
        내 옷 치수는 이 브라우저에만 저장됩니다.
      </p>

      <div className="mt-6 space-y-4">
        {rows.map(({ field, v, ready, diff }) => {
          const result = ready ? verdict(field, diff) : null;
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
                    onChange={(e) => update(field.key, side, e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="cm"
                    className="mt-1 w-full rounded-ui border border-line bg-canvas px-3 py-2 text-base text-ink outline-none focus:border-primary"
                  />
                </label>
              ))}
              {result && (
                <p className={`text-sm sm:col-span-3 ${toneClass[result.tone]}`} aria-live="polite">
                  {diff === 0 ? "같습니다" : `${diff > 0 ? "+" : ""}${diff.toFixed(1)}cm — ${result.text}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-ui border border-line bg-canvas p-4 text-sm leading-relaxed text-ink-sub" aria-live="polite">
        {filled.length === 0
          ? "두 칸을 모두 채운 항목부터 차이를 보여 드립니다. 어깨(셔츠·재킷)나 허리·엉덩이(바지)를 먼저 비교하세요."
          : far.length === 0
            ? `입력한 ${filled.length}개 항목이 모두 1사이즈 안쪽 차이입니다. 길이 차이는 수선으로 맞출 수 있는지 확인하세요.`
            : `차이가 큰 항목: ${far.map((r) => r.field.label).join(", ")}. ${far.some((r) => r.field.key === "shoulder" || r.field.key === "hip") ? "어깨·엉덩이는 수선이 어려우니 이 항목에 맞는 사이즈를 먼저 고르세요." : "다른 사이즈의 같은 항목과 비교해 보세요."}`}
      </div>

      <button type="button" onClick={clearTarget} className="mt-4 text-sm text-ink-muted underline underline-offset-2 hover:text-primary">
        사려는 옷 값만 지우기
      </button>
    </div>
  );
}
