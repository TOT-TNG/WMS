import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Modal from "../common/Modal";
import OrderDetailModal from "./OrderDetailModal";

export default function BinOrdersModal({ bin, onClose, onRemoveOrder }) {
  const [selectedOrderKey, setSelectedOrderKey] = useState(null);
  const open = Boolean(bin);
  const selectedOrder = open
    ? bin.orders.find((o) => `${o.orderCode}-${o.sku}` === selectedOrderKey) ?? null
    : null;

  return (
    <Modal open={open} onClose={onClose} title={open ? `Đơn hàng trong thùng ${bin.id}` : ""}>
      {open && (
        <div>
          <div className="flex items-center gap-5 px-5 py-4 rounded-lg border border-outline-variant bg-surface-bright mb-6">
            <div className="p-2 rounded-lg border border-outline-variant bg-white shrink-0">
              <QRCodeSVG value={bin.barcode} size={72} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-on-background">{bin.id}</p>
              <p className="text-base text-on-surface-variant mt-1">{bin.location}</p>
            </div>
          </div>

          <h4 className="text-base font-semibold text-on-surface-variant uppercase tracking-wide mb-4">
            Đơn hàng ({bin.orders.length})
          </h4>
          {bin.orders.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Thùng này hiện không còn mã hàng nào.</p>
          ) : (
            <div className="space-y-3">
              {bin.orders.map((item) => (
                <button
                  key={`${item.orderCode}-${item.sku}`}
                  type="button"
                  onClick={() => setSelectedOrderKey(`${item.orderCode}-${item.sku}`)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-lg border border-outline-variant bg-surface-bright hover:border-primary/40 hover:bg-surface-container-low transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-primary text-3xl shrink-0">
                    receipt_long
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-data-mono text-base font-semibold text-on-background">{item.orderCode}</p>
                    <p className="text-base text-on-surface-variant truncate mt-1">
                      {item.sku} · {item.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-on-background bg-surface-container-highest px-3 py-1.5 rounded-full">
                    SL: {item.quantity}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveOrder?.(item.orderCode, item.sku);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        onRemoveOrder?.(item.orderCode, item.sku);
                      }
                    }}
                    className="shrink-0 p-1.5 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                    aria-label={`Bỏ mã hàng ${item.sku} ra khỏi thùng`}
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrderKey(null)} />
    </Modal>
  );
}
