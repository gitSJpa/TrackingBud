import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Routines() {
  const [routines, setRoutines] = useState([]);
  const router = useRouter();

  // Load routines from AsyncStorage
  const loadRoutines = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const storedRoutines = await AsyncStorage.multiGet(keys);

      // Filter for keys that belong to routines
      const parsedRoutines = storedRoutines
        .map(([key, value]) =>
          key.startsWith("routine_") ? JSON.parse(value) : null
        )
        .filter((routine) => routine !== null);

      setRoutines(parsedRoutines);
    } catch (error) {
      console.error("Failed to load routines:", error);
    }
  };

  // Delete a routine
  const deleteRoutine = async (id) => {
    try {
      await AsyncStorage.removeItem(`routine_${id}`);
      Alert.alert("Deleted", "The routine has been deleted.");
      loadRoutines(); // Reload the routines
    } catch (error) {
      console.error("Failed to delete routine:", error);
    }
  };

  // Navigate to workout session
  const startWorkout = (routine) => {
    router.push({
      pathname: "/routinestart",
      params: { routine: JSON.stringify(routine) }, // Pass routine data
    });
  };

  useEffect(() => {
    loadRoutines();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Routines</Text>

      {routines.length === 0 ? (
        <Text style={styles.noRoutinesText}>
          No routines found. Create one first!
        </Text>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.routineItem}>
              <Text style={styles.routineName}>{item.name}</Text>
              <View style={styles.buttons}>
                <Button
                  title="Start Workout"
                  onPress={() => startWorkout(item)}
                />
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => deleteRoutine(item.id)}
                />
              </View>
            </View>
          )}
        />
      )}
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
  noRoutinesText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  routineItem: {
    backgroundColor: "#204b7d",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  routineName: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
