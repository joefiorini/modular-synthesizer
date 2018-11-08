import React, { useState, useReducer, useContext } from "react";
import { useArray } from "react-hanger";

import useId from "./hooks/useId";
import Device from "./data/Device";
import { Rack as RackT } from "./data/Rack";
import { Port } from "./data/Port";

import Amp from "./modules/Amp";
import Oscillator from "./modules/Oscillator";
import MasterOutput from "./modules/MasterOutput";
import styled from "react-emotion";
import Connection from "./data/Connection";

interface Action {
  type: "addDevice" | "addConnection" | "removeConnection" | "allocatePort";
  payload: any;
}
interface State {
  devices: Array<Device>;
  connections: Array<Connection>;
  ports: Array<Port>;
}

function rackReducer(state: State, action: Action): State {
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

const ports: Array<Port> = [];

function useAudioContext(): RackT {
  const [audioContext, setAudioContext] = useState(() => {
    return new AudioContext();
  });
  const [{ connections, devices, ports }, dispatch] = useReducer(rackReducer, {
    devices: [],
    connections: [],
    ports: []
  });

  return {
    ...audioContext,
    createOscillator: audioContext.createOscillator.bind(audioContext),
    createGain: audioContext.createGain.bind(audioContext),
    destination: audioContext.destination,
    __rawContext: audioContext,
    createDevice(node: AudioNode) {
      const id = useId();
      const device = { node, id };
      dispatch({ type: "addDevice", payload: device });
      return device;
    },
    connect(outputDevice: Device, inputDevice: Device) {
      console.log(`Connecting ${outputDevice.node} to ${inputDevice.node}`);
      outputDevice.node.connect(inputDevice.node);
      const connection = { output: outputDevice.id, input: inputDevice.id };
      dispatch({ type: "addConnection", payload: connection });
      return connection;
    },
    disconnect(connection: Connection) {
      const inputDevice = devices.find(
        device => device.id === connection.input
      );
      const outputDevice = devices.find(
        device => device.id === connection.output
      );
      console.log(
        `Disconnecting ${outputDevice.node} from ${inputDevice.node}`
      );
      outputDevice.node.disconnect(inputDevice.node);
      dispatch({ type: "removeConnection", payload: connection });
    },
    allocatePort(port) {
      dispatch({ type: "allocatePort", payload: port });
      return port;
    }
  };
}

const Container = styled("div")`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const Rack = (props: any) => {
  const rack = useAudioContext();
  const [[activePort], setActivePort] = useState([] as Array<Port>);
  const handlePortSelect = (port: Port) => {
    if (activePort == null) {
      setActivePort([port]);
    } else if (activePort === port) {
      setActivePort([]);
    } else if (activePort.type === "input" && port.type === "output") {
      rack.connect(
        port.device,
        activePort.device
      );
    } else if (activePort.type === "output" && port.type === "input") {
      rack.connect(
        activePort.device,
        port.device
      );
    } else {
      setActivePort([port]);
    }
  };
  return (
    <Container>
      <Oscillator
        frequency={440}
        rack={rack}
        waveType="sine"
        onPortSelect={handlePortSelect}
      />
      <Amp rack={rack} onPortSelect={handlePortSelect} />
      <MasterOutput rack={rack} onPortSelect={handlePortSelect} />
    </Container>
  );
};

export default Rack;
