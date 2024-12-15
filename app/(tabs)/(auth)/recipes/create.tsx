import { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, Button, FlatList} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSession } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI'
import { useRouter } from 'expo-router';
import axios from 'axios';
import { recipeCategoryType } from '@/types';
import { IIngredientType } from '@/types';
import { IngredientRecipe } from '@/types';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
export default function Page() {
    const router = useRouter();
    const [recCategory, setRecCategory] = useState<recipeCategoryType[]>([]);
    // array of ingredients from api
    const [ingredientList, setIngredientList] = useState<IIngredientType[]>([]);
    // tracking
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    // added a useState to hold selected ingredients
    const [selectedIngredient, setSelectedIngredient] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(0);
    const { session } = useSession();
    const [form, setForm] = useState({
        title: "",
        description: "",
        cooking_time: "",
        instructions: "",
        category: "",
        ingredients: [] as IngredientRecipe[]
    });
    // Had to get all the categories to display
    useEffect(() => {
        axios
          .get('https://recipe-backend-rose.vercel.app/api/recipes-categories')
          .then((response) => {
            console.log(response.data);
            setRecCategory(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
    
      if (!recCategory) {
        return (
            <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
        );
    }
    // Had to get all the ingredients to display
    useEffect(() => {
        axios
          .get('https://recipe-backend-rose.vercel.app/api/ingredients')
          .then((response) => {
            console.log(response.data);
            setIngredientList(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
    
      if (!ingredientList) {
        return (
            <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
        );
    }
    const { postRequest, data, loading, error } = useAPI();
    // handles each add to the ingredients array
    

    // handles any changes to fields
    const handleChange = (field: string, value:string) => {
        setForm(prevState => {
            // added condition to check if a numeric field detected
            const updatedValue = field === "cooking_time" 
            ? value.replace(/[^0-9]/g, '') 
            : value;
            return{
                ...prevState,
                [field]: updatedValue
            }
           
        });
    }
    // Created a handle for my m:n Ingredients
    const handleAddIngredient = () => {
        if (selectedIngredient && quantity > 0) {
            const ingredientConv = ingredientList.find(
                (ingredient) => ingredient._id === selectedIngredient
            );
    
            if (ingredientConv) {
                const newIngredient = {
                    ingredient: ingredientConv._id, 
                    quantity: quantity,
                };

                setForm((prevForm) => ({
                    ...prevForm,
                    ingredients: [...prevForm.ingredients, newIngredient],
                }));
                console.log(form)
                // to track the ingredients within the form to then filter the list
                setSelectedIngredients(prev => [...prev, selectedIngredient]);
                setQuantity(0); 
                setSelectedIngredient('');
            } else {
                console.log("Ingredient not found!");
            }
        } else {
            console.log("Please select an ingredient and enter a quantity.");
        }
    };
    const handleSubmit = () => {
        console.log("This is the form submitted",form);
         // Creating FormData for multipart form submission
         const formData = new FormData();

         formData.append('title', form.title);
         formData.append('description', form.description);
         formData.append('cooking_time', form.cooking_time);
         formData.append('instructions', form.instructions);
         formData.append('category', form.category);
 
         // Adding ingredients to FormData
         form.ingredients.forEach((ingredient, index) => {
             formData.append(`ingredients[${index}].ingredient`, ingredient.ingredient);
             formData.append(`ingredients[${index}].quantity`, ingredient.quantity.toString());
         });    
        postRequest('https://recipe-backend-rose.vercel.app/api/recipes', formData, {
            headers: {
                Authorization: `Bearer ${session}`,
                // had to add it as a multi part because json ingredients werent working
                'Content-Type': 'multipart/form-data'
            }
        }, (data) => {
            console.log("data",data)
            router.push(`/recipes/${data.recipe._id}`);
        });

    }

    if(loading === true) return  <ActivityIndicator animating={true} color={MD2Colors.red800} size='large'  />
    
    const filteredIngredientList = ingredientList.filter(
        (ingredient) => !selectedIngredients.includes(ingredient._id)
    );

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
                selectedValue={selectedIngredient}
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
        padding: 10
    }
});