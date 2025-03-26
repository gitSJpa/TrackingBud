import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme-config";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.inactiveTab,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "workout")
            iconName = focused ? "barbell" : "barbell-outline";
          else if (route.name === "profile/profile")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }} />
      <Tabs.Screen name="workout" options={{ tabBarLabel: "Workout" }} />
      <Tabs.Screen
        name="profile/profile"
        options={{ tabBarLabel: "Profile" }}
      />
      <Tabs.Screen name="profile/history" options={{ href: null }} />
      <Tabs.Screen name="profile/stats" options={{ href: null }} />
      <Tabs.Screen name="createroutine" options={{ href: null }} />
      <Tabs.Screen name="routinestart" options={{ href: null }} />
      <Tabs.Screen name="routines" options={{ href: null }} />
      <Tabs.Screen name="start" options={{ href: null }} />
    </Tabs>
  );
}
