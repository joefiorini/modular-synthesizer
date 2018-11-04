import React, { useState } from "react";
import { useArray } from "react-hanger";

import useId from "./hooks/useId";
import Device from "./data/Device";
import RackT from "./data/Rack";
import Port from "./data/Port";

import Amp from "./modules/Amp";
import Oscillator from "./modules/Oscillator";
import MasterOutput from "./modules/MasterOutput";

function useAudioContext(): RackT {
  const [audioContext, setAudioContext] = useState(() => {
    return new AudioContext();
  });
  const devices = useArray([]);
  const connections = useArray([]);

  return {
    ...audioContext,
    createOscillator: audioContext.createOscillator.bind(audioContext),
    createGain: audioContext.createGain.bind(audioContext),
    destination: audioContext.destination,
    __rawContext: audioContext,
    createDevice(node: AudioNode) {
      const id = useId();
      const device = { node, id };
      devices.add(device);
      return device;
    },
    connect(outputDevice: Device, inputDevice: Device) {
      console.log(`Connecting ${outputDevice.node} to ${inputDevice.node}`);
      outputDevice.node.connect(inputDevice.node);
      connections.add({ out: outputDevice.id, in: inputDevice.id });
    }
  };
}

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
    <div>
      <Oscillator
        frequency={440}
        rack={rack}
        waveType="sine"
        onPortSelect={handlePortSelect}
      />
      <Amp rack={rack} onPortSelect={handlePortSelect} />
      <MasterOutput rack={rack} onPortSelect={handlePortSelect} />
    </div>
  );
};

export default Rack;
