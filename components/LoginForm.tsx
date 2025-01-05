import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Platform } from "react-native";
import { TextInput, Button, Text, Snackbar, IconButton } from "react-native-paper";
import { useSession } from "@/contexts/AuthContext";
import axios from "axios";
import { IAuthContext } from "@/types";
import RegisterForm from "@/components/RegisterForm";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { signIn } = useSession() as IAuthContext;
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handlePress = () => {
    axios
      .post(`${process.env.EXPO_PUBLIC_DEV_URL}users/login`, {
        email: form.email.trim(),
        password: form.password,
      })
      .then((response) => {
        signIn(response.data.token);
      })
      .catch((e) => {
        setError(e.response.data.message);
        setSnackbarVisible(true);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to FlavourFind</Text>
      {/* Email input */}
      <TextInput
        label="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        // autocomplete is what the browser uses to remember the email
        autoComplete="email"
        mode="outlined"
        style={styles.input}
        placeholder="Nearly there..."
        // rounded the text field 
        theme={{ roundness: 8 }}
      />

      {/* Password input */}
      <TextInput
        label="Password"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        mode="outlined"
        placeholder="Keeping it secured"
        style={styles.input}
        theme={{ roundness: 8 }}
      />

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Submit button */}
      <Button
        mode="contained"
        onPress={handlePress}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Login
      </Button>

      {/* Register link */}
      <View style={styles.registerLink}>
        <Text>Not registered yet? </Text>
        <Text
          style={styles.registerText}
          onPress={() => setRegisterVisible(true)}
        >
          Sign up now for free
        </Text>
      </View>

      {/* Snackbar for error messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>

      {/* Modal for Register Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRegisterVisible}
        onRequestClose={() => setRegisterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setRegisterVisible(false)}
              style={styles.closeButton}
            />
            <RegisterForm onClose={() => setRegisterVisible(false)} />
          </View>
        </View>
      </Modal>
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
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 8,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
});
