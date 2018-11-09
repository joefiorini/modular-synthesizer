import { Port } from "./Port";
import Device from "./Device";

interface Connection {
  input: Port;
  output: Port;
}

export default Connection;
