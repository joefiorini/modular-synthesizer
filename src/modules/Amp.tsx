import React, { useState, useContext } from "react";

import { extractValue } from "../extractValue";
import { Slider } from "../interface/Slider";
import Device, { DeviceState } from "../data/Device";
import { Rack } from "../data/Rack";
import { PortView, PortProps } from "../interface/PortView";
import DeviceContainer from "../interface/DeviceContainer";
import { useInputPort, useOutputPort } from "../interface/PortView";

interface GainController {
  // connectInput(device: Device): void;
  updateGain(newGain: number): void;
  currentValue: number;
  device: Device;
}

export function useGain(rack: Rack, defaultValue = 0.5): GainController {
  const [[gain, device], setGain] = useState(() => {
    const node = rack.createGain();
    const device = rack.createDevice(node);
    return [node, device] as DeviceState<GainNode>;
  });
  const [gainValue, setGainValue] = useState(defaultValue);

  gain.gain.value = gainValue;
  return {
    device,
    currentValue: gain.gain.value,
    updateGain(newGainValue: number) {
      setGainValue(newGainValue);
    }
  };
}
interface AmpProps {
  rack: Rack;
  // gatePort?: PortConnection;
  // inputPort?: PortConnection;
  // outputPort?: PortConnection;
}

function Amp({ rack, onPortSelect }: AmpProps & PortProps) {
  const gain = useGain(rack);
  const inputPort = useInputPort(rack, gain.device, "input");
  const outputPort = useOutputPort(rack, gain.device, "output");
  const gatePort = useInputPort(rack, gain.device, "gate");

  return (
    <DeviceContainer name="Amp">
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={gain.currentValue}
        onChange={extractValue((value: string) =>
          gain.updateGain(Number(value))
        )}
        label="Gain"
      />
      <PortView isSelected={false} port={inputPort} onSelect={onPortSelect} />
      <PortView isSelected={false} port={outputPort} onSelect={onPortSelect} />
      <PortView isSelected={false} port={gatePort} onSelect={onPortSelect} />
    </DeviceContainer>
  );
}

export default Amp;
