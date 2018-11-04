let id = 1;

function useId(): number {
  return (id = id + 1);
}

export default useId;
