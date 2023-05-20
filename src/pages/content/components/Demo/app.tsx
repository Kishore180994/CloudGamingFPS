/**
 * Author: Chandra Kishore Danduri
 */
import { useEffect, useRef, useState } from "react";
import useFPS from "../../hooks/useFPS";
import { StyledContentView } from "./app.styles";
import { useAppDispatch } from "../../../../redux/hooks";
import { sliceSetVideoElement } from "../../../../redux/slice";
import useWebKit, { VideoStats } from "../../hooks/useWebKit";
import { convertCamelCaseToNormalString } from "../../utils/helper";
import Draggable from "react-draggable";
import { ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import useRefreshRate from "../../hooks/useRefreshRate";
import { useBatteryDischargeRate } from "../../hooks/useBatteryDischargeRate";

export type FPSData = {
  fps: number;
  time: string;
  latency: number;
  webKitFPS: number;
  droppedFrames: number;
};

/**
 * This function saves all data to a file in JSON format and sends a message to the Chrome runtime.
 * @param {string} elapsedTime - A string representing the total elapsed time of the video being
 * analyzed.
 * @param {number} refreshRate - The refresh rate is a number that represents how many times per second
 * the screen is refreshed. It is typically measured in Hertz (Hz) and is important for determining the
 * smoothness of animations and videos on a display.
 * @param fpsData - An array of FPSData objects. Each FPSData object contains information about the
 * frames per second (FPS) of a video at a specific point in time.
 * @param {VideoStats} statsData - VideoStats is likely an object that contains statistics related to a
 * video, such as its duration, resolution, bitrate, and other relevant information. However, without
 * seeing the implementation of VideoStats, it's difficult to say for sure.
 * @param {string} filename - a string representing the name of the file to be saved.
 * @returns If the length of `fpsData` is less than or equal to 0, nothing is returned (the function
 * stops executing).
 */
function saveAllDataToFile(
  elapsedTime: string,
  refreshRate: number,
  fpsData: Array<FPSData>,
  statsData: VideoStats,
  filename: string
) {
  if (fpsData.length <= 0) return;
  const consolidatedData = {
    elapsedTime,
    refreshRate,
    fpsData,
    statsData,
  };
  chrome.runtime.sendMessage({
    type: "DATA_READY",
    data: { elapsedTime, refreshRate, fpsData, statsData },
  });
  const blob = new Blob([JSON.stringify(consolidatedData, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, filename);
}

export default function App() {
  const [start, setStart] = useState<boolean>(false);
  const [fpsData, setFpsData] = useState<Array<FPSData>>([]);
  const startTime = useRef<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [time, setTime] = useState<number>(0);
  const dispatch = useAppDispatch();
  const webKitSummary = useWebKit(start);
  const refreshRate = useRefreshRate(start);
  const batteryStats = useBatteryDischargeRate(start);

  const { fps, latency } = useFPS(start);

  // New useEffect hook for setting fpsData
  useEffect(() => {
    if (start) {
      setFpsData((prevData) => [
        ...prevData,
        {
          fps,
          time: String(time),
          latency,
          webKitFPS: Number(webKitSummary?.currentDecodedFPS) || 0,
          droppedFrames: Number(webKitSummary?.currentDroppedFPS) || 0,
          effectiveFPSAvg: Number(webKitSummary?.effectiveFPSAvg) || 0,
        },
      ]);
    }
  }, [fps, latency, start, webKitSummary, time]);

  /* This `useEffect` hook is setting up a `MutationObserver` to watch for changes in the DOM. When a new
`video` element is added to the DOM, the observer will find it and dispatch an action to update the
`video` element in the Redux store using the `sliceSetVideoElement` action creator. The observer
also checks for `video` elements inside `iframe` elements and updates the store accordingly. The
hook returns a cleanup function that disconnects the observer when the component unmounts. */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const videos = document.querySelectorAll("video");
      if (videos.length > 0) {
        console.log("A new video node has been added:", videos[0]);
        dispatch(sliceSetVideoElement(videos[0]));
        // Notify user about the new video element
        observer.disconnect(); // Disconnect observer after we found a video
      }

      // Check iframes as well
      const iframes = document.querySelectorAll("iframe");
      for (let i = 0; i < iframes.length; i++) {
        try {
          const iframeVideos =
            iframes[i].contentDocument.querySelectorAll("video");
          if (iframeVideos.length > 0) {
            console.log(
              "A new video node has been added inside an iframe:",
              iframeVideos[0]
            );
            dispatch(sliceSetVideoElement(iframeVideos[0]));
            // Notify user about the new video element
            observer.disconnect(); // Disconnect observer after we found a video
            break;
          }
        } catch (err) {
          console.error("Could not access iframe content:", err);
        }
      }
    });

    observer.observe(document, { childList: true, subtree: true });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!start) {
      saveAllDataToFile(
        elapsedTime,
        refreshRate,
        fpsData,
        webKitSummary,
        "data.txt"
      );
    }
  }, [start]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "G") {
        setStart((prevStart) => {
          if (!prevStart) {
            // If we're starting the measurement
            setFpsData([]); // Clear the fpsData
          }
          if (prevStart) {
            // Stop updating elapsed time if we are stopping
            clearInterval(intervalId);
          } else {
            // Record start time and start updating elapsed time if we are starting
            startTime.current = new Date();
            intervalId = setInterval(() => {
              const now = new Date();
              const elapsedMs =
                now.getTime() - (startTime.current?.getTime() || 0);
              const elapsedSec = Math.round(elapsedMs / 1000);
              setTime(() => elapsedSec);
              const hours = Math.floor(elapsedSec / 3600)
                .toString()
                .padStart(2, "0");
              const minutes = Math.floor((elapsedSec % 3600) / 60)
                .toString()
                .padStart(2, "0");
              const seconds = (elapsedSec % 60).toString().padStart(2, "0");
              setElapsedTime(`${hours}:${minutes}:${seconds}`);
            }, 1000);
          }
          return !prevStart;
        });
      } else if (event.ctrlKey && event.shiftKey && event.key === "O") {
        chrome.runtime.sendMessage({
          type: "OPEN_OPTIONS",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <Draggable>
      <StyledContentView className="content-view">
        <div className="info">
          Press ctrl+shift+G to {start ? "stop" : "start"}
        </div>
        {!start && <div className="info">Press ctrl+shift+O for more info</div>}
        <div className="time-elasped">
          <div>Time elasped</div>
          <div>{elapsedTime}</div>
        </div>
        <div className="time-elasped">
          <div>Refresh rate</div>
          <div>{refreshRate}Hz</div>
        </div>
        <div className="raf">
          <div className="raf-heading">requestVideoFrameCallback</div>
          <div className="stats">
            <div className="title">FPS</div>
            <div className="value">{fps}</div>
          </div>
          <div className="stats">
            <div className="title">Average Display latency/second</div>
            <div className="value">{latency}ms</div>
          </div>
        </div>
        {!start && fpsData.length > 0 ? (
          <ResponsiveContainer width={300} height={150}>
            <LineChart data={fpsData} width={300} height={150}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" tick={{ fill: "white" }} />
              <YAxis domain={["dataMin", "dataMax"]} tick={{ fill: "white" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "purple",
                  borderColor: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="fps"
                stroke="#ffffff"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div>Chart data will be available when the recording is stopped</div>
        )}
        {batteryStats && batteryStats.initialBatteryLevel && (
          <div className="raf">
            <div className="raf-heading">Battery Stats</div>
            <div className="stats">
              <div className="title">Initial level</div>
              <div className="value">{batteryStats.initialBatteryLevel}%</div>
            </div>
            <div className="stats">
              <div className="title">Final level</div>
              <div className="value">{batteryStats.finalBatteryLevel}%</div>
            </div>
            <div className="stats">
              <div className="title">Discharge rate</div>
              <div className="value">
                {batteryStats.batteryDischargeRate}%/s
              </div>
            </div>
          </div>
        )}

        {webKitSummary && (
          <div className="raf">
            <div className="raf-heading">Video WebKit</div>
            <div>
              {Object.entries(webKitSummary).map((entry) => (
                <div className="stats" key={entry[0]}>
                  <div className="title">
                    {convertCamelCaseToNormalString(entry[0])}
                  </div>
                  <div className="value">{entry[1]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </StyledContentView>
    </Draggable>
  );
}
