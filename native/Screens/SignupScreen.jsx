import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { url } from './url';

const SignupScreen = ({ navigation }) => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactme, setContactme] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [qualification, setQualification] = useState('');

    const handleSignup = async () => {
        if (!fname || !lname || !email || !password || !contactme || !state || !city || !qualification) {
            Alert.alert('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(`${url}/jobseeker/signup`, {
                fname,
                lname,
                email,
                password,
                contactme,
                state,
                city,
                qualification,
            });

            if (response.status === 200) {
                Alert.alert('Signup Successful!', 'You have successfully signed up.');
                navigation.navigate('SignIn'); 
            } else {
                Alert.alert('Signup Failed', 'An error occurred during signup.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to sign up. Please try again later.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={fname}
                    onChangeText={setFname}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lname}
                    onChangeText={setLname}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    value={contactme}
                    onChangeText={setContactme}
                />
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Qualification"
                    value={qualification}
                    onChangeText={setQualification}
                />

                <Button title="Sign Up" onPress={handleSignup} color="#007bff" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    form: {
        width: '100%',
        maxWidth: 350,
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
});

export default SignupScreen;
