import { Text, View } from "react-native";
export default function Footer() {
    const currentYear = new Date().getFullYear();
  return (
    <>
        <View className="w-full h-20 bg-gray-50 justify-center items-center">
          <Text className="text-gray-600">
            © {currentYear} Aurélien Fabre. Tous droits réservés.
          </Text>
        </View>
    </>
  );
}