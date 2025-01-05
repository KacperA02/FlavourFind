import { useState, useEffect } from "react";
import {
	Text,
	TextInput,
	StyleSheet,
	FlatList,
	ScrollView,
	View,
	Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSession } from "@/contexts/AuthContext";
import useAPI from "@/hooks/useAPI";
import { useRouter } from "expo-router";
import axios from "axios";
import { recipeCategoryType } from "@/types";
import { IIngredientType } from "@/types";
import { IngredientRecipe } from "@/types";
import {
	ActivityIndicator,
	MD2Colors,
	Menu,
	Divider,
	Button,
} from "react-native-paper";
// installed everything needed for image picker
import * as ImagePicker from "expo-image-picker";

export default function Page() {
	const router = useRouter();
	const [recCategory, setRecCategory] = useState<recipeCategoryType[]>([]);
	// array of ingredients from api
	const [ingredientList, setIngredientList] = useState<IIngredientType[]>([]);
	// tracking
	const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
	const [image, setImage] = useState<string | null>(null);
	// added a useState to hold selected ingredients
	const [selectedIngredient, setSelectedIngredient] = useState<string>("");
	const [quantity, setQuantity] = useState<number>(0);
	// setting cat visable
	const [visibleCategoryMenu, setVisibleCategoryMenu] = useState(false);
	const [visibleIngredientMenu, setVisibleIngredientMenu] = useState(false);
	const { session } = useSession();
	const [form, setForm] = useState({
		title: "",
		description: "",
		cooking_time: "",
		instructions: "",
		category: "",
		ingredients: [] as IngredientRecipe[],
		image: "", // added image to the form
	});
	// Had to get all the categories to display
	useEffect(() => {
		axios
			.get(`${process.env.EXPO_PUBLIC_DEV_URL}recipes-categories`)
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
			<ActivityIndicator
				animating={true}
				color={MD2Colors.red800}
				size="large"
			/>
		);
	}
	// Had to get all the ingredients to display
	useEffect(() => {
		axios
			.get(`${process.env.EXPO_PUBLIC_DEV_URL}ingredients`)
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
			<ActivityIndicator
				animating={true}
				color={MD2Colors.red800}
				size="large"
			/>
		);
	}
	const { postRequest, data, loading, error } = useAPI();

	// handles any changes to fields
	const handleChange = (field: string, value: string) => {
		setForm((prevState) => {
			// added condition to check if a numeric field detected
			const updatedValue =
				field === "cooking_time" ? value.replace(/[^0-9]/g, "") : value;
			return {
				...prevState,
				[field]: updatedValue,
			};
		});
	};
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
				console.log(form);
				// to track the ingredients within the form to then filter the list
				setSelectedIngredients((prev) => [...prev, selectedIngredient]);
				setQuantity(0);
				setSelectedIngredient("");
			} else {
				console.log("Ingredient not found!");
			}
		} else {
			console.log("Please select an ingredient and enter a quantity.");
		}
	};
	// added a function handles picking an image
	const handlePickImage = async () => {
		// Request permission to access the gallery
		let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		// continues if permission is granted and alerts if not
		if (permission.granted) {
			let result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
				mediaTypes: ["images"],
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
			}
		} else {
			alert("Permission to access the camera roll is required!");
		}
	};

	const handleSubmit = async () => {
		console.log("This is the form submitted", form);
		// Creating FormData for multipart form submission
		const formData = new FormData();

		formData.append("title", form.title);
		formData.append("description", form.description);
		formData.append("cooking_time", form.cooking_time);
		formData.append("instructions", form.instructions);
		formData.append("category", form.category);

		// Adding ingredients to FormData
		form.ingredients.forEach((ingredient, index) => {
			formData.append(
				`ingredients[${index}].ingredient`,
				ingredient.ingredient
			);
			formData.append(
				`ingredients[${index}].quantity`,
				ingredient.quantity.toString()
			);
		});
		// added image to the form data/ if image exists then append it to the form data
		if (image) {
			// fetch the image and blob it
			// blob is a file-like object of immutable, raw data. Necessary for image upload
			const response = await fetch(image);
			const blob = await response.blob();
			// append the image to the form data with a name and a timestamp to make it unique. Even though the backend makes it unique but just to understand the process i did it this way + it didnt work otherwise
			formData.append("image", blob, `image-${Date.now()}.jpg`);
		}
		console.log("This is the form submitted", formData);
		postRequest(
			`${process.env.EXPO_PUBLIC_DEV_URL}recipes`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${session}`,
					// had to add it as a multi part because json ingredients werent working
					"Content-Type": "multipart/form-data",
				},
			},
			(data) => {
				console.log("data", data);
				router.push(`/recipes/${data.recipe._id}`);
			}
		);
	};

	if (loading === true)
		return (
			<ActivityIndicator
				animating={true}
				color={MD2Colors.red800}
				size="large"
			/>
		);
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
	// getting the current ingredient by the selected ingredient
	const currentIngredient = ingredientList.find(
		(ingredient) => ingredient._id === selectedIngredient
	);
	// filtering the ingredient list to get the ones that are not selected
	const filteredIngredientList = ingredientList.filter(
		(ingredient) => !selectedIngredients.includes(ingredient._id)
	);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.inputs}>
				<Text style={styles.titles}>Title</Text>
				<TextInput
					style={styles.input}
					placeholder="Recipes Title"
					value={form.title}
					onChangeText={(value) => handleChange("title", value)}
					autoCapitalize="words"
				/>

				<Text style={styles.titles}>Description</Text>
				<TextInput
					style={styles.input}
					placeholder="Description"
					value={form.description}
					onChangeText={(value) => handleChange("description", value)}
				/>

				<Text style={styles.titles}>Cooking Time (minutes)</Text>
				<TextInput
					style={styles.input}
					keyboardType="numeric"
					placeholder="1"
					value={form.cooking_time}
					onChangeText={(value) => handleChange("cooking_time", value)}
				/>

				<Text style={styles.titles}>Instructions</Text>
				<TextInput
					style={styles.input}
					placeholder="Use bullet points to make it easier to read"
					value={form.instructions}
					onChangeText={(value) => handleChange("instructions", value)}
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
				{/* looked a lot with picker but couldnt manage for picker to work on the phone */}
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

				{selectedIngredient && currentIngredient && (
					<Text>
						Selected Ingredient Quantity Unit: {currentIngredient.unit_id?.name}
					</Text>
				)}

				<Button
					buttonColor="grey"
					textColor="white"
					style={styles.btn}
					onPress={handleAddIngredient}
				>
					Add Ingredient
				</Button>
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
		fontSize: 12,
	},
});
