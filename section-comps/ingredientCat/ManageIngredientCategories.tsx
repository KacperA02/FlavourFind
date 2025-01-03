import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Button,
	Modal,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";
import useAPI from "@/hooks/useAPI";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { ICategoryIngredientType } from "@/types";
import DeleteButton from "@/components/DeleteBtn";
import CreateCategory from "./create";
import EditCategory from "./edit";

export default function ManageIngredientCategories() {
	const [categories, setCategories] = useState<ICategoryIngredientType[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedCategory, setSelectedCategory] =
		useState<ICategoryIngredientType | null>(null);
	const [categoryDetails, setCategoryDetails] =
		useState<ICategoryIngredientType | null>(null);
	const [categoryDetailsLoading, setCategoryDetailsLoading] = useState(false);
	const { session } = useSession();
	const { getRequest, loading, error } = useAPI();
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);

	const fetchCategories = () => {
		if (!session) {
			console.log("No session token available.");
			return;
		}

		getRequest(
			`https://recipe-backend-rose.vercel.app/api/ingredients-categories`,
			{
				headers: {
					Authorization: `Bearer ${session}`,
				},
			},
			(response) => {
				setCategories(response);
			}
		);
	};

	useEffect(() => {
		fetchCategories();
	}, [session, getRequest]);

	// Singular Category details
	const openCategoryDetails = (category: ICategoryIngredientType) => {
		setCategoryDetailsLoading(true);
		setSelectedCategory(category);
		setModalVisible(true);

		getRequest(
			`https://recipe-backend-rose.vercel.app/api/ingredients-categories/${category._id}`,
			{
				headers: {
					Authorization: `Bearer ${session}`,
				},
			},
			(response) => {
				setCategoryDetails(response.data);
				setCategoryDetailsLoading(false);
			}
		);
	};

	const closeModal = () => {
		setModalVisible(false);
		setSelectedCategory(null);
		setCategoryDetails(null);
	};

	const onDeleteCategorySuccess = () => {
		closeModal();
		alert("Category deleted successfully!");
		fetchCategories();
	};

	const handleEdit = () => {
		console.log("Edit button pressed for category ID:", selectedCategory?._id);
		setEditModalVisible(true);
	};

	const closeEditModal = () => {
		setEditModalVisible(false);
		closeModal();
		fetchCategories();
	};

	if (loading) {
		return (
			<ActivityIndicator
				animating={true}
				color={MD2Colors.red800}
				size="large"
			/>
		);
	}

	if (error) {
		return <Text>Error loading categories.</Text>;
	}

	if (!categories.length) {
		return <Text>No Categories found.</Text>;
	}

	// Open & Close Create Category modal
	const openCreateModal = () => {
		setCreateModalVisible(true);
	};

	const closeCreateModal = () => {
		setCreateModalVisible(false);
		fetchCategories();
	};
	console.log(selectedCategory);
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Manage Ingredient Categories</Text>

			{/* Create Category Button */}
			<Button title="Create Category" onPress={openCreateModal} />

			{/* List categories */}
			<FlatList
				data={categories}
				keyExtractor={(item) => item._id.toString()}
				renderItem={({ item }) => (
					<View style={styles.categoryCard}>
						<Text>{item.name}</Text>
						<Button
							title="View Category Details"
							onPress={() => openCategoryDetails(item)}
						/>
					</View>
				)}
			/>

			{/* Category details modal */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={closeModal}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{categoryDetailsLoading ? (
							<ActivityIndicator
								animating={true}
								color={MD2Colors.red800}
								size="large"
							/>
						) : (
							<View>
								<Text style={styles.modalTitle}>{selectedCategory?.name}</Text>
								<Text>
									Created At:{" "}
									{categoryDetails?.createdAt
										? new Date(categoryDetails.createdAt).toLocaleString()
										: categoryDetails?.createdAt}
								</Text>
								<Text>
									Updated At:{" "}
									{categoryDetails?.updatedAt
										? new Date(categoryDetails.updatedAt).toLocaleString()
										: categoryDetails?.updatedAt}
								</Text>
								<Text>{`Deleted?: ${categoryDetails?.isDeleted}`}</Text>
								<Button title="Edit Details" onPress={handleEdit} />
								<DeleteButton
									id={categoryDetails?._id || ""}
									resource="ingredients-categories"
									onDeleteSuccess={onDeleteCategorySuccess}
								/>
								<Pressable onPress={closeModal}>
									<Text style={styles.closeButton}>Close</Text>
								</Pressable>
							</View>
						)}
					</View>
				</View>
			</Modal>

			{/* Create Category Modal */}
			<Modal
				visible={createModalVisible}
				animationType="slide"
				transparent={false}
				onRequestClose={closeCreateModal}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<CreateCategory closeModal={closeCreateModal} />
					</View>
				</View>
			</Modal>

			{/* Edit Category Modal */}
			<Modal
				visible={editModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={closeEditModal}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{selectedCategory && (
							<EditCategory
								closeModal={closeEditModal}
								category={selectedCategory}
							/>
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
	categoryCard: {
		marginBottom: 10,
		padding: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 5,
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
	closeButton: {
		color: "blue",
		textAlign: "center",
		marginTop: 10,
	},
});
