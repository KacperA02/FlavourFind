import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";  
import useAPI from "@/hooks/useAPI"; 
import { ActivityIndicator, MD2Colors } from "react-native-paper";  
import { IUser } from "@/types";

export default function ManageUsers() {
  const [users, setUsers] = useState<IUser[]>([]);  
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
            <Button title="View User Details" onPress={() => console.log(item)} />
          </View>
        )}
      />
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
});
