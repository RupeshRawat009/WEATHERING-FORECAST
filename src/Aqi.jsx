import React from "react";
import "./Aqi.css";

export default function Aqi({ aqi }) {
  if (aqi === null || aqi === undefined) return null;

  const getAqiText = (value) => {
    switch (value) {
      case 1: return { label: "Good s", colorClass: "aqi-good", number: "0-50" };
      case 2: return { label: "Fair", colorClass: "aqi-fair", number: "51-100" };
      case 3: return { label: "Moderate", colorClass: "aqi-moderate", number: "101-150" };
      case 4: return { label: "Poor", colorClass: "aqi-poor", number: "151-200" };
      case 5: return { label: "Very Poor", colorClass: "aqi-verypoor", number: "201+" };
      default: return { label: "Unknown", colorClass: "aqi-unknown", number: "" };
    }
  };

  const { label, colorClass, number } = getAqiText(aqi);

  return (
    <div className="aqi-box">
      <p className={`aqi-text ${colorClass}`}>
        AQI: {number} — {label}
      </p>
    </div>
  );
}
