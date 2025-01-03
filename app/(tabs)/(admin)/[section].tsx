import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ManageIngredients from "@/section-comps/ingredients/ManageIngredients";
import ManageUsers from "../../../section-comps/users/ManageUsers";
import { useEffect, useState } from "react";
export default function AdminSection() {
	const { section } = useLocalSearchParams();
	const [currentSection, setCurrentSection] = useState(section);

	// Update the current section when the `section` changes
	useEffect(() => {
		if (section !== currentSection) {
			setCurrentSection(section);
		}
	}, [section, currentSection]);

	const renderSectionContent = () => {
		switch (section) {
			case "ingredients":
				return <ManageIngredients />;
			case "users":
				return <ManageUsers />;
			default:
				return <Text style={styles.error}>Invalid section: {section}</Text>;
		}
	};

	return <View style={styles.container}>{renderSectionContent()}</View>;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	error: {
		fontSize: 18,
		color: "red",
	},
});
