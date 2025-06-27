import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EmojiTileProps {
  emoji: string;
  index: number;
  marked: boolean;
  panHandlers: any;
  tileSize: number;
}

const EmojiTile: React.FC<EmojiTileProps> = ({
  emoji,
  index,
  marked,
  panHandlers,
  tileSize,
}) => {
  return (
    <View
      key={index}
      style={[styles.tile, { width: tileSize, height: tileSize }]}
      {...panHandlers}
    >
      <Text style={[styles.emoji, marked && styles.emojiMarked]}>{emoji}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9C4",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  emoji: {
    fontSize: 30,
  },
  emojiMarked: {
    opacity: 0.3,
    transform: [{ scale: 0.8 }],
  },
});

export default EmojiTile;
