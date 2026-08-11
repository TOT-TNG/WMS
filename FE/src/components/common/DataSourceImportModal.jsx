import Modal from "./Modal";

const DATA_SOURCES = [
  { id: "erp", label: "Hệ thống ERP nội bộ", icon: "dns" },
  { id: "mes", label: "Hệ thống MES nhà máy", icon: "precision_manufacturing" },
  { id: "warehouse-db", label: "Kho dữ liệu trung tâm (Data Warehouse)", icon: "storage" },
];

export default function DataSourceImportModal({ open, onClose, onSelectSource }) {
  return (
    <Modal open={open} onClose={onClose} title="Nhập dữ liệu từ cơ sở dữ liệu">
      <p className="text-sm text-on-surface-variant mb-4">
        Chọn nguồn dữ liệu để đồng bộ. Việc nhập sẽ được xử lý khi hệ thống kết nối API backend tương ứng.
      </p>
      <div className="space-y-2">
        {DATA_SOURCES.map((source) => (
          <button
            key={source.id}
            type="button"
            onClick={() => onSelectSource?.(source)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-outline-variant hover:border-primary/40 hover:bg-surface-container-low transition-colors text-left"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">{source.icon}</span>
            <span className="text-sm font-medium text-on-background">{source.label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
