import React, { useState, useCallback, useMemo } from "react";
import Availability from "./availability";
import FilterPane from "./filterpane";

export default function Product() {
  const [availability, setAvailability] = useState<Record<string, boolean>>({
    "Child A": true,
    "Child B": false,
  });

  const [text, setText] = useState("");

  console.log("🔵 Parent rendered. availability =", availability);

  const handleToggle = useCallback((id: string, next: boolean) => {
    console.log(`📨 Parent received toggle from ${id} →`, next);
    setAvailability(prev => ({
      ...prev,
      [id]: next,
    }));
  }, []);

  const handleFilterAll = useCallback((text: string) => {
    console.log("🔍 Parent received filter text:", text);
    setText(text);
  }, []);

  const handleToggleAll = useCallback(() => {
    console.log("🚫 Setting ALL children availability to false");
    setAvailability(prev =>
      Object.fromEntries(Object.keys(prev).map(id => [id, false]))
    );
  }, []);

  const filteredChildren = useMemo(() => {
    console.log("⚙️ Recomputing filteredChildren list...");
    return Object.entries(availability)
      .filter(([id, isAvailable]) => {
        const lower = text.toLowerCase();
        return (
          id.toLowerCase().includes(lower) ||
          (lower.includes("true") && isAvailable) ||
          (lower.includes("false") && !isAvailable)
        );
      })
      .map(([id]) => id);
  }, [availability, text]);

  return (
    <div style={{ border: "2px solid blue", padding: 16, borderRadius: 8 }}>
      
      {/* Filter pane is UI-separated, but state stays in parent */}
      <FilterPane value={text} onFilterChange={handleFilterAll} />

      <h2>Product Component (Parent)</h2>

      <p><strong>All child availability tracked in parent:</strong></p>
      <pre>{JSON.stringify(availability, null, 2)}</pre>

      {/* Only render children that match the filter */}
      {filteredChildren.map(id => (
        <Availability
          key={id}
          id={id}
          available={availability[id]}
          onToggle={handleToggle}
        />
      ))}

      {/* This button makes sense again because it now refers to a clear behavior */}
      <button onClick={handleToggleAll}>Set ALL children to false</button>

    </div>
  );
}
