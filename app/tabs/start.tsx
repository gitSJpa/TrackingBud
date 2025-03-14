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
import { theme } from "../../theme-config";

export default function WorkoutPage() {
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const startWorkout = () => {
    setStartTime(Date.now());
  };

  const addSet = () => {
    if (!exerciseName || !weight || !reps) {
      Alert.alert("Error", "Please fill in all fields before adding a set.");
      return;
    }
    if (!startTime) startWorkout();
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
    const endTime = Date.now();
    const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const newWorkout = {
      date: new Date().toLocaleDateString(),
      exercises: sets,
      duration,
    };

    try {
      const storedHistory = await SecureStore.getItemAsync("workoutHistory");
      const updatedHistory = storedHistory
        ? [...JSON.parse(storedHistory), newWorkout]
        : [newWorkout];
      await SecureStore.setItemAsync(
        "workoutHistory",
        JSON.stringify(updatedHistory)
      );
      const totalWorkouts = await SecureStore.getItemAsync("totalWorkouts");
      const newTotalWorkouts = totalWorkouts ? parseInt(totalWorkouts) + 1 : 1;
      const totalTime = await SecureStore.getItemAsync("totalTime");
      const newTotalTime = totalTime
        ? parseInt(totalTime) + duration
        : duration;
      await SecureStore.setItemAsync(
        "totalWorkouts",
        newTotalWorkouts.toString()
      );
      await SecureStore.setItemAsync("totalTime", newTotalTime.toString());
      setSets([]);
      setExerciseName("");
      setStartTime(null);
      Alert.alert("Success", "Workout saved!");
    } catch (error) {
      console.error("Failed to save workout:", error);
      Alert.alert("Error", "Couldn’t save workout. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Workout</Text>
      <View style={styles.inputContainer}>
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
        <Button title="Add Set" onPress={addSet} color={theme.colors.accent} />
      </View>
      <FlatList
        data={sets}
        keyExtractor={(item, index) => `${item.name}_${index}`}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item.name}: {item.reps} reps @ {item.weight} kg
          </Text>
        )}
      />
      <Button
        title="Finish Workout"
        onPress={finishWorkout}
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
  inputContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.large,
  },
  input: {
    backgroundColor: theme.colors.white,
    color: "#000",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  text: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
});
