import { Stack } from "expo-router";
import { getAuth } from "firebase/auth";
import { app as firebaseApp } from "../config/firebase-config";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Auth state:", currentUser ? "Logged in" : "Logged out");
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="tabs" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
