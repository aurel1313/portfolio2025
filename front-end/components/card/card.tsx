export default function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-gray-300 rounded-lg p-6 pb-6 m-4 h-full w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-[16px] font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}