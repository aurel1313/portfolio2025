import Card from "@/components/card/card";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/utils/utils";
export default function AboutScreen() {
  //get vercel api for fetch data
  const [url, setUrl] = useState<string | null>(null);
  const projetStage = async () => {
    const res = await fetch(`${BASE_URL}/projetStage`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",

      },

    });
    const data = await res.json();

    //get url for project stage
    let url = data.latestDeployments;
   
 const first = data.latestDeployments[0];

    // puis la première URL d'alias (souvent la bonne)
    const projectUrl = first.alias[0].startsWith("http")
      ? first.alias[0]
      : `https://${first.alias[0]}`;
      setUrl(projectUrl);
   
  };
  
  useEffect(() => {
    projetStage();
  }, []);

  return (
    <>
      <View
        id="about"
        className=" flex flex-col items-end w-full justify-end  max-sm:items-center max-sm:justify-center max-sm:mt-10 max-sm:mb-10 "
      >
        <Text className="text-2xl font-bold mb-4  ">A propos de moi</Text>
        <Text className="text-gray-500 font-sans text-xl text-wrap w-1/2 p-4 max-sm:font-sans max-sm:w-full max-sm:text-center max-sm:text-[16px]"> 
          Passionné par le développement web et mobile, je suis constamment à la
          recherche de nouvelles technologies et de défis à relever. Mon
          objectif est de créer des applications performantes, intuitives et
          esthétiques qui répondent aux besoins des utilisateurs.
        </Text>
      </View>
      <View
        id="projets"
        className="p-10 flex flex-col items-center w-3/4 justify-center mx-auto"
      >
        <Text className="text-2xl font-bold mb-4 ">Projets</Text>
        <Text className="text-gray-500 font-sans text-xl font-light text-wrap w-1/2 p-4 max-sm:w-full max-sm:text-center max-sm:text-[16px] max-sm:font-sans max-sm:mb-10">
          Developpeur avec 3 ans d'experience, je transforme les idées en
          solutions digitales innovantes et performantes
        </Text>
        {/* card des competences */}
        <View className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Card
            title="developpement front-end"
            description="Création d'interfaces utilisateur modernes et réactives avec React, Vue.js et les dernières technologies web.."
          />
          <Card
            title="Développement Backend"
            description="Architecture d'APIs robustes et scalables avec Node.js, Python et bases de données relationnelles et NoSQL.."
          />
          <Card
            title="UI/UX Design"
            description="Conception d'expériences utilisateur intuitives avec une approche centrée sur l'utilisateur et les meilleures pratiques du design.."
          />
        </View>
        {/* preview du projet avec l'url recupere */}
        <View className="mt-10 w-full">
          <Text className="text-2xl font-bold mb-4 ">Projet de stage</Text>
          <View className="border border-gray-300 rounded-lg p-4">
            <Text className="text-gray-500 font-sans text-xl font-light text-wrap w-full p-4">
              Voici un aperçu de mon projet de stage déployé sur Vercel :
            </Text>
            {url ? (
              <iframe
                src={url}
                className="w-full h-96 border border-gray-300 rounded-lg"
                title="Projet de stage"
              ></iframe>
            ) : (
              <Text>Loading...</Text>
            )}
            
          </View>
        </View>
      </View>
    </>
  );
}
