import { View, Text, StyleSheet,Image} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Link } from 'expo-router';
import { RecipeTypeID } from '@/types';
interface MyProps {
  recipe: RecipeTypeID;
}

export default function RecipeItem({ recipe }: MyProps) {
  const imageUrl = `${process.env.EXPO_PUBLIC_MY_IMAGE_URL}${recipe?.image_path}`;
  return (
    <Card style={styles.card}>
       {recipe.image_path && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <Card.Content>
        <Link
          href={{
            pathname: '/recipes/[id]',
            params: { id: recipe._id },
          }}
          style={styles.link}
        >
          <Title style={styles.title}>{recipe.title}</Title>
        </Link>
        {/* Adding Category and Cooking Time */}
        <Paragraph style={styles.category}>Category: {recipe?.category?.name}</Paragraph>
        <Paragraph style={styles.cookingTime}>Cooking Time: {recipe.cooking_time} mins</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100, 
  },
  link: {
    textDecorationLine: 'none',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  cookingTime: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
