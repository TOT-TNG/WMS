const SUMMARY_ROWS = [
  { label: "Sản phẩm dự kiến", value: "1,127" },
  { label: "Hàng đã xuất", value: "1,569" },
  { label: "Đang vận chuyển", value: "108" },
  { label: "Vị trí khả dụng", value: "142" },
  { label: "Vị trí đã dùng", value: "11,096" },
  { label: "Tổng SKU đang quản lý", value: "486" },
  { label: "Lô hàng sắp hết hạn", value: "9" },
];

const LOW_STOCK_ITEMS = [
  { sku: "SP-1042", name: "Bulong M8 x 20mm", remaining: 18, threshold: 100 },
  { sku: "SP-2078", name: "Băng tải cao su 5m", remaining: 4, threshold: 20 },
  { sku: "SP-3311", name: "Cảm biến quang PNP", remaining: 12, threshold: 50 },
  { sku: "SP-4460", name: "Dầu bôi trơn công nghiệp 5L", remaining: 7, threshold: 40 },
];

export default function WarehouseSummaryCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm h-full flex flex-col transition-shadow duration-200 hover:shadow-md">
      <h3 className="font-headline-sm text-headline-sm text-on-background mb-3 shrink-0">Tóm tắt kho hàng</h3>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
        <div className="text-sm">
          {SUMMARY_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2.5 border-b border-outline-variant/50 last:border-b-0"
            >
              <span className="text-on-surface-variant">{row.label}</span>
              <span className="font-semibold text-on-background">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-outline-variant/50">
          <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
            Sản phẩm tồn kho thấp
          </h4>
          <div className="space-y-3">
            {LOW_STOCK_ITEMS.map((item) => {
              const ratio = Math.min(item.remaining / item.threshold, 1);
              return (
                <div key={item.sku}>
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <div className="min-w-0">
                      <span className="text-sm text-on-background truncate block">{item.name}</span>
                      <span className="text-[11px] text-on-surface-variant">{item.sku}</span>
                    </div>
                    <span className="text-xs font-semibold text-error shrink-0">{item.remaining} còn lại</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full rounded-full bg-error" style={{ width: `${ratio * 100}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 pt-3 border-t border-outline-variant/50 w-full flex justify-between items-center text-sm font-medium text-primary hover:opacity-80 transition-opacity shrink-0"
      >
        Xem tất cả
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  );
}
