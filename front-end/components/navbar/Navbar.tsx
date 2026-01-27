import { Platform, StyleSheet, View,Text } from "react-native";
export const Navbar = () => {

  return (

    <View  className="">
      
      <View className={ "bg-white flex flex-row justify-end mr-5 items-center p-4 max-sm:text-[14px] " } >
        <View className="mr-auto text-bold text-lg  ">
        <Text>Portfolio</Text>
        </View>
        <a href="#home">Accueil</a>
        <a href="#about" className="ml-4">A propos</a>
        <a href="#projects" className="ml-4">Projets</a>
        <a href="#skills" className="ml-4">Competences</a>
        <a href="#contact" className="ml-4">Contact</a>

      </View>
      <View className="border-b-2 border-gray-200 "></View>
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
