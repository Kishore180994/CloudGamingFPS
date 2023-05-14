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

type props = {
  data: Array<{ fps: number; time: string }>;
};
const FpsChart: React.FC<props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="fps" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
    </LineChart>
  </ResponsiveContainer>
);

const FileUploader = () => {
  const { theme } = useContext(ThemeContext);

  const [fpsData, setFpsData] = useState<Array<{ fps: number; time: string }>>(
    []
  );
  const [data, setData] = useState(null);
  const [elapsedTime, setElapsedTime] = useState<string>("");
  const [refreshRate, setRefreshRate] = useState<number>(0);
  const [statsData, setStatsData] = useState<VideoStats | null>(null);

  const handleFileRead = (e) => {
    const content = JSON.parse(e.target.result);
    setFpsData(content.fpsData as Array<{ fps: number; time: string }>);
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
        setData(data);
        setFpsData(data.fpsData as Array<{ fps: number; time: string }>);
        setStatsData(data.statsData);
        setElapsedTime(data.elapsedTime);
        setRefreshRate(data.refreshRate);
      }
    };

    port.onMessage.addListener(messageListener);

    port.postMessage({ type: "REQUEST_DATA" });

    return () => port.onMessage.removeListener(messageListener);
  }, []);

  const containerClassName = theme === "light" ? "bg-gray-50" : "bg-gray-900";
  const borderClassName =
    theme === "light" ? "border-gray-300" : "border-gray-700";
  const textClassName = theme === "light" ? "text-black" : "text-white";
  const textColorClass = theme === "light" ? "text-black" : "text-white";

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
      {fpsData.length > 0 && statsData && (
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
      <div className={`mt-8 rounded-md ${containerClassName} p-6 shadow-lg`}>
        <h2 className={`mb-4 text-2xl font-semibold ${textClassName}`}>
          Help Information
        </h2>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Total Decoded Frames:</span> This
          represents the total number of video frames that have been decoded.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Total Dropped Frames:</span> This
          represents the total number of video frames that have been dropped and
          not displayed, even though they were decoded.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Decoded Frames:</span> This represents
          the number of video frames decoded in the current session.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Decoded FPS Avg:</span> This
          represents the average frames per second that were decoded.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Current Decoded FPS:</span> This
          represents the current rate of frames per second being decoded.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Dropped Frames:</span> This represents
          the number of frames that were dropped in the current session.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Dropped FPS Avg:</span> This
          represents the average frames per second that were dropped.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Current Dropped FPS:</span> This
          represents the current rate of frames per second being dropped.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Video Width:</span> The width of the
          video in pixels.
        </p>
        <p className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Video Height:</span> The height of the
          video in pixels.
        </p>
        <p className={`mt-4 text-sm ${textClassName}`}>
          Both{" "}
          <span className="font-semibold text-blue-600">
            requestVideoFrameCallback
          </span>{" "}
          and <span className="font-semibold text-blue-600">video.webkit</span>{" "}
          are APIs used to get information about a video&apos;s performance, but
          they serve different purposes and provide different types of
          information.
          <div className={`mt-2 ${textClassName}`}>
            <span className="font-semibold text-blue-600">
              requestVideoFrameCallback
            </span>{" "}
            is a method available on HTMLVideoElement in some modern browsers,
            such as Chrome. It allows a web developer to register a callback
            that will be run whenever a new frame of a video is presented for
            composition. The callback receives an object with details about the
            frame, including the expected display time, the presentation time,
            and the elapsed duration since the last frame. This can be useful
            for synchronizing a web application with the frame rate of a video,
            for instance to render annotations, effects, or other visual content
            in sync with the video.
          </div>
          <div className={`mt-2 ${textClassName}`}>
            <span className="font-semibold text-blue-600">
              webkitDecodedFrameCount
            </span>
            , property (part of the video.webkit properties) gives the total
            number of video frames that have been decoded. This includes frames
            that have been dropped and not displayed, as well as frames that
            were presented for display. This can be useful for getting an
            overview of the video decoding performance, for instance to see if
            frames are being dropped due to performance issues.
          </div>
          <div className={`mt-2 ${textClassName}`}>
            In summary,{" "}
            <span className="font-semibold text-blue-600">
              requestVideoFrameCallback
            </span>{" "}
            provides real-time, per-frame information and is useful for
            applications that need to synchronize with the video&apos;s frame
            rate, while{" "}
            <span className="font-semibold text-blue-600">
              webkitDecodedFrameCount
            </span>{" "}
            provides cumulative stats about the video&apos;s decoding
            performance. The choice between these APIs depends on the specific
            needs of your application.
          </div>
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
