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
import { use, useState, useEffect } from "react";
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

    const animatedStyle = useAnimatedStyle(() => ({
      color: color.value,
      fontSize: 16,
      fontWeight: "500",
    }));

    useEffect(() => {
      // Delay based on the global index (totalIndex) to keep the wave effect consistent
      color.value = withDelay(
        totalIndex * 50, // Reduced delay for smoother wave
        withRepeat(withTiming("#000000", { duration: 500 }), -1, true)
      );
    }, []);

    return <Animated.Text style={animatedStyle}  >{char}</Animated.Text>;
  };
  let globaCharIndex = 0;
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
  return (
    <View className="flex flex-col z-0 overflow-scroll h-full  bg-white ">
      
      <View className={`flex flex-col items-center mx-auto w-auto  ${isMobile ? 'w-full' : 'w-auto'} bg-white p-4  md:flex-row md:items-center md:justify-center md:p-4  md:mt-10  md:mb-10  `}>
        <View className="  flex  flex-col items-center w-1/2  md:items-center md:text-center md:p-4 md-w-full     ">
          <Text className="text-base font-extrabold poppins-light leading-tight ">
            Bonjour, je suis{"\n"}
            <Text>Aurélien Fabre</Text>
          </Text>

          <View className="  w-full items-center  h-auto md:flex md md:justify-center   ">
            <View className="flex-col justify-center  items-center flex flex-wrap mt-4     md:flex md:flex-row md:flex-wrap md:justify-center md:w-1/2 md:pb-4 md:items-center  ">
              {words.map((word, wordIndex) => {
                return (
                  // Wrap each word in a View to keep letters together so they don't break mid-word
                  <View key={wordIndex} className="flex-row items-end 
                  ">
                    {word.split("").map((char: string, charIndex: number) => {
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
                    {/* SPACE CHARACTER: This adds the necessary gap between words */}
                    <Text className="text-base"> </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        {
          <View className="relative p-4   w-auto      ">
            <View className=" absolute  top-2 left-2 w-80 h-56 bg-white rounded-xl shadow-md transform -rotate-3  max-sm:absolute max-sm:mr-10    " />

            <View className="w-80 h-56 bg-white rounded-xl shadow-lg overflow-hidden transform rotate-1 hover:scale-105 transition-transform duration-300 ease-in-out  ">
              <Image
                source={require("../../assets/images/aurelien-fabre.jpg")}
                className="w-full h-full object-cover  "
                contentFit="cover"
              />
            </View>
          </View>
        }
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
