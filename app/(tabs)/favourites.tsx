import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator } from "react-native";
import LoginForm from "@/components/LoginForm";
import { useSession } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import RecipeItem from "@/components/recipes/RecipeItem";
import { RecipeTypeID } from "@/types";
import { Link } from "expo-router";

export default function FavoritesTab() {
  const { session, signOut, user } = useSession();
  const [favourite, setFavourite] = useState<RecipeTypeID[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

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
        })
        .finally(() => {
          setLoadingFavorites(false);
        });
    }
  }, [session]);

  if (loadingFavorites) {
    return (
      <View>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Check if the user is logged in */}
      {session ? (
        <View>
          {/* Favourites Section */}
          <View>
            <Text>Favourites</Text>
            {favourite.length === 0 ? (
              <View>
                <Text>No favorites yet.</Text>
                <Link href="/recipes">
                  <Button title="Check out some Recipes!" color="#007BFF" />
                </Link>
              </View>
            ) : (
              <FlatList
                data={favourite}
                renderItem={({ item }) => <RecipeItem recipe={item} />}
                keyExtractor={(recipe: RecipeTypeID) => recipe._id}
              />
            )}
          </View>
        </View>
      ) : (
        <LoginForm />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }
});
