import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function ProfilePage() {
  const [selectedSection, setSelectedSection] = useState("Stats");

  const renderContent = () => {
    if (selectedSection === "Stats") {
      return (
        <View>
          <Text style={styles.sectionTitle}>Stats</Text>
          <Text style={styles.text}>Total Workouts: 10</Text>
          <Text style={styles.text}>Best Lift: Deadlift 100kg</Text>
          {/* Add more stats as needed */}
        </View>
      );
    }

    if (selectedSection === "History") {
      return (
        <View>
          <Text style={styles.sectionTitle}>Workout History</Text>
          <ScrollView>
            {/* Mock workout history for now */}
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
      {/* Section Tabs */}
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

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16385e",
    padding: 16,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFFFFF",
  },
  tabText: {
    color: "#7A9EB1",
    fontSize: 16,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
});
