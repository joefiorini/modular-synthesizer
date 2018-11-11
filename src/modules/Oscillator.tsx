import React, { useState, useEffect, useContext } from "react";

import Device, { DeviceState } from "../data/Device";
import { Slider } from "../interface/Slider";
import { PortView, useOutputPort, useInputPort } from "../interface/PortView";
import { extractValue } from "../extractValue";
import DeviceContainer from "../interface/DeviceContainer";
import { RackStateContext, RackContext } from "../RackState";
import useAudioContext from "../hooks/useAudioContext";
import { AudioContextContext } from "../AudioContextState";
import useId from "../hooks/useId";

interface OscillatorController {
  frequency: number;
  waveType: OscillatorType;
  setFrequency(newFreq: number): void;
  setWaveType(newWaveType: string): void;
  device: Device;
}

function useOscillator(
  rack: RackStateContext,
  defaults: { frequency: number; waveType: OscillatorType }
): OscillatorController {
  const audioContext = useContext(AudioContextContext);
  const getDeviceId = useId("device");
  const [[oscillator, device], _] = useState(() => {
    const osc = audioContext.createOscillator();
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
  waveType: OscillatorType;
}

const Oscillator = ({ frequency, waveType }: OscillatorProps) => {
  const rack = useContext(RackContext);
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
        <PortView port={outputPort} />
        <PortView port={voltPer8vaPort} />
      </div>
    </DeviceContainer>
  );
};

export default Oscillator;
