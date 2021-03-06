import React, { useContext } from "react";

import Amp from "./modules/Amp";
import Oscillator from "./modules/Oscillator";
import MasterOutput from "./modules/MasterOutput";
import styled from "react-emotion";
import PortState from "./PortState";
import RackState, { RackContext } from "./RackState";
import AudioContextState from "./AudioContextState";
import { EventEmitter } from "events";
import Envelope from "./modules/Envelope";
import Trigger from "./modules/Trigger";

const Container = styled("div")`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const Rack = () => {
  return (
    <AudioContextState>
      <RackState>
        <PortState>
          <Container>
            <Trigger />
            <Envelope />
            <Oscillator frequency={440} waveType="sine" />
            <Amp />
            <MasterOutput />
          </Container>
        </PortState>
      </RackState>
    </AudioContextState>
  );
};

export default Rack;
