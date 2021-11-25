import React from "react";
import './LoadingIndicator.css'

export function LoadingIndicator() {
  return (
    <h2 className="center align-row">
      <span className="loading-text">Loading</span>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </h2>
  )
}
