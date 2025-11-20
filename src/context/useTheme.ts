import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleTheme, setPrimaryColor, setTheme } from "../store/themeSlice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.theme.theme);
  const primaryColor = useSelector((s: RootState) => s.theme.primaryColor);
  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
    primaryColor,
    setPrimaryColor: (c: string) => dispatch(setPrimaryColor(c)),
    setTheme: (m: "light" | "dark") => dispatch(setTheme(m)),
  };
};