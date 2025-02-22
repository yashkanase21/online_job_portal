import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JobSeekerUI() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${{url}}/jobseeker/signin`, {
        email,
        password,
      });

      const { jwtoken } = response.data;

      if (response.status === 200 && jwtoken && jwtoken.trim() !== '') {
        sessionStorage.setItem('jwtToken', jwtoken);

        const decodedToken = jwtDecode(jwtoken);
        sessionStorage.setItem('seekerId', decodedToken.seeker_id);

        setErrorMessage('');
        navigate('/success');
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
    navigate('/signup'); // Redirect to the signup page
  };

  const handleAdminLoginRedirect = () => {
    navigate('/admin'); // Redirect to the Admin page
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Welcome to the Job Portal</h1>
      <h2 style={{ marginBottom: '20px', color: '#555' }}>Jobseeker Login</h2>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', width: '100%' }}>
        <label>
          <span>Email:</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
            required
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
            required
          />
        </label>
        <button
          type="submit"
          style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', width: '100%' }}
        >
          Log In
        </button>

        <div style={{ margin: '20px 0' }}> {/* Added margin for spacing */}
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            Don't have an account? <button onClick={handleSignupRedirect} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Sign Up</button>
          </p>
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            <button onClick={handleAdminLoginRedirect} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Login as Admin</button>
          </p>
        </div>
      </form>

      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </div>
  );
}

export default JobSeekerUI;
