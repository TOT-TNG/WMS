import { useState } from "react";
import { STATUS_STYLES, getPositionInfo } from "../../data/warehouseZones";

function Rack({ zone, rack, onSelectPosition, onDropBin, dragOverId, setDragOverId }) {
  return (
    <div className="shrink-0 rounded-lg border-2 border-outline-variant/70 bg-surface-container-low/40 p-2.5">
      <div className="text-center text-xs font-semibold text-on-surface-variant mb-2">{rack.label}</div>
      <div className="flex flex-col">
        {rack.levels.map((level, idx) => (
          <div
            key={level.level}
            className={`flex items-center gap-2 py-1.5 ${idx !== rack.levels.length - 1 ? "border-b border-outline-variant/40" : ""}`}
          >
            <span className="w-6 text-[10px] font-semibold text-on-surface-variant shrink-0">T{level.level}</span>
            <div className="flex gap-1.5">
              {level.positionIds.map((positionId, posIdx) => {
                const info = getPositionInfo(zone, positionId);
                const code = `${rack.label} · Tầng ${level.level} · Vị trí ${posIdx + 1}`;
                return (
                  <button
                    key={positionId}
                    type="button"
                    onClick={() => onSelectPosition?.({ ...info, code })}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverId !== positionId) setDragOverId(positionId);
                    }}
                    onDragLeave={() => setDragOverId((current) => (current === positionId ? null : current))}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverId(null);
                      const binId = e.dataTransfer.getData("text/plain");
                      if (binId) onDropBin?.(binId, positionId, code);
                    }}
                    className={[
                      "w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-transform duration-150 hover:scale-110 hover:shadow-md",
                      STATUS_STYLES[info.status],
                      dragOverId === positionId ? "ring-2 ring-primary ring-offset-1 scale-110" : "",
                    ].join(" ")}
                  >
                    {posIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* rack feet, purely decorative to read as a physical shelving frame */}
      <div className="flex justify-between px-1 mt-1.5">
        <div className="w-1.5 h-2 rounded-b bg-outline-variant/50"></div>
        <div className="w-1.5 h-2 rounded-b bg-outline-variant/50"></div>
      </div>
    </div>
  );
}

export default function RackElevationGrid({ zone, onSelectPosition, onDropBin }) {
  const [dragOverId, setDragOverId] = useState(null);

  return (
    <div className="custom-scrollbar flex gap-5 overflow-x-auto pb-1">
      {zone.racks.map((rack) => (
        <Rack
          key={rack.label}
          zone={zone}
          rack={rack}
          onSelectPosition={onSelectPosition}
          onDropBin={onDropBin}
          dragOverId={dragOverId}
          setDragOverId={setDragOverId}
        />
      ))}
    </div>
  );
}
