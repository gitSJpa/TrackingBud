import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { theme } from "../../../theme-config";

export default function HistoryPage() {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await SecureStore.getItemAsync("workoutHistory");
        setWorkoutHistory(history ? JSON.parse(history) : []);
      } catch (error) {
        console.error("Error fetching workout history:", error);
        setWorkoutHistory([]);
      }
    };
    fetchHistory();
  }, []);

  const deleteWorkout = async (index) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedHistory = [...workoutHistory];
              updatedHistory.splice(index, 1);
              setWorkoutHistory(updatedHistory);
              await SecureStore.setItemAsync(
                "workoutHistory",
                JSON.stringify(updatedHistory)
              );
              const totalWorkouts = updatedHistory.length;
              const totalTime = updatedHistory.reduce(
                (sum, workout) => sum + (workout.duration || 0),
                0
              );
              await SecureStore.setItemAsync(
                "totalWorkouts",
                totalWorkouts.toString()
              );
              await SecureStore.setItemAsync("totalTime", totalTime.toString());
            } catch (error) {
              console.error("Error deleting workout:", error);
              Alert.alert("Error", "Failed to delete workout.");
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
  };

  const renderExercise = (exercise) => {
    if (exercise.reps && exercise.weight) {
      return `${exercise.name}: ${exercise.reps} reps @ ${exercise.weight}kg`;
    }
    return `${exercise.name}: ${exercise.reps || "No reps"} @ ${
      exercise.weight || "No weight"
    }`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      {workoutHistory.length === 0 ? (
        <Text style={styles.text}>No workouts logged yet.</Text>
      ) : (
        <FlatList
          data={workoutHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.historyItem}>
              <Text style={styles.text}>
                {item.date}{" "}
                {item.duration ? `(${formatTime(item.duration)})` : ""}
              </Text>
              {Array.isArray(item.exercises) && item.exercises.length > 0 ? (
                item.exercises.map((exercise, idx) => (
                  <Text key={idx} style={styles.text}>
                    - {renderExercise(exercise)}
                  </Text>
                ))
              ) : (
                <Text style={styles.text}>No exercises logged.</Text>
              )}
              <Button
                title="Delete"
                color={theme.colors.accent}
                onPress={() => deleteWorkout(index)}
              />
            </View>
          )}
        />
      )}
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
  text: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  historyItem: {
    backgroundColor: theme.colors.historyItem,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
  },
});
