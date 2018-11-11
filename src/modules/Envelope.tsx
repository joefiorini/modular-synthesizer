import React, { useState, useContext } from "react";
import EnvelopeGenerator from "fastidious-envelope-generator";

import { extractValue, extractNumber } from "../extractValue";
import DeviceContainer from "../interface/DeviceContainer";
import { css } from "emotion";
import styled from "react-emotion";
import { useOutputPort, useInputPort, PortView } from "../interface/PortView";
import { RackContext, RackStateContext } from "../RackState";
import Device, { DeviceState } from "../data/Device";
import { CustomNode } from "../data/CustomNode";
import { AudioContextContext } from "../AudioContextState";

const Label = styled("label")`
  display: block;
`;

interface EnvelopeNode extends CustomNode {
  setAttackTime(a: number): void;
  setDecayTime(d: number): void;
  setSustainLevel(s: number): void;
  setReleaseTime(r: number): void;
}

interface EnvelopeSettings {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
}

function createEnvelopeNode(
  audioContext: AudioContext,
  settings: EnvelopeSettings
): EnvelopeNode {
  let generator: EnvelopeGenerator | null;
  const _settings = settings;

  return {
    setAttackTime(a) {
      _settings.attackTime = a;
    },
    setDecayTime(d) {
      _settings.decayTime = d;
    },
    setSustainLevel(s) {
      _settings.sustainLevel = s;
    },
    setReleaseTime(r) {
      _settings.releaseTime = r;
    },
    gateOn() {
      console.log(_settings);
      if (!generator) {
        throw new Error(
          "EnvelopeGenerator must be connected before attempting to send a gate"
        );
      }
      generator.attackTime = _settings.attackTime;
      generator.decayTime = _settings.decayTime;
      generator.sustainLevel = _settings.sustainLevel;
      generator.releaseTime = _settings.releaseTime;
      generator.gateOn();
    },
    gateOff() {
      if (!generator) {
        throw new Error(
          "EnvelopeGenerator must be connected before attempting to send a gate"
        );
      }
      generator.gateOff();
    },
    connect(node) {
      if (node instanceof AudioParam) {
        console.log("Creating envelope generator...", node);
        generator = new EnvelopeGenerator(audioContext, node);

        generator.mode = "ADSR";
        generator.attackTime = _settings.attackTime;
        generator.decayTime = _settings.decayTime;
        generator.sustainLevel = _settings.sustainLevel;
        generator.releaseTime = _settings.releaseTime;
      } else {
        throw new TypeError("Envelope only supports node of type AudioParam");
      }
    },
    disconnect(node) {
      generator = null;
    }
  };
}

interface EnvelopeController {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  setAttackTime(a: number): void;
  setDecayTime(d: number): void;
  setSustainLevel(s: number): void;
  setReleaseTime(r: number): void;
  device: Device;
}

function useEnvelope(
  rack: RackStateContext,
  settings: EnvelopeSettings
): EnvelopeController {
  const audioContext = useContext(AudioContextContext);
  const [attackTime, setAttack] = useState(settings.attackTime);
  const [decayTime, setDecay] = useState(settings.decayTime);
  const [sustainLevel, setSustain] = useState(settings.sustainLevel);
  const [releaseTime, setRelease] = useState(settings.releaseTime);
  const [[envelopeNode, device], _] = useState(() => {
    const node = createEnvelopeNode(audioContext, settings);
    const device = rack.createDevice(node);
    return [node, device] as DeviceState<EnvelopeNode>;
  });

  envelopeNode.setAttackTime(attackTime);
  envelopeNode.setDecayTime(decayTime);
  envelopeNode.setSustainLevel(sustainLevel);
  envelopeNode.setReleaseTime(releaseTime);

  return {
    device,
    attackTime,
    decayTime,
    sustainLevel,
    releaseTime,
    setAttackTime(a) {
      setAttack(a);
    },
    setDecayTime(d) {
      setDecay(d);
    },
    setSustainLevel(s) {
      setSustain(s);
    },
    setReleaseTime(r) {
      setRelease(r);
    }
  };
}

function Envelope({
  attackTime = 0.1,
  decayTime = 0.1,
  sustainLevel = 1,
  releaseTime = 0.1
}) {
  const rack = useContext(RackContext);
  const envelope = useEnvelope(rack, {
    attackTime,
    decayTime,
    sustainLevel,
    releaseTime
  });

  const outputPort = useOutputPort(rack, envelope.device, "Output");
  const gatePort = useInputPort(rack, envelope.device, "Gate");
  return (
    <DeviceContainer name="ADSR">
      <div>
        <Label>
          A{" "}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={envelope.attackTime}
            onChange={extractNumber(envelope.setAttackTime)}
          />
        </Label>
        <Label>
          D{" "}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={envelope.decayTime}
            onChange={extractNumber(envelope.setDecayTime)}
          />
        </Label>
        <Label>
          S{" "}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={envelope.sustainLevel}
            onChange={extractNumber(envelope.setSustainLevel)}
          />
        </Label>
        <Label>
          R{" "}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={envelope.releaseTime}
            onChange={extractNumber(envelope.setReleaseTime)}
          />
        </Label>
        <PortView port={outputPort} />
        <PortView port={gatePort} />
      </div>
    </DeviceContainer>
  );
}

export default Envelope;
