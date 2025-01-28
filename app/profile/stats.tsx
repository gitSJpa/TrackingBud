// app/stats.tsx
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function StatsPage() {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        // Retrieve workout data from SecureStore
        const storedTotalWorkouts = await SecureStore.getItemAsync(
          "totalWorkouts"
        );
        const storedTotalTime = await SecureStore.getItemAsync("totalTime");

        // Set the state with the retrieved data
        setTotalWorkouts(
          storedTotalWorkouts ? parseInt(storedTotalWorkouts) : 0
        );
        setTotalTime(storedTotalTime ? parseInt(storedTotalTime) : 0);
      } catch (error) {
        console.error("Error loading workout data:", error);
      }
    };

    loadWorkoutData();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Stats</Text>
      <Text style={styles.text}>Total Workouts: {totalWorkouts}</Text>
      <Text style={styles.text}>
        Total Time Worked Out: {formatTime(totalTime)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#16385e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});
