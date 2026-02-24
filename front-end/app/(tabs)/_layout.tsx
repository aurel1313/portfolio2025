import { Stack, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

import { Platform } from "react-native";
import { Navbar } from "@/components/navbar/Navbar";
import "../../global.css";
import Banner from "@/components/banner/banner";

import { ThemeProvider } from "../Context/Theme/Theme";
export default function TabLayout() {
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
  return (
    <>
      <ThemeProvider value={"light"}>
        {isMobile ? (
          <Tabs
            screenOptions={{
              //tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
              headerShown: false,
              tabBarButton: HapticTab,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="house.fill" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="explore"
              options={{
                title: "Explore",
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name="paperplane.fill" color={color} />
                ),
              }}
            />
          </Tabs>
        ) : (
          <>
            <Banner text="Le site est en cours de construction" />
            <Navbar />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </>
        )}
      </ThemeProvider>
    </>
  );
}
