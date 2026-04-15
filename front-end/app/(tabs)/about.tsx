import Card from "@/components/card/card";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/utils/utils";
import { ThemeContext } from "../../app/Context/Theme/Theme";
import { useContext } from "react";

export default function AboutScreen() {
  //get vercel api for fetch data

  const [url, setUrl] = useState<string | null>(null);

  const projetStage = async () => {
    const controller = new AbortController();
    try {
      const res = await fetch(`${BASE_URL}/projetStage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });
      const data = await res.json();
      console.log("data", data);
      
      //get url for project stage
      let url = data.latestDeployments;

      const first = data.latestDeployments[0];

      // puis la première URL d'alias (souvent la bonne)
      const projectUrl = first.alias[0].startsWith("http")
        ? first.alias[0]
        : `https://${first.alias[0]}`;
      setUrl(projectUrl);
      
    } catch (error) {
      if(error instanceof DOMException && error.name === 'AbortError') {
        console.log('Requête annulée');
      } else {
        throw error;
      }
    }
  };



  useEffect(() => {
    projetStage();
  }, []);

  // Context pour le theme
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("About component must be used within a ThemeProvider");
  }
  const { theme } = context;

  return (
    <>
      <View
        id="about"
        className={`  p-4 flex flex-col items-center text-[20px] w-full justify-center  max-sm:items-center max-sm:justify-center max-sm:mt-10 max-sm:mb-10 `}
      >
        <Text className={`text-${theme === 'dark' ? 'gray-500' : 'black'} text-2xl font-bold mb-4  `}>A propos de moi</Text>
        <Text className={`text-${theme === 'dark' ? 'gray-500' : 'gray-500'} font-sans text-xl text-wrap w-1/2  p-4 max-sm:font-sans max-sm:w-full max-sm:text-center max-sm:text-[16px] `}>
          Passionné par le développement web et mobile, je suis constamment à la
          recherche de nouvelles technologies et de défis à relever. Mon
          objectif est de créer des applications performantes, intuitives et
          esthétiques qui répondent aux besoins des utilisateurs.
        </Text>
      </View>
      <View
        id="projects"
        className="p-10 flex flex-col items-center w-3/4  mx-auto"
      >
        <Text className={`text-${theme === 'dark' ? 'white' : 'black'} text-2xl font-bold mb-4 `}>Projets</Text>
        <Text className={`text-${theme === 'dark' ? 'gray-500' : 'gray-500'} font-sans text-xl  text-wrap w-1/2 p-4 max-sm:w-full max-sm:text-center max-sm:text-[16px] max-sm:font-sans max-sm:mb-10`}>
          Developpeur avec 3 ans d'experience, je transforme les idées en
          solutions digitales innovantes et performantes
        </Text>
       
        
        <View className="flex flex-row place-content-center w-1/3    max-md:flex max-md:flex-col max-md:items-center max-md:justify-center ">
          <Card
            title="developpement front-end"
            description="Création d'interfaces utilisateur modernes et réactives avec React, Vue.js et les dernières technologies web.."
          />
          <Card
            title="Développement Backend"
            description="Architecture d'APIs robustes et scalables avec Node.js, Symfony et bases de données relationnelles et PostgreSQL.."
          />
          <Card
            title="UI/UX Design"
            description="Conception d'expériences utilisateur intuitives avec une approche centrée sur l'utilisateur et les meilleures pratiques du design.."
          />
        </View>
    
        <View className="mt-10 w-full  relative   max-sm:w-full max-sm:p-4 ">
          <Text className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'} `}>Projet de stage</Text>
          <View className=" w-full  rounded-lg p-4">
            <Text className={` font-sans text-xl font-light text-wrap w-full p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
              Voici un aperçu de mon projet de stage déployé sur Vercel :
            </Text>
            {url ? (
              <iframe
                src={url}
                className="w-full h-96 border border-gray-300 bg-white rounded-lg"
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
