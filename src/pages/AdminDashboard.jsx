import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function AdminDashboard() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [loading, setLoading] = useState(true);

  const fetchPengajuan = async () => {
    setLoading(true);
    let query = supabase.from('tb_pengajuan').select('*').order('tanggal_pengajuan', { ascending: false });

    if (filterStatus !== 'Semua') {
      query = query.eq('status_akhir', filterStatus);
    }

    const { data, error } = await query;
    if (!error) setPengajuanList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPengajuan();
  }, [filterStatus]);

  const stats = {
    total: pengajuanList.length,
    menunggu: pengajuanList.filter((p) => p.status_akhir === 'Menunggu').length,
    disetujui: pengajuanList.filter((p) => p.status_akhir === 'Disetujui').length,
  };

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Admin — LayakBantu</h1>

      <div className="stats">
        <div>Total Pengajuan: {stats.total}</div>
        <div>Menunggu: {stats.menunggu}</div>
        <div>Disetujui: {stats.disetujui}</div>
      </div>

      <div className="filter">
        <label>Filter Status: </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="Semua">Semua</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
          <option value="Dipertimbangkan">Dipertimbangkan</option>
        </select>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Total Skor</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengajuanList.map((p) => (
              <tr key={p.id_pengajuan}>
                <td>{new Date(p.tanggal_pengajuan).toLocaleDateString('id-ID')}</td>
                <td>{p.total_skor}</td>
                <td>{p.kategori_kelayakan}</td>
                <td>{p.status_akhir}</td>
                <td><Link to={`/admin/pengajuan/${p.id_pengajuan}`}>Lihat Detail</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;