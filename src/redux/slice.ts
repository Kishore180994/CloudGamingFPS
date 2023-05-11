import { createSlice } from "@reduxjs/toolkit";

export interface ExtendedVideoElement extends HTMLVideoElement {
  webkitDecodedFrameCount?: number;
  webkitDroppedFrameCount?: number;
}

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

interface settingsInterface {
  videoElement: ExtendedVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  webKit: VideoStats;
  pinned: boolean;
}
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
