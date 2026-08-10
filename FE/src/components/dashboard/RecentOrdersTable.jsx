const ORDERS = [
  { id: "#23113", date: "25 Thg 6, 2022", price: "$2500", trackingCode: "#35266925", status: "Đã Giao" },
  { id: "#54625", date: "25 Thg 6, 2022", price: "$3054", trackingCode: "#50458845", status: "Đã Giao" },
  { id: "#343345", date: "25 Thg 6, 2022", price: "$8745", trackingCode: "#69603584", status: "Đã Giao" },
  { id: "#35625", date: "25 Thg 6, 2022", price: "$3562", trackingCode: "#40502282", status: "Đã Giao" },
  { id: "#65769", date: "25 Thg 6, 2022", price: "$4654", trackingCode: "#85635425", status: "Đã Giao" },
];

const STATUS_STYLES = {
  "Đã Giao": "bg-[#4ade80]/20 text-[#166534]",
  "Đang Giao": "bg-[#F59E0B]/20 text-[#92400e]",
  "Đã Hủy": "bg-error-container text-on-error-container",
};

export default function RecentOrdersTable() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright">
        <h3 className="font-headline-sm text-headline-sm text-on-background">Đơn hàng gần đây</h3>
        <button
          type="button"
          className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1"
        >
          Xem Tất Cả
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Mã Đơn
              </th>
              <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Ngày
              </th>
              <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Giá
              </th>
              <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Mã Vận Đơn
              </th>
              <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-center">
                Trạng Thái
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md">
            {ORDERS.map((order, i) => (
              <tr
                key={order.id}
                className={[
                  "border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors last:border-b-0",
                  i % 2 === 1 ? "bg-surface-container-lowest" : "",
                ].join(" ")}
              >
                <td className="py-3 px-6 font-data-mono text-on-surface-variant">{order.id}</td>
                <td className="py-3 px-6 text-on-surface-variant">{order.date}</td>
                <td className="py-3 px-6 text-on-surface-variant">{order.price}</td>
                <td className="py-3 px-6 font-data-mono text-on-surface-variant">{order.trackingCode}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLES[order.status]}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
