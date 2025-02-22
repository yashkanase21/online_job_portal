import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Row, Spinner, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaClipboardList } from 'react-icons/fa'; // Import the clipboard icon

function AdminSuccessPage() {
  const baseAPIUrl = `${{url}}/jobprovider`;
  const statusAPIUrl = `${{url}}/jobpost/status`;
  const [jobs, setJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const updateJobStatus = async (jobId, status) => {
    try {
      await axios.put(`${statusAPIUrl}/${jobId}`, { status });
      alert(`Job status updated to ${status}`);
      fetchJobs();
    } catch (error) {
      alert('Failed to update job status.');
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

  const handlePostNewJob = () => {
    navigate('/AdminJobPost');
  };

  const handleProfileNavigation = () => {
    navigate('/AdminProfile');
  };

  const handleSeeApplications = () => {
    navigate('/JobApplications'); // Navigate to the JobApplications component
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('provider_id');
    navigate('/');
  };

  return (
    <Container fluid className="mt-5">
      <div className="text-center mb-4">
        <h1 className="mb-3">Admin Portal</h1>
        <h2>All Jobs</h2>
        <div className="d-flex justify-content-center mb-4">
          <Button variant="primary" onClick={handlePostNewJob} className="me-2">
            Post New Job
          </Button>
          <Button
            variant="secondary"
            onClick={handleProfileNavigation}
            className="d-flex align-items-center me-2"
          >
            <FaUser className="me-2" />
            Profile
          </Button>
          <Button
            variant="info"
            onClick={handleSeeApplications}
            className="d-flex align-items-center me-2"
          >
            <FaClipboardList className="me-2" />
            See Job Applications
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="d-flex align-items-center"
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </Button>
        </div>
      </div>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : jobs.length > 0 ? (
        <Row className="mt-4 gy-4">
          {jobs.map((job) => (
            <Col key={job.job_id} md={6} lg={4} xl={3}>
              <Card className="job-card shadow-lg rounded">
                <Card.Body>
                  <Card.Title className="text-primary mb-3">{job.job_title}</Card.Title>
                  <Card.Text className="mb-2">{job.job_description}</Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Location:</strong> {job.location}
                  </Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Salary:</strong> {job.salary}
                  </Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Company:</strong> {job.companyname}
                  </Card.Text>
                  <Card.Text className="mb-3">
                    <strong>Status:</strong> {job.status}
                  </Card.Text>
                  <DropdownButton id={`dropdown-${job.job_id}`} title="Change Status" className="w-100">
                    <Dropdown.Item onClick={() => updateJobStatus(job.job_id, 'open')}>Open</Dropdown.Item>
                    <Dropdown.Item onClick={() => updateJobStatus(job.job_id, 'closed')}>Closed</Dropdown.Item>
                  </DropdownButton>
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

export default AdminSuccessPage;
