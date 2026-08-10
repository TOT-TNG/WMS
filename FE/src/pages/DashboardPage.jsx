import KpiRow from "../components/dashboard/KpiRow";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import DailyActivityChart from "../components/dashboard/DailyActivityChart";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import { CURRENT_USER } from "../data/currentUser";

const TODAY_LABEL = new Date().toLocaleDateString("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function DashboardPage() {
  return (
    <>
      <div className="mb-sm">
        <div className="flex justify-between items-start">
          <h2 className="font-headline-lg text-headline-lg text-on-background">
            Xin chào, {CURRENT_USER.name}
          </h2>
          <button
            type="button"
            className="px-3 py-1.5 border border-outline-variant rounded-md text-on-surface-variant font-label-md flex items-center gap-1 hover:bg-surface-container-lowest bg-surface-container-lowest shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span> Hôm nay
          </button>
        </div>
        <p className="font-body-md text-on-surface-variant capitalize mt-0.5">{TODAY_LABEL}</p>
      </div>

      <KpiRow />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md mb-sm">
        <AnalyticsChart />
        <DailyActivityChart />
      </div>

      <RecentOrdersTable />
    </>
  );
}
