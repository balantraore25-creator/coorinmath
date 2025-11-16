import React from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
};

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? "Toggle"}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #ccc",
        background: checked ? "#2b6cb0" : "#edf2f7",
        color: checked ? "#fff" : "#2d3748",
        cursor: "pointer",
        transition: "background 200ms ease",
      }}
    >
      {label && <span style={{ fontSize: 12 }}>{label}</span>}
      <span
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? "#4299e1" : "#cbd5e0",
          position: "relative",
          transition: "background 200ms ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            transform: `translateX(${checked ? 18 : 2}px)`,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "transform 200ms ease",
          }}
        />
      </span>
    </button>
  );
};
