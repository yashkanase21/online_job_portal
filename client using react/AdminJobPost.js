import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminJobPost() {
  const [formData, setFormData] = useState({
    provider_id: '',
    job_title: '',
    job_description: '',
    location: '',
    category_id: '',
    experienece_required: '',
    salary: '',
    companyname: '',
    companyimage: '',
  });

  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${{url}}/jobpost/categories`); // Adjust the endpoint as needed
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setErrorMessage('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${{url}}/jobpost`, formData);
      setSuccessMessage('Job posted successfully!');
      setFormData({
        provider_id: '',
        job_title: '',
        job_description: '',
        location: '',
        category_id: '',
        experienece_required: '',
        salary: '',
        companyname: '',
        companyimage: '',
      });

      setTimeout(() => {
        navigate('/AdminSuccessPage');
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to post the job. Please try again.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '800px' }}>
      <h1 className="text-center mb-4">Post a New Job</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="provider_id">
              <Form.Label>Provider ID</Form.Label>
              <Form.Control
                type="text"
                name="provider_id"
                value={formData.provider_id}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px' }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="job_title">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px' }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="job_description" className="mb-3">
          <Form.Label>Job Description</Form.Label>
          <Form.Control
            as="textarea"
            name="job_description"
            value={formData.job_description}
            onChange={handleInputChange}
            required
            rows={4}
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px' }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="category_id">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px' }}
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_id} - {category.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="experienece_required">
              <Form.Label>Experience Required</Form.Label>
              <Form.Control
                type="text"
                name="experienece_required"
                value={formData.experienece_required}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px' }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="salary">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px' }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="companyname" className="mb-3">
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            name="companyname"
            value={formData.companyname}
            onChange={handleInputChange}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </Form.Group>

        <Form.Group controlId="companyimage" className="mb-4">
          <Form.Label>Company Image URL</Form.Label>
          <Form.Control
            type="text"
            name="companyimage"
            value={formData.companyimage}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: '5px' }}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: '100%', padding: '10px', fontSize: '16px' }}>
          Post Job
        </Button>
      </Form>
    </Container>
  );
}

export default AdminJobPost;
