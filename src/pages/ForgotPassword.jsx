import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [pesan, setPesan] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPesan('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://lykbntu.netlify.app//reset-password'
    });

    setLoading(false);

    if (error) setError(error.message);
    else setPesan('Link reset password sudah dikirim ke email kamu. Silakan cek inbox (dan folder spam).');
  };

  return (
    <div className="login-page">
      <h1>Lupa Password</h1>
      <p>Masukkan email akun kamu, kami akan kirim link untuk reset password.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        {pesan && <p className="success-msg">{pesan}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Link Reset'}</button>
      </form>
      <p className="switch-auth"><Link to="/login">&larr; Kembali ke Login</Link></p>
    </div>
  );
}

export default ForgotPassword;