import React, { useContext, useState } from "react";
import DeviceContainer from "../interface/DeviceContainer";
import { useOutputPort, PortView } from "../interface/PortView";
import { RackContext, RackStateContext } from "../RackState";
import { CustomNode } from "../data/CustomNode";
import Device, { DeviceState } from "../data/Device";
import { node } from "prop-types";

interface TriggerNode extends CustomNode {}

interface TriggerController {
  gateOn(): void;
  gateOff(): void;
  device: Device;
}

function createTriggerNode(): TriggerNode {
  let connectedNode: CustomNode | AudioNode | AudioParam | null;
  return {
    gateOn() {
      if (connectedNode && "gateOn" in connectedNode) {
        connectedNode.gateOn();
      }
    },
    gateOff() {
      if (connectedNode && "gateOff" in connectedNode) {
        connectedNode.gateOff();
      }
    },
    connect(node) {
      connectedNode = node;
    },
    disconnect(node) {
      connectedNode = null;
    }
  };
}

function useTrigger(rack: RackStateContext): TriggerController {
  const [[triggerNode, device], _] = useState(() => {
    const node = createTriggerNode();
    const device = rack.createDevice(node);
    return [node, device] as DeviceState<TriggerNode>;
  });

  return {
    gateOn() {
      triggerNode.gateOn();
    },
    gateOff() {
      triggerNode.gateOff();
    },
    device
  };
}

function Trigger() {
  const rack = useContext(RackContext);
  const trigger = useTrigger(rack);
  const gatePort = useOutputPort(rack, trigger.device, "Gate");
  return (
    <DeviceContainer name="trigger">
      <button onMouseDown={trigger.gateOn} onMouseUp={trigger.gateOff}>
        Trigger
      </button>
      <PortView port={gatePort} />
    </DeviceContainer>
  );
}

export default Trigger;
