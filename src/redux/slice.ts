/**
 * Author: Chandra Kishore Danduri
 */
import { createSlice } from "@reduxjs/toolkit";

/* `export interface ExtendedVideoElement extends HTMLVideoElement` is defining a new interface
`ExtendedVideoElement` that extends the `HTMLVideoElement` interface. This means that
`ExtendedVideoElement` inherits all the properties and methods of `HTMLVideoElement`. Additionally,
`ExtendedVideoElement` has two optional properties `webkitDecodedFrameCount` and
`webkitDroppedFrameCount` of type `number`. These properties are specific to the WebKit browser
engine and are used to track the number of frames that have been decoded and dropped during video
playback. */
export interface ExtendedVideoElement extends HTMLVideoElement {
  webkitDecodedFrameCount?: number;
  webkitDroppedFrameCount?: number;
}

/**
 * The above type defines the properties and their types for video statistics.
 * @property {number} decodedFrames - The number of frames that have been successfully decoded by the
 * video player.
 * @property {string} decodedFPSAvg - `decodedFPSAvg` is a string property that represents the average
 * number of frames per second that have been decoded by the video player. This value is calculated by
 * dividing the total number of decoded frames by the total duration of the video.
 * @property {string} currentDecodedFPS - `currentDecodedFPS` is a string property that represents the
 * current frames per second (FPS) at which the video is being decoded. It is a measure of how many
 * frames are being processed by the decoder in one second.
 * @property {number} droppedFrames - The "droppedFrames" property in the "VideoStats" type represents
 * the number of frames that were dropped during video playback. This can happen when the video player
 * is unable to keep up with the frame rate of the video, resulting in some frames being skipped or
 * dropped. The value of this property
 * @property {string} droppedFPSAvg - `droppedFPSAvg` is a string property that represents the average
 * number of frames per second that have been dropped during video playback. This can be useful in
 * determining the overall performance of the video playback and identifying any potential issues or
 * bottlenecks.
 * @property {string} currentDroppedFPS - `currentDroppedFPS` is a property in the `VideoStats` type
 * that represents the current dropped frames per second (FPS) of a video. This value is updated in
 * real-time as the video is being played.
 * @property {number} videoWidth - The width of the video in pixels.
 * @property {number} videoHeight - The height of the video in pixels.
 */
export type VideoStats = {
  decodedFrames: number;
  decodedFPSAvg: string;
  currentDecodedFPS: string;
  droppedFrames: number;
  droppedFPSAvg: string;
  currentDroppedFPS: string;
  videoWidth: number;
  videoHeight: number;
};

/* The `interface settingsInterface` is defining a TypeScript interface that describes the shape of an
object that has four properties: `videoElement`, `canvasElement`, `webKit`, and `pinned`. */
interface settingsInterface {
  videoElement: ExtendedVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  webKit: VideoStats;
  pinned: boolean;
}
/* This code is defining an initial state object for a Redux slice named "settings". The object has
four properties: `videoElement`, `canvasElement`, `pinned`, and `webKit`. `videoElement` and
`canvasElement` are initially set to `null`, `pinned` is initially set to `false`, and `webKit` is
an object with several properties related to video playback statistics, all initially set to `0` or
`"0"`. This initial state object will be used by the `createSlice` function to create a Redux slice
with the same name and initial state. */
const settings: settingsInterface = {
  videoElement: null,
  canvasElement: null,
  pinned: false,
  webKit: {
    decodedFrames: 0,
    decodedFPSAvg: "0",
    currentDecodedFPS: "0",
    droppedFrames: 0,
    droppedFPSAvg: "0",
    currentDroppedFPS: "0",
    videoWidth: 0,
    videoHeight: 0,
  },
};

/* This code is creating a Redux slice using the `createSlice` function from the `@reduxjs/toolkit`
library. The slice is named "settings" and has an initial state defined by the `settings` object.
The slice also has four reducer functions (`sliceSetVideoElement`, `sliceSetWebKit`,
`sliceSetCanvasElement`, and `sliceSetPinned`) that can be used to update the state in response to
actions dispatched to the Redux store. Each reducer function takes the current state and an action
object as arguments, and returns a new state object that reflects the changes made by the action. */
const settingsSlice = createSlice({
  name: "settings",
  initialState: settings,
  reducers: {
    sliceSetVideoElement: (state, action) => {
      return {
        ...state,
        videoElement: action.payload,
      };
    },
    sliceSetWebKit: (state, action) => {
      return { ...state, webKit: action.payload };
    },
    sliceSetCanvasElement: (state, action) => {
      return {
        ...state,
        canvasElement: action.payload,
      };
    },
    sliceSetPinned: (state, action) => {
      return { ...state, pinned: action.payload };
    },
  },
});

export const {
  sliceSetVideoElement,
  sliceSetCanvasElement,
  sliceSetWebKit,
  sliceSetPinned,
} = settingsSlice.actions;
export default settingsSlice.reducer;
