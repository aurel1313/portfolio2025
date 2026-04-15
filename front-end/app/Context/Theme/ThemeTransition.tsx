import React, { createContext, useContext, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { ThemeContext } from "@/app/Context/Theme/Theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ThemeTransitionContext = createContext<any>(null);

export const useThemeTransition = () => useContext(ThemeTransitionContext);

export const ThemeTransitionProvider = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [displayedTheme, setDisplayedTheme] = useState(theme);
  const progress = useSharedValue(0);

  const switchThemeWithAnimation = () => {
    // Descend le rideau
    progress.value = withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }, () => {
      // ⚡ Changer le thème **pendant que le rideau couvre tout**
      const nextTheme = theme === "dark" ? "light" : "dark";
      setDisplayedTheme(nextTheme);
      toggleTheme();

      // Remonte le rideau
      progress.value = withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) });
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: -SCREEN_HEIGHT + progress.value * SCREEN_HEIGHT,
      },
    ],
    backgroundColor:
      displayedTheme === "dark"
        ? "rgba(0,0,0,0.9)"
        : "rgba(255,255,255,0.9)",
  }));

  return (
    <ThemeTransitionContext.Provider
      value={{ displayedTheme, switchThemeWithAnimation }}
    >
      {children}

      {/* Overlay global */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { zIndex: 999 }, animatedStyle]}
      />
    </ThemeTransitionContext.Provider>
  );
};