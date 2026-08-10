import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import RightPanel from "./RightPanel";
import { CURRENT_USER } from "../data/currentUser";

export default function AppLayout() {
  const warehouseName = "Sông Công 3";
  const Detail = "Kho thông minh";

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      <Sidebar warehouseName={Detail} user={CURRENT_USER} />

      {/* This column owns the full width right of the sidebar, so the header
          can span edge-to-edge instead of stopping short of the right panel. */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Header warehouseName={warehouseName} onCreateOrder={() => {}} />
        <main className="custom-scrollbar flex-1 mr-80 pt-4 px-margin-desktop pb-margin-desktop overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <RightPanel usagePercent={73} />
    </div>
  );
}
