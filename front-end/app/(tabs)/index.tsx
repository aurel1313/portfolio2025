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
import { use, useState } from "react";
import Modal from "@/components/modal/Modal";
export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  //timeout for 3 seconds
  setTimeout(() => {
    setLoading(true);
  }, 3000);
  const { width } = useWindowDimensions();

  // Largeur auto : 80% de l'écran, max 320px
  const cardWidth = Math.min(width * 0.8, 320);
  const cardHeight = cardWidth * 0.7;
  return (
    <View className="flex flex-col z-0 overflow-scroll h-full  bg-white ">
      {!loading && (
        <View className=" fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50 overflow-auto ">
          <Modal
            content="le site est en cours de construction...."
            className=" "
          />
        </View>
      )}
      <View className="flex flex-row  bg-white justify-around h-1/2 max-sm:flex-col max-sm:items-center max-sm:h-auto  max-sm:text-no  ">
        <View className=" flex  flex-col items-start p-10  max-sm:items-center max-sm:text-center max-sm:p-4 max-sm-w-full  "> 
          <Text className="text-xl font-thin poppins-light leading-tight ">
            Bonjour, je suis{"\n"}
            <Text>Aurélien Fabre</Text>
          </Text>

          <View className="w-1/2 h-auto max-sm:w-1/4  ">
            <View>
              <Text className="text-gray-900 font-sans text-[16px] dark:text-gray-400 mt-2 max-sm:text-pretty max-sm:w-auto mx-auto">
                Développeur Full-Stack passionné par la création d'expériences
                numériques exceptionnelles. Spécialisé dans les technologies
                modernes et le design centré utilisateur.
              </Text>
            </View>
          </View>
        </View>
        {
          <View className="relative p-4    max-sm:mt-0 max-sm:mb-0 max-sm:p-0 max max-sm:flex max-sm:justify-center max-sm:items-center ">
            <View className=" absolute top-2 left-2 w-80 h-56 bg-white rounded-xl shadow-md transform -rotate-3  max-sm:absolute max-sm:mr-10    " />

            <View className="w-80 h-56 bg-white rounded-xl shadow-lg overflow-hidden transform rotate-1 hover:scale-105 transition-transform duration-300 ease-in-out  ">
              <Image
                source={require("../../assets/images/aurelien-fabre.jpg")}
                className="w-full h-full object-cover "
                contentFit="cover"
              />
            </View>
          </View>
        }
      </View>
      <AboutScreen />
      <BotScreen />
      <AvisScreen />

      <View />
    </View>
  );
}
