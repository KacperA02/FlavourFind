import { View, Text, StyleSheet, FlatList, Button, Modal, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";  
import useAPI from "@/hooks/useAPI"; 
import { ActivityIndicator, MD2Colors } from "react-native-paper";  
import { IngredientType } from "@/types";

export default function ManageIngredients() {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientType | null>(null);
  const [ingredientDetails, setIngredientDetails] = useState<IngredientType | null>(null);
  const [ingredientDetailsLoading, setIngredientDetailsLoading] = useState(false);
  const { session } = useSession();  
  const { getRequest, loading, error } = useAPI(); 


  useEffect(() => {
    if (!session) {
      console.log("No session token available.");
      return;
    }

    getRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients`, 
      {
        headers: {
          Authorization: `Bearer ${session}`,  
        },
      },
      (response) => {
        console.log(response);
        setIngredients(response);  
      }
    );
  }, [session, getRequest]);  

  // User details modal
  const openIngredientDetails = (ingredient: IngredientType) => {
    setIngredientDetailsLoading(true);
    setSelectedIngredient(ingredient);
    setModalVisible(true);

    getRequest(
      `https://recipe-backend-rose.vercel.app/api/ingredients/${ingredient._id}`, 
      {
        headers: {
          Authorization: `Bearer ${session}`,  
        },
      },
      (response) => {
        setIngredientDetails(response.data);  
        setIngredientDetailsLoading(false);
      }
    );
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedIngredient(null);
    setIngredientDetails(null);
  }
  // statements to check if something isn't working
  if (loading) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />;
  }

  if (error) {
    return <Text>Error loading ingredients.</Text>;
  }

  if (!ingredients.length) {
    return <Text>No Ingredients found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Ingredients</Text>
      
      {/* List users */}
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.ingredientCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Button title="View Ingredient Details" onPress={() => openIngredientDetails(item)} />
          </View>
        )}
      />
      
      {/* User details modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {ingredientDetailsLoading ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
            ) : (
              <View>
                <Text style={styles.modalTitle}>{selectedIngredient?.name}</Text>
                <Text>{`Calories: ${ingredientDetails?.calories}`}</Text>
                <Text>{`Category name: ${ingredientDetails?.category_id.name} | ${ingredientDetails?.category_id._id}`}</Text>
                <Text>{`unit: ${ingredientDetails?.unit_id?.name} | '${ingredientDetails?.unit_id?.abbreviation}' | ${ingredientDetails?.unit_id?._id}`}</Text>
                <Text>{`Deleted?: ${ingredientDetails?.isDeleted}`}</Text>
                <Text>
                    Created At: {ingredientDetails?.createdAt ? 
                    new Date(ingredientDetails.createdAt).toLocaleString() : 
                    ingredientDetails?.createdAt}
                </Text>
                <Text>
                    Created At: {ingredientDetails?.updatedAt ? 
                    new Date(ingredientDetails.updatedAt).toLocaleString() : 
                    ingredientDetails?.updatedAt}
                </Text>
                <Text style={styles.totalRecipe}>Total Recipes : {ingredientDetails?.recipes?.length}</Text>
                {ingredientDetails?.recipes?.length ? (
                ingredientDetails.recipes.map((recipe, index) => (
                  <Text key={index} style={styles.recipeName}>
                    Recipe{index+1} : {recipe}
                  </Text>
                ))
              ) : (
                <Text>There is no recipes with this ingredient </Text>
              )}
                <Pressable onPress={closeModal}>
                  <Text style={styles.closeButton}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
        </Modal>
    </View>
    
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
      },
      totalRecipe: {
        fontWeight: "bold",
        marginBottom: 5
      },
      userCard: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
      },
      userName: {
        fontSize: 18,
        marginBottom: 5,
      },
      modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 5,
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
      },
      recipeName: {
        marginTop: 5
      },
      closeButton: {
        color: "blue",
        textAlign: "center",
        marginTop: 10,
      }
});
