import React from "react";

interface ChildProps {
  parentMessage: string;
  onReply: (reply: string) => void;
}

function Child({ parentMessage, onReply }: ChildProps) {
  console.log("🔄 Child rendered with parentMessage:", parentMessage);

  return (
    <div style={{ border: "2px solid green", padding: "10px", margin: "10px 0" }}>
      <h3>I am the Child</h3>
      <p>Message from Parent: {parentMessage}</p>
      <button onClick={() => onReply("👶 Hi Parent, I got your message!")}>
        Reply to Parent
      </button>
    </div>
  );
}

export default React.memo(Child);
