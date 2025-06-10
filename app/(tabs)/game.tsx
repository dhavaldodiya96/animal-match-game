import React, { useState } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";

const GRID_SIZE = 7;
const TILE_SIZE = Dimensions.get("window").width / GRID_SIZE;
const animalEmojis = ["🐶", "🐒", "🐭", "🦁", "🐯", "🐻"];

const tileColors = [
  "#FFCDD2",
  "#F8BBD0",
  "#E1BEE7",
  "#BBDEFB",
  "#C8E6C9",
  "#FFF9C4",
];

const getRandomColor = () => {
  return tileColors[Math.floor(Math.random() * tileColors.length)];
};

const generateBoard = () => {
  const newBoard: string[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      let newEmoji;
      let tries = 0;

      do {
        newEmoji =
          animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
        tries++;
      } while (
        tries < 10 &&
        ((col >= 2 &&
          newEmoji === newBoard[row * GRID_SIZE + col - 1] &&
          newEmoji === newBoard[row * GRID_SIZE + col - 2]) ||
          (row >= 2 &&
            newEmoji === newBoard[(row - 1) * GRID_SIZE + col] &&
            newEmoji === newBoard[(row - 2) * GRID_SIZE + col]))
      );

      newBoard.push(newEmoji);
    }
  }
  console.log("Generated Board:", newBoard);
  return newBoard;
};

const HomeScreen = () => {
  const [imojiBoard] = useState(generateBoard());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Match Game</Text>
      <Text style={styles.subtitle}>Match the animals to win!</Text>

      <View style={styles.grid}>
        {imojiBoard.map((emoji, index) => (
          <View key={index} style={styles.tile}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  grid: {
    width: GRID_SIZE * 50,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
  },
  tile: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: getRandomColor(),
    borderColor: "#ccc",
    borderRadius: 8,
    margin: 2.5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    // elevation: 2,
  },

  emoji: {
    fontSize: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
