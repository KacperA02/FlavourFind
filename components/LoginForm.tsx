import { Text, TextInput, StyleSheet, Button, Modal,TouchableOpacity,View} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from '@/contexts/AuthContext';
import { IAuthContext } from '@/types';
import RegisterForm from "@/components/RegisterForm";

export default function LoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const { signIn } = useSession() as IAuthContext;
    const [isRegisterVisible, setRegisterVisible] = useState(false)
    const handleChange = (field: string, value:string) => {
        setForm(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    const handlePress = () => {
        console.log("Clicked");

        axios.post(`${process.env.EXPO_PUBLIC_DEV_URL}users/login`, {
            // trim function removes whitespaces
            email: form.email.trim(),
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
        <View>
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
                // secures the password to not be show on the screen
                secureTextEntry
            />

            <Text>{error}</Text>

            <Button 
                onPress={handlePress}
                title="Submit"
                color="#841584"
            />
            <Text>
        Not registered yet?{" "}
        <Text
          onPress={() => setRegisterVisible(true)} // Open modal
        >
          Sign up now for free
        </Text>
      </Text>

      {/* Modal for RegisterForm */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRegisterVisible}
        onRequestClose={() => setRegisterVisible(false)} 
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              
              onPress={() => setRegisterVisible(false)} 
            >
              <Text>X</Text>
            </TouchableOpacity>
            <RegisterForm onClose={() => setRegisterVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
    );   
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        margin: 20,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
      }
});