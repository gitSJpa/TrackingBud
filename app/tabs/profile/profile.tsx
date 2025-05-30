import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app as firebaseApp } from "../../../config/firebase-config"; // Adjust path
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../../../config/theme-config"; // Adjust path
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/dateUtils";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState("Stats");
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [bestLift, setBestLift] = useState({ name: "", weight: 0 });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [userName, setUserName] = useState("");

  const loadData = useCallback(async () => {
    console.log("Loading data for ProfilePage");
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user found.");
      }

      const userWorkoutsRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "workouts"
      );
      const querySnapshot = await getDocs(userWorkoutsRef);
      const history = querySnapshot.docs.map((doc) => doc.data());

      setTotalWorkouts(history.length);
      const timeSum = history.reduce(
        (sum, workout) => sum + (workout.duration || 0),
        0
      );
      setTotalTime(timeSum);
      const repsSum = history.reduce(
        (sum, workout) =>
          sum +
          workout.exercises.reduce((exSum, ex) => exSum + (ex.reps || 0), 0),
        0
      );
      setTotalReps(repsSum);

      let maxWeight = 0;
      let maxExercise = "";
      history.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          if ((exercise.weight || 0) > maxWeight) {
            maxWeight = exercise.weight;
            maxExercise = exercise.name;
          }
        });
      });
      setBestLift({ name: maxExercise, weight: maxWeight });

      setRecentWorkouts(history.slice(-3).reverse());

      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      const daysToMonday = (dayOfWeek + 6) % 7;
      startOfWeek.setDate(now.getDate() - daysToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dateStr = formatDate(day);
        const hasWorkout = history.some((workout) => workout.date === dateStr);
        return {
          date: dateStr,
          dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
          hasWorkout,
        };
      });
      setWeekData(weekDays);

      setUserName(auth.currentUser.displayName || "User");
    } catch (error) {
      console.error("Error loading profile data:", error);
      setTotalWorkouts(0);
      setTotalTime(0);
      setTotalReps(0);
      setBestLift({ name: "", weight: 0 });
      setRecentWorkouts([]);
      setWeekData([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("ProfilePage focused");
      loadData();
    }, [loadData])
  );

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
  };

  const renderContent = () => {
    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.refreshIcon} onPress={loadData}>
          <Ionicons name="refresh" size={24} color={theme.colors.accent} />
        </TouchableOpacity>

        {selectedSection === "Stats" && (
          <>
            <Text style={styles.sectionTitle}>Stats Summary</Text>
            <Text style={styles.text}>Total Workouts: {totalWorkouts}</Text>
            <Text style={styles.text}>Total Time: {formatTime(totalTime)}</Text>
            <Text style={styles.text}>Total Reps: {totalReps}</Text>
            <Text style={styles.text}>
              Best Lift:{" "}
              {bestLift.name
                ? `${bestLift.name} ${bestLift.weight}kg`
                : "No lifts recorded"}
            </Text>
            <View style={styles.weekContainer}>
              <Text style={styles.weekTitle}>This Week</Text>
              <View style={styles.weekDays}>
                {weekData.map((day, index) => (
                  <View
                    key={index}
                    style={[styles.dayBox, day.hasWorkout && styles.workoutDay]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        day.hasWorkout && styles.workoutDayText,
                      ]}
                    >
                      {day.dayName}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.weekSummary}>
                Workout days this week:{" "}
                {weekData.filter((day) => day.hasWorkout).length}
              </Text>
            </View>
          </>
        )}

        {selectedSection === "History" && (
          <>
            <Text style={styles.sectionTitle}>Recent History</Text>
            {recentWorkouts.length === 0 ? (
              <Text style={styles.text}>No workouts logged yet.</Text>
            ) : (
              <ScrollView>
                {recentWorkouts.map((workout, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.text}>
                      {workout.date}{" "}
                      {workout.duration
                        ? `(${formatTime(workout.duration)})`
                        : ""}
                    </Text>
                    {workout.exercises.map((exercise, idx) => (
                      <Text key={idx} style={styles.text}>
                        - {exercise.name}: {exercise.reps} reps of{" "}
                        {exercise.weight}kg
                      </Text>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Profile</Text>
      <Text style={styles.profileText}>Name: {userName}</Text>
      <Text style={styles.profileText}>Email: {auth.currentUser?.email}</Text>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedSection === "Stats" && styles.activeTab]}
          onPress={() => setSelectedSection("Stats")}
        >
          <Text
            style={[
              styles.tabText,
              selectedSection === "Stats" && styles.activeTabText,
            ]}
          >
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedSection === "History" && styles.activeTab,
          ]}
          onPress={() => setSelectedSection("History")}
        >
          <Text
            style={[
              styles.tabText,
              selectedSection === "History" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.large,
  },
  profileTitle: {
    ...theme.typography.title,
    marginBottom: theme.spacing.medium,
  },
  profileText: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.large,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.small,
  },
  tab: {
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.small,
  },
  activeTab: {
    backgroundColor: theme.colors.accent,
  },
  tabText: {
    ...theme.typography.tabText,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.text,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    position: "relative",
  },
  refreshIcon: {
    position: "absolute",
    top: theme.spacing.small,
    right: theme.spacing.small,
    zIndex: 1,
  },
  sectionTitle: {
    ...theme.typography.sectionTitle,
    marginBottom: theme.spacing.medium,
  },
  text: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
  },
  historyItem: {
    backgroundColor: theme.colors.historyItem,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
  },
  weekContainer: {
    marginTop: theme.spacing.large,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.historyItem,
    borderRadius: theme.borderRadius.large,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.medium,
  },
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutDay: {
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  dayText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  workoutDayText: {
    color: theme.colors.text,
    fontWeight: "bold",
  },
  weekSummary: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
