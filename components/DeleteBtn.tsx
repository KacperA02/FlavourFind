import { Button } from 'react-native';
import useAPI from '@/hooks/useAPI';
import { useSession } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
const DeleteButton = ({ id, resource,onDeleteSuccess}: { id: string, resource: string, onDeleteSuccess: () => void;}) => {
const router = useRouter();
  const { deleteRequest, loading, error } = useAPI();
  const { session } = useSession(); 
  if (!session) {
    return("Unauthroised")
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
    // console.log("Session",session)
    // console.log("resource + id",resource,id)
    // console.log("url + headers",url)
    // deleteRequest(url, {headers:{Authorization:`Bearer ${session}`}}, onSuccess); 
 
  return (
    <Button
      title={loading ? "Deleting..." : "Delete"}
      onPress={handleDelete}
    />
  );
};

export default DeleteButton;
