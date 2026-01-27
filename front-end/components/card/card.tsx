import { Text, View } from "react-native";

export default function Card({ title, description }: { title: string; description: string }) {
  return (
    <View className="border border-gray-300 rounded-lg p-6  m-4  w-64 h-48 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Text className="text-[16px] font-bold mb-2">{title}</Text>
      <Text className="text-gray-600">{description}</Text>
    </View>
  );
}