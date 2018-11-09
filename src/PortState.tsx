import { Port } from "./data/Port";
import React, { useReducer, useContext } from "react";
import { RackStateContext, RackContext } from "./RackState";

export interface PortState {
  rack: RackStateContext;
  selectedPort?: Port;
  inspectedPort?: Port;
}

interface PortStateActions {
  onSelect: (p: Port) => void;
  onInspect: (p: Port) => void;
  onDeselect: (p: Port) => void;
}

export const isConnectedToPort = (
  otherPort: Port,
  currentPort: Port,
  rack: RackStateContext
) => {
  const portConnection = rack.connections.find(
    port =>
      port.input === otherPort ||
      port.output === otherPort ||
      port.input === currentPort ||
      port.output === currentPort
  );

  if (portConnection == null) return false;

  return (
    (portConnection.input === otherPort &&
      portConnection.output === currentPort) ||
    (portConnection.input === currentPort &&
      portConnection.output === otherPort)
  );
};
type PortStateContext = PortState & PortStateActions;

export interface PortAction {
  type: "selectPort" | "inspectPort" | "deselectPort";
  payload: Port;
}

export function portStateReducer(state: PortState, action: PortAction) {
  switch (action.type) {
    case "selectPort": {
      const { selectedPort, rack } = state;
      const port = action.payload;

      if (state.selectedPort == null) {
        return {
          ...state,
          selectedPort: action.payload
        };
      } else if (selectedPort != null && selectedPort.type !== port.type) {
        rack.connect(
          port.type === "output" ? port : selectedPort,
          port.type === "input" ? port : selectedPort
        );
      }
      return { ...state, selectedPort: undefined };
    }
    case "inspectPort": {
      const port = action.payload;
      return { ...state, inspectedPort: port };
    }
    case "deselectPort":
      return { ...state, selectedPort: undefined };
  }
}

interface PortStateProps {
  children: React.ReactNode;
}

export const PortContext = React.createContext({} as PortStateContext);

function PortState({ children }: PortStateProps) {
  const rack = useContext(RackContext);
  const [state, dispatch] = useReducer(portStateReducer, {
    rack,
    selectedPort: undefined,
    inspectedPort: undefined
  });
  const contextObject: PortStateContext = {
    ...state,
    onDeselect(port) {
      dispatch({ type: "deselectPort", payload: port });
    },
    onSelect(port) {
      dispatch({ type: "selectPort", payload: port });
    },
    onInspect(port) {
      dispatch({ type: "inspectPort", payload: port });
    }
  };

  return (
    <PortContext.Provider value={contextObject}>
      {children}
    </PortContext.Provider>
  );
}

export default PortState;
