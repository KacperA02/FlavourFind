import { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, Button, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI';
import { IngredientType, IUnitType,ICategoryIngredientType } from '@/types';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

export default function EditIngredient() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { session } = useSession();
  const { getRequest, putRequest, data, loading, error } = useAPI();
  const [ingredient, setIngredient] = useState<IngredientType | null>(null);
  const [categories, setCategories] = useState<ICategoryIngredientType[]>([]);
  const [units, setUnits] = useState<IUnitType[]>([]);
  const [form, setForm] = useState({
    name: '',
    calories: '',
    category_id: '',
    unit_id: '',
  });

  useEffect(() => {
    if (!session || !id){
      return;
    } 

    // Fetch Ingredient Details
    getRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients/${id}`,
      { headers: { Authorization: `Bearer ${session}` } },
      (response) => {
        const ingredientData = response.data;
        setIngredient(ingredientData);
        setForm({
          name: ingredientData.name,
          calories: ingredientData.calories,
          category_id: ingredientData.category_id,
          unit_id: ingredientData.unit_id,
        });
      }
    );
  }, [id, session]);

  useEffect(() => {
    // Fetch Categories
    getRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients-categories`,
      { headers: { Authorization: `Bearer ${session}` } },
      (response) => 
        // console.log("Cats",response)
      setCategories(response)
    );

    // Fetch Units
    getRequest(
      `https://recipe-backend-rose.vercel.app/api/units`,
      { headers: { Authorization: `Bearer ${session}` } },
      (response) =>
      // console.log("uni",response)
      setUnits(response)
    );
  }, [session]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('calories', form.calories);
    formData.append('category_id', form.category_id);
    formData.append('unit_id', form.unit_id);

    console.log('FormData being sent:', {
      name: form.name,
      calories: form.calories,
      category_id: form.category_id,
      unit_id: form.unit_id,
    });
    putRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients/${id}`,
      formData, 
      {
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json',
        },
      },
      (response) => {
        console.log(response);
        router.replace(`/ingredients?updated=${response.data.updatedAt}`);
      }
    );
};


  if (!ingredient || loading) {
    return <ActivityIndicator animating color={MD2Colors.red800} size="large" />;
  }
  console.log("form",form)
 
  return (
    <View>
      <Text>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingredient Name"
        value={form.name}
        onChangeText={(value) => handleChange('name', value)}
      />

      <Text>Calories</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Calories"
        value={form.calories}
        onChangeText={(value) => handleChange('calories', value)}
      />

      <Text>Category</Text>
      <Picker
        selectedValue={form.category_id}
        style={styles.input}
        onValueChange={(value) => handleChange('category_id', value)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
        ))}
      </Picker>

      <Text>Unit</Text>
      <Picker
        selectedValue={form.unit_id}
        style={styles.input}
        onValueChange={(value) => handleChange('unit_id', value)}
      >
        <Picker.Item label="Select a unit" value="" />
        {units.map((unit) => (
          <Picker.Item key={unit._id} label={unit.name} value={unit._id} />
        ))}
      </Picker>

      <Button title="Submit" onPress={handleSubmit} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
    margin: 10,
  },
});
