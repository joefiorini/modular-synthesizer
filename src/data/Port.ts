import Device from "./Device";

export interface Port {
  label: string;
  type: string;
  device: Device;
  modulationParam?: AudioParam;
}

export const canConnectToPort = (currentPort: Port, otherPort: Port) =>
  currentPort.type !== otherPort.type;
