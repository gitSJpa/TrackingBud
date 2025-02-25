import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { theme } from "./theme";

export default function RoutineStart() {
  const router = useRouter();
  const { routine } = useLocalSearchParams();
  const parsedRoutine = routine
    ? JSON.parse(routine)
    : { name: "Unknown", exercises: [] };

  const [exercises, setExercises] = useState(
    parsedRoutine.exercises.map((exercise) => ({
      ...exercise,
      sets: Array.from({ length: exercise.sets }, (_, index) => ({
        id: `${exercise.id}_set${index + 1}`,
        reps: "",
        weight: "",
      })),
    }))
  );

  const scrollViewRef = useRef(null);
  const inputRefs = useRef({});

  const updateSet = (exerciseId, setIndex, field, value) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseId) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: `${exercise.id}_set${exercise.sets.length + 1}`,
                  reps: "",
                  weight: "",
                },
              ],
            }
          : exercise
      )
    );
  };

  const removeSet = (exerciseId, setIndex) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((_, index) => index !== setIndex),
            }
          : exercise
      )
    );
  };

  const [newExerciseName, setNewExerciseName] = useState("");
  const addExercise = () => {
    if (!newExerciseName.trim()) {
      Alert.alert("Error", "Exercise name cannot be empty.");
      return;
    }
    const newExercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: [{ id: `${Date.now()}_set1`, reps: "", weight: "" }],
    };
    setExercises([...exercises, newExercise]);
    setNewExerciseName("");
  };

  const finishRoutine = () => {
    Alert.alert("Routine Complete", "Great job completing your routine!");
    router.push("/routines");
  };

  const scrollToInput = (inputKey) => {
    const node = inputRefs.current[inputKey];
    if (node && scrollViewRef.current) {
      node.measureLayout(
        scrollViewRef.current,
        (x, y) =>
          scrollViewRef.current.scrollTo({ y: y - 100, animated: true }),
        () => console.log("Measurement failed")
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 20}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.title}>{parsedRoutine.name}</Text>
        {exercises.map((exercise) => (
          <View key={exercise.id}>
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Button title="Add Set" onPress={() => addSet(exercise.id)} />
            </View>
            {exercise.sets.map((set, setIndex) => {
              const repsKey = `${exercise.id}_set${setIndex}_reps`;
              const weightKey = `${exercise.id}_set${setIndex}_weight`;
              return (
                <View key={set.id} style={styles.setContainer}>
                  <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                  <TextInput
                    ref={(ref) => (inputRefs.current[repsKey] = ref)}
                    style={styles.input}
                    placeholder="Enter Reps"
                    keyboardType="numeric"
                    value={set.reps}
                    onFocus={() => scrollToInput(repsKey)}
                    onChangeText={(value) =>
                      updateSet(exercise.id, setIndex, "reps", value)
                    }
                  />
                  <TextInput
                    ref={(ref) => (inputRefs.current[weightKey] = ref)}
                    style={styles.input}
                    placeholder="Enter Weight"
                    keyboardType="numeric"
                    value={set.weight}
                    onFocus={() => scrollToInput(weightKey)}
                    onChangeText={(value) =>
                      updateSet(exercise.id, setIndex, "weight", value)
                    }
                  />
                  <Button
                    title="Remove Set"
                    color="red"
                    onPress={() => removeSet(exercise.id, setIndex)}
                  />
                </View>
              );
            })}
          </View>
        ))}
        <View style={styles.addExerciseContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Exercise Name"
            value={newExerciseName}
            onChangeText={setNewExerciseName}
          />
          <Button title="Add Exercise" onPress={addExercise} />
          <Button title="Finish Routine" onPress={finishRoutine} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  scrollContent: {
    padding: theme.spacing.large,
    paddingBottom: 150,
  },
  title: theme.typography.title,
  exerciseContainer: {
    backgroundColor: theme.colors.secondary,
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  exerciseName: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  setContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.accent,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  setLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    borderRadius: 5,
    padding: 8,
    width: 100,
    textAlign: "center",
  },
  addExerciseContainer: {
    padding: theme.spacing.large,
    alignItems: "center",
  },
});
