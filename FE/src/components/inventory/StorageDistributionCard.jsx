import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";

const SEGMENTS = [
  { key: "full", label: "Ô đang đầy", pct: 25, color: "#34d399" },
  { key: "partial", label: "Ô chưa đầy", pct: 25, color: "#F59E0B" },
];
const EMPTY_COLOR = "#e2e8f0";
const GAP_DEG = 5;
const usedPct = SEGMENTS.reduce((sum, seg) => sum + seg.pct, 0);
const emptyPct = 100 - usedPct;

function buildGradient(progress) {
  let cursor = 0;
  const stops = [];
  SEGMENTS.forEach((seg) => {
    const segDeg = (seg.pct / 100) * 360 * progress;
    const end = cursor + segDeg;
    const visibleEnd = Math.max(end - GAP_DEG, cursor);
    stops.push(`${seg.color} ${cursor}deg ${visibleEnd}deg`);
    stops.push(`#ffffff ${visibleEnd}deg ${end}deg`);
    cursor = end;
  });
  stops.push(`${EMPTY_COLOR} ${cursor}deg 360deg`);
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

export default function StorageDistributionCard({ flushTop = false }) {
  const progress = useAnimatedNumber(100, 900) / 100;
  const gradient = buildGradient(progress);

  return (
    <div
      className={[
        "bg-surface-container-lowest border border-outline-variant p-lg shadow-sm transition-shadow duration-200 hover:shadow-md",
        flushTop ? "rounded-tr-xl rounded-b-xl" : "rounded-xl",
      ].join(" ")}
    >
      <h3 className="font-headline-sm text-headline-sm text-on-background mb-5">
        Phân bổ vị trí lưu trữ
      </h3>

      <div className="relative flex items-center justify-center mb-6">
        <div
          className="absolute w-48 h-48 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ background: gradient }}
        ></div>

        <div
          className="relative w-44 h-44 rounded-full ring-4 ring-surface-container-highest/50 shadow-[0_10px_28px_-12px_rgba(15,23,42,0.25)]"
          style={{ background: gradient }}
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 32% 24%, rgba(255,255,255,0.55), transparent 55%)",
            }}
          ></div>
          <div className="absolute inset-[14px] rounded-full bg-surface-container-lowest shadow-inner flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-on-background tabular-nums">
              {Math.round(usedPct * progress)}%
            </span>
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wide mt-0.5">
              Đã sử dụng
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-surface-container-low"
            style={{ backgroundColor: `${seg.color}14` }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: seg.color }}
              ></span>
              <span className="text-sm text-on-surface-variant">{seg.label}</span>
            </div>
            <span className="text-sm font-bold text-on-background tabular-nums">
              {Math.round(seg.pct * progress)}%
            </span>
          </div>
        ))}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-surface-container-low"
          style={{ backgroundColor: "#94a3b814" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white shadow-sm border border-outline-variant"
              style={{ backgroundColor: EMPTY_COLOR }}
            ></span>
            <span className="text-sm text-on-surface-variant">Ô trống</span>
          </div>
          <span className="text-sm font-bold text-on-background tabular-nums">
            {Math.round(emptyPct * progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
