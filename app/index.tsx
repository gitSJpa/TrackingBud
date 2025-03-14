import { Redirect } from "expo-router";
import { getAuth } from "firebase/auth";
import { app as firebaseApp } from "../config/firebase-config";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Index() {
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

  return user ? <Redirect href="/tabs" /> : <Redirect href="/login" />;
}
