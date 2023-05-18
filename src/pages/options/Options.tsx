/**
 * Author: Chandra Kishore Danduri
 */
import React from "react";
import "@pages/options/Options.css";
import FileUploader from "./FileUploader";
import { Header, ThemeProvider } from "./Header";

const Options: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="w-screen">
        <Header />
        <FileUploader />
      </div>
    </ThemeProvider>
  );
};

export default Options;
