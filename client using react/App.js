import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JobSeekerUI from './JobSeekerUI';
import SignupPage from './SignupPage';
import SigninSuccessPage from './SigninSuccessPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyProfile from './MyProfile';
import Admin from './Admin';
import AdminSuccessPage from './AdminSuccessPage';
import AdminJobPost from './AdminJobPost';
import AdminProfile from './AdminProfile';
import JobApplications from './JobApplications';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobSeekerUI />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/success" element={<SigninSuccessPage />} />
        <Route path="/myprofile/:seeker_id" element={<MyProfile />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminSuccessPage" element={<AdminSuccessPage />} />
        <Route path="/AdminJobPost" element={<AdminJobPost />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/JobApplications" element={<JobApplications />} />
      </Routes>
    </Router>
  );
}

export default App;
