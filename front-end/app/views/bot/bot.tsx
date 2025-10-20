import { View, Text, Button } from "react-native";
import { TextInput } from "react-native";
import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import { BASE_URL } from "@/utils/utils";
export default function BotScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
 
  const botFunction = async () => {
    const res = await fetch(`${BASE_URL}/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    console.log(data);
    if(data.response.includes(`${BASE_URL}/cv`)){
      const link =document.createElement('a');
      link.href = data.response.match(/(http|https):\/\/[^\s]+/)[0];
      link.download = 'CVDevFullstackAurelienFabre.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }else{
      console.log("No CV link found in the response.");
    }
    setResponse(data.response);
  };
  return (
    <div className="flex flex-col border mx-auto w-1/2 relative z-40  bg-white min-h-auto items-center justify-start pt-20 pb-10 ">
      <h1 className="font-bold">Bot Screen</h1>
      <Text className="m-4 p-2 w-1/2  border-gray-300 rounded-md">
        Posez une question au bot concernant mon profil ou mes projets.
      </Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 m-4 w-1/2"
        placeholder="Type a message..."
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={botFunction} />
      <Text className="m-4 p-2 w-1/2 border border-gray-300 rounded-md">
        Response: {response}
      </Text>
    </div>
  );
}
