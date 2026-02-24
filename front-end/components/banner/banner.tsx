import { use } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withDelay,
  interpolateColor,
} from "react-native-reanimated";
import { useEffect } from "react";
export default function Banner({ text }: { text?: string }) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-width, { duration: 20000 }),
      -1,
      false
    );
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(translateX.value, [0, width], ["white", "#888888"]),
    transform: [{ translateX: translateX.value }],
   
  }));

  return (
    <>
      <View className=" h-10 "></View>
      <View className=" fixed top-0 w-full bg-gradient-to-r from-black to-white  py-3 px-4 text-center z-50">
        <Animated.Text
          className="text-sm font-medium text-center  absolute "
          style={[{ fontWeight: "bold" }, animatedStyle]}
        >
          {text}
        </Animated.Text>
      </View>
    </>
  );
}
