import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateRoutine() {
  const [routineName, setRoutineName] = useState(""); // Routine name
  const [exercises, setExercises] = useState([]); // List of exercises
  const [exerciseInput, setExerciseInput] = useState(""); // Input for adding a new exercise

  // Function to add a new exercise
  const addExercise = () => {
    if (exerciseInput.trim() === "") {
      Alert.alert("Error", "Exercise name cannot be empty.");
      return;
    }

    // Add new exercise to the list with default 1 set
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: exerciseInput, sets: 1 },
    ]);
    setExerciseInput(""); // Clear the input field
  };

  // Function to remove an exercise
  const removeExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  // Function to update the number of sets for an exercise
  const updateSets = (id, change) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, sets: Math.max(1, exercise.sets + change) } // Prevent sets going below 1
          : exercise
      )
    );
  };

  // Function to save the routine using AsyncStorage
  const saveRoutine = async () => {
    if (!routineName.trim()) {
      Alert.alert("Error", "Routine name cannot be empty.");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise.");
      return;
    }

    const routineData = {
      id: Date.now().toString(),
      name: routineName,
      exercises,
    };

    try {
      await AsyncStorage.setItem(
        `routine_${routineData.id}`,
        JSON.stringify(routineData)
      );
      Alert.alert("Success", "Routine saved successfully!");
      setRoutineName("");
      setExercises([]);
    } catch (error) {
      Alert.alert("Error", "Failed to save the routine.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create a New Routine</Text>

      {/* Routine Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter routine name"
        placeholderTextColor="#aaa"
        value={routineName}
        onChangeText={setRoutineName}
      />

      {/* Add Exercise Section */}
      <View style={styles.addExerciseContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter exercise name"
          placeholderTextColor="#aaa"
          value={exerciseInput}
          onChangeText={setExerciseInput}
        />
        <Button title="Add Exercise" onPress={addExercise} />
      </View>

      {/* List of Exercises */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>
              {item.name} - {item.sets} sets
            </Text>
            <View style={styles.exerciseControls}>
              <Button title="+" onPress={() => updateSets(item.id, 1)} />
              <Button title="-" onPress={() => updateSets(item.id, -1)} />
              <Button
                title="Remove"
                color="red"
                onPress={() => removeExercise(item.id)}
              />
            </View>
          </View>
        )}
      />

      {/* Save Routine Button */}
      <Button title="Save Routine" onPress={saveRoutine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#16385e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: "#000",
  },
  addExerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseItem: {
    backgroundColor: "#204b7d",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  exerciseText: {
    fontSize: 18,
    color: "#fff",
  },
  exerciseControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
