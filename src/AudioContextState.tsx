import React from "react";

import useAudioContext from "./hooks/useAudioContext";

export const AudioContextContext = React.createContext({} as AudioContext);

interface Props {
  children: React.ReactChild;
}

function AudioContextState({ children }: Props) {
  const audioContext = useAudioContext();

  return (
    <AudioContextContext.Provider value={audioContext}>
      {children}
    </AudioContextContext.Provider>
  );
}

export default AudioContextState;
