import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function SigninSuccessPage() {
    const baseAPIUrl = `${{url}}/jobprovider`;
    const appliedJobsAPIUrl = `${{url}}/jobapply`; 
    const applyAPIUrl = `${{url}}/jobapply`;

    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showJobs, setShowJobs] = useState(true);
    const [showAppliedJobs, setShowAppliedJobs] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('jwtToken');
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
            const token = sessionStorage.getItem('jwtToken');
            const seekerId = sessionStorage.getItem('seekerId');
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

    const handleApply = async (jobId) => {
        try {
            const seekerId = sessionStorage.getItem('seekerId');
            const response = await axios.post(applyAPIUrl, {
                job_id: jobId,
                seeker_id: seekerId,
            });
            alert('Application submitted successfully!');
        } catch (error) {
            alert('Failed to apply for job.');
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
        setShowAppliedJobs(true);
        setShowJobs(false);
        fetchAppliedJobs();
    };

    const handleBackToJobs = () => {
        setAppliedJobs([]); // Clear the applied jobs state
        setShowAppliedJobs(false);
        setShowJobs(true);
        fetchJobs(); // Fetch all jobs again to refresh the job list
    };

    const handleMyProfile = () => {
        const seekerId = sessionStorage.getItem('seekerId');
        if (seekerId) {
            navigate(`/myprofile/${seekerId}`); // Navigate with seeker_id
        } else {
            alert('Seeker ID not found');
        }
    };
    

    const handleLogout = () => {
        sessionStorage.clear(); // Clear session storage
        navigate('/'); // Navigate to the login page
    };

    const title = showAppliedJobs ? "All Applied Jobs" : "All Jobs";

    return (
        <Container className="mt-5">
            <Row className="mb-4 justify-content-center">
                <Col xs="auto">
                    <h1 className="d-flex align-items-center">
                        {title}
                    </h1>
                </Col>
                {!showAppliedJobs && (
                    <Col xs="auto" className="d-flex align-items-center">
                        <Button 
                            className="btn-lg ms-3" 
                            variant="secondary" 
                            onClick={handleShowApplied}
                        >
                            See Applied Jobs
                        </Button>
                    </Col>
                )}
                {showAppliedJobs && (
                    <Col xs="auto" className="d-flex align-items-center">
                        <Button 
                            className="btn-lg ms-3"
                            variant="primary"
                            onClick={handleBackToJobs}
                        >
                            Back    
                        </Button>
                    </Col>
                )}
                <Col xs="auto" className="d-flex align-items-center">
                    <Button 
                        className="btn-lg ms-3"
                        variant="info"
                        onClick={handleMyProfile}
                    >
                        My Profile
                    </Button>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                    <Button 
                        className="btn-lg ms-3"
                        variant="danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Col>
            </Row>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : showJobs && jobs.length > 0 ? (
                <Row className="mt-4">
                    {jobs.map((job) => (
                        <Col key={job.job_id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="text-primary">{job.job_title}</Card.Title>
                                    <Card.Text>{job.job_description}</Card.Text>
                                    <Card.Text>
                                        <strong>Location:</strong> {job.location}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Salary:</strong> {job.salary}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Company:</strong> {job.companyname}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Status:</strong> {job.status}
                                    </Card.Text>
                                    {job.status !== 'closed' && (
                                        <Button 
                                            onClick={() => handleApply(job.job_id)}
                                            variant="success"
                                            className="mt-3"
                                        >
                                            Apply for Job
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : showAppliedJobs && appliedJobs.length > 0 ? (
                <Row className="mt-4">
                    {appliedJobs.map((job) => (
                        <Col key={job.job_id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="text-secondary">{job.job_title}</Card.Title>
                                    <Card.Text>
                                        <strong>First Name:</strong> {job.fname}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Last Name:</strong> {job.lname}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Email:</strong> {job.email}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Contact:</strong> {job.contactme}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Resume:</strong> 
                                        <a href={job.resume_path} target="_blank" rel="noopener noreferrer">
                                            View Resume
                                        </a>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p className="text-center mt-4">No jobs available</p>
            )}
        </Container>
    );
}

export default SigninSuccessPage;
