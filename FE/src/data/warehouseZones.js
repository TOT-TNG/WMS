export const STATUS_STYLES = {
  full: "bg-[#34d399] text-white",
  partial: "bg-[#F59E0B] text-white",
  empty: "bg-[#e2e8f0] text-on-surface-variant",
};

export const LEGEND = [
  { status: "full", label: "Ô đang đầy" },
  { status: "partial", label: "Ô chưa đầy" },
  { status: "empty", label: "Ô trống" },
];

const PRODUCT_NAMES = [
  "Bulong M8 x 20mm",
  "Băng tải cao su 5m",
  "Cảm biến quang PNP",
  "Dầu bôi trơn công nghiệp 5L",
  "Vòng bi SKF 6205",
  "Dây curoa công nghiệp",
  "Ống thủy lực phi 20",
  "Găng tay bảo hộ size L",
  "Bộ lọc khí nén",
  "Đai ốc inox M10",
];

let barcodeSeq = 1000001;
function nextBarcode() {
  return `893850${String(barcodeSeq++).padStart(7, "0")}`;
}

// A rack's shelf positions are fixed physical slots — they never carry inventory data
// themselves. A bin/tote is the mobile object that can be placed into (or moved out of) a
// position; only the bin ever carries mã hàng (SKU) data. `statusByLevel` here is just the
// authoring shorthand ("what should this position look like today") used to generate a
// starting bin for every occupied slot — it is not stored on the position.
function buildRack(rackCode, rackLabel, statusByLevel) {
  const levels = [];
  const bins = [];

  statusByLevel.forEach(({ level, statuses }) => {
    const positionIds = statuses.map((_, i) => `${rackCode}-${level}-${i + 1}`);
    levels.push({ level, positionIds });

    statuses.forEach((fillStatus, i) => {
      if (fillStatus === "empty") return;
      const positionId = positionIds[i];
      const skuCount = fillStatus === "full" ? 2 : 1;
      const orders = Array.from({ length: skuCount }, (_, k) => ({
        orderCode: `DH-${rackCode}${level}${i + 1}${k}`,
        sku: `SP-${rackCode}${level}${i + 1}${k + 1}`,
        name: PRODUCT_NAMES[(level + i + k) % PRODUCT_NAMES.length],
        quantity: 10 + ((level + i + k) % 6) * 5,
      }));
      bins.push({
        id: `THG-${rackCode}${level}${i + 1}`,
        barcode: nextBarcode(),
        positionId,
        location: `${rackLabel} · Tầng ${level} · Vị trí ${i + 1}`,
        orders,
      });
    });
  });

  return { levels, bins };
}

const rackA12 = buildRack("A12", "Kệ 1-2", [
  { level: 3, statuses: ["empty", "full", "empty", "partial", "full"] },
  { level: 2, statuses: ["full", "empty", "empty", "full", "partial"] },
  { level: 1, statuses: ["empty", "full", "partial", "empty", "full"] },
]);
const rackA34 = buildRack("A34", "Kệ 3-4", [
  { level: 3, statuses: ["full", "full", "empty", "partial", "empty"] },
  { level: 2, statuses: ["empty", "partial", "full", "empty", "full"] },
  { level: 1, statuses: ["full", "empty", "full", "partial", "empty"] },
]);
const rackA56 = buildRack("A56", "Kệ 5-6", [
  { level: 3, statuses: ["empty", "empty", "full", "full", "partial"] },
  { level: 2, statuses: ["full", "partial", "empty", "empty", "full"] },
  { level: 1, statuses: ["partial", "full", "full", "empty", "empty"] },
]);
const rackB910 = buildRack("B910", "Kệ 9-10", [
  { level: 3, statuses: ["full", "empty", "partial", "full", "empty"] },
  { level: 2, statuses: ["empty", "full", "full", "empty", "partial"] },
  { level: 1, statuses: ["partial", "empty", "full", "full", "empty"] },
]);
const rackB1112 = buildRack("B1112", "Kệ 11-12", [
  { level: 3, statuses: ["empty", "full", "empty", "partial", "full"] },
  { level: 2, statuses: ["full", "empty", "partial", "full", "empty"] },
  { level: 1, statuses: ["empty", "partial", "full", "empty", "full"] },
]);

// A physical position can hold more than one small tote at once (e.g. two totes sharing a
// pallet slot) — these extra bins point at positions that already have a bin from buildRack
// above, so those positions end up with 2 totes to demonstrate the "list of bins" view.
const EXTRA_BINS_A = [
  {
    id: "THG-A12-3-2B",
    barcode: nextBarcode(),
    positionId: "A12-3-2",
    location: "Kệ 1-2 · Tầng 3 · Vị trí 2",
    orders: [{ orderCode: "DH-A1232B", sku: "SP-A1232B1", name: "Dây curoa công nghiệp", quantity: 12 }],
  },
  {
    id: "THG-A34-2-3B",
    barcode: nextBarcode(),
    positionId: "A34-2-3",
    location: "Kệ 3-4 · Tầng 2 · Vị trí 3",
    orders: [
      { orderCode: "DH-A342B1", sku: "SP-A342B1", name: "Ống thủy lực phi 20", quantity: 8 },
      { orderCode: "DH-A342B2", sku: "SP-A342B2", name: "Găng tay bảo hộ size L", quantity: 24 },
    ],
  },
];

const EXTRA_BINS_B = [
  {
    id: "THG-B910-3-1B",
    barcode: nextBarcode(),
    positionId: "B910-3-1",
    location: "Kệ 9-10 · Tầng 3 · Vị trí 1",
    orders: [{ orderCode: "DH-B9031B", sku: "SP-B9031B1", name: "Bộ lọc khí nén", quantity: 30 }],
  },
];

// Totes that have arrived (e.g. from receiving) but haven't been put away on a rack yet —
// positionId is null until a user drags one onto a position.
const UNASSIGNED_BINS_A = [
  {
    id: "THG-A-NEW01",
    barcode: nextBarcode(),
    positionId: null,
    location: null,
    orders: [
      { orderCode: "DH-A9001", sku: "SP-A90011", name: "Vòng bi SKF 6205", quantity: 16 },
      { orderCode: "DH-A9002", sku: "SP-A90012", name: "Đai ốc inox M10", quantity: 50 },
    ],
  },
  {
    id: "THG-A-NEW02",
    barcode: nextBarcode(),
    positionId: null,
    location: null,
    orders: [{ orderCode: "DH-A9003", sku: "SP-A90031", name: "Bulong M8 x 20mm", quantity: 40 }],
  },
];

const UNASSIGNED_BINS_B = [
  {
    id: "THG-B-NEW01",
    barcode: nextBarcode(),
    positionId: null,
    location: null,
    orders: [{ orderCode: "DH-B9004", sku: "SP-B90041", name: "Cảm biến quang PNP", quantity: 20 }],
  },
];

// Each rack is a physical shelving unit: levels are stacked tầng (top of the array = top
// shelf), and each level holds several fixed vị trí (positions) side by side. `bins` is the
// zone's pool of totes; a bin's `positionId` says which position it currently sits in — and
// more than one bin can share the same positionId.
export const ZONES = [
  {
    label: "Khu A",
    racks: [
      { label: "Kệ 1-2", levels: rackA12.levels },
      { label: "Kệ 3-4", levels: rackA34.levels },
      { label: "Kệ 5-6", levels: rackA56.levels },
    ],
    bins: [...rackA12.bins, ...rackA34.bins, ...rackA56.bins, ...EXTRA_BINS_A, ...UNASSIGNED_BINS_A],
  },
  {
    label: "Khu B",
    racks: [
      { label: "Kệ 9-10", levels: rackB910.levels },
      { label: "Kệ 11-12", levels: rackB1112.levels },
    ],
    bins: [...rackB910.bins, ...rackB1112.bins, ...EXTRA_BINS_B, ...UNASSIGNED_BINS_B],
  },
];

// A bin's fullness is derived live from how many mã hàng it currently holds — not stored as
// a static field — so packing/removing an order always updates its color immediately.
export function getBinFillStatus(bin) {
  if (bin.orders.length === 0) return "empty";
  if (bin.orders.length === 1) return "partial";
  return "full";
}

function pickStatus(bins) {
  if (bins.some((b) => getBinFillStatus(b) === "full")) return "full";
  if (bins.some((b) => getBinFillStatus(b) === "partial")) return "partial";
  return "empty";
}

// Looks up every bin (there may be 0, 1, or several) currently occupying a fixed position,
// deriving the position's display status from those bins rather than from data stored on
// the position itself.
export function getPositionInfo(zone, positionId) {
  const bins = zone.bins.filter((b) => b.positionId === positionId);
  return { id: positionId, status: pickStatus(bins), bins };
}

function findRackAndLevel(zone, positionId) {
  if (!positionId) return { rackLabel: null, level: null };
  for (const rack of zone.racks) {
    for (const lvl of rack.levels) {
      if (lvl.positionIds.includes(positionId)) return { rackLabel: rack.label, level: lvl.level };
    }
  }
  return { rackLabel: null, level: null };
}

// Flattens every bin's orders (plus any order not yet packed into a bin at all) into one
// product-centric row per mã hàng, tagged with where it currently sits: no bin yet, in a bin
// that isn't on a rack yet, or in a bin sitting at a specific rack/level/position. This is the
// "danh sách hàng hóa" view over the same bins/orders data the rack view already uses.
export function getZoneInventory(zone) {
  const packedItems = zone.bins.flatMap((bin) =>
    bin.orders.map((order) => {
      const { rackLabel, level } = findRackAndLevel(zone, bin.positionId);
      return {
        ...order,
        binId: bin.id,
        binBarcode: bin.barcode,
        positionId: bin.positionId,
        location: bin.location,
        rackLabel,
        level,
      };
    }),
  );
  const unpackedItems = (zone.unassignedOrders ?? []).map((order) => ({
    ...order,
    binId: null,
    binBarcode: null,
    positionId: null,
    location: null,
    rackLabel: null,
    level: null,
  }));
  return [...unpackedItems, ...packedItems];
}

export function getZoneStats(zone) {
  const binsByPosition = new Map();
  zone.bins.forEach((bin) => {
    const list = binsByPosition.get(bin.positionId) ?? [];
    list.push(bin);
    binsByPosition.set(bin.positionId, list);
  });

  let full = 0;
  let partial = 0;
  let total = 0;
  zone.racks.forEach((rack) => {
    rack.levels.forEach((level) => {
      level.positionIds.forEach((positionId) => {
        total += 1;
        const status = pickStatus(binsByPosition.get(positionId) ?? []);
        if (status === "full") full += 1;
        if (status === "partial") partial += 1;
      });
    });
  });
  return {
    fullPct: Math.round((full / total) * 100),
    partialPct: Math.round((partial / total) * 100),
    usedPct: Math.round(((full + partial) / total) * 100),
  };
}
