const Y_LABELS = ["240", "180", "120", "60", "0"];
const MAX_AXIS_VALUE = 240;

const BARS = [
  { day: "T2", value: 118, color: "#60a5fa" },
  { day: "T3", value: 176, color: "#3b82f6" },
  { day: "T4", value: 102, color: "#60a5fa" },
  { day: "T5", value: 238, color: "#4ade80" },
  { day: "T6", value: 162, color: "#3b82f6" },
  { day: "T7", value: 132, color: "#60a5fa" },
  { day: "CN", value: 224, color: "#4ade80" },
];

export default function DailyActivityChart() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col transition-shadow duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Hoạt động hàng ngày</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">Số đơn xử lý theo ngày</p>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="text-xs">20 Thg 4 - 27 Thg 4</span>
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
        </div>
      </div>

      <div className="flex-1 relative min-h-[190px] mt-4">
        <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-on-surface-variant/70 text-right pr-2 border-r border-outline-variant/30">
          {Y_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="absolute left-10 right-0 top-0 bottom-8">
          <div className="absolute inset-0 flex flex-col justify-between">
            {Y_LABELS.map((label, i) => (
              <div
                key={label}
                className={`w-full h-px ${i === Y_LABELS.length - 1 ? "bg-outline-variant/40" : "bg-outline-variant/20"}`}
              ></div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-end px-2 gap-2">
            {BARS.map((bar, i) => (
              <div key={bar.day} className="group relative flex-1 h-full flex items-end justify-center">
                <div
                  className="w-full max-w-[28px] rounded-t-md origin-bottom transition-[filter] duration-200 group-hover:brightness-110"
                  style={{
                    height: `${(bar.value / MAX_AXIS_VALUE) * 100}%`,
                    background: `linear-gradient(180deg, ${bar.color}, ${bar.color}99)`,
                    animation: `grow-bar 0.6s ease-out ${i * 60}ms backwards`,
                  }}
                ></div>
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 bg-tertiary text-white text-[11px] font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {bar.value} đơn
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-10 right-0 flex px-2 gap-2 text-xs text-on-surface-variant font-medium">
          {BARS.map((bar) => (
            <span key={bar.day} className="flex-1 text-center">
              {bar.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
