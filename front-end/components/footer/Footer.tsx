import { Text, View } from "react-native";
import { useContext } from "react";
import { useThemeTransition } from "@/app/Context/Theme/ThemeTransition";
export default function Footer() {
    const currentYear = new Date().getFullYear();
  
  const { displayedTheme } = useThemeTransition();
  if (!displayedTheme) {
    throw new Error("Footer component must be used within a displayedThemeProvider");
  }
  return (
    <>
        <View className={`w-full h-20  justify-center items-center ${displayedTheme === "dark" ? "border-t border-gray-700" : "border-t border-gray-200"}`}>
          <Text className={`${displayedTheme === "dark" ? "text-white" : "text-gray-600"} text-center text-sm`}>
            © {currentYear} Aurélien Fabre. Tous droits réservés.
          </Text>
        </View>
    </>
  );
}