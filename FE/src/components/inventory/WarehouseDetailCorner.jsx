import { useState, useEffect } from "react";
import RackElevationGrid from "./RackElevationGrid";
import BinList from "./BinList";
import { LEGEND, STATUS_STYLES, getPositionInfo } from "../../data/warehouseZones";
import ImportMenu from "../common/ImportMenu";
import ImportNotice from "../common/ImportNotice";
import DataSourceImportModal from "../common/DataSourceImportModal";

export default function WarehouseDetailCorner({ zone, onExpand, onMoveBin, onRemoveOrder, onPackOrder }) {
  const [notice, setNotice] = useState("");
  const [dbModalOpen, setDbModalOpen] = useState(false);
  // Only the id/code are kept in state; the bin list for it is recomputed from the live
  // `zone` on every render so drag-and-drop changes show up immediately.
  const [selectedPositionRef, setSelectedPositionRef] = useState(null);

  useEffect(() => {
    setSelectedPositionRef(null);
  }, [zone.label]);

  const selectedPosition = selectedPositionRef
    ? { ...getPositionInfo(zone, selectedPositionRef.id), code: selectedPositionRef.code }
    : null;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm h-full flex flex-col transition-shadow duration-200 hover:shadow-md">
      <div className="flex-1 min-h-0 flex gap-4">
        {/* Left: lane grid, with its own header so the action buttons never sit above the bin list */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <div className="flex justify-between items-start gap-3 mb-3">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-background">Sơ đồ kho hàng</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">{zone.label}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ImportMenu
                label="Nhập dữ liệu"
                onSelectFile={(file) =>
                  setNotice(`Đã chọn file "${file.name}" cho ${zone.label} — sẽ xử lý khi kết nối API backend.`)
                }
                onOpenDatabaseImport={() => setDbModalOpen(true)}
              />
              <button
                type="button"
                onClick={onExpand}
                className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                aria-label="Phóng to sơ đồ kho hàng"
              >
                <span className="material-symbols-outlined text-[20px]">open_in_full</span>
              </button>
            </div>
          </div>

          <ImportNotice message={notice} onDismiss={() => setNotice("")} />

          <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mb-3">
            {LEGEND.map((item) => (
              <span key={item.status} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[item.status].split(" ")[0]}`}></span>
                {item.label}
              </span>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <RackElevationGrid
              zone={zone}
              onSelectPosition={(info) => setSelectedPositionRef({ id: info.id, code: info.code })}
              onDropBin={onMoveBin}
            />
          </div>
        </div>

        {/* Right: bin list, its own header + a divider that runs the full height of the card */}
        {zone.bins && (
          <div className="w-80 shrink-0 border-l border-outline-variant pl-4 flex flex-col min-h-0">
            <BinList
              bins={zone.bins}
              selectedPosition={selectedPosition}
              onClearSelection={() => setSelectedPositionRef(null)}
              onUnassignBin={(binId) => onMoveBin(binId, null, null)}
              onRemoveOrder={onRemoveOrder}
              onPackOrder={onPackOrder}
            />
          </div>
        )}
      </div>

      <DataSourceImportModal
        open={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        onSelectSource={(source) => {
          setDbModalOpen(false);
          setNotice(`Đang nhập dữ liệu ${zone.label} từ "${source.label}" — sẽ hoàn tất khi kết nối API backend.`);
        }}
      />
    </div>
  );
}
