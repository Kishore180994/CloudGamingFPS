import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../redux/hooks";

// Modify this type to include total decoded and dropped frames
export type VideoStats = {
  decodedFrames: number;
  decodedFPSAvg: string;
  currentDecodedFPS: string;
  droppedFrames: number;
  droppedFPSAvg: string;
  currentDroppedFPS: string;
  videoWidth: number;
  videoHeight: number;
  totalDecodedFrames: number;
  totalDroppedFrames: number;
};

const useWebKit = (start: boolean): VideoStats | null => {
  const [stats, setStats] = useState<VideoStats | null>(null);

  const video = useAppSelector((state) => state.settings.videoElement);
  const startTimeRef = useRef<number | null>(null);
  const initialFramesRef = useRef<{ decoded: number; dropped: number } | null>(
    null
  );

  useEffect(() => {
    if (!video || !start) return;

    startTimeRef.current = new Date().getTime();
    initialFramesRef.current = {
      decoded: video.webkitDecodedFrameCount,
      dropped: video.webkitDroppedFrameCount,
    };

    const intervalId = setInterval(() => {
      if (!video.webkitDecodedFrameCount) {
        console.log("Video FPS calcs not supported");
        return;
      }

      const currentTime = new Date().getTime();
      const deltaTime = (currentTime - startTimeRef.current!) / 1000;
      const totalTime = (currentTime - startTimeRef.current!) / 1000;

      const currentDecodedFrames =
        video.webkitDecodedFrameCount - initialFramesRef.current!.decoded;
      const currentDroppedFrames =
        video.webkitDroppedFrameCount - initialFramesRef.current!.dropped;

      const currentDecodedFPS = currentDecodedFrames / deltaTime;
      const decodedFPSavg = currentDecodedFrames / totalTime;

      const currentDroppedFPS = currentDroppedFrames / deltaTime;
      const droppedFPSavg = currentDroppedFrames / totalTime;

      const newUpdatedData = {
        decodedFrames: currentDecodedFrames,
        decodedFPSAvg: decodedFPSavg.toFixed(0),
        currentDecodedFPS: currentDecodedFPS.toFixed(0),
        droppedFrames: currentDroppedFrames,
        droppedFPSAvg: droppedFPSavg.toFixed(0),
        currentDroppedFPS: currentDroppedFPS.toFixed(0),
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        totalDecodedFrames: video.webkitDecodedFrameCount,
        totalDroppedFrames: video.webkitDroppedFrameCount,
      };
      setStats(() => newUpdatedData);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      startTimeRef.current = null;
      initialFramesRef.current = null;
    };
  }, [video, start]);

  return stats;
};
export default useWebKit;
