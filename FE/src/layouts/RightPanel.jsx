import { useEffect, useState } from "react";

const VEHICLES = [
  { id: "DNC 1254", deliveryDate: "5 Th5", driver: "Thuyết" },
  { id: "DNC 1545", deliveryDate: "5 Th5", driver: "Thuyết" },
  { id: "DNC 2356", deliveryDate: "5 Th5", driver: "Thuyết" },
];

const ACTIVITIES = [
  {
    icon: "inbox",
    text: "Nhập kho 320 SKU từ NCC Sài Gòn Foods",
    time: "12 phút trước",
    colorClass: "text-secondary bg-secondary-container/20",
  },
  {
    icon: "local_shipping",
    text: "Đơn #54625 đã rời kho",
    time: "38 phút trước",
    colorClass: "text-[#059669] bg-[#059669]/10",
  },
  {
    icon: "inventory_2",
    text: "Kiểm kê khu vực B2 hoàn tất",
    time: "1 giờ trước",
    colorClass: "text-primary-container bg-primary-container/10",
  },
  {
    icon: "report",
    text: "SKU WMS-2291 dưới ngưỡng tồn tối thiểu",
    time: "2 giờ trước",
    colorClass: "text-error bg-error-container/60",
  },
];

function UsageGauge({ usagePercent }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(eased * usagePercent));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [usagePercent]);

  const sweepDeg = animatedPercent * 3.6;
  const gradient = `conic-gradient(from -90deg, #22d3ee 0deg, #34d399 ${sweepDeg}deg, #e2e8f0 ${sweepDeg}deg 360deg)`;

  return (
    <div className="relative flex items-center justify-center mb-4">
      <div
        className="absolute w-44 h-44 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{
          background: `conic-gradient(from -90deg, #22d3ee 0deg, #34d399 ${sweepDeg}deg, transparent ${sweepDeg}deg 360deg)`,
        }}
      ></div>
      <div
        className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(52,211,153,0.5)]"
        style={{ background: gradient }}
      >
        <div className="w-[calc(100%-28px)] h-[calc(100%-28px)] rounded-full bg-surface-container-lowest shadow-inner flex flex-col items-center justify-center">
          <span className="font-headline-lg text-3xl font-bold text-on-background tabular-nums">
            {animatedPercent}%
          </span>
          <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wide">Đã dùng</span>
          <span className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[13px]">trending_up</span>
            +3% tuần này
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RightPanel({ usagePercent = 73 }) {
  return (
    <aside className="custom-scrollbar fixed right-0 top-16 bottom-0 w-80 bg-surface-container-lowest border-l border-outline-variant p-6 overflow-y-auto flex flex-col gap-8 z-20">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Sử dụng kho</h3>
        <UsageGauge usagePercent={usagePercent} />
        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#22d3ee] to-[#34d399]"></div>
            <span className="font-body-md text-on-surface">Tổng Kệ Đã Dùng</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm bg-[#e2e8f0]"></div>
            <span className="font-body-md text-on-surface">Kệ Trống</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Theo Dõi Xe</h3>
        <div className="space-y-3">
          {VEHICLES.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border border-outline-variant rounded-xl p-4 bg-surface-bright transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Tên xe</p>
                  <p className="font-bold text-sm">{vehicle.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Giao hàng</p>
                  <p className="font-bold text-sm">{vehicle.deliveryDate}</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mb-3">Tài xế: {vehicle.driver}</p>
              <button
                type="button"
                className="w-full bg-[#3b82f6] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Theo dõi xe
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Hoạt động gần đây</h3>
        <ul className="space-y-4">
          {ACTIVITIES.map((activity) => (
            <li key={activity.text} className="flex gap-3">
              <span
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.colorClass}`}
              >
                <span className="material-symbols-outlined text-[16px]">{activity.icon}</span>
              </span>
              <div className="min-w-0">
                <p className="text-sm text-on-surface leading-snug">{activity.text}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
