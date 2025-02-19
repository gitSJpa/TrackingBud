import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

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

  const flatData = exercises.flatMap((exercise) => [
    { type: "exercise", ...exercise },
    ...exercise.sets.map((set, index) => ({
      type: "set",
      exerciseId: exercise.id,
      set,
      index,
    })),
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>{parsedRoutine.name}</Text>

          <FlatList
            data={flatData}
            keyExtractor={(item, index) =>
              item.type === "exercise" ? item.id : item.set.id
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => {
              if (item.type === "exercise") {
                return (
                  <View style={styles.exerciseContainer}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Button title="Add Set" onPress={() => addSet(item.id)} />
                  </View>
                );
              } else {
                return (
                  <View style={styles.setContainer}>
                    <Text style={styles.setLabel}>Set {item.index + 1}</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Enter Reps"
                      keyboardType="numeric"
                      value={item.set.reps}
                      onChangeText={(value) =>
                        updateSet(item.exerciseId, item.index, "reps", value)
                      }
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Enter Weight"
                      keyboardType="numeric"
                      value={item.set.weight}
                      onChangeText={(value) =>
                        updateSet(item.exerciseId, item.index, "weight", value)
                      }
                    />

                    <Button
                      title="Remove Set"
                      color="red"
                      onPress={() => removeSet(item.exerciseId, item.index)}
                    />
                  </View>
                );
              }
            }}
            ListFooterComponent={
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
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  exerciseContainer: {
    backgroundColor: "#204b7d",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  exerciseName: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  setContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3066be",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  setLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    width: 100,
    textAlign: "center",
  },
  addExerciseContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default RoutineStart;
