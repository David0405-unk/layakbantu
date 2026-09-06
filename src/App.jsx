import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FormPengajuan from './pages/FormPengajuan';
import StatusPengajuan from './pages/StatusPengajuan';
import AdminDashboard from './pages/AdminDashboard';
import DetailPengajuan from './pages/DetailPengajuan';
import FormPenyaluran from './pages/FormPenyaluran';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Warga */}
        <Route path="/pengajuan" element={<ProtectedRoute requiredRole="warga"><FormPengajuan /></ProtectedRoute>} />
        <Route path="/status" element={<ProtectedRoute requiredRole="warga"><StatusPengajuan /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/pengajuan/:id" element={<ProtectedRoute requiredRole="admin"><DetailPengajuan /></ProtectedRoute>} />
        <Route path="/admin/pengajuan/:id/penyaluran" element={<ProtectedRoute requiredRole="admin"><FormPenyaluran /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;