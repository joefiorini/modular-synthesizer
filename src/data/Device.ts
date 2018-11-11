import { CustomNode } from "./CustomNode";

interface Device {
  id: number;
  node: AudioNode | CustomNode;
}

export type DeviceState<TNode> = [TNode, Device];

export default Device;
