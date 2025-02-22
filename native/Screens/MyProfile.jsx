import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { url } from './url';

const MyProfile = ({ route, navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true); 
            try {
                const seekerId = await AsyncStorage.getItem('seekerId');
                if (!seekerId) {
                    setErrorMessage('Seeker ID not found');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${url}/jobseeker/myprofile/${seekerId}`);
                if (response.data && response.data.length > 0) {
                    setProfile(response.data[0]); 
                } else {
                    setErrorMessage('No profile data found');
                }
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [route.params?.refresh]); 

    const handleError = (error) => {
        if (error.response) {
            setErrorMessage(`Error: ${error.response.statusText}`);
        } else if (error.request) {
            setErrorMessage('No response from server');
        } else {
            setErrorMessage('Error setting up request');
        }
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile', { profile, refresh: true }); 
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleViewResume = (resumePath) => {
        console.log(`View resume at ${resumePath}`);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    }

    if (errorMessage) {
        return <Text style={styles.error}>{errorMessage}</Text>;
    }

    if (!profile) {
        return <Text style={styles.message}>Profile not available</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <View style={styles.profileCard}>
                <Text><Text style={styles.bold}>First Name:</Text> {profile.fname}</Text>
                <Text><Text style={styles.bold}>Last Name:</Text> {profile.lname}</Text>
                <Text><Text style={styles.bold}>Email:</Text> {profile.email}</Text>
                <Text><Text style={styles.bold}>Contact:</Text> {profile.contactme}</Text>
                <Text><Text style={styles.bold}>State:</Text> {profile.state}</Text>
                <Text><Text style={styles.bold}>City:</Text> {profile.city}</Text>
                <Text><Text style={styles.bold}>Qualification:</Text> {profile.qualification}</Text>
                {profile.resume_path && (
                    <TouchableOpacity onPress={() => handleViewResume(profile.resume_path)}>
                        <Text style={styles.resumeLink}>View Resume</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={styles.buttonText}>Back</Text>
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
    profileCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    resumeLink: {
        color: '#007bff',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});

export default MyProfile;
