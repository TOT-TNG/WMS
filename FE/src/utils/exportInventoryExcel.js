const STATUS_LABELS = {
  "no-bin": "Chưa xếp vào thùng",
  "no-position": "Đã vào thùng, chưa xếp vị trí",
  placed: "Đã xếp vị trí trên giá",
};

const COLUMNS = [
  { header: "STT", width: 6 },
  { header: "Mã hàng", width: 16 },
  { header: "Tên hàng", width: 32 },
  { header: "Số lượng", width: 10 },
  { header: "Trạng thái", width: 26 },
  { header: "Mã đơn hàng", width: 16 },
  { header: "Mã thùng", width: 16 },
  { header: "Mã vạch thùng", width: 16 },
  { header: "Khu vực", width: 12 },
  { header: "Kệ", width: 12 },
  { header: "Tầng", width: 8 },
  { header: "Vị trí cụ thể", width: 30 },
];

// Exports the given (already filtered/searched) catalog rows to a .xlsx report with one
// fixed, full-information column layout — this only ever reads data already held in memory
// on our own state, never an uploaded file, so it doesn't exercise xlsx's file-parsing code.
// The xlsx library is loaded on demand (it's a large dependency) so it never bloats the
// initial page load — only clicking "Xuất Excel" pulls it in.
export async function exportInventoryToExcel(zoneLabel, items, statusOf) {
  const XLSX = await import("xlsx");

  const rows = items.map((item, index) => [
    index + 1,
    item.sku,
    item.name,
    item.quantity,
    STATUS_LABELS[statusOf(item)],
    item.orderCode,
    item.binId ?? "—",
    item.binBarcode ?? "—",
    zoneLabel,
    item.rackLabel ?? "—",
    item.level ?? "—",
    item.location ?? "—",
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([COLUMNS.map((c) => c.header), ...rows]);
  worksheet["!cols"] = COLUMNS.map((c) => ({ wch: c.width }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sach hang hoa");

  const datePart = new Date().toISOString().slice(0, 10);
  const safeZoneName = zoneLabel.replace(/\s+/g, "_");
  XLSX.writeFile(workbook, `Danh_sach_hang_hoa_${safeZoneName}_${datePart}.xlsx`);
}
