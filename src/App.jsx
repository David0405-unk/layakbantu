import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FormPengajuan from './pages/FormPengajuan';
import StatusPengajuan from './pages/StatusPengajuan';
import DashboardWarga from './pages/DashboardWarga';
import AdminDashboard from './pages/AdminDashboard';
import DetailPengajuan from './pages/DetailPengajuan';
import FormPenyaluran from './pages/FormPenyaluran';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute requiredRole="warga"><DashboardWarga /></ProtectedRoute>} />
        <Route path="/pengajuan" element={<ProtectedRoute requiredRole="warga"><FormPengajuan /></ProtectedRoute>} />
        <Route path="/status" element={<ProtectedRoute requiredRole="warga"><StatusPengajuan /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/pengajuan/:id" element={<ProtectedRoute requiredRole="admin"><DetailPengajuan /></ProtectedRoute>} />
        <Route path="/admin/pengajuan/:id/penyaluran" element={<ProtectedRoute requiredRole="admin"><FormPenyaluran /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;