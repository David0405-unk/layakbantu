import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Navbar() {
  const [nama, setNama] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setNama(session.user.user_metadata?.nama || session.user.email);
        setRole(session.user.user_metadata?.role || '');
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!nama) return null; // jangan tampil di halaman login/register

  return (
    <nav className="navbar">
      <span className="navbar-brand">LayakBantu</span>
      <div className="navbar-user">
        <span>{nama} ({role})</span>
        <button onClick={handleLogout}>Keluar</button>
      </div>
    </nav>
  );
}

export default Navbar;