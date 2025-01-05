import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "expo-router";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button, Snackbar,Text } from "react-native-paper";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
import { useLocalSearchParams } from "expo-router";
export default function Tab() {
	// const devUrl = process.env.EXPO_PUBLIC_DEV_URL;
	const [recipes, setRecipes] = useState([]);
	// using snack bar to display any error messages
	const [snackBarVisible, setSnackBarVisible] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState("");
	const { deleted, updated } = useLocalSearchParams();
	//  getting the recipes
	useEffect(() => {
		axios
			.get(`${process.env.EXPO_PUBLIC_DEV_URL}recipes`)
			.then((response) => {
				// filtering recipes to find ones that aren't deleted
				const filteredRecipe = response.data.filter(
					(recipe: RecipeTypeID) => recipe.isDeleted === false
				);
				console.log(response.data);
				setRecipes(filteredRecipe);
			})
			.catch((err) => {
				console.log(err);
				setSnackBarMessage("Failed to load recipes");
				setSnackBarVisible(true);
			});
	}, [updated, deleted]);

	if (!recipes) return <Text>No recipes found</Text>;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				{/* Button to create new recipes */}
				<Link href={{ pathname: "/recipes/create" }}>
					<Button
						mode="contained"
						onPress={() =>
							setSnackBarMessage("oops.. Check if your logged in!")
						}
					>
						Create Your Own Recipe
					</Button>
				</Link>
				{/* Recipe List */}
				<FlatList
					data={recipes}
					renderItem={({ item }) => <RecipeItem recipe={item} />}
					keyExtractor={(recipe: RecipeTypeID) => recipe._id}
				/>

				{/* Snack bar to show error messages */}
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
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingTop: 20,
	},
});
