import { useId } from "react";

const MONTHS = ["Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6"];
const VALUES = [21000, 26000, 23000, 31000, 35543, 29000];
const MAX_AXIS_VALUE = 40000;
const Y_LABELS = ["40k", "30k", "20k", "10k", "0"];

// Catmull-Rom -> cubic Bézier smoothing so the curve passes exactly through
// every data point instead of the arbitrary bulges a hand-tuned Q/T path gives.
function buildSmoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

export default function AnalyticsChart() {
  const gradientId = useId();

  const points = VALUES.map((value, i) => ({
    x: (i / (VALUES.length - 1)) * 100,
    y: 100 - (value / MAX_AXIS_VALUE) * 100,
    value,
    label: MONTHS[i],
  }));
  const peak = points.reduce((a, b) => (b.value > a.value ? b : a));
  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L 100,100 L 0,100 Z`;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col transition-shadow duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Phân tích</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">Sản lượng xử lý theo tháng</p>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 border border-outline-variant rounded-full text-on-surface-variant font-label-md flex items-center gap-1 hover:bg-surface-container transition-colors"
        >
          2023 <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
      </div>

      <div className="flex-1 relative min-h-[190px] mt-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-on-surface-variant/70 text-right pr-2 border-r border-outline-variant/30">
          {Y_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Single "plot rectangle": gridlines, curve and tooltip all share these
            same percentage coordinates, so nothing can drift out of alignment. */}
        <div className="absolute left-10 right-0 top-0 bottom-8">
          <div className="absolute inset-0 flex flex-col justify-between">
            {Y_LABELS.map((label, i) => (
              <div
                key={label}
                className={`w-full h-px ${i === Y_LABELS.length - 1 ? "bg-outline-variant/40" : "bg-outline-variant/20"}`}
              ></div>
            ))}
          </div>

          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength="1"
              className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[draw-line_1.1s_ease-out_forwards]"
            />
          </svg>

          {/* Point markers rendered as HTML, not SVG geometry, so they stay
              perfect circles even though the box above them is stretched
              non-uniformly (that stretch is what was distorting the old chart). */}
          {points.map((p) => (
            <div
              key={p.label}
              className="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-[#3b82f6] shadow-sm"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ))}

          <div
            className="absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] bg-primary text-on-primary text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap"
            style={{ left: `${peak.x}%`, top: `${peak.y}%` }}
          >
            {peak.value.toLocaleString("vi-VN")} đơn vị
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-primary"></div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-on-surface-variant font-medium">
          {points.map((p) => (
            <span
              key={p.label}
              className={p.label === peak.label ? "bg-primary text-on-primary px-2 py-0.5 rounded-full" : ""}
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
