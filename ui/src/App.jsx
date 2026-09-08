import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing/LandingPage';
import AdminPage from './admin/AdminPage';
import BlogPage from './blog/BlogPage';
import BlogDetailView from './blog/BlogDetailView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailView />} />
      </Routes>
    </Router>
  );
}