import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";

export default function RoutineStart() {
  const router = useRouter();
  const { routine } = useSearchParams(); // Get the routine data from params
  const parsedRoutine = JSON.parse(routine); // Parse the routine data
  const [exercises, setExercises] = useState(
    parsedRoutine.exercises.map((exercise) => ({
      ...exercise,
      reps: 0,
      weight: 0,
    }))
  );
  const [newExercise, setNewExercise] = useState("");

  // Update an existing exercise
  const updateExercise = (id, field, value) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, [field]: parseInt(value) || 0 }
          : exercise
      )
    );
  };

  // Add a new exercise
  const addExercise = () => {
    if (newExercise.trim() === "") {
      Alert.alert("Error", "Exercise name cannot be empty.");
      return;
    }

    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        name: newExercise,
        reps: 0,
        weight: 0,
        sets: 1,
      },
    ]);
    setNewExercise("");
  };

  // Remove an exercise
  const removeExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  // Finish the workout
  const finishRoutine = () => {
    Alert.alert("Routine Complete", "Great job completing your routine!");
    router.push("/routines"); // Navigate back to the routines list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{parsedRoutine.name}</Text>

      {/* List of Exercises */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>

            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={item.reps.toString()}
              onChangeText={(value) => updateExercise(item.id, "reps", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              value={item.weight.toString()}
              onChangeText={(value) => updateExercise(item.id, "weight", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Sets"
              keyboardType="numeric"
              value={item.sets.toString()}
              onChangeText={(value) => updateExercise(item.id, "sets", value)}
            />

            <Button
              title="Remove"
              color="red"
              onPress={() => removeExercise(item.id)}
            />
          </View>
        )}
      />

      {/* Add New Exercise */}
      <View style={styles.addExerciseContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Exercise Name"
          value={newExercise}
          onChangeText={setNewExercise}
        />
        <Button title="Add Exercise" onPress={addExercise} />
      </View>

      {/* Finish Routine Button */}
      <Button title="Finish Routine" onPress={finishRoutine} />
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
  exerciseItem: {
    backgroundColor: "#204b7d",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  exerciseName: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },
  addExerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
