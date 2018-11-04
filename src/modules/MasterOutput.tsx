import React, { useState } from "react";

import Device from "../data/Device";
import Rack from "../data/Rack";
import { PortView, PortProps } from "../interface/PortView";

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

  return (
    <div className="device">
      <PortView
        isSelected={false}
        type="input"
        device={master.device}
        onSelect={onPortSelect}
      />
    </div>
  );
}

export default MasterOutput;