import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Navbar({ role }) {
  const [nama, setNama] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setNama(session?.user?.user_metadata?.nama || session?.user?.email);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuWarga = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/pengajuan', label: 'Buat Pengajuan' },
    { to: '/status', label: 'Riwayat Pengajuan' },
  ];
  const menuAdmin = [{ to: '/admin', label: 'Dashboard' }];
  const menu = role === 'admin' ? menuAdmin : menuWarga;

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-logo">LB</div>
        <div>
          <div className="brand-name">LayakBantu</div>
          <div className="brand-sub">Portal Bantuan</div>
        </div>
      </div>

      <nav className="topbar-menu">
        {menu.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => 'menu-item' + (isActive ? ' active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="topbar-user">
        <div className="user-avatar">{nama?.[0]?.toUpperCase() || 'U'}</div>
        <div>
          <div className="user-name">{nama}</div>
          <div className="user-role">{role === 'admin' ? 'Admin' : 'Warga'}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Keluar</button>
      </div>
    </header>
  );
}

export default Navbar;