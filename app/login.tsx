import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app as firebaseApp } from "../config/firebase-config";
import { theme } from "../theme-config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added name state
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name }); // Store name
        Alert.alert("Success", "Account created! Logging you in...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Logged in successfully!");
      }
      router.replace("/tabs/index");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</Text>
      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={theme.colors.placeholder}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button
        title={isSignUp ? "Sign Up" : "Login"}
        onPress={handleAuth}
        color={theme.colors.accent}
      />
      <Button
        title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
        onPress={() => setIsSignUp(!isSignUp)}
        color={theme.colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.large,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.large,
  },
  input: {
    backgroundColor: theme.colors.white,
    color: "#000",
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    width: "80%",
  },
});
