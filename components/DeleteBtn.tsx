import { Button } from 'react-native-paper'; 
import useAPI from '@/hooks/useAPI';
import { useSession } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { StyleSheet} from 'react-native';

const DeleteButton = ({ id, resource, onDeleteSuccess }: { id: string, resource: string, onDeleteSuccess: () => void; }) => {
  const router = useRouter();
  const { deleteRequest, loading, error } = useAPI();
  const { session } = useSession();

  if (!session) {
    return; 
  }

  const handleDelete = () => {
    if (!session) {
      console.error("No session token found");
      return;
    }

    const url = `${process.env.EXPO_PUBLIC_DEV_URL}${resource}/${id}`;

    deleteRequest(
      url,
      { headers: { Authorization: `Bearer ${session}` } },
      (data) => {
        console.log("Deleted successfully", data);
        onDeleteSuccess();
        router.replace(`/?deleted=${id}`);
      }
    );
  };

  return (
    <Button
      mode="contained"
      icon="delete" 
      buttonColor="#d32f2f" 
      style={styles.button}
      onPress={handleDelete}
      loading={loading ?? false} 
      disabled={loading ?? false} 

    >
      Delete
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30, // rounded corners
    marginLeft:5 // seperating the buttons
  },
});

export default DeleteButton;
