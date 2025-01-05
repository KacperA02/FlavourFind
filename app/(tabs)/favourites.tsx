import React from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
import { Link } from "expo-router";
import { Snackbar, Card, Text, Button} from "react-native-paper";
import { useFavorites } from "@/contexts/FavouriteContext";
import LoginForm from "@/components/LoginForm";
export default function FavoritesTab() {
  const router = useRouter();
  const { session } = useSession();
  const [favourite, setFavourite] = useState<RecipeTypeID[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const { favorites, loading, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (session) {
      setLoadingFavorites(true);
      axios
        .get(`${process.env.EXPO_PUBLIC_DEV_URL}users/favourites`, {
          headers: { Authorization: `Bearer ${session}` },
        })
        .then((response) => {
          setFavourite(response.data.favourites);
        })
        .catch((error) => {
          console.error("Error fetching favorites", error);
          setSnackBarMessage("Failed to load recipes");
          setSnackBarVisible(true);
        })
        .finally(() => {
          setLoadingFavorites(false);
        });
    }
  }, [favorites,session]);

  if (loadingFavorites) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Please log in to view your favorites.</Text>
      </View>
    );
  }

  return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				{/* Centered Container for Welcome and My Recipes */}
				<View style={styles.centeredContainer}>
					{/* Welcome Section */}
					<View style={styles.welcomeContainer}>
						<Card style={styles.card}>
							<Card.Content>
								<Text variant="headlineSmall">
									Favourites
								</Text>
							</Card.Content>
						</Card>
					</View>

					{/* My Recipes Section */}
					{session ? (
						<ScrollView contentContainerStyle={styles.scrollContainer}>
							<View style={styles.myRecipesSection}>
								{/* Displaying Recipe List */}
								{favourite.length > 0 ? (
									<FlatList
										data={favourite}
										renderItem={({ item }) => <RecipeItem recipe={item} />}
										keyExtractor={(recipe: RecipeTypeID) => recipe._id}
									/>
								) : (
									<Button mode="contained" onPress={() => router.push(`/recipes/`)}>Check out some recipes</Button>
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
     maxWidth: "100%",
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
    maxWidth: "100%",
		alignItems: "center", 
		justifyContent: "center", 
	}, loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
