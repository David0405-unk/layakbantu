import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function DetailPengajuan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from('tb_pengajuan')
        .select('*')
        .eq('id_pengajuan', id)
        .single();
      if (!error) setPengajuan(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleUbahStatus = async (statusBaru) => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase
      .from('tb_pengajuan')
      .update({
        status_akhir: statusBaru,
        id_admin: session.user.id,
        tanggal_review: new Date().toISOString()
      })
      .eq('id_pengajuan', id);

    setSaving(false);

    if (!error) {
      if (statusBaru === 'Disetujui') {
        navigate(`/admin/pengajuan/${id}/penyaluran`);
      } else {
        navigate('/admin');
      }
    }
  };

  if (loading) return <p>Memuat...</p>;
  if (!pengajuan) return <p>Pengajuan tidak ditemukan.</p>;

  return (
    <div className="detail-pengajuan-page">
      <Link to="/admin">&larr; Kembali ke Daftar</Link>
      <h1>Detail Pengajuan</h1>

      <div className="detail-card">
        <p><strong>Penghasilan:</strong> Rp{Number(pengajuan.penghasilan).toLocaleString('id-ID')}</p>
        <p><strong>Jumlah Tanggungan:</strong> {pengajuan.jumlah_tanggungan}</p>
        <p><strong>Status Pekerjaan:</strong> {pengajuan.status_pekerjaan}</p>
        <p><strong>Kondisi Rumah:</strong> {pengajuan.kondisi_rumah}</p>
        <p><strong>Kepemilikan Aset:</strong> {pengajuan.kepemilikan_aset}</p>
        <p><strong>Alamat:</strong> {pengajuan.alamat}</p>
        <p><strong>No. Telepon:</strong> {pengajuan.no_telepon}</p>
      </div>

      <div className="skor-card">
        <h3>Rincian Skor</h3>
        <ul>
          <li>Penghasilan (30%): {pengajuan.skor_penghasilan}</li>
          <li>Tanggungan (20%): {pengajuan.skor_tanggungan}</li>
          <li>Pekerjaan (20%): {pengajuan.skor_pekerjaan}</li>
          <li>Kondisi Rumah (15%): {pengajuan.skor_rumah}</li>
          <li>Kepemilikan Aset (15%): {pengajuan.skor_aset}</li>
        </ul>
        <p><strong>Total Skor:</strong> {pengajuan.total_skor}</p>
        <p><strong>Kategori Kelayakan (otomatis):</strong> {pengajuan.kategori_kelayakan}</p>
      </div>

      <div className="status-akhir">
        <p><strong>Status Saat Ini:</strong> {pengajuan.status_akhir}</p>
        {pengajuan.status_akhir === 'Menunggu' && (
          <div className="actions">
            <button disabled={saving} onClick={() => handleUbahStatus('Disetujui')}>Setujui</button>
            <button disabled={saving} onClick={() => handleUbahStatus('Dipertimbangkan')}>Pertimbangkan</button>
            <button disabled={saving} onClick={() => handleUbahStatus('Ditolak')}>Tolak</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPengajuan;