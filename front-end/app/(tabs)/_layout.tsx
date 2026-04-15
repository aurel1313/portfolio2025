import { Stack, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/displayedTheme";

import { Platform, View } from "react-native";
import { Navbar } from "@/components/navbar/Navbar";
import "../../global.css";
import Banner from "@/components/banner/banner";
import { ThemeTransitionProvider } from "../Context/Theme/ThemeTransition";
import { ThemeProvider } from "../Context/Theme/Theme";
import Messages from "./messages";
import { useState } from "react";
export default function TabLayout() {
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
    const [openChat, setOpenChat] = useState(false);
  return (
   <ThemeProvider value={"light"}>
    <ThemeTransitionProvider>
      {isMobile ? (
        <Tabs screenOptions={{ headerShown: false, tabBarButton: HapticTab }}>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          {/* Assurez-vous que 'explore' existe bien dans vos fichiers sinon cela fera une erreur */}
          <Tabs.Screen name="about" options={{ title: "About" }} /> 
        </Tabs>
      ) : (
        <>
          <Banner text="Le site est en cours de construction" />
          <Navbar openChat={openChat} setOpenChat={setOpenChat} />
          
          {/* C'est ici que le contenu de index.tsx ou messages/index.tsx s'affichera */}
          <Stack screenOptions={{ headerShown: false }} />
          {openChat && (
                <View className={`fixed bottom-0 right-0 w-full md:w-[400px] h-[500px] bg-white shadow-lg rounded-lg overflow-hidden z-50`}>
                  <Messages />
                </View>
              )}
        </>
      )}
    </ThemeTransitionProvider>
  </ThemeProvider>
);
    
}
