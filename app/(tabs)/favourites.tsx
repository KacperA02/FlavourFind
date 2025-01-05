import React from "react";
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
import { Link } from "expo-router";
import { Snackbar } from "react-native-paper";
import { useFavorites } from "@/contexts/FavouriteContext";
export default function FavoritesTab() {
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            {/* Favourites Section */}
            <Text style={styles.sectionTitle}>Favourites</Text>

            {favourite.length === 0 ? (
              <View style={styles.noFavoritesContainer}>
                <Text>No favorites yet.</Text>
                <Link href="/recipes">
                  <Button title="Check out some Recipes!" color="#007BFF" />
                </Link>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>My Favourites</Text>
                <FlatList
                  data={favourite}
                  renderItem={({ item }) => <RecipeItem recipe={item} />}
                  keyExtractor={(recipe: RecipeTypeID) => recipe._id}
                />
              </>
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
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noFavoritesContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
