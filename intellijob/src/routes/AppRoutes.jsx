// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UploadResume from '../pages/UploadResume';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ATSResumeChecker from '../pages/Ats';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ats" element={<ATSResumeChecker/>} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
