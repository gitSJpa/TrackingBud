import { useAuth } from "../context/AuthContext"; // Adjust the path to your AuthContext file, bug fixed by gpt
import { Redirect } from "expo-router";
import { Text, StatusBar } from "react-native";

export default function AppIndex() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <Text>Loading...</Text>
      </>
    );
  }

  // Redirect to home if user is logged in, otherwise to login
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      {user ? <Redirect href="/tabs/home" /> : <Redirect href="/login" />}
    </>
  );
}
