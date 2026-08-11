// A small drawn illustration (not a single icon glyph) used as a faint background image on
// warehouse cards — a building silhouette with a door cut-out plus stacked pallet boxes.
export default function WarehouseWatermark({ className = "" }) {
  return (
    <svg viewBox="0 0 240 170" className={className} fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 65 L120 20 L195 65 L195 155 L45 155 Z M100 95 L140 95 L140 155 L100 155 Z"
      />
      <rect x="42" y="62" width="156" height="6" rx="2" />
      <rect x="8" y="120" width="26" height="26" rx="2" />
      <rect x="8" y="92" width="26" height="26" rx="2" />
      <rect x="206" y="112" width="26" height="26" rx="2" />
      <rect x="206" y="84" width="26" height="26" rx="2" />
    </svg>
  );
}
