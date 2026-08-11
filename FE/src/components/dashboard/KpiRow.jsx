import KpiCard from "../common/KpiCard";

const KPI_DATA = [
  {
    icon: "inventory_2",
    iconBgClass: "bg-primary-container/10",
    iconColorClass: "text-primary-container",
    label: "Tổng Tồn kho",
    value: "142,854",
    caption: "đơn vị trong kho",
    trend: "up",
    trendLabel: "2.4%",
  },
  {
    icon: "local_shipping",
    iconBgClass: "bg-secondary-container/20",
    iconColorClass: "text-secondary",
    label: "Đang vận chuyển",
    value: "342",
    caption: "đang trên đường hôm nay",
    trend: "up",
    trendLabel: "5.1%",
  },
  {
    icon: "pending_actions",
    iconBgClass: "bg-[#F59E0B]/10",
    iconColorClass: "text-[#F59E0B]",
    label: "Đơn Hàng Chờ",
    value: "128",
    caption: "chờ xử lý",
    trend: "flat",
    trendLabel: "0.0%",
  },
  {
    icon: "warning",
    iconBgClass: "bg-error-container",
    iconColorClass: "text-on-error-container",
    label: "Cảnh Báo Tồn Thấp",
    value: "24",
    caption: "SKU dưới ngưỡng",
    trend: "down",
    trendLabel: "Cần xử lý",
    accent: true,
  },
];

export default function KpiRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md mb-sm">
      {KPI_DATA.map((kpi, i) => (
        <KpiCard key={kpi.label} {...kpi} style={{ animationDelay: `${i * 70}ms` }} />
      ))}
    </div>
  );
}
