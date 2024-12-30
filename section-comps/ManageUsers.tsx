import { View, Text, StyleSheet, FlatList, Button, Modal, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";  
import useAPI from "@/hooks/useAPI"; 
import { ActivityIndicator, MD2Colors } from "react-native-paper";  
import { IUser } from "@/types";

export default function ManageUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const { session } = useSession();  
  const { getRequest, loading, error } = useAPI(); 


  useEffect(() => {
    if (!session) {
      console.log("No session token available.");
      return;
    }

    getRequest(
      `https://recipe-backend-rose.vercel.app/api/users/all`, 
      {
        headers: {
          Authorization: `Bearer ${session}`,  
        },
      },
      (response) => {
        console.log(response.users);
        setUsers(response.users);  
      }
    );
  }, [session, getRequest]);  

  // User details modal
  const openUserDetails = (user: IUser) => {
    setUserDetailsLoading(true);
    setSelectedUser(user);
    setModalVisible(true);

    getRequest(
      `https://recipe-backend-rose.vercel.app/api/users/specific/${user._id}`, 
      {
        headers: {
          Authorization: `Bearer ${session}`,  
        },
      },
      (response) => {
        setUserDetails(response.user);  
        setUserDetailsLoading(false);
      }
    );
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setUserDetails(null);
  }
  // statements to check if something isn't working
  if (loading) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />;
  }

  if (error) {
    return <Text>Error loading users.</Text>;
  }

  if (!users.length) {
    return <Text>No users found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      
      {/* List users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
            <Button title="View User Details" onPress={() => openUserDetails(item)} />
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
            {userDetailsLoading ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
            ) : (
              <View>
                <Text style={styles.modalTitle}>{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</Text>
                <Text>{`Email: ${userDetails?.email}`}</Text>
                <Text style={styles.totalRecipe}>Total Recipes : {userDetails?.recipes?.length}</Text>
                {userDetails?.recipes?.length ? (
                userDetails.recipes.map((recipe, index) => (
                  <Text key={index} style={styles.recipeName}>
                    Recipe{index+1} : {recipe.title}
                  </Text>
                ))
              ) : (
                <Text>This user has not created any recipes.</Text>
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
