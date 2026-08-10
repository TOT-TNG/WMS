export default function Header({ warehouseName, onCreateOrder }) {
  return (
    <header className="flex items-center justify-between gap-4 w-full h-16 px-margin-desktop bg-surface-container-lowest dark:bg-surface-container-low border-b border-outline-variant dark:border-outline shadow-sm sticky top-0 z-30">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-full font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Tìm kiếm SKU, Mã ĐH, Vị trí..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right hidden md:block">
          <p className="text-sm text-on-surface-variant">Nhà máy</p>
          <p className="text-base text-primary font-semibold">{warehouseName}</p>
        </div>

        <div className="flex items-center gap-2 border-l border-outline-variant pl-6">
          <button
            type="button"
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative"
            aria-label="Thông báo"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
          </button>
          <button
            type="button"
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
            aria-label="Vị trí"
          >
            <span className="material-symbols-outlined">location_on</span>
          </button>
          <button
            type="button"
            onClick={onCreateOrder}
            className="ml-4 bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo đơn hàng
          </button>
        </div>
      </div>
    </header>
  );
}
