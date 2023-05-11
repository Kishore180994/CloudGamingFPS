import { useEffect, useRef, useState } from "react";
import useFPS from "../../hooks/useFPS";
import { StyledContentView } from "./app.styles";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { sliceSetVideoElement } from "../../../../redux/slice";
import useWebKit from "../../hooks/useWebKit";
import { convertCamelCaseToNormalString } from "../../utils/helper";
import Draggable from "react-draggable";
import { Brush, ResponsiveContainer } from "recharts";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function App() {
  const [start, setStart] = useState<boolean>(false);
  const [fpsData, setFpsData] = useState<Array<{ fps: number; time: string }>>(
    []
  );
  const startTime = useRef<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const webKitSummary = useAppSelector((state) => state.settings.webKit);
  const dispatch = useAppDispatch();

  const fps = useFPS(start, (fps, time) => {
    setFpsData((prevData) => [...prevData, { fps, time }]);
  });

  useWebKit(start);

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
        <div className="time-elasped">
          <div>Time elasped</div>
          <div>{elapsedTime}</div>
        </div>
        <div className="raf">
          <div className="raf-heading">requestVideoFrameCallback</div>
          <div className="stats">
            <div className="title">FPS</div>
            <div className="value">{fps}</div>
          </div>
        </div>
        <ResponsiveContainer width={300} height={150}>
          <LineChart data={fpsData} width={300} height={150}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" tick={{ fill: "white" }} />
            <YAxis domain={["dataMin", "dataMax"]} tick={{ fill: "white" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "purple", borderColor: "white" }}
            />
            <Line
              type="monotone"
              dataKey="fps"
              stroke="#ffffff"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
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
      </StyledContentView>
    </Draggable>
  );
}
