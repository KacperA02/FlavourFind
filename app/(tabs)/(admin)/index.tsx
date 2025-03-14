import { View, Text, Button, StyleSheet } from "react-native";
import { useSession } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import { useRouter } from "expo-router";
export default function AdminIndex() {
	const router = useRouter();
	const { session, isAdmin } = useSession();
	// redirects to login page if user isn't logged in
	if (!session || !isAdmin) {
		return <LoginForm />;
	}
// This page shows all the different routes for admins
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to the Admin Dashboard</Text>
			<Button title="Manage Users" onPress={() => router.push("/users")} />
			<Button
				title="Manage Ingredients"
				onPress={() => router.push("/ingredients")}
			/>
			<Button
				title="Manage Ingredient Categories"
				onPress={() => router.push("/ingredientCat")}
			/>
			<Button
				title="Manage Recipe Categories"
				onPress={() => router.push("/recipeCat")}
			/>
			<Button title="Manage units" onPress={() => router.push("/units")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column", 
		justifyContent: "space-around", 
		margin: 50,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10, 
	},
});
