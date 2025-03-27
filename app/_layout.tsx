import { Stack } from "expo-router";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  IconButton,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import { useMemo, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { EventEmitter } from "events";

const THEME_KEY = "@theme_preference";
export const themeEmitter = new EventEmitter();

// Custom theme configurations
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#006D77",
    secondary: "#83C5BE",
    background: "#FFFFFF",
    surface: "#F8F9FA",
    elevation: {
      level2: "#FFFFFF",
      level3: "#F8F9FA",
    },
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#83C5BE",
    secondary: "#006D77",
    background: "#121212",
    surface: "#1E1E1E",
    elevation: {
      level2: "#1E1E1E",
      level3: "#2D2D2D",
    },
  },
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [isCustomDark, setIsCustomDark] = useState<boolean | null>(null);

  const toggleTheme = useCallback(() => {
    const newTheme = !isCustomDark;
    setIsCustomDark(newTheme);
    AsyncStorage.setItem(THEME_KEY, newTheme ? "dark" : "light");
  }, [isCustomDark]);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((value) => {
      setIsCustomDark(value === "dark");
    });

    const handleThemeToggle = () => {
      toggleTheme();
    };

    themeEmitter.addListener("toggleTheme", handleThemeToggle);
    return () => {
      themeEmitter.removeListener("toggleTheme", handleThemeToggle);
    };
  }, [toggleTheme]);

  const theme = useMemo(() => {
    if (isCustomDark === null) {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return isCustomDark ? darkTheme : lightTheme;
  }, [isCustomDark, systemColorScheme]);

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PaperProvider>
  );
}
