import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "./theme";

export default function WorkoutPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>
      <Text style={styles.sectionTitle}>Quick Start</Text>
      <Button title="Start Workout" onPress={() => router.push("/start")} />
      <Text style={styles.sectionTitle}>Routines</Text>
      <Button
        title="Create Routine"
        onPress={() => router.push("/createroutine")}
      />
      <Button title="Start Routine" onPress={() => router.push("/routines")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.large,
    backgroundColor: theme.colors.primary,
  },
  title: theme.typography.title,
  sectionTitle: theme.typography.sectionTitle,
});
