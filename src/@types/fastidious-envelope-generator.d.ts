declare class EnvelopeGenerator {
  constructor(c: AudioContext, node: AudioNode | AudioParam);

  mode: "ADSR" | "ASR" | "AD";
  attackTime: number;
  decayTime: number;
  releaseTime: number;
  sustainLevel: number;
  gateOn(t?: number): void;
  gateOff(t?: number): void;
}

declare module "fastidious-envelope-generator" {
  export default EnvelopeGenerator;
}
