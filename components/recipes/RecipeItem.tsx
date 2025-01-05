import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { Link } from 'expo-router';
import { RecipeTypeID } from '@/types';
import FavouriteButton from '../FavouriteBtn';

interface MyProps {
  recipe: RecipeTypeID;
}

export default function RecipeItem({ recipe }: MyProps) {
  const imageUrl = `${process.env.EXPO_PUBLIC_MY_IMAGE_URL}${recipe?.image_path}`;

  return (
    <Card style={styles.card}>
      {/* Image */}
      {recipe.image_path && (
        <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
      )}

      <Card.Content style={styles.content}>
        {/* Title and Link */}
        <Link
          href={{
            pathname: '/recipes/[id]',
            params: { id: recipe._id },
          }}
          style={styles.link}
        >
          <Title style={styles.title}>{recipe.title}</Title>
        </Link>

        {/* Recipe Info */}
        <Paragraph style={styles.category}>Category: {recipe?.category?.name}</Paragraph>
        <Paragraph style={styles.cookingTime}>Cooking Time: {recipe.cooking_time} mins</Paragraph>

        {/* Favorite Button (using IconButton from React Native Paper) */}
        <FavouriteButton id={recipe._id} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Card Styles
  card: {
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 5,
    justifyContent: 'center',
   
    backgroundColor: '#fff',
    shadowColor: '#000',
    // shadowOffset is used to give the shadow an offset both directions
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity is used to control the transparency of the shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignContent: 'center',
    // justifyContent: 'center',
    // overflow is used to hide the shadow that goes outside the card
    overflow: 'hidden',
  },
  content: {
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 16,
    textAlign: 'center'
  },
  // fixed height for the image
  image: {
    height: 180, 
  },
  // removing the decoration from the link
  link: {
    textDecorationLine: 'none',
  },
  title: {
    // alignItems: 'center',
    // textAlign: 'center',
    paddingTop : 8,
    marginTop:10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  cookingTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
});
