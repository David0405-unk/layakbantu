import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    const role = data.user.user_metadata?.role;
    navigate(role === 'admin' ? '/admin' : '/dashboard');
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
          <h1 className="auth-welcome">Selamat Datang Kembali!</h1>
          <p className="auth-tagline">Untuk tetap terhubung dengan kami, silakan masuk dengan info pribadi Anda.</p>
          <Link to="/register" className="btn-outline-white">Daftar</Link>
        </div>

        <div className="auth-right">
          <h1>Masuk</h1>
          <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Kata Sandi" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p className="auth-link-line"><Link to="/forgot-password">Lupa kata sandi?</Link></p>
            {error && <p className="error">{error}</p>}
            <button type="submit">Masuk</button>
          </form>
          <p className="switch-auth">Belum punya akun? <Link to="/register">Daftar</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;