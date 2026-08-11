import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import BinOrdersModal from "./BinOrdersModal";

function getBinStats(bin) {
  const skuCount = new Set(bin.orders.map((order) => order.sku)).size;
  return { orderCount: bin.orders.length, skuCount };
}

export default function BinList({
  bins,
  selectedPosition,
  onClearSelection,
  onUnassignBin,
  onRemoveOrder,
  onPackOrder,
}) {
  // Only the id is kept in state; the bin itself is looked up fresh from `bins` on every
  // render so removing an order (or unassigning the bin) updates the modal immediately.
  const [selectedBinId, setSelectedBinId] = useState(null);
  const [dragOverBinId, setDragOverBinId] = useState(null);
  const selectedBin = bins.find((bin) => bin.id === selectedBinId) ?? null;
  const unassignedBins = bins.filter((bin) => !bin.positionId);
  const displayedBins = selectedPosition ? selectedPosition.bins : unassignedBins;

  return (
    <div className="h-full flex flex-col min-h-0">
      {selectedPosition ? (
        <div className="flex items-center gap-4 mb-4 p-3.5 rounded-lg border border-outline-variant bg-surface-bright shrink-0">
          <div className="p-1.5 rounded border border-outline-variant bg-white shrink-0">
            <QRCodeSVG value={selectedPosition.id} size={68} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-on-background truncate">{selectedPosition.code}</p>
            <p className="text-sm text-on-surface-variant mt-1">
              {selectedPosition.bins.length} thùng tại vị trí này
            </p>
          </div>
          <button
            type="button"
            onClick={onClearSelection}
            className="shrink-0 p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
            aria-label="Bỏ chọn vị trí, xem thùng chưa xếp vị trí"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      ) : (
        <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 shrink-0">
          Thùng chưa xếp vị trí ({unassignedBins.length})
        </h4>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {selectedPosition && displayedBins.length === 0 && (
          <p className="text-sm text-on-surface-variant">Vị trí này hiện chưa có thùng hàng nào.</p>
        )}
        {!selectedPosition && displayedBins.length === 0 && (
          <p className="text-sm text-on-surface-variant">Tất cả thùng hàng đã được xếp vào vị trí.</p>
        )}
        {displayedBins.map((bin) => {
          const { orderCount, skuCount } = getBinStats(bin);
          const draggable = !selectedPosition;
          return (
            <button
              key={bin.id}
              type="button"
              draggable={draggable}
              onDragStart={(e) => e.dataTransfer.setData("text/plain", bin.id)}
              onDragOver={(e) => {
                if (!draggable || !e.dataTransfer.types.includes("application/x-wms-order")) return;
                e.preventDefault();
                if (dragOverBinId !== bin.id) setDragOverBinId(bin.id);
              }}
              onDragLeave={() => setDragOverBinId((current) => (current === bin.id ? null : current))}
              onDrop={(e) => {
                if (!draggable || !e.dataTransfer.types.includes("application/x-wms-order")) return;
                e.preventDefault();
                setDragOverBinId(null);
                const payload = JSON.parse(e.dataTransfer.getData("application/x-wms-order"));
                onPackOrder?.(payload.orderCode, payload.sku, bin.id);
              }}
              onClick={() => setSelectedBinId(bin.id)}
              className={[
                "w-full flex items-start gap-3 px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright hover:border-primary/40 hover:bg-surface-container-low transition-colors text-left",
                draggable ? "cursor-grab active:cursor-grabbing" : "",
                dragOverBinId === bin.id ? "ring-2 ring-primary ring-offset-1" : "",
              ].join(" ")}
            >
              {draggable && (
                <span className="material-symbols-outlined text-on-surface-variant/60 text-xl mt-0.5 shrink-0">
                  drag_indicator
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-on-background truncate">{bin.id}</p>
                {bin.location && (
                  <p className="text-sm text-on-surface-variant truncate mt-0.5">{bin.location}</p>
                )}
                <p className="text-sm text-on-surface-variant mt-1.5">
                  {orderCount} đơn · {skuCount} mã hàng
                </p>
              </div>
              {selectedPosition && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnassignBin?.(bin.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onUnassignBin?.(bin.id);
                    }
                  }}
                  className="shrink-0 p-1 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                  aria-label={`Bỏ thùng ${bin.id} ra khỏi vị trí`}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <BinOrdersModal
        bin={selectedBin}
        onClose={() => setSelectedBinId(null)}
        onRemoveOrder={(orderCode, sku) => onRemoveOrder?.(selectedBin.id, orderCode, sku)}
      />
    </div>
  );
}
