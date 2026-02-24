import { Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../app/Context/Theme/Theme";
export default function Card({ title, description }: { title: string; description: string }) {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("Card component must be used within a ThemeProvider");
  }
  const { theme } = context;
  return (
    <View className={`border border-gray-300 rounded-lg p-6  m-4  w-64 h-48 shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-gray-600' : 'bg-white'}`}>
      <Text className={`text-[16px] font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{title}</Text>
      <Text className={`text-gray-600 ${theme === 'dark' ? 'text-white' : ''}`}>{description}</Text>
    </View>
  );
}