# Product Review: Loja-62

## Current Maturity

**Status: Functional Prototype**

### Alasan Penilaian:
Loja-62 berada pada tingkat **Functional Prototype** yang sangat matang. 
* Seluruh fitur utama (katalog menu, keranjang, pemotongan stok bahan baku berbasis formula resep, pengadaan barang, penyesuaian limbah, pelacakan sangrai, dan dashboard penjualan) **benar-benar berfungsi penuh dan saling terhubung tanpa error runtime**.
* Namun, aplikasi belum dapat dikategorikan sebagai *MVP (Minimum Viable Product)* untuk komersialisasi nyata karena **seluruh persistensi data masih bertumpu pada `localStorage` browser lokal**, tidak memiliki sistem login/autentikasi pengguna, tidak memiliki sinkronisasi data antarperangkat, serta masih mengandalkan dialog bawaan peramban (`alert()` dan `confirm()`).
* Jika browser dibersihkan atau perangkat kasir rusak, seluruh data bisnis pengguna seketika hilang. Oleh karena itu, aplikasi ini adalah prototipe fungsional berkinerja tinggi, bukan produk siap rilis (*production-ready*).

---

## What Works Well
1. **Engine Kalkulasi Resep & HPP Otomatis**: Logika pengurangan stok bahan mentah dari menu jadi (termasuk produk setengah jadi/sub-produk) berjalan sangat presisi dan cepat secara *real-time*.
2. **Penentuan Stok Virtual**: Kemampuan menghitung secara dinamis berapa porsi minuman/makanan yang bisa dibuat berdasarkan bahan baku paling kritis (*bottleneck*) berhasil mencegah kasir menjual menu yang bahannya sudah habis di dapur.
3. **Siklus Pembelian (PO) & Penerimaan Bertahap**: Fitur penerimaan barang parsial (*receiving workflow*) yang otomatis memperbarui stok bahan baku mentah bekerja dengan mulus.
4. **Modul Batch Roasting**: Pencatatan lot sangrai, penghitungan susut bobot (*weight loss %*), dan pelacak hari *resting* biji kopi sangat relevan dan pas dengan kebutuhan operasional roastery.
5. **Responsivitas Antarmuka**: Tampilan antarmuka gelap (*Aurora UI*) terasa gegas, transisi antar-tab mulus, dan tata letak katalog kasir nyaman digunakan pada layar tablet maupun laptop.
6. **Dukungan Dwibahasa Penuh**: Pengalihan bahasa (Indonesia dan Inggris) mencakup hampir seluruh teks aplikasi tanpa *missing translation key*.

---

## What Is Valuable
* **Pemodelan Domain F&B yang Otentik**: Aplikasi ini tidak memperlakukan makanan/minuman seperti barang ritel pabrikan, melainkan sebagai hasil formulasi dapur (*kitchen manufacturing*). Ini adalah nilai jual produk yang sangat langka di antara POS open-source lainnya.
* **Transparansi Struktur Biaya**: Integrasi biaya tenaga kerja langsung (*labor cost*) dan biaya overhead ke dalam perhitungan HPP per cangkir memberikan visibilitas profitabilitas yang jarang dimiliki aplikasi kasir UMKM.
* **Arsitektur Tipe Data yang Bersih**: Berkas `types.ts` mendefinisikan model domain F&B dengan sangat terstruktur dan siap dipindahkan ke skema basis data relasional atau dokumen cloud kapan pun.

---

## UX Issues
1. **Dialog Pop-up Native Browser (`alert()` & `confirm()`)**: Menggunakan `alert()` bawaan browser menghentikan thread JavaScript, terasa kuno, dan sering terblokir jika aplikasi dijalankan di dalam iframe.
2. **Disparitas Angka HPP di Modal Form Produk**: Pada saat menambah/mengedit produk di `ProductForm.tsx`, HPP untuk sub-produk tidak dihitung secara rekursif (dianggap 0), sehingga angka estimasi HPP di form berbeda dengan angka HPP resmi yang muncul di tabel produk setelah disimpan.
3. **Penyimpanan Foto via Base64**: Mengunggah foto produk langsung menyimpannya sebagai Base64 string ke `localStorage`. Unggahan 3–4 foto resolusi tinggi dari kamera ponsel dapat langsung membuat penyimpanan browser penuh (*QuotaExceededError*).
4. **Cetak Struk Masih Mengandalkan Dialog Cetak Browser**: Menekan tombol cetak struk membuka dialog `window.print()` standar browser, belum mendukung format strip sempit 58mm/80mm printer kasir thermal Bluetooth secara langsung.

---

## Product Issues
1. **Tidak Ada Proteksi Hak Akses (Single-Role Hazard)**: Kasir di meja depan memiliki akses tak terbatas untuk menghapus data produk, mengubah HPP, mengedit harga beli bahan mentah, bahkan menghapus seluruh riwayat transaksi.
2. **Keterisolasian Data (Siloed Terminal)**: Kasir di meja bar dan roaster di ruang sangrai tidak bisa menggunakan aplikasi secara terpisah di dua tablet berbeda karena data tidak tersinkronisasi melalui server/cloud.
3. **Fitur Laporan Belum Terpisah Mandiri**: Tab navigasi "Laporan" saat ini hanya merender ulang komponen `SalesHistory`, belum menyediakan laporan laba rugi komprehensif, laporan perputaran stok, atau analisis tren jam ramai.

---

## Technical Issues
1. **Ketergantungan CDN di Dokumen HTML**: Memuat Tailwind CSS melalui skrip CDN (`<script src="https://cdn.tailwindcss.com">`) di `index.html` memicu peringatan resmi dari tim Tailwind bahwa skrip ini ditujukan untuk prototyping cepat, bukan untuk kompilasi production yang optimal.
2. **Komponen Kosong di Codebase**:
   * `components/Reports.tsx` berukuran 0 byte.
   * `hooks/useLocalStorageState.ts` berukuran 0 byte.
3. **Skrip Package.json Minim**: Tidak ada perintah `npm run lint` atau `npm test`.

---

## Technical Debt
1. **`App.tsx` Sebagai "God Component"**: Berkas `App.tsx` memiliki panjang lebih dari 900 baris kode dan mengelola lebih dari 20 state berbeda serta belasan modal secara bersamaan. Jika ada fitur baru ditambahkan, berkas ini akan semakin sulit dikelola.
2. **Penyimpanan Data Tak Terindeks**: Seluruh pencarian dan filter transaksi dilakukan dengan memuat seluruh array JSON ke dalam memori peramban. Jika jumlah transaksi mencapai lebih dari 2.000 data, performa rendering kasir akan menurun.

---

## Missing Functionality
* **Cloud Database & Multi-Device Sync**: Sinkronisasi data antarperangkat (misal: kasir bar dan bagian gudang).
* **Autentikasi & Multi-User Role**: Akun Kasir (hanya akses POS) vs Akun Manajer/Owner (akses HPP, PO, dan Pengaturan).
* **Integrasi Pembayaran QRIS / Non-Tunai**: Belum ada pencatatan metode pembayaran selain status Lunas (*Paid*) dan Tempo (*Unpaid*).
* **Export / Import Data**: Belum ada tombol untuk mengekspor data ke Excel/CSV atau mencadangkan (*backup*) basis data lokal jika pengguna ingin berganti komputer.

---

## Risks
* **Risiko Kehilangan Data Total (*Data Wipeout*)**: Jika pengguna secara tidak sengaja menekan tombol "Clear Browsing Data / Cache" di Google Chrome atau Safari, seluruh catatan penjualan, stok, dan resep akan musnah tanpa bisa dipulihkan.
* **Risiko Manipulasi Kasir**: Karena tidak ada sistem password atau audit trail, staf kasir dapat dengan mudah mengubah harga jual atau menghapus transaksi tanpa ketahuan pemilik.

---

## What Should Be Preserved
* **Seluruh Logika Komputasi Formula Resep (BOM Engine)**: Fungsi `calculateHpp` dan `calculateStock` di `App.tsx` adalah aset intelektual terbaik dari aplikasi ini dan harus dipertahankan secara utuh.
* **Struktur Data di `types.ts`**: Skema data sudah sangat matang dan mencakup kebutuhan nyata F&B.
* **Desain UI & Komponen Form**: Form input resep, modal penerimaan PO, dan antarmuka keranjang kasir sudah dirancang dengan sangat baik dan intuitif.
* **Kamus Terjemahan (i18n)**: Berkas lokalisasi `id.ts` dan `en.ts` sangat rapi dan lengkap.

---

## What Should Be Changed
* Ganti layer penyimpanan `localStorage` pada `services/api.ts` dengan database nyata (seperti Firebase Firestore atau PostgreSQL).
* Ganti dialog browser `alert()` / `confirm()` dengan komponen UI *Toast Notification* dan *Confirmation Modal* modern.
* Pecah `App.tsx` dengan memindahkan manajemen state global ke React Context atau state manager terisolasi.
* Bangun sistem pencadangan (*Backup & Restore*) data JSON jika aplikasi tetap ingin mempertahankan opsi operasional offline.

---

## What Should NOT Be Over-Engineered
* **Jangan menambah AI generatif tanpa kebutuhan nyata**: Aplikasi kasir butuh kepastian angka 100% deterministik dan kecepatan respons sub-detik. Menambahkan model bahasa besar (LLM) ke dalam alur checkout kasir hanya akan memperlambat transaksi dan menambah biaya tanpa manfaat operasional yang jelas.
* **Jangan membuat microservices**: Tetap pertahankan arsitektur monolitik modular sederhana (Frontend React + Backend REST API / Serverless tunggal).

---

## Recommended Direction

### Rekomendasi Utama: **EVOLVE**

#### Justifikasi Objektif:
Aplikasi ini memiliki **ide produk yang sangat kuat (*Strong Product Idea*)** dan **implementasi antarmuka yang sudah bekerja dengan sangat baik (*Solid Frontend Implementation*)**. Membuang kode ini atau membangun ulang dari nol (*Rebuild from Scratch*) akan membuang ratusan jam kerja yang telah berhasil merapikan UI, logika resep multi-level, kamus bahasa, dan alur pengadaan barang.

Langkah terbaik adalah **mengembangkan (*EVOLVE*)** aplikasi ini menjadi produk nyata dengan tahapan:
1. **Fase 1 (Pembersihan Kode & Keamanan Data Lokal)**:
   * Hapus berkas kosong (`Reports.tsx`, `useLocalStorageState.ts`).
   * Buat fitur *Backup & Restore to JSON File* agar pengguna tidak takut kehilangan data saat menggunakan versi offline.
   * Ganti `alert()` dan `confirm()` dengan Toast UI.
2. **Fase 2 (Peningkatan ke Cloud & Multi-User)**:
   * Hubungkan `services/api.ts` ke backend database cloud (misalnya Firebase Firestore atau Supabase PostgreSQL).
   * Tambahkan autentikasi pengguna dan pemisahan peran Kasir vs Pemilik Toko.
3. **Fase 3 (Penyempurnaan Hardware)**:
   * Tambahkan dukungan cetak format thermal 58mm/80mm untuk printer kasir.
