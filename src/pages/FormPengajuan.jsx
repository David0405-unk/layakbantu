import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { hitungSkor } from '../utils/hitungSkor';

function FormPengajuan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    namaLengkap: '',
    nomorKK: '',
    penghasilan: '',
    jumlahTanggungan: '',
    statusPekerjaan: '',
    kondisiRumah: '',
    kepemilikanAset: '',
    alamat: '',
    noTelepon: ''
  });
  const [fotoRumah, setFotoRumah] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFotoRumah(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.values(form).some((v) => v === '') || !fotoRumah) {
      setError('Semua data termasuk foto rumah wajib diisi.');
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const idWarga = session.user.id;

    // upload foto rumah ke Supabase Storage
    const namaFile = `${idWarga}-${Date.now()}-${fotoRumah.name}`;
    const { error: uploadError } = await supabase.storage
      .from('foto-rumah')
      .upload(namaFile, fotoRumah);

    if (uploadError) {
      setError('Gagal upload foto: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('foto-rumah').getPublicUrl(namaFile);
    const fotoUrl = urlData.publicUrl;

    const hasil = hitungSkor({
      penghasilan: Number(form.penghasilan),
      jumlahTanggungan: Number(form.jumlahTanggungan),
      statusPekerjaan: form.statusPekerjaan,
      kondisiRumah: form.kondisiRumah,
      kepemilikanAset: form.kepemilikanAset
    });

    const { error: insertError } = await supabase.from('tb_pengajuan').insert({
      id_warga: idWarga,
      nama_lengkap: form.namaLengkap,
      nomor_kk: form.nomorKK,
      penghasilan: Number(form.penghasilan),
      jumlah_tanggungan: Number(form.jumlahTanggungan),
      status_pekerjaan: form.statusPekerjaan,
      kondisi_rumah: form.kondisiRumah,
      kepemilikan_aset: form.kepemilikanAset,
      alamat: form.alamat,
      no_telepon: form.noTelepon,
      foto_rumah: fotoUrl,
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
        <label>Nama Lengkap</label>
        <input type="text" name="namaLengkap" value={form.namaLengkap} onChange={handleChange} required />

        <label>Nomor Kartu Keluarga (KK)</label>
        <input type="text" name="nomorKK" value={form.nomorKK} onChange={handleChange} placeholder="16 digit nomor KK" required />

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

        <label>Foto Kondisi Rumah</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />

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