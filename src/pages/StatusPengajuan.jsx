import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function StatusPengajuan() {
  const [daftar, setDaftar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('tb_pengajuan')
        .select('*')
        .eq('id_warga', session.user.id)
        .order('tanggal_pengajuan', { ascending: false });

      if (!error) setDaftar(data);
      setLoading(false);
    };
    fetchRiwayat();
  }, []);

  if (loading) return <p>Memuat riwayat...</p>;
  if (daftar.length === 0) return <p>Kamu belum pernah mengajukan bantuan.</p>;

  return (
    <div className="riwayat-page">
      <h1>Riwayat Pengajuan</h1>
      {daftar.map((p) => (
        <div key={p.id_pengajuan} className="riwayat-card">
          <div className="riwayat-header">
            <span>{new Date(p.tanggal_pengajuan).toLocaleDateString('id-ID')}</span>
            <span className={`badge badge-${p.status_akhir}`}>{p.status_akhir}</span>
          </div>
          <p><strong>Total Skor:</strong> {p.total_skor} — {p.kategori_kelayakan}</p>
          <details>
            <summary>Rincian Skor</summary>
            <ul>
              <li>Penghasilan: {p.skor_penghasilan}</li>
              <li>Tanggungan: {p.skor_tanggungan}</li>
              <li>Pekerjaan: {p.skor_pekerjaan}</li>
              <li>Kondisi Rumah: {p.skor_rumah}</li>
              <li>Kepemilikan Aset: {p.skor_aset}</li>
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}

export default StatusPengajuan;