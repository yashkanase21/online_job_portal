import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { url } from './url';

const EditProfile = ({ route, navigation }) => {
    const { profile } = route.params;
    const [formData, setFormData] = useState(profile);
    const [loading, setLoading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const seekerId = await AsyncStorage.getItem('seekerId');
            if (!seekerId) {
                setErrorMessage('Seeker ID not found');
                setLoading(false);
                return;
            }
    
            const response = await axios.put(`${url}/jobseeker/${seekerId}`, formData);
            if (response.status === 200) {
                Alert.alert('Success', 'Profile updated successfully');
                navigation.navigate('MyProfile', { refresh: true }); 
            } else {
                setErrorMessage('Failed to update profile');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleError = (error) => {
        if (error.response) {
            setErrorMessage(`Error: ${error.response.statusText}`);
        } else if (error.request) {
            setErrorMessage('No response from server');
        } else {
            setErrorMessage('Error setting up request');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update your Profile </Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.fname}
                onChangeText={(text) => handleInputChange('fname', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lname}
                onChangeText={(text) => handleInputChange('lname', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact"
                value={formData.contactme}
                onChangeText={(text) => handleInputChange('contactme', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Qualification"
                value={formData.qualification}
                onChangeText={(text) => handleInputChange('qualification', text)}
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default EditProfile;
