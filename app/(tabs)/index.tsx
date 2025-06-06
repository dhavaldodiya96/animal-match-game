import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Welcome to Animal Match Game</Text>
      <Button title="Start Game" onPress={() => router.push("/(tabs)/game")} />
    </View>
  );
}
