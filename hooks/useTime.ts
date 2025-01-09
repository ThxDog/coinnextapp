// hooks/useTimer.ts
import { useState, useEffect } from "react";

const useTimer = (startTime: number, pointsPerSecond: number) => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const updatePoints = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - startTime;
      setPoints(Math.floor(elapsedTime * pointsPerSecond));
    };

    const timer = setInterval(updatePoints, 1000);
    updatePoints();

    return () => clearInterval(timer);
  }, [startTime, pointsPerSecond]);

  return points;
};

export default useTimer;
