/**
 * Author: Chandra Kishore Danduri
 */

import { useEffect, useState } from "react";

/**
 * This is a custom React Hook called `useRefreshRate`. It calculates and provides the
 * refresh rate (in frames per second) of the current window or screen.
 *
 * @param {boolean} start - A boolean indicating whether or not to start calculating the refresh rate.
 * @returns {number} refreshRate - The current refresh rate in frames per second.
 *
 * When the `start` parameter is true, it starts measuring the refresh rate. The refresh rate is calculated
 * by counting the number of requestAnimationFrame callbacks within a given second (1000ms).
 *
 * When a second has passed, the `refreshRate` state is updated with the current number of frames,
 * which effectively represents the refresh rate. The frame count (`frames`) is then reset to zero.
 *
 * If `start` is false, the counting stops, effectively freezing the refresh rate at its last value.
 *
 * The useEffect hook performs cleanup when the component is unmounted or when `start` is set to false.
 * It cancels the last requestAnimationFrame to prevent unnecessary computations.
 *
 * Note: The refresh rate is tied to the browser's refresh rate, so it is subject to limitations and
 * can vary depending on the user's hardware and settings.
 */
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
