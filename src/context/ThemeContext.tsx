import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useSelector((s: RootState) => s.theme.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);
  return <>{children}</>;
};