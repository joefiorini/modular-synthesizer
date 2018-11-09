import React, { useState, useContext } from "react";

import Device from "../data/Device";
import { PortView, useInputPort } from "../interface/PortView";
import DeviceContainer from "../interface/DeviceContainer";
import { RackStateContext, RackContext } from "../RackState";
import useAudioContext from "../hooks/useAudioContext";
import { AudioContextContext } from "../AudioContextState";

interface MasterOutputController {
  device: Device;
}

function useMaster(rack: RackStateContext): MasterOutputController {
  const audioContext = useContext(AudioContextContext);
  const [device] = useState(() => {
    const node = audioContext.destination;
    const device = rack.createDevice(node);
    return device;
  });

  return { device };
}

function MasterOutput() {
  const rack = useContext(RackContext);
  const master = useMaster(rack);
  const inputPort = useInputPort(rack, master.device, "input");

  return (
    <DeviceContainer name="Master Output">
      <PortView port={inputPort} />
    </DeviceContainer>
  );
}

export default MasterOutput;
