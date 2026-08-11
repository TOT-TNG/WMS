import { QRCodeSVG } from "qrcode.react";
import Modal from "../common/Modal";

export default function OrderDetailModal({ order, onClose }) {
  const open = Boolean(order);

  return (
    <Modal open={open} onClose={onClose} title={open ? `Đơn hàng ${order.orderCode}` : ""}>
      {open && (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="p-3 rounded-lg border border-outline-variant bg-white shrink-0">
            <QRCodeSVG value={order.sku} size={160} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Mã đơn hàng</p>
            <p className="font-data-mono text-lg font-semibold text-on-background mb-4">{order.orderCode}</p>

            <p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">Mã hàng</p>
            <p className="font-data-mono text-base font-semibold text-on-background">{order.sku}</p>
            <p className="text-base text-on-surface-variant mb-4">{order.name}</p>

            <span className="inline-flex items-center text-sm font-semibold text-on-background bg-surface-container-highest px-3 py-1.5 rounded-full">
              Số lượng: {order.quantity}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
