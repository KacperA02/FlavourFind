import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View,Text,
	TextInput, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSession } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { recipeCategoryType, IIngredientType, RecipeTypeID, IngredientRecipe } from '@/types';
import { ActivityIndicator, MD2Colors, Menu,Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
// import { reload } from 'expo-router/build/global-state/routing';

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
  const [image, setImage] = useState<string | null>(null);
  const [imageVisable, setImageVisable] = useState<boolean>(true);
  const imageUrl = `${process.env.EXPO_PUBLIC_MY_IMAGE_URL}${oldRecipe?.image_path}`;
  const [form, setForm] = useState({
    title: '',
    description: '',
    cooking_time: '',
    instructions: '',
    category: '',
    ingredients: [] as IngredientRecipe[],
    image: '',
  });

  const [visibleCategoryMenu, setVisibleCategoryMenu] = useState(false);
  const [visibleIngredientMenu, setVisibleIngredientMenu] = useState(false);

  const { putRequest, data, loading, error } = useAPI();

  // Fetch Recipe Details
  useEffect(() => {
    if (!session || !id) return;
    axios
      .get(`${process.env.EXPO_PUBLIC_DEV_URL}recipes/${id}`, {
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
          image: recipe.image_path,
        });
        setSelectedIngredients(recipe.ingredients.map((ing:{ingredient:{_id:string}}) => ing.ingredient._id));
      })
     
      .catch((err) => console.error(err));
  }, [id, session]);

  // Fetch Categories
  useEffect(() => {
    axios
      .get(`${process.env.EXPO_PUBLIC_DEV_URL}recipes-categories`)
      .then((response) => setRecCategory(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Ingredients
  useEffect(() => {
    axios
      .get(`${process.env.EXPO_PUBLIC_DEV_URL}ingredients`)
      .then((response) => setIngredientList(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter Ingredients
  const filteredIngredientList = ingredientList.filter(
		(ingredient) => !selectedIngredients.includes(ingredient._id)
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
  // added function to remove an ingredient from the list
  const handleRemoveIngredient = (i:number) => {
    setForm((prev) => {
      const updateIngredients = [...prev.ingredients]
      // used splice to remove the ingredient the corresponding button
      updateIngredients.splice(i,1);
      return {
        ...prev,
        ingredients:updateIngredients
      }
    })
    // then filtered the selected ingredients to match the form so the ingredient doesnt disapear
    setSelectedIngredients((prev) =>
      prev.filter((ingredientId) => ingredientId !== form.ingredients[i].ingredient)
    );
  }
  const handlePickImage = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      alert('Permission to access the camera roll is required!');
    }
  };
  // Submit Form
  const handleSubmit = async () => {
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
    // console.log("Recipe ID:", id);

    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append('image', blob, `image-${Date.now()}.jpg`);
    }
    console.log("Form Data:", formData);
    // console.log("FormData content:");
    // formData.forEach((value, key) => console.log(`${key}: ${value}`));
    
    putRequest(
      `${process.env.EXPO_PUBLIC_DEV_URL}recipes/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'multipart/form-data',
        },
      },
      
      (response) => {
        // i needed the data to be updated so put this in the params. Then within the dependencys in the show i checked if it was there and to match the updated at
        console.log("Response Data:", response.data);
        router.replace(`/recipes/${response.data._id}?updated=${response.data.updatedAt}`
        )}
    );
  };

  // Render Loading State
  if (!oldRecipe || loading === true) {
    return <ActivityIndicator animating color={MD2Colors.red800} size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.inputs}>
        <Text style={styles.titles}>Title</Text>
        <TextInput
            style={styles.input}
            placeholder='Recipes Title'
            value={form.title}
            autoCapitalize="words"
            onChangeText={(value)=> handleChange("title",value)}
        />

        <Text style={styles.titles}>Description</Text>
        <TextInput
            style={styles.input}
            placeholder='Description'
            value={form.description}
            onChangeText={(value)=> handleChange("description",value)}
        />
        <Text style={styles.titles}>Cooking Time (minutes)</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="1"
            value={form.cooking_time}
            onChangeText={(value)=> handleChange("cooking_time",value)}
        />
         <Text style={styles.titles}>instructions</Text>
        <TextInput
            // need to add custom style for this
            style={styles.input}
            placeholder='Use bullet points to make it easier to read'
            value={form.instructions}
            onChangeText={(value)=> handleChange("instructions",value)}
        />
       <Text style={styles.titles}>Category</Text>
				<Menu
					visible={visibleCategoryMenu}
					onDismiss={() => setVisibleCategoryMenu(false)}
					anchor={
						<Button
							mode="contained"
							onPress={() => setVisibleCategoryMenu(true)}
							style={styles.categoryButton}
						>
							{form.category
								? recCategory.find((cat) => cat._id === form.category)?.name
								: "Select Category"}
						</Button>
					}
				>
					{recCategory.map((cat) => (
						<Menu.Item
							key={cat._id}
							title={cat.name}
							onPress={() => {
								setForm((prevForm) => ({ ...prevForm, category: cat._id }));
								setVisibleCategoryMenu(false);
							}}
						/>
					))}
				</Menu>
        <Text style={styles.titles}>Ingredient</Text>
				<Menu
					visible={visibleIngredientMenu}
					onDismiss={() => setVisibleIngredientMenu(false)}
					anchor={
						<Button
							mode="contained"
							textColor="white"
							buttonColor="grey"
							onPress={() => setVisibleIngredientMenu(true)}
							style={styles.ingredientButton}
						>
							{selectedIngredient
								? ingredientList.find(
										(ingredient) => ingredient._id === selectedIngredient
								  )?.name
								: "Select Ingredient"}
						</Button>
					}
				>
					{filteredIngredientList.map((ingredient) => (
						<Menu.Item
							key={ingredient._id}
							title={ingredient.name}
							onPress={() => {
								setSelectedIngredient(ingredient._id);
								setVisibleIngredientMenu(false);
							}}
						/>
					))}
				</Menu>

				<Text style={styles.titles}>Ingredient Quantity:</Text>
				<TextInput
					style={styles.input}
					keyboardType="numeric"
					placeholder="quantity"
					value={quantity.toString()}
					onChangeText={(value) => {
						const parsedValue = Number(value);
						if (isNaN(parsedValue)) {
							setQuantity(0);
						} else {
							setQuantity(parsedValue);
						}
					}}
				/>
        {/* {selectedIngredient && currentIngredient && (
                  <Text>
                    Selected Ingredient Quantity Unit: {currentIngredient.unit_id?.name}
                  </Text>
                )} */}
        <Button
                  buttonColor="grey"
                  textColor="white"
                  style={styles.btn}
                  onPress={handleAddIngredient}
                >
                  Add Ingredient
                </Button>
        {/* shows the previous image until a new image is selected */}
        
         
              <View >
        <Text style={styles.ingreients}>Added Ingredients:</Text>
        {/* need to figure out how to show these. Maybe a filter ?? */}
        {/* used flat list to show the ingredients already selected */}
        {form.ingredients.length > 0 && (
             <FlatList
             data={form.ingredients}
             keyExtractor={(index) => index.toString()}
            //  using extra data to get the ingredients list that we got before to match with the form.ingredient id to display the name
             extraData={ingredientList} 
             renderItem={({ item, index }) => {
                // .find function to find the corresponding id from form.ingredient to ingredientlist _ id
                 const ingredient = ingredientList.find(ingredient => ingredient._id === item.ingredient);
     
                 return (
                  // displaying the chosen ingredients
                  <View>
                     <Text style={styles.ingreients}>
                         {ingredient ? ingredient.name : 'Unknown Ingredient'} - Quantity: {item.quantity}
                     </Text>
                     <Button
									 buttonColor="red"
									 textColor="white"
									 onPress={() => handleRemoveIngredient(index)}
								   >
									   Remove
								   </Button>
                   </View>
                 );
            }}
            />
            
        )}
        </View>
        <Text style={styles.titles}>Current Recipe Image</Text>
         {!image && oldRecipe.image_path && (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
        <Button mode="contained" onPress={handlePickImage} buttonColor="blue">
					Pick an image
				</Button>

				{image && (
					<Image
						source={{ uri: image }}
						style={{ width: 50, height: 50, margin: 10 }}
					/>
				)}
        <Text>{error}</Text>

        <Button onPress={handleSubmit} mode="contained" buttonColor="green">
					Submit
				</Button>
    </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
		flexGrow: 1,
		padding: 10,
		marginBottom: 50,
	},
	input: {
		height: 40,
		margin: 10,
		borderWidth: 1,
		padding: 10,
	},
	titles:{
		fontWeight: "bold",
	},
	btn: {
		margin: 10,
	},
	categoryButton: {
		height: 60,
		justifyContent: "center",
	},
	inputs:{
		margin:50
	  },
	ingredientButton: {
		height: 60,
		justifyContent: "center",
	},
	ingreients: {
		marginVertical: 2,
		fontWeight: "bold",
		fontSize: 12
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
});

