import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

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
            updatedHistory.splice(index, 1); // Remove the workout at the given index
            setWorkoutHistory(updatedHistory); // Update the state
            await SecureStore.setItemAsync(
              "workoutHistory",
              JSON.stringify(updatedHistory)
            ); // Save updated history to SecureStore
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
                    - {exercise.name}: {exercise.sets} sets x {exercise.reps}{" "}
                    reps @ {exercise.weight} kg
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
    padding: 16,
    backgroundColor: "#16385e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  historyItem: {
    backgroundColor: "#2d517f",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});
