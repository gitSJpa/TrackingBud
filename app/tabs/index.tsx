import { View, Text, Button, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { theme } from "../../theme-config";
import { getAuth, signOut } from "firebase/auth";
import { app as firebaseApp } from "../../config/firebase-config";

export default function HomePage() {
  const [workoutCount, setWorkoutCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });

    const fetchWorkoutCount = async () => {
      try {
        let count;
        if (Platform.OS === "web") {
          count = localStorage.getItem("totalWorkouts");
        } else {
          count = await SecureStore.getItemAsync("totalWorkouts");
        }
        setWorkoutCount(count ? parseInt(count) : 0);
      } catch (error) {
        console.error("Error fetching workout count:", error);
        setWorkoutCount(0);
      }
    };
    fetchWorkoutCount();

    return () => unsubscribe();
  }, []);

  const startWorkout = () => router.push("/tabs/workout");
  const viewHistory = () => router.push("/tabs/profile/history");
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.email}!</Text>
      <Text style={styles.text}>Total Workouts: {workoutCount}</Text>
      <Button
        title="Start Workout"
        onPress={startWorkout}
        color={theme.colors.accent}
      />
      <View style={styles.buttonSpacer}>
        <Button
          title="View History"
          onPress={viewHistory}
          color={theme.colors.accent}
        />
      </View>
      <View style={styles.buttonSpacer}>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          color={theme.colors.accent}
        />
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
    padding: theme.spacing.large,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.large,
  },
  text: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.large,
  },
  buttonSpacer: {
    marginTop: theme.spacing.medium,
  },
});
