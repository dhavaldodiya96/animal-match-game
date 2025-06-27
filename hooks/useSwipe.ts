// hooks/useSwipeSound.ts
import { useEffect, useRef } from "react";
import { Audio } from "expo-av";

export const useSwipeSound = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/swipe.mp3")
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSwipeSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.warn("Swipe sound error:", error);
    }
  };

  return { playSwipeSound };
};
