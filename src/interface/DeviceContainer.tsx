import React from "react";
import styled from "react-emotion";

interface PropTypes {
  name: string;
  children: React.ReactNode;
}

const Device = styled("div")`
  border: solid 1px #000;
`;

const DeviceName = styled("div")`
  font-family: "Dank Mono", "Fira Code", "Anonymous Pro", monospace;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
`;

function DeviceContainer({ name, children }: PropTypes) {
  return (
    <Device>
      <DeviceName>{name}</DeviceName>
      {children}
    </Device>
  );
}

export default DeviceContainer;
