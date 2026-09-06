import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { hitungSkor } from '../utils/hitungSkor';

function FormPengajuan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    penghasilan: '',
    jumlahTanggungan: '',
    statusPekerjaan: '',
    kondisiRumah: '',
    kepemilikanAset: '',
    alamat: '',
    noTelepon: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.values(form).some((v) => v === '')) {
      setError('Semua data wajib diisi.');
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const idWarga = session.user.id;

    const hasil = hitungSkor({
      penghasilan: Number(form.penghasilan),
      jumlahTanggungan: Number(form.jumlahTanggungan),
      statusPekerjaan: form.statusPekerjaan,
      kondisiRumah: form.kondisiRumah,
      kepemilikanAset: form.kepemilikanAset
    });

    const { error: insertError } = await supabase.from('tb_pengajuan').insert({
      id_warga: idWarga,
      penghasilan: Number(form.penghasilan),
      jumlah_tanggungan: Number(form.jumlahTanggungan),
      status_pekerjaan: form.statusPekerjaan,
      kondisi_rumah: form.kondisiRumah,
      kepemilikan_aset: form.kepemilikanAset,
      alamat: form.alamat,
      no_telepon: form.noTelepon,
      skor_penghasilan: hasil.skorPenghasilan,
      skor_tanggungan: hasil.skorTanggungan,
      skor_pekerjaan: hasil.skorPekerjaan,
      skor_rumah: hasil.skorRumah,
      skor_aset: hasil.skorAset,
      total_skor: hasil.totalSkor,
      kategori_kelayakan: hasil.kategori,
      status_akhir: 'Menunggu'
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    navigate('/status');
  };

  return (
    <div className="form-pengajuan-page">
      <h1>Form Pengajuan Bantuan</h1>
      <form onSubmit={handleSubmit}>
        <label>Penghasilan per bulan (Rp)</label>
        <input type="number" name="penghasilan" value={form.penghasilan} onChange={handleChange} required />

        <label>Jumlah Tanggungan</label>
        <input type="number" name="jumlahTanggungan" value={form.jumlahTanggungan} onChange={handleChange} required />

        <label>Status Pekerjaan</label>
        <select name="statusPekerjaan" value={form.statusPekerjaan} onChange={handleChange} required>
          <option value="">Pilih</option>
          <option value="Tidak Bekerja">Tidak Bekerja</option>
          <option value="Buruh Harian">Buruh Harian</option>
          <option value="Wiraswasta Kecil">Wiraswasta Kecil</option>
          <option value="Pekerja Tetap">Pekerja Tetap</option>
        </select>

        <label>Kondisi Rumah</label>
        <select name="kondisiRumah" value={form.kondisiRumah} onChange={handleChange} required>
          <option value="">Pilih</option>
          <option value="Tidak Layak">Tidak Layak</option>
          <option value="Sederhana">Sederhana</option>
          <option value="Layak">Layak</option>
        </select>

        <label>Kepemilikan Aset</label>
        <select name="kepemilikanAset" value={form.kepemilikanAset} onChange={handleChange} required>
          <option value="">Pilih</option>
          <option value="Tidak Ada">Tidak Ada</option>
          <option value="Sedikit">Sedikit</option>
          <option value="Cukup">Cukup</option>
        </select>

        <label>Alamat Lengkap</label>
        <textarea name="alamat" value={form.alamat} onChange={handleChange} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" required />

        <label>Nomor Telepon/WhatsApp</label>
        <input type="tel" name="noTelepon" value={form.noTelepon} onChange={handleChange} placeholder="08xxxxxxxxxx" required />

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Pengajuan'}</button>
      </form>
    </div>
  );
}

export default FormPengajuan;