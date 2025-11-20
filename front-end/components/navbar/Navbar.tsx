import { Platform, StyleSheet } from "react-native";
export const Navbar = () => {
  const isWeb = Platform.OS === "web" ;
  return (

    <div  className="">
      
      <div className={isWeb ? "flex flex-row justify-around items-center":" flex flex-col mx-auto"}>
        <a href="/(tabs)/index">Accueil</a>
        <a href="#about" className="ml-4">A propos</a>
        <a href="/(tabs)/projets" className="ml-4">Projets</a>
        <a href="/(tabs)/blog" className="ml-4">Competences</a>
        <a href="/(tabs)/profile" className="ml-4">Contact</a>

      </div>
    </div>
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
