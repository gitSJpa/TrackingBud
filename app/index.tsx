import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { theme } from "./theme";

export default function HomePage() {
  const [workoutCount, setWorkoutCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkoutCount = async () => {
      const count = await SecureStore.getItemAsync("workoutCount");
      setWorkoutCount(count ? parseInt(count) : 0);
    };
    fetchWorkoutCount();
  }, []);

  const startWorkout = () => router.push("/workout");
  const viewHistory = () => router.push("/profile/history");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.text}>Total Workouts: {workoutCount}</Text>
      <Button title="Start Workout" onPress={startWorkout} />
      <View style={styles.buttonSpacer}>
        <Button title="View History" onPress={viewHistory} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
  },
  title: theme.typography.title,
  text: theme.typography.text,
  buttonSpacer: {
    marginTop: theme.spacing.medium,
  },
});
