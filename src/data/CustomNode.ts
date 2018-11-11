export interface CustomNode {
  connect(node: AudioNode | AudioParam | CustomNode): void;
  disconnect(node: AudioNode | AudioParam | CustomNode): void;
  gateOn(): void;
  gateOff(): void;
}
