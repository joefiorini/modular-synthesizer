interface Device {
  id: number;
  node: AudioNode;
}

export type DeviceState<TNode> = [TNode, Device];

export default Device;
