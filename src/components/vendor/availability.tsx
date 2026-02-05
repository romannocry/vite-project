import React, { memo } from "react";

interface AvailabilityProps {
  id: string;
  available: boolean;
  onToggle: (id: string, next: boolean) => void;
}

function Availability({ id, available, onToggle }: AvailabilityProps) {
  console.log(`🟢 Availability(${id}) rendered. available prop =`, available);

  const handleClick = () => {
    const nextValue = !available;
    onToggle(id, nextValue); // ↑ notify parent about THIS child
  };

  return (
    <div style={{ border: "1px solid green", padding: 12, borderRadius: 8, margin: "8px 0" }}>
      <h3>{id}: {available ? "✅ available" : "❌ not available"}</h3>
      <button onClick={handleClick}>Toggle from Child</button>
    </div>
  );
}

//export default Availability
export default memo(Availability);