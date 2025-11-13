export default function AvisScreen() {
    //espace commentaire  pour les avis des clients
    return (
        <div className="p-10 flex flex-col items-center w-3/4 justify-center mx-auto">
        <h2 className="text-2xl font-bold mb-4 ">Avis des clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Exemple d'avis */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
            <p className="text-gray-700 mb-2">
              "Aurélien a fait un travail exceptionnel sur notre site web. Très
              professionnel et à l'écoute de nos besoins."
            </p>
            <p className="text-indigo-600 font-semibold">- Client Satisfait</p>
          </div>
            <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
            <p className="text-gray-700 mb-2">
                "Je recommande vivement Aurélien pour tout projet de développement
                web. Son expertise et son dévouement sont remarquables."
            </p>
            <p className="text-indigo-600 font-semibold">- Client Heureux</p>
            </div>
            </div>
        </div>
    );

    
}