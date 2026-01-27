import { Pressable, Text, TextInput, View } from "react-native";
import { Building, Github, Mail, Phone,Linkedin } from "lucide-react-native";
import { Link } from "expo-router";
import { useActionState } from "react";
import { useForm, Controller } from "react-hook-form";
import { BASE_URL } from "@/utils/utils";
import { useState } from "react";
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export default function Contact() {
  const [messageSend,setMessageSend] = useState<string>("")
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

  return (
    <>
      <View
      id="contact"
      className="w-full px-4 my-10"
    >
      {/* TITRE */}
      <Text className="font-bold text-xl text-center mb-6">
        Contacter-moi
      </Text>

      {/* LAYOUT PRINCIPAL */}
      <View className="flex flex-col gap-8 md:flex-row md:justify-center  ">
        
        {/* INFOS CONTACT */}
        <View className="w-auto flex items-center   md:w-1/2">
          <Text className="text-lg font-semibold mb-4">
            Informations de contact
          </Text>

          <View className="flex flex-row items-center gap-2 mb-3">
            <Phone size={20} />
            <Text>06 59 92 51 96</Text>
          </View>

          <View className="flex flex-row items-center gap-2 mb-3">
            <Mail size={20} />
            <Text>aurelienfabre439@gmail.com</Text>
          </View>

          <View className="flex flex-row items-center gap-2 mb-3">
            <Building size={20} />
            <Text>Aiffres, France</Text>
          </View>

          <View className="mt-2  flex flex-col place-items-center gap-4 md:flex md:flex-row">
            <View className="border border-gray-200 rounded-md p-2 w-fit">
              <Link href="https://github.com/aurel1313">
                <Github size={22} />
              </Link>
            </View>
            <View className="border border-gray-200 rounded-md p-2 w-fit mt-2">
              <Link href="https://www.linkedin.com/in/aurelien-fabre-4b7245244/">
                <Linkedin size={22} />
              </Link>
            </View>
          </View>
        </View>

        {/* FORMULAIRE */}
        <View className="w-auto h-auto flex  items-center border border-gray-200 rounded-md ">
          <View className="p-4">
            <Text className="font-medium text-base mb-4">
              Envoyez-moi un message :
            </Text>

            {/* NOM + EMAIL */}
        
              {/* NOM */}
              <View className="flex flex-col w-full">
                <Text className="mb-1">Nom</Text>
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
                <Text className="mb-1">Email</Text>
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
              <Text className="mb-1">Sujet</Text>
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
              <Text className="mb-1">Message</Text>
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-gray-100 rounded-md p-2 w-full h-32"
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
              <Text className="text-green-500 mt-3">
                {messageSend}
              </Text>
            )}

            {/* BOUTON */}
            <Pressable
              className={`mt-4 bg-black rounded-md p-3 items-center ${
                !isValid ? "opacity-50" : ""
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              <Text className="text-white font-bold">
                Envoyer le message
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
    </>
  );
}
