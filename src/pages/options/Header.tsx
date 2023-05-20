/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * Author: Chandra Kishore Danduri
 */
import React, { useState, createContext, useContext } from "react";
import "./index.css";
import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import pdfMake from "pdfmake/build/pdfmake";

export const ThemeContext = createContext<{
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}>({
  theme: "light",
  setTheme: () => {},
});

interface props {
  children: any;
}
export const ThemeProvider: React.FC<props> = ({ children }) => {
  const [theme, setTheme] = useState<string>("dark");

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState<boolean>(false);
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const headerClassName =
    theme !== "light" ? "bg-gray-900 text-white" : "bg-gray-900 text-white";

  // Determine the logo based on the current theme
  const logo =
    theme === "light" ? (
      <svg
        className="h-8 w-8 md:h-10 md:w-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ) : (
      <svg
        className="h-8 w-8 md:h-10 md:w-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    // Show loading spinner
    setLoading(true);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdfWidth = 595.28; // A4 pdf page width in points
        const imgWidth = pdfWidth; // set image width to match pdf width
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // adjust image height while maintaining aspect ratio

        const docDefinition = {
          pageSize: {
            width: pdfWidth,
            height: imgHeight, // set page height to match image height
          },
          pageMargins: [0, 0, 0, 0], // remove default margins
          content: [
            {
              table: {
                widths: ["*"],
                heights: [imgHeight], // set cell height to match image height
                body: [
                  [
                    {
                      image: imgData,
                      width: imgWidth,
                      height: imgHeight,
                      alignment: "center",
                      fillColor: "gray", // set cell background color
                    },
                  ],
                ],
              },
              layout: "noBorders", // remove default borders
            },
          ],
        };

        pdfMake.createPdf(docDefinition).open();
        // Hide loading spinner
        setLoading(false);
      })
      .catch((error) => console.error("Oops, something went wrong!", error));
  };

  return (
    <header
      className={`flex items-center justify-between px-10 py-5 shadow-lg transition-all duration-500 ${headerClassName}`}
    >
      <h1 className="text-3xl font-semibold">Cloud Gaming FPS</h1>
      <div className="flex items-center space-x-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={printDocument}
        >
          {loading ? "Generating PDF..." : "Export to PDF"}
        </button>
        <label
          htmlFor="toggle"
          className="flex cursor-pointer items-center space-x-2"
        >
          <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
            <input
              type="checkbox"
              id="toggle"
              checked={theme === "dark"}
              onChange={toggleTheme}
              className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white"
            />
            <label
              className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300"
              htmlFor="toggle"
            ></label>
          </div>
          {logo}
        </label>
      </div>
    </header>
  );
};
