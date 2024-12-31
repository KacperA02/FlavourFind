import { View, Text, Button, StyleSheet } from "react-native";
import { useSession } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "expo-router";
export default function AdminIndex() {
  const router = useRouter();
  const { session, user } = useSession();
  const isAdmin = (user?.roles?.some(role => role.name === 'admin'))
    // redirects to login page if user isn't logged in
    if (!session || !isAdmin) {
      return <LoginForm />;
    }
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Admin Dashboard</Text>
      <Button title="Manage Users" onPress={() => router.push("/users")} />
      <Button title="Manage Ingredients" onPress={() => router.push("/ingredients")} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});