import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WorkoutPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>

      {/* Quick Start Section */}
      <Text style={styles.sectionTitle}>Quick Start</Text>
      <Button
        title="Start Workout"
        onPress={() => {
          router.push("/start"); // Navigate to start.tsx
        }}
      />

      {/* Routines Section */}
      <Text style={styles.sectionTitle}>Routines</Text>
      <Button
        title="Create Routine"
        onPress={() => {
          router.push("/createroutine"); // Navigate to createroutine.tsx
        }}
      />

      <Button
        title="Start Routine"
        onPress={() => {
          router.push("/routines"); // Navigate to routines.tsx
        }}
      />
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
});
