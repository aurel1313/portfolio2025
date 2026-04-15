import { Platform, StyleSheet, View, Text } from "react-native";
import { useState, use, useContext } from "react";
import { Moon, Sun } from "lucide-react-native";
import { useThemeTransition } from "@/app/Context/Theme/ThemeTransition";
import { useWindowDimensions } from "react-native";
import { MessageCircle } from "lucide-react-native";
export const Navbar = ({openChat, setOpenChat}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
 
  const window = useWindowDimensions();
  const windowsWidth = window.width;
  const { displayedTheme, switchThemeWithAnimation } = useThemeTransition();

  const toggledisplayedTheme = () => {
    setDarkMode(!darkMode);
    switchThemeWithAnimation();
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };
 const MenuMessage = () => {
    setOpenChat(!openChat);
  }

  return (
    <View
      className={`${displayedTheme === "dark" ? "bg-gray-900 text-white hover:text-white" : "bg-white text-gray-800"} `}
    >
      <View
        className={`${displayedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"} flex flex-row items-center md:flex md:flex-row md:justify-end md:mr-5 md:items-center p-4 md:text-[14px] ${menuOpen && "flex-col"} md:flex md:flex-row md:justify-end md:mr-5 md:items-center `}
      >
        <View className={`flex flex-row items-center`}>
          {/* creer un menu burger pour les petits ecrans */}
          {Platform.OS === "web" && windowsWidth < 768 ? (
            <View className="flex flex-row items-center justify-between w-full">
              <Text
                className={`text-2xl font-bold m-2 ${displayedTheme === "dark" ? "text-white justify-self-start" : "text-gray-800"}`}
              >
                Portfolio
              </Text>
               
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 "
                onClick={handleMenuClick}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
               
              <View className="ml-4 cursor-pointer">
                {darkMode ? (
                  <Sun size={20} onPress={toggledisplayedTheme} />
                ) : (
                  <Moon size={20} onPress={toggledisplayedTheme} />
                )}
              </View>
            
            </View>
            
          ) : null}
        </View>
        {menuOpen && Platform.OS === "web" && window.width < 768 ? (
          <View className="flex flex-row md:flex-row md:space-x-6 text-sm  ">
   

            <a href="#home">Accueil</a>
            <a href="#about" className="ml-4">
              A propos
            </a>
            <a href="#projects" className="ml-4">
              Projets
            </a>
            <a href="#skills" className="ml-4">
              Competences
            </a>
            <a href="#contact" className="ml-4">
              Contact
            </a>
          </View>
        ) : (
          <View
            className={`hidden md:flex md:flex-row md:space-x-6 text-base ${displayedTheme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            <a href="#home">Accueil</a>
            <a href="#about" className="ml-4">
              A propos
            </a>
            <a href="#projects" className="ml-4">
              Projets
            </a>
            <a href="#skills" className="ml-4">
              Competences
            </a>
            <a href="#contact" className="ml-4">
              Contact
            </a>

            <View className="ml-4 cursor-pointer">
              {darkMode ? (
                <Sun size={20} onPress={toggledisplayedTheme} />
              ) : (
                <Moon size={20} onPress={toggledisplayedTheme} />
              )}
            </View>
                <MessageCircle size={20} className="ml-4 cursor-pointer" onPress={MenuMessage} />
          </View>
        )}

        <View className="border-b-2 border-gray-200 "></View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "row",

    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 40,
  },
});
