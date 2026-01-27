import { useForm, SubmitHandler, Controller, set } from "react-hook-form";
import { Button, TextInput, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { BASE_URL } from "@/utils/utils";
import { View } from "react-native";
import { use, useState,useEffect } from "react";

export default function AvisScreen() {
  //espace commentaire  pour les avis des clients
  const [responseMessage, setResponseMessage] =  useState("");
  type Avis = {
    id?: number;
    email: string;
    avis: string;
    createdAt?: string;
  };

  const [error, setError] = useState<string>("");
  const [avisList, setAvisList] = useState<Avis[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; comment: string }>({
    defaultValues: {
      email: "",
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<{ comment: string; email: string }> = async (data) => {
    console.log(data);
    // ici vous pouvez ajouter la logique pour envoyer l'avis au serveur
    const commentData = await fetch(`${BASE_URL}/avis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await commentData.json();
    console.log(result);
    if (result.messageSuccess) {
      setResponseMessage(result.messageSuccess);
    }
    if (result.messageFailed) {
      setError(result.messageFailed);
    }
  }
  const getAvis = async () => {
    const avisData = await fetch(`${BASE_URL}/avis`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const avis = await avisData.json();
    
   setAvisList(avis);
  }
  
  useEffect(() => {
    getAvis();
  }, [responseMessage]);
  return (
    <View className="p-10 flex flex-col items-center w-3/4 justify-center mx-auto">
      <Text className="text-2xl font-bold mb-4 ">Laissez votre avis</Text>
      <Controller
      name="email"
        control={control}
        render={({ field }) => (
          <TextInput
            className="border border-gray-300 rounded-lg p-3 m-4 w-3/4 focus:border-indigo-500 transition duration-150"
            placeholder="Votre email"
            {...field}
           
          />
        )}
      />
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <TextInput
            className="border border-gray-300 rounded-lg p-3 m-4 w-3/4 focus:border-indigo-500 transition duration-150"
            placeholder="Laissez votre avis ici..."
            {...field}
           
          />
          
        )}
        
      />
   <TouchableOpacity onPress={handleSubmit(onSubmit)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        <Text className="text-white">Envoyer l'avis</Text>
      </TouchableOpacity>
      <View id="responseMessage" className="mt-4 w-full flex flex-col items-center">
        {responseMessage && !error ? <Text className="text-green-600">{responseMessage}</Text> : null}
        {avisList.length > 0 ? (
          <View className="mt-6 w-3/4">
            <Text className="text-xl font-bold mb-4">Avis reçus :</Text>
            {avisList.map((avis) => (
              <View key={avis.id} className="border-b border-gray-300 mb-4 pb-4">
                <Text className="font-semibold">{avis.email} :</Text>
                <Text className="italic">{avis.avis}</Text>
               
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">Aucun avis reçu pour le moment.</Text>
        )}
        {error ? <Text className="text-red-600">{error}</Text> : null}
      </View>
    </View>
  );
}
