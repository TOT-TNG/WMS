import { useState } from "react";
import { getZoneStats } from "../../data/warehouseZones";
import ImportMenu from "../common/ImportMenu";
import ImportNotice from "../common/ImportNotice";
import DataSourceImportModal from "../common/DataSourceImportModal";
import WarehouseWatermark from "./WarehouseWatermark";

function WarehouseCard({ zone, selected, onClick }) {
  const stats = getZoneStats(zone);
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex-1 min-w-[240px] overflow-hidden rounded-xl border-2 p-5 text-left transition-all duration-200",
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-outline-variant hover:border-primary/40 hover:bg-surface-container-low hover:shadow-sm",
      ].join(" ")}
    >
      {/* Faint background image sunk behind the content, just to read as "this card is a warehouse" */}
      <WarehouseWatermark className="absolute -right-6 -bottom-8 w-56 h-40 text-primary/[0.07] pointer-events-none select-none transition-transform duration-300 group-hover:scale-105" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-container text-2xl">warehouse</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-lg text-on-background truncate">{zone.label}</p>
            <p className="text-xs text-on-surface-variant">{zone.racks.length} kệ hàng</p>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-[#e2e8f0] overflow-hidden flex mb-2">
          <div style={{ width: `${stats.fullPct}%`, backgroundColor: "#34d399" }}></div>
          <div style={{ width: `${stats.partialPct}%`, backgroundColor: "#F59E0B" }}></div>
        </div>
        <span className="text-sm text-on-surface-variant">{stats.usedPct}% đã sử dụng</span>
      </div>
    </button>
  );
}

export default function FactoryFloorPlan({ zones, selectedZoneLabel, onSelectZone, onAddGoods, onIssueGoods }) {
  const [notice, setNotice] = useState("");
  const [dbModalOpen, setDbModalOpen] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm shrink-0 flex flex-col transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-headline-sm text-headline-sm text-on-background">Kho hàng</h3>
            <ImportMenu
              label="Chỉnh sửa kho hàng"
              icon="edit"
              iconOnly
              onSelectFile={(file) =>
                setNotice(`Đã chọn file "${file.name}" — sẽ xử lý khi kết nối API backend.`)
              }
              onOpenDatabaseImport={() => setDbModalOpen(true)}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">Chọn một kho để xem chi tiết vị trí lưu trữ</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddGoods}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-lowest text-on-background border border-outline-variant text-sm font-medium hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nhập hàng
          </button>
          <button
            type="button"
            onClick={onIssueGoods}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container-lowest text-on-background border border-outline-variant text-sm font-medium hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            Xuất hàng
          </button>
        </div>
      </div>

      <ImportNotice message={notice} onDismiss={() => setNotice("")} />

      <div className="flex flex-wrap gap-4">
        {zones.map((zone) => (
          <WarehouseCard
            key={zone.label}
            zone={zone}
            selected={zone.label === selectedZoneLabel}
            onClick={() => onSelectZone(zone.label)}
          />
        ))}
      </div>

      <DataSourceImportModal
        open={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        onSelectSource={(source) => {
          setDbModalOpen(false);
          setNotice(`Đang nhập danh sách kho từ "${source.label}" — sẽ hoàn tất khi kết nối API backend.`);
        }}
      />
    </div>
  );
}
