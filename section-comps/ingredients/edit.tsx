import { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, Button, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSession } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI';
import { IngredientType, IUnitType,ICategoryIngredientType } from '@/types';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

interface EditIngredientProps {
  closeModal: () => void;
  ingredient: IngredientType; 
}


export default function EditIngredient({ closeModal, ingredient }: EditIngredientProps) {
  const { session } = useSession();
  const { getRequest, putRequest, data, loading, error } = useAPI();
  const [form, setForm] = useState<IngredientType>({
    name: ingredient.name || '',
    calories: ingredient.calories || '',
    category_id: ingredient.category_id._id || '',
    unit_id: ingredient.unit_id._id || '',
  });
  
  const [categories, setCategories] = useState<ICategoryIngredientType[]>([]);
  const [units, setUnits] = useState<IUnitType[]>([]);

  useEffect(() => {
    // Fetch Categories
    getRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients-categories`,
      { headers: { Authorization: `Bearer ${session}` } },
      (response) => setCategories(response)
    );

    // Fetch Units
    getRequest(
      `https://recipe-backend-rose.vercel.app/api/units`,
      { headers: { Authorization: `Bearer ${session}` } },
      (response) => setUnits(response)
    );
  }, [session]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('calories', form.calories.toString());
    formData.append('category_id', form.category_id.toString()); 
    formData.append('unit_id', form.unit_id.toString());
  
    console.log('FormData being sent:', form);
    console.log('Ingredient ID:', ingredient._id);
    putRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients/${ingredient._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json',
        },
      },
      (response) => {
        console.log(response);
        closeModal();
      }
    );
  };
  

  if (loading) {
    return <ActivityIndicator animating color={MD2Colors.red800} size="large" />;
  }

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
        value={form.calories.toString()}
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
      <Button title="Cancel" onPress={closeModal} />
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
