import { Text, View } from "react-native";
import { useContext } from "react";
import { useThemeTransition } from "@/app/Context/Theme/ThemeTransition";
export default function Card({ title, description }: { title: string; description: string }) {
  const { displayedTheme } = useThemeTransition();
  if (!displayedTheme) {
    throw new Error("Card component must be used within a displayedThemeProvider");
  }

  return (
    <View className={`border border-gray-300 rounded-lg p-6  m-4  w-64 h-48 shadow-lg hover:shadow-xl transition-shadow duration-300 ${displayedTheme === 'dark' ? 'bg-zinc-900 border-gray-600' : 'bg-white'}`}>
      <Text className={`text-[16px] font-bold mb-2 ${displayedTheme === 'dark' ? 'text-white' : 'text-black'}`}>{title}</Text>
      <Text className={`text-gray-600 ${displayedTheme === 'dark' ? 'text-white' : ''}`}>{description}</Text>
    </View>
  );
}