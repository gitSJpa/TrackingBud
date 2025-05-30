import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../config/theme-config";

export default function WorkoutPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <Button
          title="Start Workout"
          onPress={() => router.push("/tabs/start")}
          color={theme.colors.accent}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Routines</Text>
        <Button
          title="Create Routine"
          onPress={() => router.push("/tabs/createroutine")}
          color={theme.colors.accent}
        />
        <View style={styles.buttonSpacer}>
          <Button
            title="Start Routine"
            onPress={() => router.push("/tabs/routines")}
            color={theme.colors.accent}
          />
        </View>
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
  section: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    ...theme.typography.sectionTitle,
    marginBottom: theme.spacing.medium,
  },
  buttonSpacer: {
    marginTop: theme.spacing.small,
  },
});
