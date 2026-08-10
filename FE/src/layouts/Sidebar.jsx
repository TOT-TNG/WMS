import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Trang chủ", icon: "dashboard" },
  { to: "/inventory", label: "Kho hàng", icon: "inventory_2" },
  { to: "/orders", label: "Đơn hàng", icon: "shopping_cart" },
  { to: "/shipping", label: "Vận chuyển", icon: "local_shipping" },
  { to: "/reports", label: "Báo cáo", icon: "analytics" },
  { to: "/settings", label: "Cài đặt", icon: "settings" },
];

export default function Sidebar({ warehouseName, user }) {
  return (
    <nav className="fixed left-0 top-0 h-full w-60 bg-primary dark:bg-inverse-surface flex flex-col z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-container text-[20px]">warehouse</span>
        </div>
        <div>
          <h1 className="font-headline-md text-xl font-bold leading-tight text-surface-container-lowest">
            TOT WMS
          </h1>
          <p className="text-base text-surface-container-lowest/70">
            {warehouseName}
          </p>
        </div>
      </div>

      <div className="flex-1 py-4 space-y-1 custom-scrollbar overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 pl-6 pr-5 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-background text-primary font-bold rounded-l-full"
                  : "text-surface-variant hover:text-surface-bright hover:bg-white/5",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[24px] transition-transform duration-200 group-hover:scale-110"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <button
          type="button"
          className="w-full bg-surface-container-lowest text-primary text-sm font-semibold py-3 px-4 rounded-lg shadow-sm hover:opacity-90 hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">qr_code_scanner</span>
          Quét mã vạch
        </button>

        <div className="mt-4 flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
          <img
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-outline-variant"
            src={user.avatarUrl}
          />
          <div>
            <p className="text-sm font-medium text-surface-container-lowest">
              {user.name}
            </p>
            <p className="text-xs text-surface-container-lowest/60">{user.role}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
