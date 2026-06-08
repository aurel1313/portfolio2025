import GroqSdk from 'groq-sdk';
const Groq = GroqSdk.default || GroqSdk;
const groq = new Groq({ apiKey: process.env.GROQ_API });
const monProfil = () => {
    // Logique pour interagir avec l'API Groq et générer une réponse basée sur le message de l'utilisateur
    // Vous pouvez utiliser la clé d'API pour faire des requêtes à l'API Groq et traiter les réponses
    return groq.chat.completions.create({
        //
        // Required parameters
        //
        messages: [
            // Set an optional system message. This sets the behavior of the
            // assistant and can be used to provide specific instructions for
            // how it should behave throughout the conversation.
            {
                role: "system",
                content: `u es un assistant qui aide les utilisateurs à obtenir des informations sur le profil d'Aurélien Fabre, 
        développeur fullstack. Lorsque l'utilisateur demande des informations sur le profil, 
        tu dois lui fournir une description détaillée du profil d'Aurélien Fabre 
        et si il demande des details si il connait un language repond. 
        Si le utilisateur pose des questions spécifiques, réponds-y de manière précise.
        Par exemple sur les soft skills, hard skills, expériences, formations, projets, etc. Ne pas indiquer en soft skills la partie communication,
        mais dire le travail en equipe,adaptabilité,resolution de problèmes. 
        les experiences sont: Expériences Professionnelles 06/2025 – 09/2025 Développeur Full Stack & Mobile, CDOS (Comité Olympique), 
        Niort Projet : Conception de A à Z d’une plateforme de gestion pour ligues et clubs sportifs. 
        Développement d’une application mobile cross-plateforme en React Native. 
        Création d’une API Backend performante avec Node.js pour centraliser les données. 
        Mise en place de l’architecture technique et rédaction de la documentation. 
        10/2022 – 09/2024 Alternant Développeur Full Stack, MonLook, Niort Contexte : E-commerce / Retail (Prêt-à-porter). 
        Développement et maintenance d’un ERP interne de gestion de stocks (PHP/JS). 
        Optimisation des flux logistiques et automatisation des processus d’inventaire. 
        Application des bonnes pratiques : tests, revues de code et intégration continue. 
        Travail en autonomie sur l’analyse des besoins et la résolution d’incidents critiques. 
        09/2021 – 08/2022 Alternant Développeur Frontend, Digital Associates, Niort Refonte de l’interface utilisateur (UI/UX) d’un outil de gestion budgétaire. 
        Intégration de maquettes responsive et collaboration avec les équipes Design. 
        01/2021 – 02/2021 Stage Développeur Web, Lycée Saint-Joseph, Bressuire Développement d’une application de recherche géographique avec le framework CodeIgniter.
            `,
            },
            // Set a user message for the assistant to respond to.
            {
                role: "user",
                content: `Donne moi le profil d'Aurélien Fabre qui est :  Par exemple sur les soft skills, hard skills, expériences, formations, projets, etc. Ne pas indiquer en soft skills la partie communication,
        mais dire le travail en equipe,adaptabilité,resolution de problèmes. 
        les experiences sont: Expériences Professionnelles 06/2025 – 09/2025 Développeur Full Stack & Mobile, CDOS (Comité Olympique), 
        Niort Projet : Conception de A à Z d’une plateforme de gestion pour ligues et clubs sportifs. 
        Développement d’une application mobile cross-plateforme en React Native. 
        Création d’une API Backend performante avec Node.js pour centraliser les données. 
        Mise en place de l’architecture technique et rédaction de la documentation. 
        10/2022 – 09/2024 Alternant Développeur Full Stack, MonLook, Niort Contexte : E-commerce / Retail (Prêt-à-porter). 
        Développement et maintenance d’un ERP interne de gestion de stocks (PHP/JS). 
        Optimisation des flux logistiques et automatisation des processus d’inventaire. 
        Application des bonnes pratiques : tests, revues de code et intégration continue. 
        Travail en autonomie sur l’analyse des besoins et la résolution d’incidents critiques. 
        09/2021 – 08/2022 Alternant Développeur Frontend, Digital Associates, Niort Refonte de l’interface utilisateur (UI/UX) d’un outil de gestion budgétaire. 
        Intégration de maquettes responsive et collaboration avec les équipes Design. 
        01/2021 – 02/2021 Stage Développeur Web, Lycée Saint-Joseph, Bressuire Développement d’une application de recherche géographique avec le framework CodeIgniter`,
            },
        ],
        // The language model which will generate the completion.
        model: "llama-3.1-8b-instant",
    });
};
const genererCV = async () => {
    // recuperer le chemin de la racine du projet
    const __dirname = import.meta.dirname;
    // construire le chemin vers le fichier CV.pdf qui est dans le dossier back-end/public
    const filePath = `${__dirname}/public/CVDevFullstackAurelienFabre.pdf`;
    // créer un objet File à partir du chemin du fichier
    const file = new File([filePath], "CVDevFullstackAurelienFabre.pdf", {
        type: "application/pdf",
    });
    return file;
};
export { monProfil, genererCV };
