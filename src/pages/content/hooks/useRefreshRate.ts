import { useEffect, useState } from "react";

const useRefreshRate = (start: boolean) => {
  const [refreshRate, setRefreshRate] = useState<number>(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let frameId: number;

    const countFrames = () => {
      const now = performance.now();
      frames++;

      if (now - lastTime >= 1000) {
        setRefreshRate(frames);
        frames = 0;
        lastTime = now;
      }

      if (start) {
        frameId = requestAnimationFrame(countFrames);
      }
    };

    if (start) {
      frameId = requestAnimationFrame(countFrames);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [start]);

  return refreshRate;
};

export default useRefreshRate;
