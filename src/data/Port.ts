import Device from "./Device";

export interface Port {
  label: string;
  type: string;
  device: Device;
}
