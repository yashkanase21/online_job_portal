import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { url } from './url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Please fill in both fields');
            return;
        }

        try {
            const response = await axios.post(`${url}/jobseeker/signin`, { email, password });
            

            const { jwtoken } = response.data;

            if (response.status === 200 && jwtoken && jwtoken.trim() !== '') {
                const decodedToken = jwtDecode(jwtoken);
                // Store token and seeker ID in AsyncStorage
                await AsyncStorage.setItem('jwtToken', jwtoken);
                await AsyncStorage.setItem('seekerId', decodedToken.seeker_id.toString());

                Alert.alert('Sign-In Successful!', `Welcome ${decodedToken.username}`);
                navigation.navigate('SuccessScreen');
            } else {
                setErrorMessage('Invalid login response from server.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
            console.error(error);
        }
    };

    const handleSignupRedirect = () => {
        navigation.navigate('SignupScreen'); 
    };

    // const handleAdminLoginRedirect = () => {
    //     navigation.navigate('AdminLoginScreen');
    // };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Job Portal</Text>
            <Text style={styles.subtitle}>Jobseeker Login</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    required
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    required
                />
                <Button title="Log In" onPress={handleLogin} color="#007bff" />
            </View>

            <View style={styles.linkContainer}>
                <TouchableOpacity onPress={handleSignupRedirect}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={handleAdminLoginRedirect}>
                    <Text style={styles.linkText}>Login as Admin</Text>
                </TouchableOpacity> */}
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
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
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007bff',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default SignInScreen;
