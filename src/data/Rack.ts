import React from "react";

import Device from "./Device";
import Connection from "./Connection";
import { Port } from "./Port";

interface RackBehavior {
  connect(output: Device, input: Device): Connection;
  disconnect(connection: Connection): void;
  createDevice(node: AudioNode): Device;
  allocatePort(port: Port): Port;
  __rawContext: AudioContext;
}

export type Rack = RackBehavior & AudioContext;
