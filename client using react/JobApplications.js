import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Row, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        setErrorMessage('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${{url}}/jobapply`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setErrorMessage('Unexpected data format from server');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/AdminSuccessPage');
  };

  return (
    <Container fluid className="mt-5">
      <div className="text-center mb-4">
        <h1 className="mb-3">Job Applications</h1>
        <Button onClick={handleBack} variant="secondary" className="mb-4">Back to Admin Portal</Button>
      </div>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : applications.length > 0 ? (
        <Row className="mt-4 gy-4">
          {applications.map((application) => (
            <Col key={application.job_id} md={6} lg={4} xl={3}>
              <Card className="shadow-lg rounded">
                <Card.Body>
                  <Card.Title className="text-primary mb-3">{application.job_title}</Card.Title>
                  <Card.Text className="mb-2"><strong>Name:</strong> {application.fname} {application.lname}</Card.Text>
                  <Card.Text className="mb-2"><strong>Email:</strong> {application.email}</Card.Text>
                  <Card.Text className="mb-2"><strong>Contact:</strong> {application.contactme}</Card.Text>
                  <Card.Text className="mb-3"><strong>Applied At:</strong> {new Date(application.applied_at).toLocaleString()}</Card.Text>
                  <a href={application.resume_path} target="_blank" className="btn btn-primary">View Resume</a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-4">No job applications available</p>
      )}
    </Container>
  );
}

export default JobApplications;
