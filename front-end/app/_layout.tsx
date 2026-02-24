import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { GlobalErrorBoundary } from "../components/GlobalErrorBoundary";
export const unstable_settings = {
  anchor: "(tabs)",
};
import { ThemeContext } from "./Context/Theme/Theme";
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <GlobalErrorBoundary>
      
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        
      </GlobalErrorBoundary>
    </>
  );
}
