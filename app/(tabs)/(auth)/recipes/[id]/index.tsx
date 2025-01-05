import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator, MD2Colors, Card } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import RecipeCardSingle from "@/components/recipes/RecipeSingleComp";
import useAPI from "@/hooks/useAPI";
import { useSession } from "@/contexts/AuthContext";
import { RecipeTypeID } from "@/types";

export default function Tab() {
	const [recipe, setRecipe] = useState<RecipeTypeID | null>(null);
	const { id, updated } = useLocalSearchParams();
	const { session, isLoading, user } = useSession();
	const { getRequest, loading, error } = useAPI();

	useEffect(() => {
		if (!session) {
			console.log("No session token available.");
			return;
		}

		getRequest(
			`${process.env.EXPO_PUBLIC_DEV_URL}recipes/${id}`,
			{
				headers: {
					Authorization: `Bearer ${session}`,
				},
			},
			(data) => {
				setRecipe(data.data);
			}
		);
	}, [id, session, getRequest, updated]);

	if (!recipe) return <Text style={styles.errorText}>No Recipe Found</Text>;
	if (loading)
		return (
			<ActivityIndicator
				animating={true}
				color={MD2Colors.red800}
				size="large"
				style={styles.loader}
			/>
		);

	return (
		// added scroll view to allow for scrolling
		<ScrollView style={styles.scrollContainer}>
			<View style={styles.container}>
				<View style={styles.cardWrapper}>
					<Card style={styles.card}>
						<View style={styles.cardContentWrapper}>
							<RecipeCardSingle recipe={recipe} user={user} />
						</View>
					</Card>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		// Light grey background color
		backgroundColor: "#f4f4f4",
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	// Card styles
	cardWrapper: {
		alignSelf: "center",
	},
	card: {
		marginBottom: 16,
		borderRadius: 8,
		// elevation for Android
		elevation: 3,
		// Apply overflow here to the outer card
		overflow: "hidden", 
	},
	cardContentWrapper: {
		overflow: "visible", // Apply overflow here to the inner content
	},
	// loader styles
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	// error text styles
	errorText: {
		textAlign: "center",
		color: "#e74c3c",
		fontSize: 16,
		marginTop: 20,
	},
});
