import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { RecipeTypeID } from "@/types";
import { useRouter } from "expo-router";
import { IUser } from "@/types";
import DeleteButton from "../DeleteBtn";

import { useSession } from "@/contexts/AuthContext";
import { FlatList } from "react-native-gesture-handler";
interface MyProps {
	recipe: RecipeTypeID;
	user: IUser | null;
}
const router = useRouter();

// const LeftContent = (myProps) => <Avatar.Icon {...MyProps} icon="food" />;

export default function RecipeCardSingle({ recipe, user }: MyProps) {
	return (
		<Card style={styles.card}>
			{/* Card Header */}
			<Card.Title
				title={recipe.title}
				subtitle={`Cooking Time: ${recipe.cooking_time} mins`}
				// left={LeftContent}
			/>

			{/* Recipe Image */}
			{/* {recipe.image_path && (
        <Card.Cover
          source={{ uri: `https://your-image-url.com/${recipe.image_path}` }}
          style={styles.image}
        />
      )} */}

			{/* Card Content */}
			<Card.Content>
				{/* Description */}
				<Text variant="bodyMedium" style={styles.description}>
					{recipe.description}
				</Text>

				{/* Ingredients */}
				<Text variant="titleMedium" style={styles.sectionTitle}>
					Ingredients:
				</Text>

				{recipe.ingredients.map((ingredientEntry, index) =>
					ingredientEntry ? (
						<Text key={index} style={styles.ingredient}>
							- {ingredientEntry.quantity}
							{ingredientEntry.ingredient.unit_id.abbreviation} of{" "}
							{ingredientEntry.ingredient.name} -{" "}
							{ingredientEntry.ingredient.calories} calories
						</Text>
					) : (
						"No Ingredient Found"
					)
				)}
			</Card.Content>

			{/* Card Actions */}
			{user && user._id === recipe.user ? (
				<Card.Actions>
					<Button onPress={() => router.push(`/recipes/${recipe._id}/edit`)}>
						Edit Details
					</Button>
					<DeleteButton id={recipe._id} resource="recipes" />
				</Card.Actions>
			) : (
				""
			)}
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		margin: 16,
		borderRadius: 8,
		elevation: 3,
	},
	image: {
		height: 200,
	},
	description: {
		marginBottom: 8,
		color: "#34495e",
	},
	sectionTitle: {
		marginTop: 8,
		fontWeight: "bold",
		color: "#2c3e50",
	},
	ingredient: {
		marginBottom: 4,
		color: "#7f8c8d",
	},
});
