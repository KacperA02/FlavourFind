import { useState } from "react";
import { Text, TextInput, StyleSheet, Button, View } from "react-native";
import { useSession } from "@/contexts/AuthContext";
import useAPI from "@/hooks/useAPI";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function RegisterAdmin({
	closeModal,
}: {
	closeModal: () => void;
}) {
	const { session } = useSession();
	const { postRequest, loading, error } = useAPI();
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const handleChange = (field: string, value: string) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		const formData = {
			firstName: form.firstName,
			lastName: form.lastName,
			email: form.email,
			password: form.password,
		};

		console.log("FormData being sent:", formData);
		postRequest(
			`https://recipe-backend-rose.vercel.app/api/users/register/admin`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${session}`,
					"Content-Type": "application/json",
				},
			},
			(response) => {
				console.log(response);
				closeModal();
			}
		);
	};

	if (loading) {
		return (
			<ActivityIndicator animating color={MD2Colors.red800} size="large" />
		);
	}

	return (
		<View>
			<Text>First Name</Text>
			<TextInput
				style={styles.input}
				placeholder="Eg. Joe"
				value={form.firstName}
				onChangeText={(value) => handleChange("firstName", value)}
			/>

			<Text>Last Name</Text>
			<TextInput
				style={styles.input}
				placeholder="Eg. Duffy"
				value={form.lastName}
				onChangeText={(value) => handleChange("lastName", value)}
			/>

			<Text>Email</Text>
			<TextInput
				style={styles.input}
				placeholder="Eg. joe.duffy@gmail.com"
				keyboardType="email-address"
				value={form.email}
				onChangeText={(value) => handleChange("email", value)}
			/>

			<Text>Password</Text>
			<TextInput
				style={styles.input}
				placeholder="Secure Password"
				value={form.password}
				onChangeText={(value) => handleChange("password", value)}
			/>

			<Button title="Register Admin" onPress={handleSubmit} />
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
		color: "red",
		margin: 10,
	},
});
