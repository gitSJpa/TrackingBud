import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: theme.colors.primary },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.inactiveTab,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "workout") {
            iconName = focused ? "barbell" : "barbell-outline";
          } else if (route.name === "profile/profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="workout" options={{ tabBarLabel: "Workout" }} />
      <Tabs.Screen name="start" options={{ href: null }} />
      <Tabs.Screen name="createroutine" options={{ href: null }} />
      <Tabs.Screen name="routines" options={{ href: null }} />
      <Tabs.Screen name="routinestart" options={{ href: null }} />
      <Tabs.Screen
        name="profile/profile"
        options={{ tabBarLabel: "Profile" }}
      />
      <Tabs.Screen name="profile/history" options={{ href: null }} />
      <Tabs.Screen name="profile/stats" options={{ href: null }} />
    </Tabs>
  );
}
