import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

function MyProfile() {
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
                const seekerId = sessionStorage.getItem('seekerId');
        
                if (!token || !seekerId) {
                    setErrorMessage('No authentication token or seeker ID found');
                    setLoading(false);
                    return;
                }
        
                const response = await axios.get(`${{url}}/jobseeker/myprofile/${seekerId}`, {
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
            const seekerId = sessionStorage.getItem('seekerId');
        
            if (!token || !seekerId) {
                setErrorMessage('No authentication token or seeker ID found');
                return;
            }

            await axios.put(`${{url}}/jobseeker/${seekerId}`, formData, {
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
        sessionStorage.clear(); 
        navigate('/'); 
    };

    const handleBack = () => {
        navigate('/success'); 
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
                                <Card.Title className="text-center mb-4">My Profile</Card.Title>
                                <Row className="align-items-start">
                                    <Col md={4} className="d-flex justify-content-center mb-3 mb-md-0">
                                        <img
                                            src={profileData.resume_path || '/path/to/default/profile.png'} // Default profile image if none is available
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
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="fname"
                                                            value={formData.fname || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Last Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="lname"
                                                            value={formData.lname || ''}
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
                                                        <Form.Label>Contact</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="contactme"
                                                            value={formData.contactme || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>State</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="state"
                                                            value={formData.state || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>City</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="city"
                                                            value={formData.city || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Qualification</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="qualification"
                                                            value={formData.qualification || ''}
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
                                                        <strong>First Name:</strong> {profileData.fname}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Last Name:</strong> {profileData.lname}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Email:</strong> {profileData.email}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Contact:</strong> {profileData.contactme}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>State:</strong> {profileData.state}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>City:</strong> {profileData.city}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Qualification:</strong> {profileData.qualification || 'N/A'}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Resume:</strong>
                                                        <a href={profileData.resume_path} target="_blank" rel="noopener noreferrer">
                                                            View Resume
                                                        </a>
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

export default MyProfile;
