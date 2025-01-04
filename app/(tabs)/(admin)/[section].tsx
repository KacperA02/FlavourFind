import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ManageIngredients from "@/section-comps/ingredients/ManageIngredients";
import ManageUsers from "../../../section-comps/users/ManageUsers";
import ManageIngredientCategories from "@/section-comps/ingredientCat/ManageIngredientCategories";
import ManageRecipeCategories from "@/section-comps/recipeCat/ManageRecipeCat";
import ManageUnits from "@/section-comps/units/ManageUnits";
import { useSession } from "@/contexts/AuthContext";
import NotFound from "@/app/[...missing]";
// import { useEffect, useState } from "react";
export default function AdminSection() {
	const { section } = useLocalSearchParams();
	const {isAdmin } = useSession();
	// const [currentSection, setCurrentSection] = useState(section);

	// Update the current section when the `section` changes
	// useEffect(() => {
	// 	setCurrentSection(section);
	// }, [section]);
	if(!isAdmin){
		return <NotFound />
	}
	const renderSectionContent = () => {
		switch (section) {
			case "ingredients":
				return <ManageIngredients />;
			case "users":
				return <ManageUsers />;
			case "ingredientCat":
				return <ManageIngredientCategories />;
			case "recipeCat":
				return <ManageRecipeCategories />;
			case "units":
				return <ManageUnits />;
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
