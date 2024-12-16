import { useState, useEffect, useMemo } from 'react';
import { Text, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSession } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { recipeCategoryType, IIngredientType, RecipeTypeID, IngredientRecipe } from '@/types';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

export default function Page() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { session } = useSession();

  const [oldRecipe, setOldRecipe] = useState<RecipeTypeID | null>(null);
  const [recCategory, setRecCategory] = useState<recipeCategoryType[]>([]);
  const [ingredientList, setIngredientList] = useState<IIngredientType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);

  const [form, setForm] = useState({
    title: '',
    description: '',
    cooking_time: '',
    instructions: '',
    category: '',
    ingredients: [] as IngredientRecipe[],
  });

  const { putRequest, data, loading, error } = useAPI();

  // Fetch Recipe Details
  useEffect(() => {
    if (!session || !id) return;
    axios
      .get(`https://recipe-backend-rose.vercel.app/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${session}` },
      })
      .then((response) => {
        const recipe = response.data.data;
        setOldRecipe(recipe);
        setForm({
          title: recipe.title,
          description: recipe.description,
          cooking_time: recipe.cooking_time.toString(),
          instructions: recipe.instructions,
          category: recipe.category._id,
          ingredients: recipe.ingredients.map((ingredient:{ ingredient: { _id: string }; quantity: number }) => ({
            ingredient: ingredient.ingredient._id,
            quantity: ingredient.quantity,
          })),
        });
        setSelectedIngredients(recipe.ingredients.map((ing:{ingredient:{_id:string}}) => ing.ingredient._id));
      })
      .catch((err) => console.error(err));
  }, [id, session]);

  // Fetch Categories
  useEffect(() => {
    axios
      .get('https://recipe-backend-rose.vercel.app/api/recipes-categories')
      .then((response) => setRecCategory(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Ingredients
  useEffect(() => {
    axios
      .get('https://recipe-backend-rose.vercel.app/api/ingredients')
      .then((response) => setIngredientList(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Memoized Filtered Ingredient List
  const filteredIngredientList = useMemo(
    () => ingredientList.filter((ingredient) => !selectedIngredients.includes(ingredient._id)),
    [ingredientList, selectedIngredients]
  );

  // Handle Input Change
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'cooking_time' ? value.replace(/[^0-9]/g, '') : value,
    }));
  };

  // Add Ingredient to Form
  const handleAddIngredient = () => {
    if (selectedIngredient && quantity > 0) {
      const newIngredient = { ingredient: selectedIngredient, quantity };
      setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, newIngredient] }));
      setSelectedIngredients((prev) => [...prev, selectedIngredient]);
      setSelectedIngredient('');
      setQuantity(0);
    }
  };

  // Submit Form
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('cooking_time', form.cooking_time);
    formData.append('instructions', form.instructions);
    formData.append('category', form.category);

    form.ingredients.forEach((ing, i) => {
      formData.append(`ingredients[${i}].ingredient`, ing.ingredient);
      formData.append(`ingredients[${i}].quantity`, ing.quantity.toString());
    });
    console.log("Recipe ID:", id);
    // console.log("FormData content:");
    formData.forEach((value, key) => console.log(`${key}: ${value}`));
    
    putRequest(
        
      `https://recipe-backend-rose.vercel.app/api/recipes/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'multipart/form-data',
        },
      },
      (data) => router.push(`/recipes/${data.recipe._id}`)
    );
  };

  // Render Loading State
  if (!oldRecipe || loading) {
    return <ActivityIndicator animating color={MD2Colors.red800} size="large" />;
  }

  return (
    <>
        <Text>Title</Text>
        <TextInput
            style={styles.input}
            placeholder='Recipes Title'
            value={form.title}
            onChangeText={(value)=> handleChange("title",value)}
        />

        <Text>Description</Text>
        <TextInput
            style={styles.input}
            placeholder='Description'
            value={form.description}
            onChangeText={(value)=> handleChange("description",value)}
        />
        <Text>Cooking Time (minutes)</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="1"
            value={form.cooking_time}
            onChangeText={(value)=> handleChange("cooking_time",value)}
        />
         <Text>instructions</Text>
        <TextInput
            // need to add custom style for this
            style={styles.input}
            placeholder='Use bullet points to make it easier to read'
            value={form.instructions}
            onChangeText={(value)=> handleChange("instructions",value)}
        />
        <Text>Category</Text>
        <Picker
            selectedValue={form.category}
            style={styles.input}
            onValueChange={(value:string) => handleChange("category", value)}
        >
           <Picker.Item label="Select a category" value="" />
            {recCategory.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
            ))}
        </Picker>
        <Text>Ingredient</Text>
        <Picker
            selectedValue={form.category}
            style={styles.input}
            onValueChange={(value: string) => setSelectedIngredient(value)}
        >
            {/* mapped the by the filtered list then */}
            <Picker.Item label="Select an ingredient" value="" />
            {filteredIngredientList.map((ingredient) => (
                <Picker.Item key={ingredient._id} label={ingredient.name} value={ingredient._id} />
            ))}
        </Picker>

        <Text>Quantity</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="quantity"
            value={quantity.toString()}
            onChangeText={(value) => {
                const parsedValue = Number(value);
                // resetting the value if its not a valid number
                if (isNaN(parsedValue)) {
                    setQuantity(0);
                } else {
                    setQuantity(parsedValue);
                }
            }}
        />
        
        <Button title="Add Ingredient" onPress={handleAddIngredient} />
        <Text>Added Ingredients:</Text>
        {/* need to figure out how to show these. Maybe a filter ?? */}
        {/* used flat list to show the ingredients already selected */}
        {form.ingredients.length > 0 && (
             <FlatList
             data={form.ingredients}
             keyExtractor={(item, index) => index.toString()}
            //  using extra data to get the ingredients list that we got before to match with the form.ingredient id to display the name
             extraData={ingredientList} 
             renderItem={({ item }) => {
                // .find function to find the corresponding id from form.ingredient to ingredientlist _ id
                 const ingredient = ingredientList.find(ingredient => ingredient._id === item.ingredient);
     
                 return (
                     <Text>
                         {ingredient ? ingredient.name : 'Unknown Ingredient'} - Quantity: {item.quantity}
                     </Text>
                 );
            }}
            />
        )}
        <Text>{error}</Text>

        <Button 
            onPress={handleSubmit}
            title="Submit"
            color="#841584"
        />
    </>
    );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
});
