const TREND_STYLES = {
  up: "text-[#059669] bg-[#059669]/10",
  down: "text-error bg-error-container/50",
  flat: "text-on-surface-variant bg-surface-container",
};

const TREND_ICONS = {
  up: "trending_up",
  down: "trending_down",
  flat: "trending_flat",
};

export default function KpiCard({
  icon,
  iconBgClass,
  iconColorClass,
  label,
  value,
  caption,
  trend = "flat",
  trendLabel,
  accent = false,
  style,
}) {
  return (
    <div
      style={style}
      className={[
        "bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        "animate-[fade-in-up_0.5s_ease-out_backwards]",
        accent ? "border-l-4 border-l-error" : "",
      ].join(" ")}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <span className={`material-symbols-outlined ${iconColorClass}`}>{icon}</span>
        </div>
        <span
          className={`flex items-center gap-1 font-label-md text-label-md px-2 py-1 rounded ${TREND_STYLES[trend]}`}
        >
          <span className="material-symbols-outlined text-[14px]">{TREND_ICONS[trend]}</span>
          {trendLabel}
        </span>
      </div>
      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
        {label}
      </p>
      <h3 className="font-headline-sm text-headline-sm text-on-background">{value}</h3>
      <p className="font-body-md text-[12px] text-on-surface-variant mt-2">{caption}</p>
    </div>
  );
}
