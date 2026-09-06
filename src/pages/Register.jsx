import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nama, role: 'warga' } } // default role: warga
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Daftar</button>
      </form>
    </div>
  );
}

export default Register;