import { useEffect, useState } from "react";
import Modal from "../common/Modal";

const inputClass =
  "w-full px-3 py-2 rounded-md border border-outline-variant bg-surface-bright text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

export default function AddGoodsModal({ open, onClose, zoneOptions, defaultZoneLabel, onSubmit }) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [zoneLabel, setZoneLabel] = useState(defaultZoneLabel);

  useEffect(() => {
    if (open) setZoneLabel(defaultZoneLabel);
  }, [open, defaultZoneLabel]);

  function resetAndClose() {
    setSku("");
    setName("");
    setQuantity("");
    setZoneLabel(defaultZoneLabel);
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || !quantity) return;
    onSubmit({ zoneLabel, sku: sku.trim(), name: name.trim(), quantity: Number(quantity) });
    resetAndClose();
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Nhập hàng mới vào kho">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Khu vực</label>
          <select value={zoneLabel} onChange={(e) => setZoneLabel(e.target.value)} className={inputClass}>
            {zoneOptions.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Mã hàng</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="VD: SP-1050"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Tên hàng</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Vòng bi SKF 6206"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Số lượng</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="VD: 20"
            className={inputClass}
            required
          />
        </div>

        <p className="text-xs text-on-surface-variant">
          Hàng mới sẽ ở trạng thái "chưa xếp vị trí" — kéo thả vào ô trên sơ đồ kệ để xếp lên giá.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            Nhập hàng
          </button>
        </div>
      </form>
    </Modal>
  );
}
