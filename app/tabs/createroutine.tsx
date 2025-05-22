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
import { theme } from "../../theme-config";

export default function CreateRoutine() {
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [exerciseInput, setExerciseInput] = useState("");

  const addExercise = () => {
    if (exerciseInput.trim() === "") {
      Alert.alert("Error", "Exercise name cannot be empty.");
      return;
    }
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: exerciseInput, sets: 1 },
    ]);
    setExerciseInput("");
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const updateSets = (id, change) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, sets: Math.max(1, exercise.sets + change) }
          : exercise
      )
    );
  };

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
      <Text style={styles.title}>Create a New Routine</Text>
      <TextInput
        style={styles.input}
        placeholder="Routine Name"
        placeholderTextColor={theme.colors.placeholder}
        value={routineName}
        onChangeText={setRoutineName}
      />
      <View style={styles.addExerciseContainer}>
        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          placeholderTextColor={theme.colors.placeholder}
          value={exerciseInput}
          onChangeText={setExerciseInput}
        />
        <Button
          title="Add Exercise"
          onPress={addExercise}
          color={theme.colors.accent}
        />
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>
              {item.name} - {item.sets} sets
            </Text>
            <View style={styles.exerciseControls}>
              <Button
                title="-"
                onPress={() => updateSets(item.id, -1)}
                color={theme.colors.accent}
              />
              <Button
                title="+"
                onPress={() => updateSets(item.id, 1)}
                color={theme.colors.accent}
              />

              <Button
                title="Remove"
                color={theme.colors.accent}
                onPress={() => removeExercise(item.id)}
              />
            </View>
          </View>
        )}
      />
      <Button
        title="Save Routine"
        onPress={saveRoutine}
        color={theme.colors.accent}
      />
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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginVertical: theme.spacing.small,
    color: "#000",
  },
  addExerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.large,
  },
  exerciseItem: {
    backgroundColor: theme.colors.historyItem,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginVertical: theme.spacing.small,
  },
  exerciseText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  exerciseControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.medium,
  },
});
