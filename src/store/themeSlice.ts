import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  primaryColor: string;
}

const initialState: ThemeState = {
  theme: (typeof localStorage !== "undefined" && localStorage.getItem("theme") === "dark") ? "dark" : "light",
  primaryColor: (typeof localStorage !== "undefined" && localStorage.getItem("primaryColor")) || "#1677ff",
};

const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setPrimaryColor(state, action: PayloadAction<string>) {
      state.primaryColor = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setPrimaryColor } = slice.actions;
export default slice.reducer;