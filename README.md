# Pemantauan Progres Sumur

## Buka aplikasi

- GitHub Pages: https://irwan-dot-cyber.github.io/pemantauan-sumur/ — mode coba, menyimpan data hanya pada browser/perangkat yang sama.
- Aplikasi tersinkron Google Sheet: https://script.google.com/macros/s/AKfycbwUZhqJJW63Y20EelOnefPg4X7fq3fWm0nFxGZYIuspi-kF5lHhg0ia2JPfjbcIpjpH/exec — menyimpan progres di Sheet dan foto di Drive. Saat ini deployment Apps Script dibatasi untuk akun Google pemilik (“Only myself”). Gunakan tombol di bagian atas GitHub Pages untuk membuka versi ini.

Data yang diisi dalam mode coba tidak otomatis dipindahkan ke Google Sheet. Jangan menaruh token API atau kredensial di GitHub Pages.

## Integrasi Vercel (opsional, belum dipakai)

Frontend untuk Sumur C, E, G, K dengan API Vercel yang meneruskan operasi ke Apps Script. Data tanggal, foto, keterangan, dan progres fisik tetap tersimpan di Google Sheet/Drive yang telah dipakai.

## Sambungkan Apps Script

1. Tambahkan isi `apps-script/Code.gs` ke **akhir** file `Code.gs` pada project Apps Script yang sudah berjalan. Jangan mengganti fungsi lama.
2. Jalankan `createApiToken` satu kali dari editor; salin token dari Execution log ke pengaturan environment Vercel, bukan ke repo.
3. Deploy → Manage deployments → Edit → New version → Deploy. Pilih eksekusi sebagai pemilik dan akses web app sesuai kebutuhan server Vercel (endpoint harus dapat diakses oleh server Vercel). URL `/exec` hasil deployment adalah `APPS_SCRIPT_URL`.
4. Karena endpoint Apps Script bisa diakses umum untuk memanggil fungsi, jaga token tetap rahasia dan ubah jika terungkap.

## Vercel

Import repo dengan **Root Directory** folder ini, Framework Preset **Other**, Output Directory `public`. Tambahkan environment variables:

- `APPS_SCRIPT_URL`: URL `/exec` Apps Script.
- `SUMUR_API_TOKEN`: token yang dibuat oleh `createApiToken`.
- `APP_PASSWORD`: kata sandi aplikasi yang panjang dan berbeda dari token API.

Deploy ulang setelah variabel terpasang. Saat pertama membuka aplikasi, masukkan `APP_PASSWORD`. Jangan menaruh ketiga nilai tersebut di source code atau GitHub.

## Catatan

`getState` saat ini membawa foto terkompresi sebagai data URL dari Drive. Jika dokumentasi sudah sangat banyak, pemuatan awal akan melambat; tahap berikutnya dapat memakai pemuatan foto per entri.
