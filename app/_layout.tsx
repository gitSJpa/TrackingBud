import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext"; // Adjust the path to your AuthContext file, bug fixes by gpt
import { StatusBar } from "react-native";
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
