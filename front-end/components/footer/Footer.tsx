import { Text, View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../app/Context/Theme/Theme";
export default function Footer() {
    const currentYear = new Date().getFullYear();
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("Footer component must be used within a ThemeProvider");
    }
    const { theme } = context;
  return (
    <>
        <View className={`w-full h-20  justify-center items-center ${theme === "dark" ? "border-t border-gray-700" : "border-t border-gray-200"}`}>
          <Text className={`${theme === "dark" ? "text-white" : "text-gray-600"} text-center text-sm`}>
            © {currentYear} Aurélien Fabre. Tous droits réservés.
          </Text>
        </View>
    </>
  );
}