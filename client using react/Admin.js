import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:9999/jobprovider/signin', {
        email,
        password,
      });

      const { jwtoken } = response.data;

      if (response.status === 200 && jwtoken && jwtoken.trim() !== '') {
        sessionStorage.setItem('jwtToken', jwtoken);

        const decodedToken = jwtDecode(jwtoken);
        sessionStorage.setItem('provider_id', decodedToken.provider_id);

        setErrorMessage('');
        navigate('/AdminSuccessPage'); 
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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:9999/jobprovider/signup', {
        email,
        password,
        company_name: companyName,
        company_description: companyDescription,
      });

      alert('Signup successful! You can now log in.');
      setIsSignup(false); // Switch to login mode after successful signup
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      console.error(error);
    }
  };

  const handleToggleMode = () => {
    setIsSignup((prev) => !prev); // Toggle between login and signup
    setErrorMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#555' }}>{isSignup ? 'Admin Signup' : 'Admin Login'}</h2>

      <form
        onSubmit={isSignup ? handleSignup : handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', width: '100%' }}
      >
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
        {isSignup && (
          <>
            <label>
              <span>Company Name:</span>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                required
              />
            </label>
            <label>
              <span>Company Description:</span>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                required
              />
            </label>
          </>
        )}
        <button
          type="submit"
          style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', width: '100%' }}
        >
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>

        <div style={{ margin: '20px 0' }}>
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            {isSignup ? (
              <>
                Already have an account? <button onClick={handleToggleMode} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Log In</button>
              </>
            ) : (
              <>
                Don't have an account? <button onClick={handleToggleMode} style={{ border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>Sign Up</button>
              </>
            )}
          </p>
        </div>
      </form>

      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </div>
  );
}

export default Admin;
