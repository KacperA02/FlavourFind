import { View, Text, StyleSheet, Button, FlatList, ScrollView } from "react-native";
import LoginForm from "@/components/LoginForm";
import { useSession } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
import { Link } from "expo-router";
import { Snackbar } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from "expo-router";
export default function Tab() {
	const { session, signOut, user } = useSession();
	const [myRecipes, setMyRecipes] = useState([]);
	const { deleted, updated } = useLocalSearchParams();
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const [snackBarVisible, setSnackBarVisible] = useState(false);
	// TOOK TOO LONG THIS WAY
    // const API_URL = process.env.EXPO_PUBLIC_DEV_URL;
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
					console.log(response.data.recipes);
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
		  {session ? (
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			  <Text>Welcome, {user?.first_name}</Text>
			  
			  {/* Display the logout button when logged in */}
			  <Button onPress={signOut} title="Logout" color="#841584" />
			  
			  {/* My Recipes Section */}
			  <Text>My Recipes</Text>
			  <FlatList
				data={myRecipes}
				renderItem={({ item }) => <RecipeItem recipe={item} />}
				keyExtractor={(recipe: RecipeTypeID) => recipe._id}
			  />
			  
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
			</ScrollView>
		  ) : (
			<LoginForm />
		  )}
		</SafeAreaView>
	  </SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingTop: 20,
	},
});
