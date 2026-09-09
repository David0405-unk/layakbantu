import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Pengecekan sesi dari link reset Supabase
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidSession(true);
      }
      setChecking(false);
    };

    checkSession();

    // Listener jika event PASSWORD_RECOVERY dipicu oleh Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true);
        setChecking(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      alert('Password berhasil diubah, silakan login kembali.');
      navigate('/login');
    }
  };

  if (checking) {
    return (
      <div className="login-page" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Memverifikasi link reset...</h2>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="login-page" style={{ padding: '20px', textAlign: 'center', color: '#333' }}>
        <h2>Link Tidak Valid</h2>
        <p>Link reset password sudah kedaluwarsa atau tidak valid. Silakan minta link baru dari halaman Lupa Password.</p>
      </div>
    );
  }

  return (
    <div className="login-page" style={{ padding: '20px', color: '#333' }}>
      <h1>Buat Password Baru</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Konfirmasi Password Baru"
          value={konfirmasi}
          onChange={(e) => setKonfirmasi(e.target.value)}
          required
        />
        <br /><br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;