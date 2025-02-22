import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { url } from './url';

const SigninSuccessScreen = ({ navigation }) => {
    // const baseAPIUrl = 'http://192.168.56.1:9999/jobprovider';
    // const appliedJobsAPIUrl = 'http://192.168.56.1:9999/jobapply';
    // const applyAPIUrl = 'http://192.168.56.1:9999/jobapply';
    const baseAPIUrl = `${url}/jobprovider`;
    const appliedJobsAPIUrl = `${url}/jobapply`;
    const applyAPIUrl = `${url}/jobapply`;

    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentView, setCurrentView] = useState('jobs');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                setErrorMessage('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await axios.get(baseAPIUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);

            if (Array.isArray(response.data)) {
                setJobs(response.data);
            } else {
                setErrorMessage('Unexpected data format from server');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppliedJobs = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const seekerId = await AsyncStorage.getItem('seekerId');
            if (!token || !seekerId) {
                setErrorMessage('No authentication token or seeker ID found');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${appliedJobsAPIUrl}?seeker_id=${seekerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(response.data)) {
                setAppliedJobs(response.data);
            } else {
                setErrorMessage('Unexpected data format from server');
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId, jobTitle, companyName) => {
        try {
            const seekerId = await AsyncStorage.getItem('seekerId');
            const token = await AsyncStorage.getItem('jwtToken');

            if (!seekerId || !token) {
                Alert.alert('Error', 'Authentication required');
                return;
            }

            const response = await axios.post(applyAPIUrl, {
                job_id: jobId,
                seeker_id: seekerId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Application submitted successfully! Please check your email for confirmation.');
            } else {
                Alert.alert('Error', 'Failed to apply for the job.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to apply for the job.');
            console.error('Error applying for job:', error);
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

    const handleShowApplied = () => {
        setCurrentView('appliedJobs');
        fetchAppliedJobs();
    };

    const handleBackToJobs = () => {
        setCurrentView('jobs');
        fetchJobs();
    };

    const handleMyProfile = async () => {
        const seekerId = await AsyncStorage.getItem('seekerId');
        if (seekerId) {
            navigation.navigate('MyProfile', { seekerId });
        } else {
            Alert.alert('Error', 'Seeker ID not found');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate('SignIn');
    };

    const renderCurrentView = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#007bff" />;
        }

        if (currentView === 'jobs') {
            return jobs.length > 0 ? (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.job_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.jobCard}>
                            <Text style={styles.jobTitle}>{item.job_title}</Text>
                            <Text>{item.job_description}</Text>
                            <Text><Text style={styles.bold}>Location:</Text> {item.location}</Text>
                            <Text><Text style={styles.bold}>Salary:</Text> {item.salary}</Text>
                            <Text><Text style={styles.bold}>Company:</Text> {item.companyname}</Text>
                            <Text><Text style={styles.bold}>Status:</Text> {item.status}</Text>
                            {item.status !== 'closed' && (
                                <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(item.job_id)}>
                                    <Text style={styles.applyButtonText}>Apply for Job</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.message}>No jobs available</Text>
            );
        } else if (currentView === 'appliedJobs') {
            return appliedJobs.length > 0 ? (
                <FlatList
                    data={appliedJobs}
                    keyExtractor={(item) => item.job_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.jobCard}>
                            <Text style={styles.jobTitle}>{item.job_title}</Text>
                            <Text><Text style={styles.bold}>First Name:</Text> {item.fname}</Text>
                            <Text><Text style={styles.bold}>Last Name:</Text> {item.lname}</Text>
                            <Text><Text style={styles.bold}>Email:</Text> {item.email}</Text>
                            <Text><Text style={styles.bold}>Contact:</Text> {item.contactme}</Text>
                            <TouchableOpacity onPress={() => handleViewResume(item.resume_path)}>
                                <Text style={styles.resumeLink}>View Resume</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.message}>No applied jobs available</Text>
            );
        } else {
            return <Text style={styles.message}>No view selected</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleBackToJobs}>
                    <Text style={styles.buttonText}>All Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleShowApplied}>
                    <Text style={styles.buttonText}>Applied Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleMyProfile}>
                    <Text style={styles.buttonText}>My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {renderCurrentView()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    jobCard: {
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
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    applyButton: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    resumeLink: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    message: {
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
    },
});

export default SigninSuccessScreen;
