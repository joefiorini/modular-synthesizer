import React, { useState, useEffect } from "react";

import Device, { DeviceState } from "../data/Device";
import { Rack } from "../data/Rack";
import { Slider } from "../interface/Slider";
import {
  PortView,
  PortProps,
  useOutputPort,
  useInputPort
} from "../interface/PortView";
import { extractValue } from "../extractValue";
import DeviceContainer from "../interface/DeviceContainer";

interface OscillatorController {
  frequency: number;
  waveType: OscillatorType;
  setFrequency(newFreq: number): void;
  setWaveType(newWaveType: OscillatorType): void;
  device: Device;
}

function useOscillator(
  rack: Rack,
  defaults: { frequency: number; waveType: OscillatorType }
): OscillatorController {
  const [[oscillator, device], _] = useState(() => {
    const osc = rack.createOscillator();
    const device = rack.createDevice(osc);
    return [osc, device] as DeviceState<OscillatorNode>;
  });
  const [{ frequency, waveType }, setParams] = useState({
    frequency: defaults.frequency,
    waveType: defaults.waveType
  });

  oscillator.frequency.value = frequency;
  oscillator.type = waveType;

  useEffect(() => {
    oscillator.start();
  }, []);

  return {
    device,
    frequency: oscillator.frequency.value,
    waveType: oscillator.type,
    setFrequency(newFrequency: number) {
      setParams({
        frequency: newFrequency,
        waveType
      });
    },
    setWaveType(newWaveType: OscillatorType) {
      setParams({ frequency, waveType: newWaveType });
    }
  };
}

interface OscillatorProps {
  frequency: number;
  rack: Rack;
  waveType: OscillatorType;
}

const Oscillator = ({
  frequency,
  rack,
  waveType,
  onPortSelect
}: OscillatorProps & PortProps) => {
  const oscillator = useOscillator(rack, { frequency, waveType });
  const outputPort = useOutputPort(rack, oscillator.device, "output");
  const voltPer8vaPort = useInputPort(rack, oscillator.device, "Volt per 8va");

  return (
    <DeviceContainer name="Oscillator">
      <Slider
        min={80}
        max={1100}
        step={20}
        value={oscillator.frequency || frequency}
        label="Frequency"
        onChange={extractValue((value: string) =>
          oscillator.setFrequency(Number(value))
        )}
      />
      <div className="waveTypeOptions">
        <label>
          <input
            type="radio"
            checked={oscillator.waveType === "sine"}
            value="sine"
            onChange={extractValue(oscillator.setWaveType)}
          />
          Sin
        </label>
        <label>
          <input
            type="radio"
            checked={oscillator.waveType === "triangle"}
            value="triangle"
            onChange={extractValue(oscillator.setWaveType)}
          />
          Triangle
        </label>
        <label>
          <input
            type="radio"
            checked={oscillator.waveType === "square"}
            value="square"
            onChange={extractValue(oscillator.setWaveType)}
          />
          Square
        </label>
        <label>
          <input
            type="radio"
            checked={oscillator.waveType === "sawtooth"}
            value="sawtooth"
            onChange={extractValue(oscillator.setWaveType)}
          />
          Saw
        </label>
        <PortView
          isSelected={false}
          port={outputPort}
          onSelect={onPortSelect}
        />
        <PortView
          isSelected={false}
          port={voltPer8vaPort}
          onSelect={onPortSelect}
        />
      </div>
    </DeviceContainer>
  );
};

export default Oscillator;
