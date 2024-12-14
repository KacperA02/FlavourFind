import { View, Text, StyleSheet, Button, FlatList} from 'react-native';
import LoginForm from '@/components/LoginForm';
import { useSession } from '@/contexts/AuthContext';
import { useEffect,useState } from 'react';
import axios from 'axios';
import RecipeItem from '@/components/RecipeItem';
import { RecipeTypeID } from '@/types';
import { Link } from 'expo-router';
export default function Tab() {
  const { session, signOut } = useSession();
  const [favourite, setFavourite] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  useEffect(() => {
    if (session) {
     
      axios
        .get('https://recipe-backend-rose.vercel.app/api/users/favourites', {
          headers: { Authorization: `Bearer ${session}` }
        })
        .then((response) => {
          console.log(response.data.favourites)
          setFavourite(response.data.favourites);
        })
        .catch((error) => {
          console.error('Error fetching user data', error);
        });

      axios
        .get('https://recipe-backend-rose.vercel.app/api/users/myRecipes', {
          headers: { Authorization: `Bearer ${session}` }
        })
        .then((response) => {
          console.log(response.data.recipes)
          setMyRecipes(response.data.recipes); 
        })
        .catch((error) => {
          console.error('Error fetching recipes', error);
        });
    }
  }, [session]);
  return (
    <View>

      {/* Show either the login form or logged-in content based on session */}
      {session ? (
        <View>
          {/* Display the logout button when logged in */}
          <Button onPress={signOut} title="Logout" color="#841584" />
            {/* displaying */}
            <View>
            {/* Favourites Section */}
            <View>
            <Text>Favourites</Text>
          {favourite.length === 0 ? (
             <Link href={{pathname: '/recipes'}}>
              <Button
                title="Check out some Recipes!"
                onPress={() => {}}
                color="#007BFF"
              />
            </Link>
          ):(
            <FlatList
               
            data={favourite}
            renderItem={({ item }) => <RecipeItem recipe={item} />}
           keyExtractor={(recipe: RecipeTypeID) => recipe._id}
            />
          )}
            </View>

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