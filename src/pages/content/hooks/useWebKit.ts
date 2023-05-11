import { useEffect, useState } from "react";
import { VideoStats, sliceSetWebKit } from "../../../redux/slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

const useWebKit = (start: boolean): VideoStats | null => {
  const [stats, setStats] = useState<VideoStats | null>(null);
  const dispatch = useAppDispatch();
  const video = useAppSelector((state) => state.settings.videoElement);

  useEffect(() => {
    if (!video || !start) return;

    const startTime = new Date().getTime();
    const initialTime = startTime;

    let decodedFrames = 0;
    let droppedFrames = 0;

    const intervalId = setInterval(() => {
      if (!video.webkitDecodedFrameCount) {
        console.log("Video FPS calcs not supported");
        return;
      }

      const currentTime = new Date().getTime();
      const deltaTime = (currentTime - startTime) / 1000;
      const totalTime = (currentTime - initialTime) / 1000;

      const currentDecodedFPS =
        (video.webkitDecodedFrameCount - decodedFrames) / deltaTime;
      const decodedFPSavg = video.webkitDecodedFrameCount / totalTime;
      decodedFrames = video.webkitDecodedFrameCount;

      const currentDroppedFPS =
        (video?.webkitDroppedFrameCount - droppedFrames) / deltaTime;
      const droppedFPSavg = video.webkitDroppedFrameCount / totalTime;
      droppedFrames = video.webkitDroppedFrameCount;
      dispatch(
        sliceSetWebKit({
          decodedFrames,
          decodedFPSAvg: decodedFPSavg.toFixed(0),
          currentDecodedFPS: currentDecodedFPS.toFixed(0),
          droppedFrames,
          droppedFPSAvg: droppedFPSavg.toFixed(0),
          currentDroppedFPS: currentDroppedFPS.toFixed(0),
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
        })
      );

      setStats({
        decodedFrames,
        decodedFPSAvg: decodedFPSavg.toFixed(0),
        currentDecodedFPS: currentDecodedFPS.toFixed(0),
        droppedFrames,
        droppedFPSAvg: droppedFPSavg.toFixed(0),
        currentDroppedFPS: currentDroppedFPS.toFixed(0),
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [video, start]);

  return stats;
};
export default useWebKit;
