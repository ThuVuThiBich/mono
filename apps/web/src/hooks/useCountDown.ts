import { useEffect, useState } from 'react';
import { useToggle } from './useToggle';

export const useCountdown = (time = 60) => {
  const [countDown, setCountDown] = useState(time);
  const [start, toggleStart, setStart] = useToggle(false);

  useEffect(() => {
    if (!start) return;
    const interval = setInterval(() => {
      setCountDown((old) => {
        if (old === 0) {
          clearInterval(interval);
          setStart(false);
          return time;
        }
        return Math.max((old -= 1), 0);
      });
    }, 1000);

    return () => {
      setStart(false);
      setCountDown(time);
      clearInterval(interval);
    };
  }, [start]);

  return { isStart: start, countDown, toggleStart };
};
