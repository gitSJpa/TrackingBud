import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, onSnapshot } from "firebase/firestore";
import { app as firebaseApp, db } from "../../config/firebase-config"; // Adjust path to your Firebase config
import { theme } from "../../config/theme-config"; // Adjust path to your theme config

export default function HomePage() {
  const [workoutCount, setWorkoutCount] = useState(0);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName || "User");
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Set up real-time listener for workout count
  useEffect(() => {
    if (!user) return;

    const workoutsRef = collection(db, "users", user.uid, "workouts");
    const q = query(workoutsRef);

    const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      setWorkoutCount(querySnapshot.size); // Update count with the number of workouts
    });

    // Cleanup listener when component unmounts or user changes
    return () => unsubscribeSnapshot();
  }, [user]);

  const startWorkout = () => router.push("/tabs/workout");
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setWorkoutCount(0); // Reset count on sign out
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
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.text}>Total Workouts: {workoutCount}</Text>
      <Button
        title="Start Workout"
        onPress={startWorkout}
        color={theme.colors.accent}
      />
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
