import { Platform, StyleSheet, View, Text } from "react-native";
import { useState } from "react";
export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  }
  return (
    <View className="">
         <View className="mr-auto text-bold text-lg bg-white p-4 md:ml-5 w-full items-center ">
          <Text>Portfolio</Text>
        </View>
      <View
        className={
          "bg-white flex flex-row items-center md:flex md:flex-row md:justify-end md:mr-5 md:items-center p-4 md:text-[14px] "
        }
      >
     
        <View className="flex flex-row items-center ">
          {/* creer un menu burger pour les petits ecrans */}
          {Platform.OS === "web" && window.innerWidth < 768 ? (
            <View className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={handleMenuClick}

              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </View>
          ) : null}
        </View>
        {menuOpen && Platform.OS === "web" && window.innerWidth < 768 ? (
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
          <View className="hidden md:flex md:flex-row md:space-x-6 text-base  ">
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
