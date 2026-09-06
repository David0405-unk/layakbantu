import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function DashboardWarga() {
  const [terbaru, setTerbaru] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerbaru = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('tb_pengajuan')
        .select('*')
        .eq('id_warga', session.user.id)
        .order('tanggal_pengajuan', { ascending: false })
        .limit(1);

      if (!error && data.length > 0) setTerbaru(data[0]);
      setLoading(false);
    };
    fetchTerbaru();
  }, []);

  if (loading) return <p>Memuat...</p>;

  return (
    <div className="dashboard-warga">
      <div className="hero-card">
        <span className="badge-role">WARGA</span>
        <h2>Halo!</h2>
        <p>Pantau pengajuan dan hasil penilaian bantuan sosial Anda di sini.</p>
        <Link to="/pengajuan" className="btn-hero">+ Buat Pengajuan</Link>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <p className="summary-label">Status Pengajuan</p>
          <p className="summary-value">{terbaru ? terbaru.status_akhir : 'Belum Ada'}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Skor Kelayakan</p>
          <p className="summary-value">{terbaru ? terbaru.total_skor : '—'}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Kategori</p>
          <p className="summary-value">{terbaru ? terbaru.kategori_kelayakan : '—'}</p>
        </div>
      </div>

      <Link to="/status" className="link-riwayat">Lihat semua riwayat pengajuan &rarr;</Link>
    </div>
  );
}

export default DashboardWarga;