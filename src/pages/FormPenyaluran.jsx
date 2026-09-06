import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function FormPenyaluran() {
  const { id } = useParams(); // id_pengajuan
  const navigate = useNavigate();
  const [tanggalPenyaluran, setTanggalPenyaluran] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    const { error: insertError } = await supabase.from('tb_penyaluran').insert({
      id_pengajuan: id,
      id_admin: session.user.id,
      tanggal_penyaluran: tanggalPenyaluran,
      keterangan
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="form-penyaluran-page">
      <Link to="/admin">&larr; Kembali ke Daftar</Link>
      <h1>Catat Penyaluran Bantuan</h1>
      <p>Pengajuan ini telah <strong>Disetujui</strong>. Lengkapi data penyaluran bantuan.</p>

      <form onSubmit={handleSubmit}>
        <label>Tanggal Penyaluran</label>
        <input type="date" value={tanggalPenyaluran} onChange={(e) => setTanggalPenyaluran(e.target.value)} required />

        <label>Keterangan</label>
        <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Contoh: bantuan tunai diserahkan langsung ke penerima" />

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Penyaluran'}</button>
      </form>
    </div>
  );
}

export default FormPenyaluran;