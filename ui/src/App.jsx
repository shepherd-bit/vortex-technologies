import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import AdminPage from './admin/AdminPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}