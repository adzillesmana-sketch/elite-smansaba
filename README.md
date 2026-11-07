# Website ELITE SMA Negeri 1 Babakan

Website statis untuk organisasi ELITE tahun kepengurusan 2026/2027. Dibuat dengan HTML, CSS, dan JavaScript tanpa proses build atau dependensi tambahan.

## Menjalankan

1. Pastikan folder `assets` dan seluruh file project tetap berada dalam folder yang sama.
2. Buka `index.html` di browser modern. Untuk pengalaman yang lebih konsisten, jalankan server lokal dari folder project:

   ```powershell
   python -m http.server 8000
   ```

3. Buka `http://localhost:8000`.

Font menggunakan Google Fonts jika koneksi internet tersedia; font sistem digunakan sebagai fallback.

## Isi project

- `index.html` — halaman dan konten website.
- `styles.css` — tampilan responsif dan gerakan visual ringan dengan dukungan reduced motion.
- `app.js` — data pengurus, modal profil, filter galeri, dan panel data lokal.
- `assets/logo-elite.png` — logo resmi ELITE.
- `assets/logo-basket-smansaba.png` — logo SMANSABA Basketball pada kartu cabang Basket.
- `assets/logo-pencak-silat-smansaba.jpeg` — logo IPSI SMANSABA pada kartu cabang Pencak Silat.
- `assets/logo-sman1-babakan.png` — lambang sekolah.
- `assets/foto_insan_fadilah.png` — foto khusus Ketua Umum Insan Fadilah.
- `assets/foto_dwi_chantica.png` — foto khusus Bendahara 1, Dwi Chantica Ramadani.
- `assets/foto_putri_komala_sari.png` — foto khusus Koordinator Silat Putri, Putri Komala Sari.
- `assets/foto_kaeyla_putri_alifah.png` — foto khusus Sekretaris 1, Kaeyla Putri Alifah.
- `assets/foto_avara_althafunnisa.png` — foto khusus Avara Althafunnisa, Koordinator Cabor.

## Mengubah data

- Data nama pengurus dan cabang olahraga berada di bagian awal `app.js`.
- Panel “Pengelolaan konten” dapat mengubah kelas pengurus serta menambahkan pengumuman. Perubahan disimpan hanya di `localStorage` browser yang sedang digunakan, bukan di server atau perangkat pengunjung lain.
- Tombol “Hapus perubahan lokal” mengembalikan perubahan kelas dan pengumuman pada browser tersebut ke keadaan awal.
- Jadwal, lokasi, pelatih, kontak, kalender, jumlah anggota, prestasi, dan isi AD/ART diberi penanda “Belum diisi” sampai data resminya tersedia. Jangan mengisi data resmi berdasarkan tebakan.

## Mengganti foto

Ganti file foto anggota dengan foto yang telah mendapat izin dan pertahankan nama file: `foto_insan_fadilah.png` untuk Ketua Umum; `foto_dwi_chantica.png` untuk Bendahara 1; `foto_putri_komala_sari.png` untuk Koordinator Silat Putri; `foto_kaeyla_putri_alifah.png` untuk Sekretaris 1; serta `foto_avara_althafunnisa.png` untuk Avara Althafunnisa. Profil pengurus lain memakai placeholder netral sampai foto mereka diberikan.

Galeri saat ini menggunakan ilustrasi grafis CSS, bukan foto anggota atau dokumentasi kegiatan. Tambahkan foto kegiatan yang sudah mendapat izin sebelum menampilkan dokumentasi di galeri.

## Catatan fitur

- Bagian peresmian dirancang sebagai materi presentasi layar. Gunakan tombol “Tampilkan di layar” untuk mode layar penuh; tekan `Esc` untuk keluar. Tahun kepengurusan ditampilkan sebagai 2026/2027; tanggal acara tidak dicantumkan karena belum diberikan.
- Panel pengelolaan lokal tidak memiliki autentikasi atau backend dan bukan untuk pengelolaan website publik. Publikasi perubahan bersama membutuhkan backend dengan autentikasi yang benar.
- Bagian AD/ART masih berupa placeholder sampai dokumen resmi ditambahkan. Tautan yang tersedia membuka folder referensi Google Drive yang diberikan.
