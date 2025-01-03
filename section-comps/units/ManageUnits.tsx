import { View, Text, StyleSheet, FlatList, Button, Modal, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";
import useAPI from "@/hooks/useAPI";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { IUnitType } from "@/types";
import DeleteButton from "@/components/DeleteBtn";
import CreateUnit from "./create";
import EditUnit from "./edit";

export default function ManageUnits() {
  const [units, setUnits] = useState<IUnitType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<IUnitType | null>(null);
  const [unitDetails, setUnitDetails] = useState<IUnitType | null>(null);
  const [unitDetailsLoading, setUnitDetailsLoading] = useState(false);
  const { session } = useSession();
  const { getRequest, loading, error } = useAPI();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchUnits = () => {
    if (!session) {
      console.log("No session token available.");
      return;
    }

    getRequest(
      `https://recipe-backend-rose.vercel.app/api/units`,
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      },
      (response) => {
        setUnits(response);
      }
    );
  };

  useEffect(() => {
    fetchUnits();
  }, [session, getRequest]);

  const openUnitDetails = (unit: IUnitType) => {
    setUnitDetailsLoading(true);
    setSelectedUnit(unit);
    setModalVisible(true);

    getRequest(
      `https://recipe-backend-rose.vercel.app/api/units/${unit._id}`,
      {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      },
      (response) => {
        setUnitDetails(response.data);
        setUnitDetailsLoading(false);
      }
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUnit(null);
    setUnitDetails(null);
  };

  const onDeleteUnitSuccess = () => {
    closeModal();
    alert("Unit deleted successfully!");
    fetchUnits();
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    closeModal();
    fetchUnits();
  };

  if (loading) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />;
  }

  if (error) {
    return <Text>Error loading units.</Text>;
  }

  if (!units.length) {
    return <Text>No Units found.</Text>;
  }

  const openCreateModal = () => {
    setCreateModalVisible(true);
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    fetchUnits();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Units</Text>
      <Button title="Create Unit" onPress={openCreateModal} />

      <FlatList
        data={units}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.unitCard}>
            <Text>{item.name}</Text>
            <Button title="View Unit Details" onPress={() => openUnitDetails(item)} />
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {unitDetailsLoading ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} size="large" />
            ) : (
              <View>
                <Text style={styles.modalTitle}>{selectedUnit?.name}</Text>
                <Text>{`Abbreviation: ${unitDetails?.abbreviation}`}</Text>
                <Text>
                  Created At:{" "}
                  {unitDetails?.createdAt
                    ? new Date(unitDetails.createdAt).toLocaleString()
                    : unitDetails?.createdAt}
                </Text>
                <Text>
                  Updated At:{" "}
                  {unitDetails?.updatedAt
                    ? new Date(unitDetails.updatedAt).toLocaleString()
                    : unitDetails?.updatedAt}
                </Text>
                <Text>{`Deleted?: ${unitDetails?.isDeleted}`}</Text>
                <Button title="Edit Details" onPress={handleEdit} />
                <DeleteButton
                  id={unitDetails?._id || ""}
                  resource="units"
                  onDeleteSuccess={onDeleteUnitSuccess}
                />
                <Pressable onPress={closeModal}>
                  <Text style={styles.closeButton}>Close</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeCreateModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CreateUnit closeModal={closeCreateModal} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUnit && (
              <EditUnit closeModal={closeEditModal} unit={selectedUnit} />
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
  unitCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
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
