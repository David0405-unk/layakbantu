import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function ResetPassword() {
  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setValidSession(true);
      setChecking(false);
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true);
        setChecking(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== konfirmasi) {
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setError(error.message);
    else {
      alert('Password berhasil diubah, silakan login kembali.');
      navigate('/login');
    }
  };

  if (checking) {
    return <div className="login-page"><p>Memverifikasi link reset...</p></div>;
  }

  if (!validSession) {
    return (
      <div className="login-page">
        <h1>Link Tidak Valid</h1>
        <p>Link reset password sudah kedaluwarsa atau tidak valid. Silakan minta link baru dari halaman Lupa Password.</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <h1>Buat Password Baru</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Password Baru" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Konfirmasi Password Baru" value={konfirmasi} onChange={(e) => setKonfirmasi(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Password Baru'}</button>
      </form>
    </div>
  );
}

export default ResetPassword;