import React, { useReducer } from "react";

import Device from "./data/Device";
import Connection from "./data/Connection";
import { Port } from "./data/Port";
import useId from "./hooks/useId";

interface RackState {
  devices: Array<Device>;
  connections: Array<Connection>;
  ports: Array<Port>;
}

interface RackStateActions {
  connect(output: Port, input: Port): Connection;
  disconnect(connection: Connection): void;
  createDevice(node: AudioNode): Device;
  allocatePort(port: Port): Port;
}

export type RackStateContext = RackState & RackStateActions;

interface Action {
  type: "addDevice" | "addConnection" | "removeConnection" | "allocatePort";
  payload: any;
}

function rackReducer(state: RackState, action: Action): RackState {
  switch (action.type) {
    case "addDevice":
      return {
        ...state,
        devices: [...state.devices, action.payload]
      };
    case "addConnection":
      return {
        ...state,
        connections: [...state.connections, action.payload]
      };
    case "removeConnection":
      return {
        ...state,
        connections: state.connections.filter(c => c === action.payload)
      };
    case "allocatePort":
      return {
        ...state,
        ports: [...state.ports, action.payload]
      };
  }
}

interface RackStateProps {
  children: React.ReactNode;
}

export const RackContext = React.createContext({} as RackStateContext);

function RackState({ children }: RackStateProps) {
  const [state, dispatch] = useReducer(rackReducer, {
    devices: [],
    connections: [],
    ports: []
  });
  const { ports } = state;
  const contextObject: RackStateContext = {
    ...state,
    createDevice(node: AudioNode) {
      const id = useId();
      const device = { node, id };
      dispatch({ type: "addDevice", payload: device });
      return device;
    },
    connect(outputPort, inputPort) {
      const {
        device: { node: inputNode }
      } = inputPort;
      const {
        device: { node: outputNode }
      } = outputPort;
      console.log(`Connecting ${outputNode} to ${inputNode}`);
      outputNode.connect(inputNode);
      const connection = { output: outputPort, input: inputPort };
      dispatch({ type: "addConnection", payload: connection });
      return connection;
    },
    disconnect(connection: Connection) {
      const inputPort = ports.find(port => port === connection.input);
      const outputPort = ports.find(port => port === connection.output);
      console.log(
        `Disconnecting ${outputPort.device.node} from ${inputPort.device.node}`
      );
      outputPort.device.node.disconnect(inputPort.device.node);
      dispatch({ type: "removeConnection", payload: connection });
    },
    allocatePort(port) {
      dispatch({ type: "allocatePort", payload: port });
      return port;
    }
  };

  return (
    <RackContext.Provider value={contextObject}>
      {children}
    </RackContext.Provider>
  );
}

export default RackState;
