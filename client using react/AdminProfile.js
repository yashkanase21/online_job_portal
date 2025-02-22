import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import for eye icon
import { useNavigate } from 'react-router-dom';

function AdminProfile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('jwtToken');
                const provider_id = sessionStorage.getItem('provider_id');
        
                if (!token || !provider_id) {
                    setErrorMessage('No authentication token or seeker ID found');
                    setLoading(false);
                    return;
                }
        
                const response = await axios.get(`${{url}}/jobprovider/adminprofile/${provider_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setProfileData(response.data[0]);
                    setFormData(response.data[0]);
                } else {
                    setErrorMessage('No profile data found');
                }
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleError = (error) => {
        if (error.response) {
            setErrorMessage(`Error: ${error.response.statusText}`);
        } else if (error.request) {
            setErrorMessage('No response from server');
        } else {
            setErrorMessage('Error setting up request');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            const token = sessionStorage.getItem('jwtToken');
            const provider_id = sessionStorage.getItem('provider_id');
        
            if (!token || !provider_id) {
                setErrorMessage('No authentication token or provider ID found');
                return;
            }

            await axios.put(`${{url}}/jobprovider/${provider_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfileData(formData);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            handleError(error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('provider_id');
        navigate('/');
      };

    const handleBack = () => {
        navigate('/AdminSuccessPage'); 
    };

    return (
        <Container className="mt-5">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : errorMessage ? (
                <Alert variant="danger">{errorMessage}</Alert>
            ) : profileData ? (
                <Row className="justify-content-center">
                    <Col md={12} lg={10}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                {!isEditing && (
                                    <Button onClick={handleBack} variant="secondary" className="mb-3">Back</Button>
                                )}
                                <Card.Title className="text-center mb-4">Admin Profile</Card.Title>
                                <Row className="align-items-start">
                                    <Col md={4} className="d-flex justify-content-center mb-3 mb-md-0">
                                        <img
                                            src="/path/to/default/profile.png" // Default profile image
                                            alt="Profile"
                                            className="img-fluid rounded-circle"
                                            style={{ width: '200px', height: '200px' }}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <div className="d-flex flex-column">
                                            {isEditing ? (
                                                <>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Company Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="company_name"
                                                            value={formData.company_name || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Company Description</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="company_description"
                                                            value={formData.company_description || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="email"
                                                            value={formData.email || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Password</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control
                                                                type={showPassword ? 'text' : 'password'}
                                                                name="password"
                                                                value={formData.password || ''}
                                                                onChange={handleChange}
                                                            />
                                                            <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Button onClick={handleUpdate} variant="primary" className="mt-3">Save Changes</Button>
                                                    <Button onClick={() => setIsEditing(false)} variant="secondary" className="mt-3 ms-2">Cancel</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="mb-3">
                                                        <strong>Company Name:</strong> {profileData.company_name}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Company Description:</strong> {profileData.company_description}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Email:</strong> {profileData.email}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Password:</strong> ********
                                                    </div>
                                                    <Button onClick={() => setIsEditing(true)} variant="primary" className="mt-3">Edit Profile</Button>
                                                    <Button onClick={handleLogout} variant="danger" className="mt-3 ms-2">Logout</Button>
                                                </>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <p className="text-center">No profile data available</p>
            )}
        </Container>
    );
}

export default AdminProfile;
