import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function StatusPengajuan() {
  const [pengajuan, setPengajuan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const idWarga = session.user.id;

      const { data, error } = await supabase
        .from('tb_pengajuan')
        .select('*')
        .eq('id_warga', idWarga)
        .order('tanggal_pengajuan', { ascending: false })
        .limit(1)
        .single();

      if (!error) setPengajuan(data);
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) return <p>Memuat status...</p>;
  if (!pengajuan) return <p>Kamu belum pernah mengajukan bantuan.</p>;

  const statusColor = {
    'Menunggu': 'orange',
    'Disetujui': 'green',
    'Ditolak': 'red',
    'Dipertimbangkan': 'blue'
  };

  return (
    <div className="status-pengajuan-page">
      <h1>Status Pengajuan Kamu</h1>

      <div className="status-card">
        <p><strong>Status:</strong> <span style={{ color: statusColor[pengajuan.status_akhir] }}>{pengajuan.status_akhir}</span></p>
        <p><strong>Total Skor:</strong> {pengajuan.total_skor}</p>
        <p><strong>Kategori Kelayakan:</strong> {pengajuan.kategori_kelayakan}</p>
        <p><strong>Tanggal Pengajuan:</strong> {new Date(pengajuan.tanggal_pengajuan).toLocaleDateString('id-ID')}</p>
        {pengajuan.tanggal_review && (
          <p><strong>Tanggal Review:</strong> {new Date(pengajuan.tanggal_review).toLocaleDateString('id-ID')}</p>
        )}
      </div>

      <details>
        <summary>Rincian Skor per Kriteria</summary>
        <ul>
          <li>Penghasilan: {pengajuan.skor_penghasilan}</li>
          <li>Tanggungan: {pengajuan.skor_tanggungan}</li>
          <li>Pekerjaan: {pengajuan.skor_pekerjaan}</li>
          <li>Kondisi Rumah: {pengajuan.skor_rumah}</li>
          <li>Kepemilikan Aset: {pengajuan.skor_aset}</li>
        </ul>
      </details>
    </div>
  );
}

export default StatusPengajuan;