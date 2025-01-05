import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// useFavorites is a custom hook that provides access to the favorites context
import { useFavorites } from '@/contexts/FavouriteContext'; 
// favourite button component that toggles the favorite status of a recipe
const FavouriteButton = ({ id }: { id: string }) => {
  const { favorites, toggleFavorite, loading } = useFavorites();
  const [isFavourite, setIsFavourite] = useState(false);

  // checks if the recipe is already a favorite
  useEffect(() => {
    setIsFavourite(favorites.some((fav) => fav._id === id));
  }, [favorites, id]);
// handles the toggle of the favorite status
  const handleToggle = () => {
    toggleFavorite(id); 
  };

  return (
    // button that displays a filled heart icon when the recipe is a favorite or an outlined heart icon when it is not
    <TouchableOpacity style={styles.button} onPress={handleToggle} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="red" />
      ) : (
        <FontAwesome name={isFavourite ? 'heart' : 'heart-o'} size={24} color={isFavourite ? 'red' : 'gray'} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default FavouriteButton;
