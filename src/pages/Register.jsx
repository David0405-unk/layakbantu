import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== konfirmasi) { setError('Password dan konfirmasi tidak cocok.'); return; }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nama, role: 'warga' } } });
    if (error) setError(error.message);
    else navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <svg className="auth-shield" viewBox="0 0 64 64" fill="none">
            <path d="M32 4 L56 14 V30 C56 46 46 56 32 60 C18 56 8 46 8 30 V14 Z" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.08)"/>
            <path d="M22 32 C22 24 27 20 32 20 C37 20 42 24 42 32 C38 34 34 44 32 48 C30 44 26 34 22 32 Z" fill="white" opacity="0.9"/>
          </svg>
          <div className="auth-brand">LayakBantu</div>
          <h1 className="auth-welcome">Bergabung Bersama Kami</h1>
          <p className="auth-tagline">Daftar untuk mulai mengajukan dan memantau bantuan sosial Anda.</p>
          <Link to="/login" className="btn-outline-white">Masuk</Link>
        </div>

        <div className="auth-right">
          <h1>Daftar Akun</h1>
          <p className="auth-subtitle">Lengkapi data untuk membuat akun baru</p>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Konfirmasi Password" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button type="submit">Daftar</button>
          </form>
          <p className="switch-auth">Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;