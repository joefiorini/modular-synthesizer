import Device from "./Device";

interface RackBehavior {
  connect(output: Device, input: Device): void;
  createDevice(node: AudioNode): Device;
  __rawContext: AudioContext;
}

type Rack = RackBehavior & AudioContext;

export default Rack;
