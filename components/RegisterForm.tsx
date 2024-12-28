import { useState } from 'react';
import { Text, TextInput, StyleSheet, Button, View } from "react-native";
import axios from "axios";

// typescript definitions for onClose prop 
interface RegisterFormProps {
// passing a onClose function to close the modal
  onClose: () => void; 
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePress = () => {
    console.log("Register Clicked");

    axios.post('https://recipe-backend-rose.vercel.app/api/users/register', {
        // trim function to remove any white spaces
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password
    })
    .then(response => {
        console.log(response.data)
        setSuccess("You're all set! Now Login and share explore recipes");
        // closing the modal once successful after 2 seconds
        setTimeout(() => onClose(), 2000); 
    })
    .catch(e => {
        console.log(e.response.data.message)
        setError(e.response?.data?.message);
    });
};

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(value) => handleChange("firstName", value)}
        // captilaizes the first letter
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(value) => handleChange("lastName", value)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        // shows a specific keyboard on the phone for emails
        keyboardType="email-address"
        // Undos any captialization
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <Button onPress={handlePress} title="Register" color="#841584" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  success: {
    color: "green",
    marginBottom: 10,
  },
});
