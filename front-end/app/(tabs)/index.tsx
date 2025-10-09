import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import AboutScreen from "./about";
import BotScreen from "../views/bot/bot";
export default function HomeScreen() {
  return (
    <View className="flex flex-col z-0 overflow-scroll h-full  bg-white ">
      <div className="flex flex-row  bg-white justify-around h-1/2 ">
        <div className=" flex  flex-col items-start p-10   ">
          <Text className="text-xl font-thin poppins-light leading-tight">
            Bonjour, je suis{"\n"}
            <Text>Aurélien Fabre</Text>
          </Text>

          <section className="w-1/2 h-auto  ">
            <div className="text-gray-900 font-sans text-[16px] dark:text-gray-400 mt-2">
              Développeur Full-Stack passionné par la création d'expériences
              numériques exceptionnelles. Spécialisé dans les technologies
              modernes et le design centré utilisateur.
            </div>
          </section>
        </div>
        <View className="relative p-4 ">
          {/* Carte du dessous */}
          <View className="absolute top-2 left-2 w-80 h-56 bg-white rounded-xl shadow-md transform -rotate-3  " />

          {/* Carte au-dessus */}
          <View className="w-80 h-56 bg-white rounded-xl shadow-lg overflow-hidden transform rotate-1 hover:scale-105 transition-transform duration-300 ease-in-out">
            <Image
              source={require("../../assets/images/aurelien-fabre.jpg")}
              className="w-full h-full object-cover"
              contentFit="cover"
            />
          </View>
        </View>
      </div>
      <AboutScreen />
      <BotScreen />
    <View/>
    </View>
  );
}
