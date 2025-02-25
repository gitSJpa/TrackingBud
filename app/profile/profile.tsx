import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { theme } from "../theme";

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState("Stats");

  const renderContent = () => {
    if (selectedSection === "Stats") {
      return (
        <View>
          <Text style={styles.sectionTitle}>Stats</Text>
          <Text style={styles.text}>Total Workouts: 10</Text>
          <Text style={styles.text}>Best Lift: Deadlift 100kg</Text>
        </View>
      );
    }
    if (selectedSection === "History") {
      return (
        <View>
          <Text style={styles.sectionTitle}>Workout History</Text>
          <ScrollView>
            <Text style={styles.text}>1. Jan 12, 2025 - Chest & Triceps</Text>
            <Text style={styles.text}>2. Jan 10, 2025 - Legs</Text>
            <Text style={styles.text}>3. Jan 8, 2025 - Back & Biceps</Text>
          </ScrollView>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
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
    padding: theme.spacing.medium,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.medium,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: theme.colors.text,
  },
  tabText: theme.typography.tabText,
  activeTabText: {
    color: theme.colors.text,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  sectionTitle: theme.typography.sectionTitle,
  text: theme.typography.text,
});
