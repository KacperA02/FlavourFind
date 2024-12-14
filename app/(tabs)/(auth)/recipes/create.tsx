import { useState } from 'react';
import { Text, TextInput, StyleSheet, Button } from 'react-native';
import { useSession } from '@/contexts/AuthContext';
import useAPI from '@/hooks/useAPI'
import { useRouter } from 'expo-router';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
export default function Page() {
    const router = useRouter();
    const { session } = useSession();
    const [form, setForm] = useState({
        title: "",
        description: "",
        cooking_time: "",
        instructions: "",
        category: "",
        ingredients: []
    });

    const { postRequest, data, loading, error } = useAPI();

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }

    const handleSubmit = () => {
        console.log(form);

        postRequest('', form, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }, (data) => {
            router.push(`/recipes/${data._id}`);
        });

    }

    if(loading === true) return  <ActivityIndicator animating={true} color={MD2Colors.red800} size='large'  />
    
    return (
        <>
            <Text>Title</Text>
            <TextInput
                style={styles.input}
                placeholder='Title'
                value={form.title}
                onChange={handleChange}
                id='title'
            />

            <Text>Description</Text>
            <TextInput
                style={styles.input}
                placeholder='Description'
                value={form.description}
                onChange={handleChange}
                id='description'
            />
            <Text>Cooking Time</Text>
            <TextInput
                style={styles.input}
                placeholder='Description'
                value={form.description}
                onChange={handleChange}
                id='description'
            />
           

            

            <Text>{error}</Text>

            <Button 
                onPress={handleSubmit}
                title="Submit"
                color="#841584"
            />
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10
    }
});