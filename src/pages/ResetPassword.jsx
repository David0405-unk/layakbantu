import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== konfirmasi) {
      setError('Password dan konfirmasi tidak cocok.');
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