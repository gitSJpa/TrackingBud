import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { theme } from "../theme";

export default function HistoryPage() {
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await SecureStore.getItemAsync("workoutHistory");
      setWorkoutHistory(history ? JSON.parse(history) : []);
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
            const updatedHistory = [...workoutHistory];
            updatedHistory.splice(index, 1);
            setWorkoutHistory(updatedHistory);
            await SecureStore.setItemAsync(
              "workoutHistory",
              JSON.stringify(updatedHistory)
            );
          },
        },
      ]
    );
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
              <Text style={styles.text}>Date: {item.date}</Text>
              {Array.isArray(item.exercises) && item.exercises.length > 0 ? (
                item.exercises.map((exercise, idx) => (
                  <Text key={idx} style={styles.text}>
                    - {exercise.name}: {exercise.reps} reps @ {exercise.weight}{" "}
                    kg
                  </Text>
                ))
              ) : (
                <Text style={styles.text}>No exercises logged.</Text>
              )}
              <Button
                title="Delete"
                color="red"
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
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.primary,
  },
  title: theme.typography.title,
  text: theme.typography.text,
  historyItem: {
    backgroundColor: theme.colors.historyItem,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});
