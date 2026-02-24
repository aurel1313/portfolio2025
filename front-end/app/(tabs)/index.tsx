import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";
import AboutScreen from "./about";
import BotScreen from "../views/bot/bot";
import AvisScreen from "../views/avis/avis";
import { use, useState, useEffect, useContext } from "react";
import Modal from "@/components/modal/Modal";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withDelay,
} from "react-native-reanimated";
import Contact from "../views/contact/contact";
import Footer from "@/components/footer/Footer";
import { ThemeContext } from "../../app/Context/Theme/Theme";
import '../../global.css';
export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  //timeout for 3 seconds
  setTimeout(() => {
    setLoading(true);
  }, 3000);
  const rawText = `Développeur Full-Stack passionné par la création d'expériences numériques exceptionnelles. Spécialisé dans les technologies modernes et le design centré utilisateur.`;
  // Using \s+ handles all whitespace (tabs, newlines, multiple spaces) turning them into a single space
  const pres = rawText.replace(/\s+/g, " ").trim();

  // Split by words first to control spacing and wrapping
  const words = pres.split(" ");

  // Track global index for the animation delay
  let globalCharIndex = 0;

  const { width } = useWindowDimensions();

  // Largeur auto : 80% de l'écran, max 320px
  const cardWidth = Math.min(width * 0.8, 320);

  const AnimatedLetter = ({
    char,
    index,
    totalIndex,
  }: {
    char: string;
    index: number;
    totalIndex: number;
  }) => {
    const color = useSharedValue("grey");
    const colorDarkMode = useSharedValue("violet");
    const animatedStyle = useAnimatedStyle(() => ({
      //color: color.value,
      fontSize: 16,
      fontWeight: "500",
      color: theme === "dark" ? colorDarkMode.value : color.value,
    }));

    useEffect(() => {
      // Delay based on the global index (totalIndex) to keep the wave effect consistent
      color.value = withDelay(
        totalIndex * 50, // Reduced delay for smoother wave
        withRepeat(withTiming("#000000", { duration: 500 }), -1, true),
      );
      colorDarkMode.value = withDelay(
        totalIndex * 50, // Same delay for dark mode color
        withRepeat(withTiming("white", { duration: 500 }), -1, true),
      );
    }, []);

    return <Animated.Text style={animatedStyle}>{char}</Animated.Text>;
  };
  let globaCharIndex = 0;
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeSwitcher must be used within a ThemeProvider");
  }
  const { theme, toggleTheme } = context;
  return (
    <View
      className={`flex flex-col z-0 overflow-scroll h-full   ${theme === "dark" ? "bg-gray-900 text-white" : " bg-white"} `}
    >
      <View
        className={`
     
    p-4
    flex
    flex-col
    items-center
    md:flex-row
    md:items-center
    md:justify-center
    md:mx-auto
    md:mt-10
    md:mb-10
    
   `}
      >
        {/* ===== TEXTE ===== */}
        <View className="w-1/2 md:w-1/3 flex flex-col items-center justify-center  max-sm:items-center max-sm:text-center max-sm:w-full">
          <Text
            className={`${theme === "dark" ? "text-white" : "text-black"}  text-2xl font-bold mb-4  `}
          >
            Bonjour, je suis Aurélien Fabre
          </Text>

          <View className=" flex md:items-center">
            <View
              className="
         
          flex-row
          flex-wrap
          mt-4
          justify-start
          md:justify-center
        "
            >
              {words.map((word, wordIndex) => (
                <View key={wordIndex} className="flex-row items-end">
                  {word.split("").map((char, charIndex) => {
                    const currentIndex = globaCharIndex++;
                    return (
                      <AnimatedLetter
                        key={`${wordIndex}-${charIndex}`}
                        char={char}
                        index={charIndex}
                        totalIndex={currentIndex}
                      />
                    );
                  })}

                  {/* espace entre les mots */}
                  <Text className="text-base"> </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ===== IMAGE ===== */}
        <View className="relative p-4">
          {/* carte derrière */}
          <View
            className={`absolute top-2 left-2 w-64 h-48 ${theme === "dark" ? "" : ""} rounded-xl shadow-md transform -rotate-3`}
          />

          {/* image principale */}
          <View
            className="
        w-64
        h-48
        test
        
          rounded-xl
        
      
       
        shadow-lg
        overflow-hidden
        transform
        rotate-1
        hover:scale-105
        transition-transform
        duration-300
        ease-in-out
      "
          >
            <Image
              source={require("../../assets/images/aurelien-fabre.jpg")}
              className="w-full h-full object-cover"
              contentFit="cover"
            />
          </View>
        </View>
      </View>
      <View className="  w-full h-auto mt-10   flex flex-col   items-center   ">
        <AboutScreen />
        <BotScreen />
        <AvisScreen />
        <Contact />
      </View>
      <Footer />
      <View />
    </View>
  );
}
