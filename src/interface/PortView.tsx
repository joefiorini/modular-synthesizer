import React, { useEffect } from "react";

import Device from "../data/Device";
import { Port } from "../data/Port";
import { Rack } from "../data/Rack";

export interface PortProps {
  onPortSelect(port: Port): void;
}

interface PortViewProps {
  isSelected: boolean;
  port: Port;
  onSelect: (v: any) => void;
}

export function useOutputPort(rack: Rack, device: Device, label: string) {
  const port = { type: "output", device, label };
  useEffect(() => {
    rack.allocatePort(port);
  }, []);
  return port;
}

export function useInputPort(rack: Rack, device: Device, label: string) {
  const port = { type: "input", device, label };
  useEffect(() => {
    rack.allocatePort(port);
  }, []);
  return port;
}

export const PortView = ({ isSelected, port, onSelect }: PortViewProps) => {
  const { type, device, label } = port;
  const indicator = (
    <line
      x1={type === "input" ? -10 : 24}
      y1="12"
      x2={type === "output" ? 34 : 10}
      y2="12"
      stroke="#000"
      strokeWidth="1"
      markerEnd="url(#arrow)"
    />
  );

  return (
    <div>
      <svg width="40" height="24">
        <defs>
          <marker
            id="arrow"
            markerWidth="5"
            markerHeight="5"
            refX="0"
            refY="2.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,5 L4,3 z" fill="#000" />
          </marker>
        </defs>
        {indicator}
        <rect
          onClick={() => {
            onSelect({ type, device });
          }}
          x={type === "input" ? 14 : 0}
          width="24"
          height="24"
          style={{
            strokeWidth: 1,
            stroke: isSelected ? "#00F" : "#000",
            fill: "#FFF"
          }}
        />
      </svg>
      {label}
    </div>
  );
};
