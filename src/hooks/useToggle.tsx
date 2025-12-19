import { useCallback, useState } from "react";

function useToggle(initial = false): [boolean, () => void] {
  const [state, setState] = useState(initial);
  return [
    state,
    useCallback(() => {
      setState((v) => !v);
    }, []),
  ] as const;
}

export default useToggle;
