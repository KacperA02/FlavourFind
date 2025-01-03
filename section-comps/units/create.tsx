import { useState, useEffect } from "react";
import { Text, TextInput, StyleSheet, Button, View } from "react-native";
import { useSession } from "@/contexts/AuthContext";
import useAPI from "@/hooks/useAPI";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function CreateUnit({
	closeModal,
}: {
	closeModal: () => void;
}) {
	const { session } = useSession();
	const { postRequest, loading, error } = useAPI();
	const [form, setForm] = useState({
		name: "",
        abbreviation:""
	});

	const handleChange = (field: string, value: string) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		const formData = {
			name: form.name,
            abbreviation: form.abbreviation
		};

		console.log("FormData being sent:", formData);

		postRequest(
			`https://recipe-backend-rose.vercel.app/api/units`,
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
			<Text>Name</Text>
			<TextInput
				style={styles.input}
				placeholder="Unit Name"
				value={form.name}
				onChangeText={(value) => handleChange("name", value)}
			/>
            <Text>Abbreviation</Text>
			<TextInput
				style={styles.input}
				placeholder="Unit abbreviation"
				value={form.abbreviation}
				onChangeText={(value) => handleChange("abbreviation", value)}
			/>

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
		color: "red",
		margin: 10,
	},
});
