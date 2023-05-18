/**
 * Author: Chandra Kishore Danduri
 */

import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../../redux/hooks";

/**
 * Type definition for VideoStats. This type includes several properties such as
 * `effectiveFPSAvg`, `decodedFrames`, `decodedFPSAvg`, `currentDecodedFPS`, `droppedFrames`,
 * `droppedFPSAvg`, `currentDroppedFPS`, `videoWidth`, `videoHeight`, `totalDecodedFrames` and `totalDroppedFrames`.
 *
 * Each property represents a different aspect of the video statistics.
 */
export type VideoStats = {
  effectiveFPSAvg: number;
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

/**
 * useWebKit is a custom React Hook which returns video statistics when a video is played.
 *
 * @param {boolean} start - a boolean to indicate whether the video is being played.
 * @returns {VideoStats | null} - the statistics of the played video or null if video is not playing.
 *
 * The returned object contains various information about the video like effective frame per second average,
 * total decoded frames, total dropped frames, current decoded frames per second, current dropped frames per second,
 * average decoded frames per second, average dropped frames per second, video height, and video width.
 *
 * The hook uses various state and reference hooks to perform its operations:
 *
 * - video: A video element from the Redux state.
 * - startTimeRef: A reference to the start time of the video.
 * - initialFramesRef: A reference to the initial decoded and dropped frames of the video.
 * - intervalFramesRef: A reference to the decoded and dropped frames of the video at the start of each interval.
 *
 * useEffect is used to perform operations when the video starts playing. It records the start time and the initial
 * frame data, and sets an interval to perform operations every second.
 *
 * Within the interval, it calculates the average frames per second for decoded and dropped frames, as well as the
 * current frames per second for both. It also updates the `stats` state with this data.
 *
 * The useEffect hook also cleans up when the component is unmounted or when the video stops playing. It clears the
 * interval and resets all the references to their initial state.
 *
 * Note: This hook uses webkit specific properties of the video element like `webkitDecodedFrameCount` and
 * `webkitDroppedFrameCount` which may not be available in all browsers.
 */
const useWebKit = (start: boolean): VideoStats | null => {
  const [stats, setStats] = useState<VideoStats | null>(null);

  const video = useAppSelector((state) => state.settings.videoElement);
  const startTimeRef = useRef<number | null>(null);
  const initialFramesRef = useRef<{ decoded: number; dropped: number } | null>(
    null
  );
  const intervalFramesRef = useRef<{
    decoded: number;
    dropped: number;
  } | null>(null);

  useEffect(() => {
    if (!video || !start) return;

    startTimeRef.current = new Date().getTime();
    let prevTime = startTimeRef.current;
    initialFramesRef.current = {
      decoded: video.webkitDecodedFrameCount,
      dropped: video.webkitDroppedFrameCount,
    };
    intervalFramesRef.current = {
      decoded: video.webkitDecodedFrameCount,
      dropped: video.webkitDroppedFrameCount,
    };

    const intervalId = setInterval(() => {
      if (!video.webkitDecodedFrameCount) {
        console.log("Video FPS calcs not supported");
        return;
      }

      const currentTime = new Date().getTime();
      const deltaTime = (currentTime - prevTime) / 1000;
      const totalTime = (currentTime - startTimeRef.current!) / 1000;

      // Decoded frames and average.
      const decodedFrames =
        video.webkitDecodedFrameCount - initialFramesRef.current!.decoded;
      const decodedFPSavg = decodedFrames / totalTime;

      // Dropped frames and average.
      const droppedFrames =
        video.webkitDroppedFrameCount - initialFramesRef.current!.dropped;
      const droppedFPSavg = droppedFrames / totalTime;

      const averageFPS = ((decodedFrames - droppedFrames) / totalTime).toFixed(
        0
      );

      const currentDecodedFPS =
        video.webkitDecodedFrameCount -
        intervalFramesRef.current!.decoded / deltaTime;

      const currentDroppedFPS =
        video.webkitDroppedFrameCount -
        intervalFramesRef.current!.dropped / deltaTime;

      const newUpdatedData = {
        effectiveFPSAvg: Number(averageFPS),
        decodedFrames: decodedFrames,
        decodedFPSAvg: decodedFPSavg.toFixed(0),
        currentDecodedFPS: currentDecodedFPS.toFixed(0),
        droppedFrames: droppedFrames,
        droppedFPSAvg: droppedFPSavg.toFixed(0),
        currentDroppedFPS: currentDroppedFPS.toFixed(0),
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        totalDecodedFrames: video.webkitDecodedFrameCount,
        totalDroppedFrames: video.webkitDroppedFrameCount,
      };
      setStats(() => newUpdatedData);

      prevTime = currentTime; // update prevTime for next interval
      intervalFramesRef.current = {
        decoded: video.webkitDecodedFrameCount,
        dropped: video.webkitDroppedFrameCount,
      }; // update initialFrames for next interval
    }, 1000);

    return () => {
      clearInterval(intervalId);
      startTimeRef.current = null;
      initialFramesRef.current = null;
      intervalFramesRef.current = null;
    };
  }, [video, start]);

  return stats;
};

export default useWebKit;
