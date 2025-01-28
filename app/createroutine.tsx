import { View, Text, StyleSheet } from "react-native";

export default function CreateRoutine() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Routine</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#16385e",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
