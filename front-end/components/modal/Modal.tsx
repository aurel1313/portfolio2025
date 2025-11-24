import { Text, View } from "react-native";

type Props = {
  content: string;
  className?: string;
};

export default function Modal({ content, className }: Props) {
  return (
    <View className={className}>
      <View>
        <Text className="text-gray-500 font-sans text-xl text-wrap w-1/2 p-4">
          {content}
        </Text>
      </View>
      <View></View>
    </View>
  );
}
