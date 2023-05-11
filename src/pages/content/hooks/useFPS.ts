import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

type UseFPSType = (
  start: boolean,
  setFpsData: (fps: number, time: string) => void
) => number;

const useFPS: UseFPSType = (start, setFpsData) => {
  const videoEl = useAppSelector((state) => state.settings.videoElement);

  const [fps, setFPS] = useState(0);
  const startTime = useRef<number>(Date.now());
  const fpsRounder = useRef<number[]>([]);
  const lastMetadata = useRef<{ mediaTime: number; frameCount: number }>({
    mediaTime: 0,
    frameCount: 0,
  });
  const frameNotSeeked = useRef(true);

  useEffect(() => {
    if (!start) return;
    if (start) {
      startTime.current = Date.now(); // update startTime when start changes to true
    }
    const onSeeked = () => {
      fpsRounder.current.pop();
      frameNotSeeked.current = false;
    };

    const getFpsAverage = () => {
      if (fpsRounder.current.length === 0) {
        return 0;
      }
      return (
        fpsRounder.current.reduce((a, b) => a + b, 0) /
        fpsRounder.current.length
      );
    };

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

      if (videoEl) {
        videoEl.requestVideoFrameCallback(ticker);
      }
    };

    if (videoEl) {
      videoEl.requestVideoFrameCallback(ticker);
      videoEl.addEventListener("seeked", onSeeked);
    }

    const intervalId = setInterval(() => {
      const average = getFpsAverage();
      if (average !== 0) {
        const calculatedFPS = Math.round(1 / average);
        setFPS(calculatedFPS);
        const nowInSeconds = Math.floor(
          (Date.now() - startTime.current) / 1000
        );
        setFpsData(calculatedFPS, nowInSeconds.toString());
      }
      fpsRounder.current = [];
    }, 1000);

    return () => {
      if (videoEl) {
        videoEl.removeEventListener("seeked", onSeeked);
      }
      clearInterval(intervalId);
    };
  }, [videoEl, start]);

  return fps;
};

export default useFPS;
