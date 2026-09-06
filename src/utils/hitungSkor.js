export function hitungSkor({ penghasilan, jumlahTanggungan, statusPekerjaan, kondisiRumah, kepemilikanAset }) {
  // Skala tiap kriteria 0-100, lalu dikali bobot
  const skorPenghasilan = penghasilan < 1000000 ? 100 : penghasilan < 2500000 ? 70 : penghasilan < 5000000 ? 40 : 10;
  const skorTanggungan = jumlahTanggungan >= 4 ? 100 : jumlahTanggungan >= 2 ? 70 : 40;
  const skorPekerjaan = statusPekerjaan === 'Tidak Bekerja' ? 100 : statusPekerjaan === 'Buruh Harian' ? 80 : statusPekerjaan === 'Pekerja Tetap' ? 30 : 50;
  const skorRumah = kondisiRumah === 'Tidak Layak' ? 100 : kondisiRumah === 'Sederhana' ? 60 : 20;
  const skorAset = kepemilikanAset === 'Tidak Ada' ? 100 : kepemilikanAset === 'Sedikit' ? 60 : 20;

  const totalSkor =
    skorPenghasilan * 0.3 +
    skorTanggungan * 0.2 +
    skorPekerjaan * 0.2 +
    skorRumah * 0.15 +
    skorAset * 0.15;

  let kategori;
  if (totalSkor >= 80) kategori = 'Sangat Layak';
  else if (totalSkor >= 60) kategori = 'Layak';
  else if (totalSkor >= 40) kategori = 'Dipertimbangkan';
  else kategori = 'Tidak Layak';

  return {
    skorPenghasilan, skorTanggungan, skorPekerjaan, skorRumah, skorAset,
    totalSkor: totalSkor.toFixed(2),
    kategori
  };
}