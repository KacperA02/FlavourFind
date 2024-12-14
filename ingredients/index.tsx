// import { View, Text, StyleSheet } from 'react-native';
// import { FlatList } from 'react-native';
// import {useState,useEffect} from 'react';
// import axios from 'axios';
// import {Link} from 'expo-router';
// import { IngredientType } from '@/types';
// import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
// import IngredientItem from '@/components/IngredientItem';
// export default function Tab() {
//   const [ingredients,setIngredients] = useState([]);
//   useEffect(()=> {
//     axios.get('')
//     .then(response => {
//       console.log(response.data)
//       setIngredients(response.data);
//     })
//     .catch(err => {
//       console.log(err)
//     })
//   },[])
//   if(!ingredients) return <Text>No ingredients found</Text>
//   return (
//     <SafeAreaProvider>
//     <SafeAreaView style={styles.container}>
//        <FlatList 
//           data={ingredients}
//           renderItem={({item})=> <IngredientItem recipe={item} />}
//           keyExtractor={(ingredient: IngredientType) => ingredient._id}
//        />
//     </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
