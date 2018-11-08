import React, { useState } from "react";

import Device from "../data/Device";
import { Rack } from "../data/Rack";
import { PortView, PortProps, useInputPort } from "../interface/PortView";
import DeviceContainer from "../interface/DeviceContainer";

interface MasterOutputController {
  device: Device;
}

interface MasterOutputProps {
  rack: Rack;
}

function useMaster(rack: Rack): MasterOutputController {
  const [device, setMaster] = useState(() => {
    const node = rack.destination;
    const device = rack.createDevice(node);
    return device;
  });

  return { device };
}

function MasterOutput({ rack, onPortSelect }: MasterOutputProps & PortProps) {
  const master = useMaster(rack);
  const inputPort = useInputPort(rack, master.device, "input");

  return (
    <DeviceContainer name="Master Output">
      <PortView isSelected={false} port={inputPort} onSelect={onPortSelect} />
    </DeviceContainer>
  );
}

export default MasterOutput;
