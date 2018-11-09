import React, {
  useEffect,
  useState,
  useMutationEffect,
  useContext
} from "react";

import Device from "../data/Device";
import { Port, canConnectToPort } from "../data/Port";

import * as colors from "./Colors";
import { css } from "react-emotion";
import { PortContext, isConnectedToPort } from "../PortState";
import { RackContext, RackStateContext } from "../RackState";

const isBasic = css(`
  stroke: ${colors.gray6};
  stroke-width: 2;
  fill: ${colors.secondary21};
`);

const activeStyle = css(`
  stroke: ${colors.primary2};
  fill: ${colors.complement1};
`);

const availableStyle = css(`
  stroke: ${colors.secondary12};
  fill: ${colors.secondary21};
`);

const unavailableStyle = css(`
  stroke: ${colors.gray4};
  fill: ${colors.gray2};
  cursor: not-allowed;
`);

interface PortViewProps {
  port: Port;
}

export function useOutputPort(
  rack: RackStateContext,
  device: Device,
  label: string
) {
  const [port] = useState(() => ({ type: "output", device, label }));
  useEffect(() => {
    rack.allocatePort(port);
  }, []);
  return port;
}

export function useInputPort(
  rack: RackStateContext,
  device: Device,
  label: string
) {
  const [port] = useState(() => ({ type: "input", device, label }));
  useEffect(() => {
    rack.allocatePort(port);
  }, []);
  return port;
}

interface FlashingOptions {
  when: boolean;
  timing?: number;
}
function useFlashingStyle(
  style: string,
  alternateStyle: string,
  { when, timing = 250 }: FlashingOptions
) {
  let [currentStyle, setStyle] = useState(style);

  function toggleStyle() {
    setStyle(currentStyle === style ? alternateStyle : style);
  }

  function scheduleStyleChange() {
    if (when) {
      setTimeout(toggleStyle, timing);
    }
  }

  useMutationEffect(scheduleStyleChange, [when, currentStyle]);

  return currentStyle;
}

export const PortView = ({ port }: PortViewProps) => {
  const rack = useContext(RackContext);
  const portContext = useContext(PortContext);
  const [inspectTimeout, setInspectTimeout] = useState(
    null as NodeJS.Timeout | null
  );
  const { selectedPort, inspectedPort } = portContext;
  const { type, label } = port;
  const isAvailable =
    selectedPort != null &&
    (canConnectToPort(port, selectedPort) ||
      isConnectedToPort(selectedPort, port, rack));
  const flashingAvailability = useFlashingStyle(availableStyle, isBasic, {
    when: isAvailable
  });

  const rectStyle =
    selectedPort === port
      ? activeStyle
      : isAvailable
      ? flashingAvailability
      : selectedPort
      ? unavailableStyle
      : isBasic;
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
      <svg width="40" height="30">
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
          className={rectStyle}
          onClick={() => {
            if (selectedPort === port) {
              portContext.onDeselect(port);
            } else {
              portContext.onSelect(port);
            }
          }}
          onMouseOver={() => {
            const timeout = setTimeout(() => {
              portContext.onInspect(port);
              setInspectTimeout(null);
            }, 500);
            setInspectTimeout(timeout);
          }}
          onMouseOut={() => {
            if (inspectTimeout) {
              clearTimeout(inspectTimeout);
            }
          }}
          x={type === "input" ? 14 : 0}
          y={2}
          width="24"
          height="24"
        />
      </svg>
      {label}
    </div>
  );
};
