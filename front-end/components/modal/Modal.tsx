import { Text } from "react-native";

type Props = {
    content: string;
    className?: string;
}

export default function Modal ({content,className}: Props) {
   
    return (
        
        <div className={className}>
            <div>
              
                <Text className="text-gray-500 font-sans text-xl text-wrap w-1/2 p-4">
         {content}
        </Text>
            </div>
            <div>
                
            </div>
        </div>
    );
}