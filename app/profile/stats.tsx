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
        const storedHistory = await SecureStore.getItemAsync("workoutHistory");
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        const workoutCount = history.length;
        const timeSum = history.reduce(
          (sum, workout) => sum + (workout.duration || 0),
          0
        );
        const storedTotalWorkouts = await SecureStore.getItemAsync(
          "totalWorkouts"
        );
        const storedTotalTime = await SecureStore.getItemAsync("totalTime");
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
      <View style={styles.statsContainer}>
        <Text style={styles.text}>Total Workouts: {totalWorkouts}</Text>
        <Text style={styles.text}>
          Total Time Worked Out: {formatTime(totalTime)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.primary,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.large,
  },
  statsContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
  },
  text: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    fontSize: 18,
    marginBottom: theme.spacing.medium,
  },
});
