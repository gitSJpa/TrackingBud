import { useAuth } from '../context/AuthContext'; // Adjust the path to your AuthContext file
import { Redirect } from 'expo-router';
import { Text } from 'react-native';

export default function AppIndex() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Redirect to home if user is logged in, otherwise to login
  return user ? <Redirect href="/tabs/home" /> : <Redirect href="/login" />;
}