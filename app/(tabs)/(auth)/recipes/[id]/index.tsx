import { View, Text, StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import {useState,useEffect} from 'react';
import axios from 'axios';
import { RecipeType } from '@/types';
import useAPI from '@/hooks/useAPI'
import { useSession } from '@/contexts/AuthContext';
// import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import RecipeCardSingle from '@/components/RecipeSingleComp';
import { IAuthContext } from '@/types';
import { RecipeTypeID } from '@/types';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
export default function Tab() {
  const [recipe,setRecipe] = useState<RecipeTypeID | null>(null);
  const {id,updated } = useLocalSearchParams();
  const {session, isLoading, user} = useSession();
  const { getRequest, loading, error } = useAPI();
  useEffect(()=> {
    if (!session) {
        console.log("No session token available.");
        return;
      }
      
      getRequest(
        `https://recipe-backend-rose.vercel.app/api/recipes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        },
        (data) => {
          setRecipe(data.data);
        }
      );
    }, [id, session, getRequest,updated]);
  if(!recipe) return <Text>No Recipe found</Text>
  if(loading === true) return  <ActivityIndicator animating={true} color={MD2Colors.red800} size='large'  />
  return (
    <View style={styles.container}>
    <RecipeCardSingle recipe={recipe} user={user}  />
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
