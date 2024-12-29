import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import LoginForm from "@/components/LoginForm";
import { useSession } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
export default function Tab() {
	const { session, signOut, user } = useSession();
	const [myRecipes, setMyRecipes] = useState([]);
	const { deleted, updated } = useLocalSearchParams();

	useEffect(() => {
		if (session) {
			axios
				.get("https://recipe-backend-rose.vercel.app/api/users/myRecipes", {
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
				});
		}
	}, [session, deleted, updated]);
	
	return (
		
    <View>
		
			{/* Show either the login form or logged-in content based on session */}
			{session ? (
				<View>
					<Text>Welcome, {user?.first_name}</Text>
					{/* Display the logout button when logged in */}
					<Button onPress={signOut} title="Logout" color="#841584" />
						{/* My Recipes Section */}
						<View>
							<Text>My Recipes</Text>
							<FlatList
								data={myRecipes}
								renderItem={({ item }) => <RecipeItem recipe={item} />}
								keyExtractor={(recipe: RecipeTypeID) => recipe._id}
							/>
						</View>
					</View>
			) : (
				<LoginForm />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	//  Neeed to add some styles
});
