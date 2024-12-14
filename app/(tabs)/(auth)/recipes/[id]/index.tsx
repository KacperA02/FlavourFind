import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import {useState,useEffect} from 'react';
import axios from 'axios';
import { RecipeType } from '@/types';
import { useSession } from '@/contexts/AuthContext';
// import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import RecipeCardSingle from '@/components/RecipeSingleComp';
import { IAuthContext } from '@/types';
import { RecipeTypeID } from '@/types';
export default function Tab() {
  const [recipe,setRecipe] = useState<RecipeTypeID | null>(null);
  const {id} = useLocalSearchParams();
  const {session, isLoading} = useSession() as IAuthContext;
  useEffect(()=> {
    if (!session) {
        console.log("No session token available.");
        return;
      }
    axios.get(`https://recipe-backend-rose.vercel.app/api/recipes/${id}`, {
        headers:{
            Authorization: `Bearer ${session}`
        }
    })
    .then(response => {
      console.log(response.data.data)
      setRecipe(response.data.data);
    })
    .catch(err => {
      console.log(err)
    })
  },[id,session])
  if(!recipe) return <Text>No Recipe found</Text>
  return (
    <View style={styles.container}>
    <RecipeCardSingle recipe={recipe}  />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
