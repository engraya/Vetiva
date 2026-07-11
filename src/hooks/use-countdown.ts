import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function partsFor(target: number): CountdownParts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 864e5),
    hours: Math.floor(ms / 36e5) % 24,
    minutes: Math.floor(ms / 6e4) % 60,
    seconds: Math.floor(ms / 1e3) % 60,
    expired: ms === 0,
  };
}

export function useCountdown(targetIso: string): CountdownParts {
  const target = new Date(targetIso).getTime();
  const [parts, setParts] = useState(() => partsFor(target));

  useEffect(() => {
    setParts(partsFor(target));
    const handle = setInterval(() => setParts(partsFor(target)), 1000);
    return () => clearInterval(handle);
  }, [target]);

  return parts;
}
