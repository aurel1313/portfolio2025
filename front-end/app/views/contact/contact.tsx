import { Pressable, Text, TextInput, View } from "react-native";
import { Building, Github, Mail, Phone, Linkedin } from "lucide-react-native";
import { Link } from "expo-router";
import { useActionState } from "react";
import { useForm, Controller } from "react-hook-form";
import { BASE_URL } from "@/utils/utils";
import { useState } from "react";
import { ThemeContext } from "@/app/Context/Theme/Theme";
import { useContext } from "react";
import { useThemeTransition } from "@/app/Context/Theme/ThemeTransition";
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export default function Contact() {
  const [messageSend, setMessageSend] = useState<string>("");
  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
    const res = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await res.json();
    if (res.ok) {
      setMessageSend(content.message);
    } else {
      throw new Error(
        content.message ||
          "Une erreur est survenue lors de l'envoi du message.",
      );
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { displayedTheme } = useThemeTransition();
  if (!displayedTheme) {
    throw new Error("Contact component must be used within a displayedThemeProvider");
  }
  return (
    <>
      <View
        id="contact"
        className={`w-full  my-10 p-10 ${displayedTheme === "dark" ? "bg-gray-900" : "bg-white"} `}
      >
        {/* TITRE */}
        <Text
          className={`font-bold text-xl text-center mb-6 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
        >
          Contacter-moi
        </Text>

        {/* LAYOUT PRINCIPAL */}
        <View className="flex w-full flex-row items-start justify-center gap-20 max-sm:flex-col max-sm:items-center max-sm:justify-center ">
        <View className="flex w-1/2  flex-col items-center     md:flex md:items-start md:justify-start md:flex-row md:gap-20  max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-center ">
          {/* INFOS CONTACT */}
          <View className="w-auto flex flex-col items-center gap-6 mb-10 md:mb-0">
            <View className="flex flex-col place-items-center">
              <Text
                className={`text-lg font-semibold mb-4 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
              >
                Informations de contact
              </Text>

              <View className="flex flex-row   gap-2 mb-3">
                <Phone size={20} />
                <Text
                  className={`${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  06 59 92 51 96
                </Text>
              </View>

              <View className="flex flex-row items-center gap-2 mb-3">
                <Mail size={20} />
                <Text
                  className={`${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  aurelienfabre439@gmail.com
                </Text>
              </View>

              <View className="flex flex-row items-center gap-2 mb-3">
                <Building size={20} />
                <Text
                  className={`${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  Aiffres, France
                </Text>
              </View>
            </View>
            <View className="mt-2  flex flex-col place-items-center gap-4 md:flex md:flex-row">
              <View className="border border-gray-200 rounded-md p-2 w-fit">
                <Link href="https://github.com/aurel1313">
                  <Github
                    size={22}
                    className={`${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                  />
                </Link>
              </View>
              <View className="border border-gray-200 rounded-md p-2 w-fit ">
                <Link href="https://www.linkedin.com/in/aurelien-fabre/">
                  <Linkedin
                    size={22}
                    className={`${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                  />
                </Link>
              </View>
            </View>
          </View>

          {/* FORMULAIRE */}
          <View
            className={`mx-auto w-1/2   border  ${displayedTheme === "dark" ? "border-gray-700" : "border-gray-200"} rounded-md `}
          >
            <View className="p-4">
              <Text
                className={`font-medium text-base mb-4 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
              >
                Envoyez-moi un message :
              </Text>

              {/* NOM + EMAIL */}

              {/* NOM */}
              <View className="flex flex-col w-full ">
                <Text
                  className={`mb-1 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  Nom
                </Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-md p-2 w-full"
                      placeholder="Votre nom"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>

              {/* EMAIL */}
              <View className="flex flex-col w-full">
                <Text
                  className={`mb-1 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  Email
                </Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Adresse email invalide",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-md p-2 w-full"
                      placeholder="Votre email"
                      autoComplete="email"
                      onChangeText={onChange}
                      value={value ?? ""}
                    />
                  )}
                />
                {errors?.email && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* SUJET */}
              <View className="mt-4">
                <Text
                  className={`mb-1 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  Sujet
                </Text>
                <Controller
                  control={control}
                  name="subject"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-md p-2 w-full"
                      placeholder="Sujet du message"
                      onChangeText={onChange}
                      value={value ?? ""}
                    />
                  )}
                />
              </View>

              {/* MESSAGE */}
              <View className="mt-4">
                <Text
                  className={`mb-1 ${displayedTheme === "dark" ? "text-white" : "text-black"}`}
                >
                  Message
                </Text>
                <Controller
                  control={control}
                  name="message"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100  rounded-md p-2 w-full h-32"
                      placeholder="Votre message"
                      multiline
                      onChangeText={onChange}
                      value={value ?? ""}
                    />
                  )}
                />
              </View>

              {/* MESSAGE SUCCÈS */}
              {messageSend !== "" && (
                <Text className="text-green-500 mt-3">{messageSend}</Text>
              )}

              {/* BOUTON */}
              <Pressable
                className={`mt-4  rounded-md p-3 items-center  ${displayedTheme === "dark" ? "bg-black" : "bg-gray-300"} ${
                  !isValid ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
              >
                <Text
                  className={`${displayedTheme === "dark" ? "text-white  " : "text-black"} font-bold`}
                >
                  Envoyer le message
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        </View>
      </View>
    </>
  );
}
