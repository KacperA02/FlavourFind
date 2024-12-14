import { Text, TextInput, StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from '@/contexts/AuthContext';
import { IAuthContext } from '@/types';

export default function LoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const { signIn } = useSession() as IAuthContext;

    const handleChange = (field: string, value:string) => {
        setForm(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    const handlePress = () => {
        console.log("Clicked");

        axios.post('https://recipe-backend-rose.vercel.app/api/users/login', {
            email: form.email,
            password: form.password
        })
             .then(response => {
                console.log(response.data.token)
                signIn(response.data.token);
             })
             .catch(e => {
                console.log(e);
                setError(e.response.data.message);
             });
    };

    return (
        <>
            <TextInput
                style={styles.input}
                placeholder='Email'
                value={form.email}
                onChangeText={(value)=> handleChange("email",value)}
            />

            <TextInput
                style={styles.input}
                placeholder='Password'
                value={form.password}
                onChangeText={(value)=> handleChange("password",value)}
            />

            <Text>{error}</Text>

            <Button 
                onPress={handlePress}
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