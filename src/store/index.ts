import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

store.subscribe(() => {
  const s = store.getState();
  const mode = s.theme.theme;
  const color = s.theme.primaryColor;
  try {
    localStorage.setItem("theme", mode);
    localStorage.setItem("primaryColor", color);
  } catch {
    void 0;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;