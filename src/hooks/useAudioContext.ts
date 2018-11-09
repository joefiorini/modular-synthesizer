import { useState } from "react";

function useAudioContext(): AudioContext {
  const [audioContext, setAudioContext] = useState(() => {
    return new AudioContext();
  });

  return audioContext;
}

export default useAudioContext;
