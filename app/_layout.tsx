import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#16385e" },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#7A9EB1",
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "barbell"
            | "barbell-outline"
            | "person"
            | "person-outline";

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "workout") {
            iconName = focused ? "barbell" : "barbell-outline";
          } else if (route.name === "profile/profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "home"; // or some other default value
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
        }}
      />

      {/* Workout */}
      <Tabs.Screen
        name="workout"
        options={{
          tabBarLabel: "Workout",
        }}
      />
      <Tabs.Screen
        name="start"
        options={{
          href: null, // Excludes this route from the tabs
        }}
      />
      <Tabs.Screen
        name="createroutine"
        options={{
          href: null, // Excludes this route from the tabs
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile/profile"
        options={{
          tabBarLabel: "Profile",
        }}
      />

      {/* Ensure history and stats do NOT appear */}
      <Tabs.Screen
        name="profile/history"
        options={{
          href: null, // Excludes this route from the tabs
        }}
      />
      <Tabs.Screen
        name="profile/stats"
        options={{
          href: null, // Excludes this route from the tabs
        }}
      />
    </Tabs>
  );
}
