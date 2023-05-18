import React, { useContext } from "react";
import { ThemeContext } from "./Header";

const Help = () => {
  const { theme } = useContext(ThemeContext);
  const textClassName = theme === "light" ? "text-black" : "text-white";
  const containerClassName = theme === "light" ? "bg-gray-50" : "bg-gray-900";

  return (
    <div className={`mt-8 rounded-md ${containerClassName} p-6 shadow-lg`}>
      <h2 className={`mb-4 text-2xl font-semibold ${textClassName}`}>
        Help Information
      </h2>
      <h3 className={`mb-2 text-lg font-semibold ${textClassName}`}>
        How video rendering works?
      </h3>
      <p className={`mb-2 text-sm ${textClassName}`}>
        If the video playback cannot keep up with the intended FPS (for example,
        a 60 FPS video on a system that can only render 30 FPS), then the system
        has to &ldquo;drop&ldquo; frames to keep up with the video&#39;s timing.
        This means it simply doesn&#39;t render some frames to maintain the
        video&#39;s speed, resulting in less smooth playback.
      </p>
      <h3 className={`mb-2 text-lg font-semibold ${textClassName}`}>
        requestVideoFrameCallback
      </h3>
      <ul className="list-disc pl-6">
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">FPS:</span> This represents the
          instantaneous frames per second (FPS) of the video element during
          runtime. The FPS value displayed here corresponds to the number of
          frames directly presented by the video element itself. It is important
          to note that this FPS measurement is independent of the device&apos;s
          display refresh rate.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Display Latency:</span> This latency
          measures the time difference between when a frame is expected to be
          displayed (expectedDisplayTime) and when it was actually presented
          (presentationTime). This gives an indication of the delay, or
          &ldquo;lag&ldquo;, in presenting the frames of the video. Remember, a
          positive latency value indicates that the frame was presented later
          than expected, whereas a negative value indicates that the frame was
          presented earlier than expected. In most real-time systems, you&apos;d
          ideally want this value to be as close to zero as possible.
        </li>
      </ul>
      <h3 className={`mb-2 text-lg font-semibold ${textClassName}`}>
        Video WebKit
      </h3>
      <ul className="list-disc pl-6">
        <li className={`mb-2 text-sm ${textClassName} font-semibold`}>
          Note: Please make sure not to pause the video in order to get the
          accurate results. If you paused the video, we might not get accurate
          results. Please restart the runs again.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Effective FPS Avg:</span> This
          represents the average frames per second taking into account both
          decoded and dropped frames. It is calculated as the total frames
          (decoded frames - dropped frames) divided by the total time elapsed.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Total Decoded Frames:</span> This
          represents the total number of video frames that have been decoded.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Total Dropped Frames:</span> This
          represents the total number of video frames that have been dropped and
          not displayed, even though they were decoded.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Decoded Frames:</span> This represents
          the number of video frames decoded in the current session.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Decoded FPS Avg:</span> This
          represents the average frames per second that were decoded.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Current Decoded FPS:</span> This
          represents the current rate of frames per second being decoded.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Dropped Frames:</span> This represents
          the number of frames that were dropped in the current session.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Dropped FPS Avg:</span> This
          represents the average frames per second that were dropped.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Current Dropped FPS:</span> This
          represents the current rate of frames per second being dropped.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Video Width:</span> The width of the
          video in pixels.
        </li>
        <li className={`mb-2 text-sm ${textClassName}`}>
          <span className="font-semibold">Video Height:</span> The height of the
          video in pixels.
        </li>
      </ul>
      <p className={`mt-4 text-sm ${textClassName}`}>
        Both{" "}
        <a
          className="font-semibold text-blue-600"
          href="https://wicg.github.io/video-rvfc/"
          target="_blank"
          rel="noreferrer"
        >
          requestVideoFrameCallback
        </a>{" "}
        and{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/VideoPlaybackQuality"
          target="_blank"
          rel="noreferrer"
        >
          video.webkit
        </a>{" "}
        are APIs used to get information about a video&apos;s performance, but
        they serve different purposes and provide different types of
        information.
        <div className={`mt-2 ${textClassName}`}>
          <a
            className="font-semibold text-blue-600"
            href="https://wicg.github.io/video-rvfc/"
            target="_blank"
            rel="noreferrer"
          >
            requestVideoFrameCallback
          </a>{" "}
          is a method available on HTMLVideoElement in some modern browsers,
          such as Chrome. It allows a web developer to register a callback that
          will be run whenever a new frame of a video is presented for
          composition. The callback receives an object with details about the
          frame, including the expected display time, the presentation time, and
          the elapsed duration since the last frame. This can be useful for
          synchronizing a web application with the frame rate of a video, for
          instance to render annotations, effects, or other visual content in
          sync with the video.
        </div>
        <div className={`mt-2 ${textClassName}`}>
          <a
            className="font-semibold text-blue-600"
            href="https://developer.mozilla.org/en-US/docs/Web/API/VideoPlaybackQuality/totalVideoFrames"
            target="_blank"
            rel="noreferrer"
          >
            webkitDecodedFrameCount
          </a>
          , property (part of the{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/VideoPlaybackQuality"
            target="_blank"
            rel="noreferrer"
          >
            video.webkit
          </a>
          properties) gives the total number of video frames that have been
          decoded. This includes frames that have been dropped and not
          displayed, as well as frames that were presented for display. This can
          be useful for getting an overview of the video decoding performance,
          for instance to see if frames are being dropped due to performance
          issues.
        </div>
        <div className={`mt-2 ${textClassName}`}>
          In summary,{" "}
          <a
            className="font-semibold text-blue-600"
            href="https://wicg.github.io/video-rvfc/"
            target="_blank"
            rel="noreferrer"
          >
            requestVideoFrameCallback
          </a>{" "}
          provides real-time, per-frame information and is useful for
          applications that need to synchronize with the video&apos;s frame
          rate, while{" "}
          <a
            className="font-semibold text-blue-600"
            href="https://developer.mozilla.org/en-US/docs/Web/API/VideoPlaybackQuality/totalVideoFrames"
            target="_blank"
            rel="noreferrer"
          >
            webkitDecodedFrameCount
          </a>{" "}
          provides cumulative stats about the video&apos;s decoding performance.
          The choice between these APIs depends on the specific needs of your
          application.
        </div>
      </p>
    </div>
  );
};

export default Help;
