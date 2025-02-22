import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function SignupPage() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactme, setContactme] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${{url}}/jobseeker/signup`, {
        fname,
        lname,
        email,
        password,
        contactme,
        state,
        city,
        qualification,
      });
      alert('Signup completed successfully. You will be redirected to the sign-in page.');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Create new account</h1>
      <form onSubmit={handleSignup}>
        <label>
          First Name:
          <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Contact Me:
          <input type="text" value={contactme} onChange={(e) => setContactme(e.target.value)} />
        </label>
        <label>
          State:
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
        </label>
        <label>
          City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label>
          Qualification:
          <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
