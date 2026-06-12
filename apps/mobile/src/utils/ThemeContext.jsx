import { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme, Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext({
  isDark: false,
  themeMode: "system",
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState("system");

  useEffect(() => {
    AsyncStorage.getItem("themeMode").then((saved) => {
      if (saved) {
        setThemeModeState(saved);
        if (saved === "dark") Appearance.setColorScheme("dark");
        else if (saved === "light") Appearance.setColorScheme("light");
        else Appearance.setColorScheme(null);
      }
    });
  }, []);

  const setThemeMode = async (mode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem("themeMode", mode);
    if (mode === "dark") Appearance.setColorScheme("dark");
    else if (mode === "light") Appearance.setColorScheme("light");
    else Appearance.setColorScheme(null); // back to system
  };

  const isDark =
    themeMode === "dark"
      ? true
      : themeMode === "light"
        ? false
        : systemColorScheme === "dark";

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
