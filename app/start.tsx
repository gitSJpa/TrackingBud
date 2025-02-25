import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { theme } from "./theme";

export default function WorkoutPage() {
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);

  const addSet = () => {
    if (!exerciseName || !weight || !reps) {
      Alert.alert("Error", "Please fill in all fields before adding a set.");
      return;
    }
    const newSet = {
      name: exerciseName,
      weight: parseFloat(weight),
      reps: parseInt(reps),
    };
    setSets((prevSets) => [...prevSets, newSet]);
    setWeight("");
    setReps("");
  };

  const finishWorkout = async () => {
    if (sets.length === 0) {
      Alert.alert(
        "Error",
        "Add at least one set before finishing the workout."
      );
      return;
    }
    const newWorkout = {
      date: new Date().toLocaleDateString(),
      exercises: sets,
    };
    const storedHistory = await SecureStore.getItemAsync("workoutHistory");
    const updatedHistory = storedHistory
      ? [...JSON.parse(storedHistory), newWorkout]
      : [newWorkout];
    await SecureStore.setItemAsync(
      "workoutHistory",
      JSON.stringify(updatedHistory)
    );
    setSets([]);
    setExerciseName("");
    Alert.alert("Success", "Workout saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Workout</Text>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        placeholderTextColor={theme.colors.placeholder}
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor={theme.colors.placeholder}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        placeholderTextColor={theme.colors.placeholder}
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <Button title="Add Set" onPress={addSet} />
      <FlatList
        data={sets}
        keyExtractor={(item, index) => `${item.name}_${index}`}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item.name}: {item.reps} reps @ {item.weight} kg
          </Text>
        )}
      />
      <Button title="Finish Workout" onPress={finishWorkout} />
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
  input: {
    backgroundColor: theme.colors.white,
    color: "#000",
    borderRadius: 8,
    padding: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  text: theme.typography.text,
});
