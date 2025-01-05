import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import LoginForm from "@/components/LoginForm";
import { useSession } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
// appBar is used to display the header
import { Snackbar, Text, Appbar, Card } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function Tab() {
	const { session, signOut, user } = useSession();
	const [myRecipes, setMyRecipes] = useState([]);
	const { deleted, updated } = useLocalSearchParams();
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const [snackBarVisible, setSnackBarVisible] = useState(false);

	useEffect(() => {
		if (session) {
			axios
				.get(`${process.env.EXPO_PUBLIC_DEV_URL}users/myRecipes`, {
					headers: { Authorization: `Bearer ${session}` },
				})
				.then((response) => {
					const filteredRecipe = response.data.recipes.filter(
						(recipe: RecipeTypeID) => recipe.isDeleted === false
					);
					setMyRecipes(filteredRecipe);
				})
				.catch((error) => {
					console.error("Error fetching recipes", error);
					setSnackBarMessage("Failed to load recipes");
					setSnackBarVisible(true);
				});
		}
	}, [session, deleted, updated]);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				{/* AppBar Header */}
				<Appbar.Header>
					<Appbar.Content title="My Recipes"/>
					{session && (
						<Appbar.Action icon="logout" onPress={signOut} />
					)}
				</Appbar.Header>

				{/* Centered Container for Welcome and My Recipes */}
				<View style={styles.centeredContainer}>
					{/* Welcome Section */}
					<View style={styles.welcomeContainer}>
						<Card style={styles.card}>
							<Card.Content>
								<Text variant="headlineSmall">
									Welcome, {user?.first_name}!
								</Text>
							</Card.Content>
						</Card>
					</View>

					{/* My Recipes Section */}
					{session ? (
						<ScrollView contentContainerStyle={styles.scrollContainer}>
							<View style={styles.myRecipesSection}>
								<Text variant="titleMedium">My Recipes</Text>

								{/* Displaying Recipe List */}
								{myRecipes.length > 0 ? (
									<FlatList
										data={myRecipes}
										renderItem={({ item }) => <RecipeItem recipe={item} />}
										keyExtractor={(recipe: RecipeTypeID) => recipe._id}
									/>
								) : (
									<Text>No recipes found</Text>
								)}
							</View>
						</ScrollView>
					) : (
						<LoginForm />
					)}
				</View>

				{/* Snackbar to show error messages */}
				<Snackbar
					visible={snackBarVisible}
					onDismiss={() => setSnackBarVisible(false)}
					action={{
						label: "Close",
						onPress: () => setSnackBarVisible(false),
					}}
				>
					{snackBarMessage}
				</Snackbar>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	// Container for the entire screen
	container: {
		flex: 1,
		justifyContent: "flex-start",
		 // Stretches the content to the width of the screen
		alignItems: "stretch", 
	},
	centeredContainer: {
		flex: 1,
		justifyContent: "center", 
		alignItems: "center", 
		paddingHorizontal: 8,
	},
	// welcomeContainer is used to display the welcome message
	welcomeContainer: {
		width: "90%", 
		height: 100, 
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5", 
		marginBottom: 10, 
	},
	// Card is used to display the welcome message
	card: {
		width: "100%",
		alignItems: "center", 
		justifyContent: "center", 
	},
	// scrollContainer is used to make the My Recipes section scrollable
	scrollContainer: {
		flexGrow: 1, 
	},
	myRecipesSection: {
		// Container for My Recipes section
		flex: 1,
		width: "100%", 
		alignItems: "center", 
	},
});
