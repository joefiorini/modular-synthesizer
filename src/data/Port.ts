import Device from "./Device";

interface Port {
  type: "input" | "output";
  device: Device;
}

export default Port;
