import { useReducer } from "react";

let id = 1;

interface State {
  [key: string]: number;
}

type Action = { type: "increment"; payload: string };

function incrementingReducer(state: State, action: Action) {
  return {
    ...state,
    [action.payload]: (state[action.payload] || 0) + 1
  };
}

function useId(prefix: string): () => number {
  const [state, dispatch] = useReducer(incrementingReducer, { [prefix]: 0 });
  return () => {
    dispatch({ type: "increment", payload: prefix });
    return state[prefix];
  };
}

export default useId;
