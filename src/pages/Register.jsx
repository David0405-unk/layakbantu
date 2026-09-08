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

    if (password !== konfirmasi) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nama, role: 'warga' } }
    });

    if (error) setError(error.message);
    else navigate('/login');
  };

  return (
    <div className="register-page">
      <h1>Daftar Akun — LayakBantu</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Konfirmasi Password" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Daftar</button>
      </form>
      <p className="switch-auth">Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
    </div>
  );
}

export default Register;