/**
 * Author: Chandra Kishore Danduri
 */

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

// Defining the type for the useFPS hook
type UseFPSType = (start: boolean) => { fps: number; latency: number };

/**
 * This hook calculates the frames per second (FPS) and the latency for a video.
 *
 * @param {boolean} start - Controls when to start the FPS and latency calculation
 * @returns {Object} An object containing FPS and latency values
 */
const useFPS: UseFPSType = (start) => {
  // The video element selected from the application state
  const videoEl = useAppSelector((state) => state.settings.videoElement);

  // State for FPS and latency
  const [fps, setFPS] = useState(0);
  const [latency, setLatency] = useState(0);

  // References to keep track of various metrics
  const startTime = useRef<number>(Date.now());
  const fpsRounder = useRef<number[]>([]);
  const latencyRounder = useRef<number[]>([]);
  const lastMetadata = useRef<{ mediaTime: number; frameCount: number }>({
    mediaTime: 0,
    frameCount: 0,
  });
  const frameNotSeeked = useRef(true);

  useEffect(() => {
    if (!start) return;
    if (start) {
      startTime.current = Date.now(); // Reset the start time
    }

    // Function to handle the "seeked" event on the video
    const onSeeked = () => {
      fpsRounder.current.pop();
      frameNotSeeked.current = false;
    };

    // Function to calculate the average FPS
    const getFpsAverage = () => {
      if (fpsRounder.current.length === 0) {
        return 0;
      }
      return (
        fpsRounder.current.reduce((a, b) => a + b, 0) /
        fpsRounder.current.length
      );
    };

    // Function to calculate the average Display Latency.
    const getLatencyAverage = () => {
      if (latencyRounder.current.length === 0) {
        return 0;
      }
      return (
        latencyRounder.current.reduce((a, b) => a + b, 0) /
        latencyRounder.current.length
      );
    };

    // Callback function to be passed to requestVideoFrameCallback
    const ticker = (useless: number, metadata: any) => {
      const mediaTimeDiff = Math.abs(
        metadata.mediaTime - lastMetadata.current.mediaTime
      );
      const frameNumDiff = Math.abs(
        metadata.presentedFrames - lastMetadata.current.frameCount
      );
      const diff = mediaTimeDiff / frameNumDiff;

      if (
        diff &&
        diff < 1 &&
        frameNotSeeked.current &&
        fpsRounder.current.length < 50 &&
        videoEl &&
        videoEl.playbackRate === 1
      ) {
        fpsRounder.current.push(diff);
      }

      frameNotSeeked.current = true;
      lastMetadata.current = {
        mediaTime: metadata.mediaTime,
        frameCount: metadata.presentedFrames,
      };

      // Calculate and set the latency
      const calculatedLatency =
        metadata.expectedDisplayTime - metadata.presentationTime;
      latencyRounder.current.push(parseFloat(calculatedLatency.toFixed(2)));

      if (videoEl) {
        videoEl.requestVideoFrameCallback(ticker);
      }
    };

    if (videoEl) {
      videoEl.requestVideoFrameCallback(ticker);
      videoEl.addEventListener("seeked", onSeeked);
    }

    // Function to calculate FPS and latency every second
    const intervalId = setInterval(() => {
      const average = getFpsAverage();
      const latencyAverage = getLatencyAverage();
      if (average !== 0) {
        const calculatedFPS = Math.round(1 / average);
        setFPS(calculatedFPS);
        setLatency(latencyAverage);
      }
      fpsRounder.current = [];
      latencyRounder.current = [];
    }, 1000);

    // Cleanup function
    return () => {
      if (videoEl) {
        videoEl.removeEventListener("seeked", onSeeked);
      }
      clearInterval(intervalId);
    };
  }, [videoEl, start]);

  // Return the FPS and latency
  return { fps, latency: parseFloat(latency.toFixed(2)) };
};

export default useFPS;
