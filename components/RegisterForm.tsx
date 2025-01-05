import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import axios from "axios";

// typescript definitions for onClose prop
interface RegisterFormProps {
  // passing an onClose function to close the modal
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
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePress = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_DEV_URL}users/register`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      .then((response) => {
        setSuccess("You're all set! Now Login and explore recipes.");
        setSnackbarMessage("Registration Successful!");
        setSnackbarVisible(true);
        // Close modal after 2 seconds
        setTimeout(() => onClose(), 2000);
      })
      .catch((e) => {
        setError(e.response?.data?.message);
        setSnackbarMessage(e.response?.data?.message || "Something went wrong");
        setSnackbarVisible(true);
      });
  };

  return (
    <View style={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Sign Up For Free</Text>

      {/* Form fields */}
      <TextInput
        style={styles.input}
        label="First Name"
        value={form.firstName}
        onChangeText={(value) => handleChange("firstName", value)}
        autoCapitalize="words"
        placeholder="joe"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label="Last Name"
        value={form.lastName}
        onChangeText={(value) => handleChange("lastName", value)}
        autoCapitalize="words"
        placeholder="duffy"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="joe.duffy@gmail.com"
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label="Password"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        placeholder="At least 7 characters"
        mode="outlined"
      />

      {/* Error and Success messages */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      {/* Register Button */}
      <Button
       mode="contained"
       onPress={handlePress}
       style={styles.button}
       labelStyle={styles.buttonLabel}
      >
        Register
      </Button>

      {/* Snackbar to show error or success messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});
