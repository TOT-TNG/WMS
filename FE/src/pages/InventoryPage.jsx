import { useMemo, useState } from "react";
import StorageDistributionCard from "../components/inventory/StorageDistributionCard";
import WarehouseSummaryCard from "../components/inventory/WarehouseSummaryCard";
import InventoryCatalogCard from "../components/inventory/InventoryCatalogCard";
import AddGoodsModal from "../components/inventory/AddGoodsModal";
import IssueSlipModal from "../components/inventory/IssueSlipModal";
import FactoryFloorPlan from "../components/inventory/FactoryFloorPlan";
import WarehouseDetailCorner from "../components/inventory/WarehouseDetailCorner";
import RackElevationGrid from "../components/inventory/RackElevationGrid";
import Modal from "../components/common/Modal";
import { ZONES } from "../data/warehouseZones";

const SIDEBAR_TABS = [
  { id: "overview", label: "Tổng quan" },
  { id: "catalog", label: "Danh sách hàng hóa" },
];

export default function InventoryPage() {
  const [selectedZoneLabel, setSelectedZoneLabel] = useState(ZONES[0].label);
  const [expanded, setExpanded] = useState(false);
  const [sidebarView, setSidebarView] = useState("overview");
  const [addGoodsOpen, setAddGoodsOpen] = useState(false);
  const [issueSlipOpen, setIssueSlipOpen] = useState(false);
  // Bins are the only thing that ever changes at runtime (a tote gets placed on / pulled off
  // a rack, or a manual receiving entry is added), so they're lifted into state here while
  // the rack/position structure stays static. Orders that haven't been packed into any bin
  // yet live in their own map, separate from bins.
  const [binsByZone, setBinsByZone] = useState(() =>
    Object.fromEntries(ZONES.map((zone) => [zone.label, zone.bins])),
  );
  const [unassignedOrdersByZone, setUnassignedOrdersByZone] = useState(() =>
    Object.fromEntries(ZONES.map((zone) => [zone.label, []])),
  );
  // Not shown anywhere yet — kept so the future "Đơn hàng" (outbound history) page has real
  // data to read from instead of being rebuilt from scratch later.
  const [outboundLog, setOutboundLog] = useState([]);

  const zones = useMemo(
    () =>
      ZONES.map((zone) => ({
        ...zone,
        bins: binsByZone[zone.label],
        unassignedOrders: unassignedOrdersByZone[zone.label],
      })),
    [binsByZone, unassignedOrdersByZone],
  );
  const selectedZone = zones.find((zone) => zone.label === selectedZoneLabel);

  function moveBin(zoneLabel, binId, positionId, location) {
    setBinsByZone((prev) => ({
      ...prev,
      [zoneLabel]: prev[zoneLabel].map((bin) =>
        bin.id === binId ? { ...bin, positionId, location } : bin,
      ),
    }));
  }

  // Taking an order out of a bin doesn't delete it — it goes back to being an unpacked order
  // in the catalog list, same as one that was never packed in the first place.
  function removeOrderFromBin(zoneLabel, binId, orderCode, sku) {
    const bin = binsByZone[zoneLabel].find((b) => b.id === binId);
    const order = bin?.orders.find((o) => o.orderCode === orderCode && o.sku === sku);
    if (!order) return;
    setBinsByZone((prev) => ({
      ...prev,
      [zoneLabel]: prev[zoneLabel].map((b) =>
        b.id === binId
          ? { ...b, orders: b.orders.filter((o) => !(o.orderCode === orderCode && o.sku === sku)) }
          : b,
      ),
    }));
    setUnassignedOrdersByZone((prev) => ({
      ...prev,
      [zoneLabel]: [...prev[zoneLabel], order],
    }));
  }

  // A manual "nhập hàng mới" entry lands as a standalone order — not yet packed into any
  // bin. It shows up in the catalog list (and can be dragged onto a bin in the "Thùng chưa
  // xếp vị trí" list to pack it) until someone assigns it to a tote.
  function addGoods({ zoneLabel, sku, name, quantity }) {
    const stamp = Date.now();
    const newOrder = { orderCode: `DH-NEW-${stamp}`, sku, name, quantity };
    setUnassignedOrdersByZone((prev) => ({ ...prev, [zoneLabel]: [...prev[zoneLabel], newOrder] }));
    setSelectedZoneLabel(zoneLabel);
    setSidebarView("catalog");
  }

  // Packs a not-yet-assigned order into an existing bin (dragged from the catalog list onto
  // a bin in the "Thùng chưa xếp vị trí" list).
  function packOrderIntoBin(zoneLabel, orderCode, sku, binId) {
    const order = unassignedOrdersByZone[zoneLabel].find((o) => o.orderCode === orderCode && o.sku === sku);
    if (!order) return;
    setUnassignedOrdersByZone((prev) => ({
      ...prev,
      [zoneLabel]: prev[zoneLabel].filter((o) => !(o.orderCode === orderCode && o.sku === sku)),
    }));
    setBinsByZone((prev) => ({
      ...prev,
      [zoneLabel]: prev[zoneLabel].map((bin) =>
        bin.id === binId ? { ...bin, orders: [...bin.orders, order] } : bin,
      ),
    }));
  }

  // Issues one or more order lines out of the warehouse at once (a "phiếu xuất kho"). Unlike
  // removeOrderFromBin, the quantity leaves for good — it does not return to the catalog as
  // unpacked, it's shipped. A line is either reduced in place or removed entirely if fully issued.
  function issueGoods(zoneLabel, lines) {
    setBinsByZone((prev) => ({
      ...prev,
      [zoneLabel]: prev[zoneLabel].map((bin) => {
        const linesForBin = lines.filter((l) => l.binId === bin.id);
        if (linesForBin.length === 0) return bin;
        return {
          ...bin,
          orders: bin.orders
            .map((o) => {
              const line = linesForBin.find((l) => l.orderCode === o.orderCode && l.sku === o.sku);
              if (!line) return o;
              const remaining = o.quantity - line.quantity;
              return remaining > 0 ? { ...o, quantity: remaining } : null;
            })
            .filter(Boolean),
        };
      }),
    }));

    const issuedAt = new Date().toISOString();
    setOutboundLog((prev) => [
      ...prev,
      ...lines.map((line) => ({
        zoneLabel,
        sku: line.sku,
        name: line.name,
        quantity: line.quantity,
        fromLocation: line.location,
        issuedAt,
      })),
    ]);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md lg:h-[calc(100vh-7rem)]">
        <div className="lg:col-span-2 flex flex-col gap-md min-h-0">
          <FactoryFloorPlan
            zones={zones}
            selectedZoneLabel={selectedZoneLabel}
            onSelectZone={setSelectedZoneLabel}
            onAddGoods={() => setAddGoodsOpen(true)}
            onIssueGoods={() => setIssueSlipOpen(true)}
          />
          <div className="flex-1 min-h-0">
            <WarehouseDetailCorner
              zone={selectedZone}
              onExpand={() => setExpanded(true)}
              onMoveBin={(binId, positionId, location) =>
                moveBin(selectedZone.label, binId, positionId, location)
              }
              onRemoveOrder={(binId, orderCode, sku) =>
                removeOrderFromBin(selectedZone.label, binId, orderCode, sku)
              }
              onPackOrder={(orderCode, sku, binId) =>
                packOrderIntoBin(selectedZone.label, orderCode, sku, binId)
              }
            />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col min-h-0">
          <div className="flex gap-1 shrink-0">
            {SIDEBAR_TABS.map((tab) => {
              const active = sidebarView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSidebarView(tab.id)}
                  className={[
                    "px-4 py-2 rounded-t-lg text-sm border border-b-0 -mb-px transition-colors",
                    active
                      ? "bg-surface-container-lowest border-outline-variant text-on-background font-semibold relative z-10"
                      : "bg-surface-container border-transparent text-on-surface-variant font-medium hover:bg-surface-container-low",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-md relative z-0">
            {sidebarView === "overview" ? (
              <>
                <StorageDistributionCard flushTop />
                <div className="flex-1 min-h-0">
                  <WarehouseSummaryCard />
                </div>
              </>
            ) : (
              <div className="flex-1 min-h-0">
                <InventoryCatalogCard zone={selectedZone} flushTop />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={expanded}
        onClose={() => setExpanded(false)}
        title={`Sơ đồ kho hàng — ${selectedZone.label}`}
      >
        <RackElevationGrid zone={selectedZone} />
      </Modal>

      <AddGoodsModal
        open={addGoodsOpen}
        onClose={() => setAddGoodsOpen(false)}
        zoneOptions={zones.map((zone) => zone.label)}
        defaultZoneLabel={selectedZoneLabel}
        onSubmit={addGoods}
      />

      <IssueSlipModal
        open={issueSlipOpen}
        onClose={() => setIssueSlipOpen(false)}
        zone={selectedZone}
        onConfirm={(lines) => issueGoods(selectedZone.label, lines)}
      />
    </>
  );
}
