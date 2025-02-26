import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { theme } from "../theme";

export default function StatsPage() {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        // Load workout history
        const storedHistory = await SecureStore.getItemAsync("workoutHistory");
        const history = storedHistory ? JSON.parse(storedHistory) : [];

        // Calculate stats from history
        const workoutCount = history.length;
        const timeSum = history.reduce(
          (sum, workout) => sum + (workout.duration || 0),
          0
        );

        // Load legacy totals from SecureStore (for backward compatibility)
        const storedTotalWorkouts = await SecureStore.getItemAsync(
          "totalWorkouts"
        );
        const storedTotalTime = await SecureStore.getItemAsync("totalTime");

        // Use the larger value between history and stored totals to avoid data loss
        setTotalWorkouts(
          Math.max(
            workoutCount,
            storedTotalWorkouts ? parseInt(storedTotalWorkouts) : 0
          )
        );
        setTotalTime(
          Math.max(timeSum, storedTotalTime ? parseInt(storedTotalTime) : 0)
        );
      } catch (error) {
        console.error("Error loading workout data:", error);
        setTotalWorkouts(0);
        setTotalTime(0);
      }
    };
    loadWorkoutData();
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
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
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
  },
  title: theme.typography.title,
  text: {
    ...theme.typography.text,
    fontSize: 18,
  },
});
