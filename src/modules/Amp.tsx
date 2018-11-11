import React, { useState, useContext } from "react";

import { extractValue } from "../extractValue";
import { Slider } from "../interface/Slider";
import Device, { DeviceState } from "../data/Device";
import { PortView } from "../interface/PortView";
import DeviceContainer from "../interface/DeviceContainer";
import { useInputPort, useOutputPort } from "../interface/PortView";
import { RackContext, RackStateContext } from "../RackState";
import useAudioContext from "../hooks/useAudioContext";
import { AudioContextContext } from "../AudioContextState";

interface GainController {
  // connectInput(device: Device): void;
  updateGain(newGain: number): void;
  currentValue: number;
  gainParam: AudioParam;
  device: Device;
}

export function useGain(
  rack: RackStateContext,
  defaultValue = 0.5
): GainController {
  const audioContext = useContext(AudioContextContext);
  const [[gain, device]] = useState(() => {
    const node = audioContext.createGain();
    const device = rack.createDevice(node);
    return [node, device] as DeviceState<GainNode>;
  });
  const [gainValue, setGainValue] = useState(defaultValue);

  gain.gain.value = gainValue;
  return {
    device,
    currentValue: gain.gain.value,
    gainParam: gain.gain,
    updateGain(newGainValue: number) {
      setGainValue(newGainValue);
    }
  };
}

function Amp() {
  const rack = useContext(RackContext);
  const gain = useGain(rack);
  const inputPort = useInputPort(rack, gain.device, "input");
  const outputPort = useOutputPort(rack, gain.device, "output");
  const gatePort = useInputPort(rack, gain.device, "gate", gain.gainParam);

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
      <PortView port={inputPort} />
      <PortView port={outputPort} />
      <PortView port={gatePort} />
    </DeviceContainer>
  );
}

export default Amp;
