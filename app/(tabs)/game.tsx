import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { Audio } from "expo-av";

const GRID_SIZE = 6;
const TILE_SIZE = Dimensions.get("window").width / GRID_SIZE;
const animalEmojis = ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻"];

const generateBoard = () => {
  const board: string[] = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    let isValid = false;
    let emoji = "";

    while (!isValid) {
      emoji = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
      isValid = true;

      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;

      // Horizontal check
      if (col >= 2 && board[i - 1] === emoji && board[i - 2] === emoji) {
        isValid = false;
      }

      // Vertical check
      if (
        row >= 2 &&
        board[i - GRID_SIZE] === emoji &&
        board[i - 2 * GRID_SIZE] === emoji
      ) {
        isValid = false;
      }
    }

    board.push(emoji);
  }
  return board;
};

// Match 3+ emojis
const findMatches = (board: string[], gridSize: number): number[] => {
  const matches: Set<number> = new Set();

  // Horizontal
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - 2; col++) {
      const idx = row * gridSize + col;
      const emoji = board[idx];
      if (emoji && board[idx + 1] === emoji && board[idx + 2] === emoji) {
        matches.add(idx);
        matches.add(idx + 1);
        matches.add(idx + 2);
      }
    }
  }

  // Vertical
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize - 2; row++) {
      const idx = row * gridSize + col;
      const emoji = board[idx];
      if (
        emoji &&
        board[idx + gridSize] === emoji &&
        board[idx + gridSize * 2] === emoji
      ) {
        matches.add(idx);
        matches.add(idx + gridSize);
        matches.add(idx + gridSize * 2);
      }
    }
  }

  return Array.from(matches);
};

const removeAndCollapse = (
  board: string[],
  matchedIndices: number[]
): string[] => {
  const newBoard = [...board];

  // Clear matched tiles
  for (let index of matchedIndices) {
    newBoard[index] = "";
  }

  // Collapse columns
  for (let col = 0; col < GRID_SIZE; col++) {
    const column: string[] = [];

    // Pull down non-empty emojis
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      const idx = row * GRID_SIZE + col;
      if (newBoard[idx] !== "") column.push(newBoard[idx]);
    }

    // Fill remaining with new random emojis
    while (column.length < GRID_SIZE) {
      const newEmoji =
        animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
      column.push(newEmoji);
    }

    // Write column back to board
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      const idx = row * GRID_SIZE + col;
      newBoard[idx] = column[GRID_SIZE - 1 - row];
    }
  }

  return newBoard;
};

const HomeScreen = () => {
  const [imojiBoard, setImojiBoard] = useState(generateBoard());
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/swipe.mp3")
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      // Cleanup sound when component unmounts
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSwipeSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync(); // ✅ use replay instead of create new
      }
    } catch (error) {
      console.warn("Swipe sound error:", error);
    }
  };

  const getSwapIndex = (fromIndex: number, direction: string) => {
    const row = Math.floor(fromIndex / GRID_SIZE);
    const col = fromIndex % GRID_SIZE;

    switch (direction) {
      case "up":
        return row > 0 ? fromIndex - GRID_SIZE : -1;
      case "down":
        return row < GRID_SIZE - 1 ? fromIndex + GRID_SIZE : -1;
      case "left":
        return col > 0 ? fromIndex - 1 : -1;
      case "right":
        return col < GRID_SIZE - 1 ? fromIndex + 1 : -1;
      default:
        return -1;
    }
  };

  const handleSwipe = async (fromIndex: number, direction: string) => {
    const toIndex = getSwapIndex(fromIndex, direction);
    if (toIndex === -1) return;

    const newBoard = [...imojiBoard];
    [newBoard[fromIndex], newBoard[toIndex]] = [
      newBoard[toIndex],
      newBoard[fromIndex],
    ];
    const matched = findMatches(newBoard, GRID_SIZE);

    if (matched.length > 0) {
      await playSwipeSound();

      let updatedBoard = removeAndCollapse(newBoard, matched);

      // Keep checking for new matches after collapsing
      while (true) {
        const nextMatches = findMatches(updatedBoard, GRID_SIZE);
        if (nextMatches.length === 0) break;
        updatedBoard = removeAndCollapse(updatedBoard, nextMatches);
      }

      setImojiBoard(updatedBoard);
    } else {
      // No match, revert the swap
      [newBoard[fromIndex], newBoard[toIndex]] = [
        newBoard[toIndex],
        newBoard[fromIndex],
      ];
      setImojiBoard(newBoard);
    }
  };

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        _: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { dx, dy } = gestureState;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;

        const direction =
          Math.abs(dx) > Math.abs(dy)
            ? dx > 0
              ? "right"
              : "left"
            : dy > 0
            ? "down"
            : "up";

        handleSwipe(index, direction);
      },
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Match Game</Text>
      <View style={styles.grid}>
        {imojiBoard.map((emoji, index) => {
          const panResponder = createPanResponder(index);
          return (
            <View key={index} style={styles.tile} {...panResponder.panHandlers}>
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
          );
        })}
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
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: Dimensions.get("window").width,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
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
});

export default HomeScreen;
