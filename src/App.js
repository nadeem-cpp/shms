import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ProfilePage from './components/ProfilePage';
import Doctor from './Dashboards/Doctor';
import Patient from './Dashboards/Patient';
// import AdminDashboard from './components/AdminDashboard';
// import DoctorDashboard from './components/DoctorDashboard';
// import PatientDashboard from './components/PatientDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        <Route path="/doctor-dashboard" element={<Doctor />} />
        <Route path="/patient-dashboard" element={<Patient />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
