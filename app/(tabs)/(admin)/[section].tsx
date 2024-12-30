import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
// import ManageRecipes from "./sections/ManageRecipes";
import ManageUsers from "../../../section-comps/ManageUsers";

export default function AdminSection() {
    const { section } = useLocalSearchParams();
    

  const renderSectionContent = () => {
    switch (section) {
      case "recipes":
        // return <ManageRecipes />;
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
