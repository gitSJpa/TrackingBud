import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { theme } from "./theme";

export default function Routines() {
  const [routines, setRoutines] = useState([]);
  const router = useRouter();

  const loadRoutines = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const storedRoutines = await AsyncStorage.multiGet(keys);
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

  const deleteRoutine = async (id) => {
    try {
      await AsyncStorage.removeItem(`routine_${id}`);
      Alert.alert("Deleted", "The routine has been deleted.");
      loadRoutines();
    } catch (error) {
      console.error("Failed to delete routine:", error);
    }
  };

  const startWorkout = (routine) => {
    router.push({
      pathname: "/routinestart",
      params: { routine: JSON.stringify(routine) },
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
                  color={theme.colors.accent}
                />
                <Button
                  title="Delete"
                  color={theme.colors.accent}
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
    padding: theme.spacing.large,
    backgroundColor: theme.colors.primary,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.large,
  },
  noRoutinesText: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.large,
  },
  routineItem: {
    backgroundColor: theme.colors.historyItem,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
  },
  routineName: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
