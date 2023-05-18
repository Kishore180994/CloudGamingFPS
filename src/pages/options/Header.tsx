/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * Author: Chandra Kishore Danduri
 */
import React, { useState, createContext, useContext } from "react";

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

  return (
    <header
      className={`flex items-center justify-between transition-colors duration-500  ${headerClassName} p-4`}
    >
      <h1 className="text-2xl font-semibold">Cloud Gaming FPS</h1>
      <div className="flex items-center space-x-2">
        <label htmlFor="toggle" className="cursor-pointer">
          {logo}
        </label>
        <input
          type="checkbox"
          id="toggle"
          checked={theme === "dark"}
          onChange={toggleTheme}
          className="sr-only"
        />
      </div>
    </header>
  );
};
