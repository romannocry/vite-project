import React, { useState } from "react";
import Child from "./Child";

export default function Parent() {
  const [parentMessage, setParentMessage] = useState("Hello Child!");
  const [childReply, setChildReply] = useState("");

  console.log("🔄 Parent rendered with state:", { parentMessage, childReply });

  return (
    <div style={{ border: "2px solid blue", padding: "15px" }}>
      <h2>I am the Parent</h2>

      <p>
        <strong>Message I send to child:</strong> {parentMessage}
      </p>
      <p>
        <strong>Reply I got back:</strong> {childReply || "No reply yet"}
      </p>

      <button onClick={() => setParentMessage("📢 New message from Parent!")}>
        Change Message to Child
      </button>

      <Child parentMessage={parentMessage} onReply={setChildReply} />
    </div>
  );
}
