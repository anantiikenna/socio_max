import { useEffect, useState } from "react";

const useDebounce = (value: string, time: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timerId = setTimeout(() => {
      return setDebouncedValue(value);
    }, time);

    return () => clearTimeout(timerId);
  }, [value, time]);

  return debouncedValue;
};

export default useDebounce;
