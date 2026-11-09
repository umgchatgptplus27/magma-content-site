export default function MeasurementDiagram({ trouser }: { trouser: boolean }) {
  return (
    <figure id="measurement-position" className="mt-6 scroll-mt-24 rounded-ui border border-line bg-canvas p-4">
      <figcaption className="font-semibold text-primary">입력 전에 측정 위치부터 맞추세요</figcaption>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-2">
        <svg viewBox="0 0 360 320" className="mx-auto w-full max-w-xs text-ink-sub" role="img" aria-label={trouser ? "바지 앞면의 허리·엉덩이·앞밑위·허벅지·밑단·총장 측정 위치 도해" : "상의 뒷면의 어깨·가슴·총장·소매 측정 위치 도해"}>
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            {trouser ? (
              <>
                <path d="M105 40H245L255 140L238 285H190L180 151L170 285H122L105 140Z" />
                <path d="M106 54H246M180 40V112Q180 138 180 151" strokeDasharray="4 4" />
              </>
            ) : (
              <>
                <path d="M150 60L110 78L35 149L68 181L112 144L112 280H248V144L292 181L325 149L250 78L210 60Z" />
                <path d="M150 60Q180 88 210 60M110 78L112 144M250 78L248 144" strokeDasharray="4 4" />
              </>
            )}
          </g>
          <g fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light">
            {trouser ? (
              <>
                <path d="M105 32H245M105 27V37M245 27V37" />
                <path d="M109 92H251M109 87V97M251 87V97" />
                <path d="M180 40V112Q180 138 180 151" />
                <path d="M108 163H179M108 158V168M179 158V168" />
                <path d="M122 294H170M122 289V299M170 289V299" />
                <path d="M245 40L255 140L238 285" />
              </>
            ) : (
              <>
                <path d="M110 78H250M110 73V83M250 73V83" />
                <path d="M112 157H248M112 152V162M248 152V162" />
                <path d="M180 76V280M175 76H185M175 280H185" />
                <path d="M250 78L325 149M246 82L254 74M321 153L329 145" />
              </>
            )}
          </g>
          <g fill="currentColor" textAnchor="middle" className="text-primary" fontSize="18" fontWeight="700">
            {trouser ? (
              <>
                <text x="175" y="24">1</text><text x="94" y="98">2</text>
                <text x="195" y="127">3</text><text x="144" y="155">4</text>
                <text x="146" y="316">5</text><text x="272" y="192">6</text>
              </>
            ) : (
              <>
                <text x="180" y="57">1</text><text x="97" y="163">2</text>
                <text x="196" y="237">3</text><text x="306" y="105">4</text>
              </>
            )}
          </g>
        </svg>
        <div className="text-sm leading-relaxed text-ink-sub">
          <p className="font-semibold text-primary">{trouser ? "바지 앞면 · 단추와 지퍼를 잠근 상태" : "상의 뒷면 · 원단을 당기지 않은 상태"}</p>
          {trouser ? (
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>허리단면: 허리밴드 윗단 양 끝을 잇습니다.</li>
              <li>엉덩이단면: 판매처가 지정한 높이에서 가로로 잽니다.</li>
              <li>앞밑위: 앞 중심 솔기를 따라 가랑이 접점까지 잽니다.</li>
              <li>허벅지단면: 판매처가 지정한 가랑이 아래 위치에서 한쪽 다리 폭을 잽니다.</li>
              <li>밑단단면: 한쪽 밑단의 양 끝을 잇습니다.</li>
              <li>총장: 허리밴드 위부터 바깥 옆선을 따라 밑단까지 잽니다.</li>
            </ol>
          ) : (
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>어깨너비: 양쪽 어깨 봉제선 끝을 직선으로 잇습니다.</li>
              <li>가슴단면: 판매처가 지정한 겨드랑이 아래 위치에서 가로로 잽니다.</li>
              <li>총장: 이 도구는 뒷목 칼라 아래 중심부터 밑단까지를 기준으로 표시합니다.</li>
              <li>소매: 이 도구는 어깨 봉제선부터 소매 끝까지를 기준으로 표시합니다.</li>
            </ol>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-sub">
        측정 위치를 설명하는 개략도이며 실제 제품의 실측·비례를 나타내지 않습니다. 판매처가 다른 시작점이나 높이를 지정했다면 내 옷도 그 방법으로 다시 재세요.
        {trouser ? " 엉덩이의 가장 넓은 곳과 허리밴드 아래 일정 높이는 같은 위치가 아닐 수 있습니다." : " 뒷목 중심에서 시작하는 소매와 어깨에서 시작하는 소매를 그대로 빼서 비교하지 마세요. 래글런·드롭 숄더는 판매처의 별도 측정 안내를 따르세요."}
      </p>
    </figure>
  );
}
