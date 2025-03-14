import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { theme } from "../../../theme-config";

export default function StatsPage() {
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        const storedHistory = await SecureStore.getItemAsync("workoutHistory");
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        const workoutCount = history.length;
        const timeSum = history.reduce(
          (sum, workout) => sum + (workout.duration || 0),
          0
        );
        const storedTotalWorkouts = await SecureStore.getItemAsync(
          "totalWorkouts"
        );
        const storedTotalTime = await SecureStore.getItemAsync("totalTime");
        setTotalWorkouts(
          Math.max(
            workoutCount,
            storedTotalWorkouts ? parseInt(storedTotalWorkouts) : 0
          )
        );
        setTotalTime(
          Math.max(timeSum, storedTotalTime ? parseInt(storedTotalTime) : 0)
        );

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(
          now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const weekDays = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          const dateStr = day.toLocaleDateString();
          const hasWorkout = history.some(
            (workout) => workout.date === dateStr
          );
          return {
            date: dateStr,
            dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
            hasWorkout,
          };
        });
        setWeekData(weekDays);
      } catch (error) {
        console.error("Error loading workout data:", error);
        setTotalWorkouts(0);
        setTotalTime(0);
        setWeekData([]);
      }
    };
    loadWorkoutData();
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Stats</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.text}>Total Workouts: {totalWorkouts}</Text>
        <Text style={styles.text}>
          Total Time Worked Out: {formatTime(totalTime)}
        </Text>
      </View>
      <View style={styles.weekContainer}>
        <Text style={styles.sectionTitle}>This Week</Text>
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
          Workouts this week: {weekData.filter((day) => day.hasWorkout).length}
        </Text>
      </View>
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
  statsContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.large,
  },
  text: {
    ...theme.typography.text,
    color: theme.colors.textSecondary,
    fontSize: 18,
    marginBottom: theme.spacing.medium,
  },
  weekContainer: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
  },
  sectionTitle: {
    ...theme.typography.sectionTitle,
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
    backgroundColor: theme.colors.historyItem,
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
