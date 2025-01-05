import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import { RecipeTypeID } from "@/types";
import { useRouter } from "expo-router";
import { IUser } from "@/types";
import DeleteButton from "../DeleteBtn";
import { useSession } from "@/contexts/AuthContext";
interface MyProps {
	recipe: RecipeTypeID;
	user: IUser | null;
}

export default function RecipeCardSingle({ recipe, user }: MyProps) {
	const router = useRouter();
	const {  isAdmin } = useSession();
	// dimensions to check screen size
	const { width } = Dimensions.get("window");
	// check if screen is large
	const isLargeScreen = width > 768; 
	const imageUrl = `${process.env.EXPO_PUBLIC_MY_IMAGE_URL}${recipe?.image_path}`;
	
	// State to toggle expansion of description and instructions
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);
	const [instructionsExpanded, setInstructionsExpanded] = useState(false);
	// Function to toggle expansions
	const toggleDescription = () => setDescriptionExpanded(!descriptionExpanded);
	const toggleInstructions = () =>
		setInstructionsExpanded(!instructionsExpanded);

	return (
		<View style={[styles.container, isLargeScreen && styles.containerLarge]}>
			{/* Image inside the Card for Small Screens */}
			{recipe.image_path && !isLargeScreen && (
				<Card.Cover
					source={{ uri: imageUrl }}
					style={[styles.image, !isLargeScreen && styles.imageSmall]}
					resizeMode="cover"
				/>
			)}

			{/* Text Content Card */}
			<Card style={[styles.card, isLargeScreen && styles.cardLargeText]}>
				<Card.Content
					style={[styles.content, isLargeScreen && styles.contentLarge]}
				>
					{/* Title and Cooking Time */}
					<Text variant="headlineSmall" style={styles.title}>
						{recipe.title}
					</Text>
					<Text style={styles.cookingTime}>
						Cooking Time: {recipe.cooking_time} mins
					</Text>

					{/* Description */}
					<Text style={styles.sectionTitle}>Description:</Text>
					<ScrollView
						style={styles.scrollableContent}
						contentContainerStyle={styles.scrollableContainer}
					>
						<Text style={styles.description}>
							{descriptionExpanded
								? recipe.description
								: `${recipe.description.slice(0, 100)}...`}
						</Text>
					</ScrollView>
					{/* button to toggle expansion as text may be long */}
					<Button mode="text" onPress={toggleDescription}>
						{descriptionExpanded ? "See Less" : "See More"}
					</Button>

					{/* Instructions */}
					<Text style={styles.sectionTitle}>Instructions:</Text>
					<ScrollView
						style={styles.scrollableContent}
						contentContainerStyle={styles.scrollableContainer}
					>
						<Text style={styles.instructions}>
							{instructionsExpanded
								? recipe.instructions
								: `${recipe.instructions.slice(0, 100)}...`}
						</Text>
					</ScrollView>
					<Button mode="text" onPress={toggleInstructions}>
						{instructionsExpanded ? "See Less" : "See More"}
					</Button>

					{/* Ingredients */}
					<Text variant="titleMedium" style={styles.sectionTitle}>
						Ingredients:
					</Text>
					<ScrollView style={styles.scrollableContent}>
						{recipe.ingredients.length > 0 ? (
							// map through ingredients and display them
							recipe.ingredients.map((ingredientEntry, index) => (
								<Text key={index} style={styles.ingredient}>
									- {ingredientEntry.quantity}
									{ingredientEntry.ingredient.unit_id.abbreviation} of{" "}
									{ingredientEntry.ingredient.name} -{" "}
									{ingredientEntry.ingredient.calories} calories
								</Text>
							))
						) : (
							<Text style={styles.noIngredients}>No ingredients found</Text>
						)}
					</ScrollView>
				</Card.Content>

				{/* Actions */}
				{(user && user._id === recipe.user) || isAdmin ? (
					<Card.Actions style={styles.actions}>
						<Button
							mode="contained"
							onPress={() => router.push(`/recipes/${recipe._id}/edit`)}
						>
							Edit
						</Button>
						<DeleteButton
							id={recipe._id}
							resource="recipes"
							onDeleteSuccess={() => alert("Recipe Deleted Successfully")}
						/>
					</Card.Actions>
				) : null}
			</Card>

			{/* Image outside of Card for Large Screens */}
			{recipe.image_path && isLargeScreen && (
				<View
					style={[
						styles.imageContainer,
						isLargeScreen && styles.imageContainerLarge,
					]}
				>
					<Card.Cover
						source={{ uri: imageUrl }}
						style={styles.image}
						resizeMode="cover"
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// Stacks image and text on smaller screens
		flexDirection: "column",
		margin: 16,
	},
	containerLarge: {
		// Stacks images reversed on larger screens
		flexDirection: "column-reverse",
		margin: 16,
	},
	// image container for smaller screens
	imageContainer: {
		marginBottom: 16,
	},
	// image container for larger screens
	imageContainerLarge: {
		height: 500,
		marginRight: 24,
		marginLeft: 20,
	},
	// image styles
	image: {
		width: "100%",
		height: "100%",
	},
	imageSmall: {
		height: 200,
	},
	card: {
		marginBottom: 16,
		borderRadius: 8,
		elevation: 3,
		overflow: "hidden",
	},
	cardLargeText: {
		flex: 2,
	},
	content: {
		padding: 16,
		flex: 1,
	},
	// content styles for larger screens
	contentLarge: {
		paddingHorizontal: 24,
		justifyContent: "center",
	},
	//different styles for each entity
	title: {
		fontWeight: "bold",
		marginBottom: 8,
		color: "#2c3e50",
	},
	cookingTime: {
		fontSize: 14,
		color: "#7f8c8d",
		marginBottom: 16,
	},
	sectionTitle: {
		fontWeight: "bold",
		marginBottom: 8,
		color: "#2c3e50",
	},
	description: {
		fontSize: 14,
		color: "#34495e",
		marginBottom: 8,
	},
	instructions: {
		fontSize: 14,
		color: "#34495e",
		marginBottom: 8,
	},
	ingredient: {
		fontSize: 14,
		color: "#7f8c8d",
		marginBottom: 4,
	},
	noIngredients: {
		fontSize: 14,
		color: "#c0392b",
	},
	actions: {
		justifyContent: "flex-end",
		marginTop: 8,
		paddingRight: 16,
	},
	scrollableContent: {
		maxHeight: 150,
		// set a max width for the scrollable content as it expanded horizontally
		maxWidth: 600,
	},
	// flex direction is column to allow for vertical scrolling
	scrollableContainer: {
		flexDirection: "column",
	},
});
