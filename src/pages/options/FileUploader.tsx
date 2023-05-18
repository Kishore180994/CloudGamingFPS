/**
 * Author: Chandra Kishore Danduri
 */
import React, { useContext, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { convertCamelCaseToNormalString } from "../content/utils/helper";
import { VideoStats } from "../content/hooks/useWebKit";
import { ThemeContext } from "./Header";
import { FPSData } from "../content/components/Demo/app";
import Help from "./help";

type props = {
  data: Array<FPSData>;
};

const FpsChart: React.FC<props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="fps" stroke="#8884d8" />
      <Line type="monotone" dataKey="latency" stroke="#82ca9d" />
      <Line type="monotone" dataKey="webKitFPS" stroke="#CA8282" />
      <Line type="monotone" dataKey="droppedFrames" stroke="#C6CA82" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
);

const FileUploader = () => {
  const { theme } = useContext(ThemeContext);

  const [fpsData, setFpsData] = useState<Array<FPSData>>([]);
  const [data, setData] = useState(null);
  const [elapsedTime, setElapsedTime] = useState<string>("");
  const [refreshRate, setRefreshRate] = useState<number>(0);
  const [statsData, setStatsData] = useState<VideoStats | null>(null);

  const handleFileRead = (e) => {
    const content = JSON.parse(e.target.result);
    setFpsData(content.fpsData as Array<FPSData>);
    setStatsData(content.statsData);
    setElapsedTime(content.elapsedTime);
    setRefreshRate(content.refreshRate);
  };

  const handleFileChosen = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "OPTIONS_PAGE" });

    const messageListener = (request) => {
      if (request.type === "DATA_READY") {
        const data = request.data;
        if (data) {
          setData(data);
          data.fpsData && setFpsData(data.fpsData as Array<FPSData>);
          data.statsData && setStatsData(data.statsData);
          data.elapsedTime && setElapsedTime(data.elapsedTime);
          data.refreshRate && setRefreshRate(data.refreshRate);
        }
      }
    };

    port.onMessage.addListener(messageListener);

    port.postMessage({ type: "REQUEST_DATA" });

    return () => port.onMessage.removeListener(messageListener);
  }, []);

  const containerClassName = theme === "light" ? "bg-gray-50" : "bg-gray-900";
  const borderClassName =
    theme === "light" ? "border-gray-300" : "border-gray-700";
  const textColorClass = theme === "light" ? "text-black" : "text-white";
  const textClassName = theme === "light" ? "text-black" : "text-white";
  return (
    <div
      className={`min-h-screen ${containerClassName} p-6 transition-colors duration-500`}
    >
      <div className="mb-8">
        <input
          className={`w-full rounded-lg border-2 p-2 transition-colors focus:border-blue-500 focus:outline-none ${textColorClass}`}
          type="file"
          id="file"
          accept=".txt"
          placeholder="Choose a file"
          onChange={(e) => handleFileChosen(e.target.files[0])}
        />
      </div>
      {fpsData && fpsData.length > 0 && statsData && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          <div className={`rounded-lg border p-4 shadow-md ${borderClassName}`}>
            <h2 className={`mb-2 text-xl font-semibold ${textClassName}`}>
              Elapsed Time
            </h2>
            <p className={textClassName}>{elapsedTime}</p>
          </div>
          <div className={`rounded-lg border p-4 shadow-md ${borderClassName}`}>
            <h2 className={`mb-2 text-xl font-semibold ${textClassName}`}>
              Refresh Rate
            </h2>
            <p className={textClassName}>{refreshRate}</p>
          </div>
          <div className={`rounded-lg border p-4 shadow-md ${borderClassName}`}>
            <h2 className={`mb-2 text-xl font-semibold ${textClassName}`}>
              FPS Chart (requestVideoFrameCallback)
            </h2>
            <FpsChart data={fpsData} />
          </div>
          <div className={`rounded-lg border p-4 shadow-md ${borderClassName}`}>
            <h2 className={`mb-2 text-xl font-semibold ${textClassName}`}>
              Video Metadata (webKit)
            </h2>
            <div className={`mt-2 space-y-2 ${textClassName}`}>
              <h2 className={`mb-2 text-lg font-semibold ${textClassName}`}>
                Full Video Decoded Frames
              </h2>
              {Object.entries(statsData)
                .filter(([key]) =>
                  ["totalDecodedFrames", "totalDroppedFrames"].includes(key)
                )
                .map((entry) => (
                  <div
                    className={`flex justify-between border-b border-gray-200 py-2 ${textClassName}`}
                    key={entry[0]}
                  >
                    <div
                      className={`font-semibold text-gray-700 ${textClassName}`}
                    >
                      {convertCamelCaseToNormalString(entry[0])}
                    </div>
                    <div className={`text-gray-900 ${textClassName}`}>
                      {entry[1]}
                    </div>
                  </div>
                ))}
              <h2 className={`mb-2 text-lg font-semibold ${textClassName}`}>
                Current Session
              </h2>
              {Object.entries(statsData)
                .filter(
                  ([key]) =>
                    !["totalDecodedFrames", "totalDroppedFrames"].includes(key)
                )
                .map((entry) => (
                  <div
                    className={`flex justify-between border-b border-gray-200 py-2 ${textClassName}`}
                    key={entry[0]}
                  >
                    <div
                      className={`font-semibold text-gray-700 ${textClassName}`}
                    >
                      {convertCamelCaseToNormalString(entry[0])}
                    </div>
                    <div className={`text-gray-900 ${textClassName}`}>
                      {entry[1]}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      <Help />
    </div>
  );
};

export default FileUploader;
