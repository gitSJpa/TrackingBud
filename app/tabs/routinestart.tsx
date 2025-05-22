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
import { theme } from "../../theme-config";
import { formatDate } from "../../utils/dateUtils";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app as firebaseApp } from "../../config/firebase-config";

// Initialize Firebase Auth and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

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
  const [startTime, setStartTime] = useState(null);
  const [newExerciseName, setNewExerciseName] = useState("");

  const scrollViewRef = useRef(null);
  const inputRefs = useRef({});

  const startRoutine = () => setStartTime(Date.now());

  const updateSet = (exerciseId, setIndex, field, value) => {
    if (!startTime) startRoutine();
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
    if (!startTime) startRoutine();
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

  const addExercise = () => {
    if (!newExerciseName.trim()) {
      Alert.alert("Error", "Exercise name cannot be empty.");
      return;
    }
    if (!startTime) startRoutine();
    const newExercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: [{ id: `${Date.now()}_set1`, reps: "", weight: "" }],
    };
    setExercises([...exercises, newExercise]);
    setNewExerciseName("");
  };

  const finishRoutine = async () => {
    if (exercises.some((ex) => ex.sets.length === 0)) {
      Alert.alert(
        "Error",
        "Add at least one set to each exercise before finishing the routine."
      );
      return;
    }
    const endTime = Date.now();
    const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const newWorkout = {
      date: formatDate(new Date()),
      exercises: exercises.flatMap((ex) =>
        ex.sets.map((set) => ({
          name: ex.name,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
        }))
      ),
      duration,
      userId: auth.currentUser.uid, // Tie the workout to the authenticated user
    };

    try {
      // Save to Firestore under the user's workouts collection
      const userWorkoutsRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "workouts"
      );
      await addDoc(userWorkoutsRef, newWorkout);

      // Reset state after successful save
      setExercises(
        parsedRoutine.exercises.map((exercise) => ({
          ...exercise,
          sets: Array.from({ length: exercise.sets }, (_, index) => ({
            id: `${exercise.id}_set${index + 1}`,
            reps: "",
            weight: "",
          })),
        }))
      );
      setStartTime(null);
      setNewExerciseName("");
      Alert.alert("Success", "Routine saved!");
    } catch (error) {
      console.error("Failed to save routine:", error);
      Alert.alert("Error", "Couldn’t save routine. Try again.");
    }
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
          <View key={exercise.id} style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Button
              title="Add Set"
              onPress={() => addSet(exercise.id)}
              color={theme.colors.accent}
            />
            {exercise.sets.map((set, setIndex) => {
              const repsKey = `${exercise.id}_set${setIndex}_reps`;
              const weightKey = `${exercise.id}_set${setIndex}_weight`;
              return (
                <View key={set.id} style={styles.setContainer}>
                  <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                  <TextInput
                    ref={(ref) => (inputRefs.current[repsKey] = ref)}
                    style={styles.input}
                    placeholder="Reps"
                    placeholderTextColor={theme.colors.placeholder}
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
                    placeholder="Weight"
                    placeholderTextColor={theme.colors.placeholder}
                    keyboardType="numeric"
                    value={set.weight}
                    onFocus={() => scrollToInput(weightKey)}
                    onChangeText={(value) =>
                      updateSet(exercise.id, setIndex, "weight", value)
                    }
                  />
                  <Button
                    title="Remove"
                    color={theme.colors.accent}
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
            placeholder="New Exercise"
            placeholderTextColor={theme.colors.placeholder}
            value={newExerciseName}
            onChangeText={setNewExerciseName}
          />
          <Button
            title="Add Exercise"
            onPress={addExercise}
            color={theme.colors.accent}
          />
          <Button
            title="Finish Routine"
            onPress={finishRoutine}
            color={theme.colors.accent}
          />
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
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.large,
  },
  exerciseContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.medium,
  },
  exerciseName: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
    textAlign: "center",
  },
  setContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.historyItem,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginVertical: theme.spacing.small,
  },
  setLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.small,
    width: 80,
    textAlign: "center",
    color: "#000",
  },
  addExerciseContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.large,
    borderRadius: theme.borderRadius.large,
    alignItems: "center",
    marginTop: theme.spacing.large,
  },
});
