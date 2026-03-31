import { View } from "react-native";

type Props = {
  index: number;
  total: number;
};

export default function PaginationDots({ index, total }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === index ? 20 : 8,
            height: 8,
            borderRadius: 10,
            backgroundColor: i === index ? "#1db954" : "#ddd",
            transitionDuration: "300ms"
          }}
        />
      ))}
    </View>
  );
}
