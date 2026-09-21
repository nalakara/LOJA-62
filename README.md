# Loja-62

> Sistem Kasir (Point of Sale) & Manajemen Inventaris Berbasis Resep untuk Bisnis F&B dan Roastery Mikro.

---

## Overview

**Loja-62** adalah aplikasi kasir (Point of Sale) dan manajemen inventaris operasional yang dirancang khusus untuk bisnis makanan dan minuman (F&B), seperti kedai kopi (*coffee shop*), gerai artisan bakery, dan micro-roastery. 

Berbeda dengan aplikasi kasir ritel konvensional yang hanya mencatat pengurangan stok barang jadi secara langsung (1:1), Loja-62 mengadopsi model perakitan manufaktur (*Bill of Materials* / BOM). Setiap kali menu terjual di kasir (misalnya *Cappuccino* atau *Iced Latte*), sistem secara otomatis menghitung dan memotong gramatur bahan baku mentah (biji kopi, susu cair, sirup, air) dari gudang berdasarkan formula resep bertingkat. Selain itu, sistem ini memperhitungkan HPP (*Harga Pokok Penjualan*) dinamis yang menggabungkan biaya bahan baku, upah tenaga kerja langsung (*direct labor*), dan biaya operasional (*overhead*).

Aplikasi ini berjalan 100% pada browser (client-side SPA) dan menyimpan seluruh data operasional di penyimpanan lokal perangkat (`localStorage`).

---

## Problem yang Ingin Diselesaikan

1. **Ketidaksesuaian Model Stok Ritel vs F&B**:
   Di bisnis F&B, produk yang dijual tidak disimpan sebagai satu barang utuh. Secangkir *Cappuccino* adalah perpaduan dari *espresso shot* (biji kopi + air) dan susu segar. Kasir umum tidak bisa memotong stok bahan mentah secara otomatis saat transaksi terjadi.
2. **HPP yang Sering Meleset dan Tidak Akurat**:
   Banyak pengusaha UMKM F&B tidak mengetahui margin keuntungan bersih riil per porsi karena fluktuasi harga bahan mentah serta tidak dihitungnya biaya tenaga kerja dan listrik/gas (*overhead*) per porsi.
3. **Kebocoran Stok dan Limbah Tidak Tercatat**:
   Bahan baku sering berkurang di luar penjualan kasir (tumpah, basi, kalibrasi mesin, atau tester). Tanpa modul *stock adjustment*, stok fisik di bar dan catatan kasir selalu selisih.
4. **Ketergantungan Internet dan Biaya Langganan**:
   Banyak software POS berbasis cloud menuntut biaya langganan bulanan mahal dan macet ketika koneksi internet gerai terputus.

---

## Target User

* **Owner-Operator F&B Mikro/Kecil**: Pemilik kedai kopi, roastery mini, atau toko roti mandiri yang butuh transparansi HPP dan kontrol bahan baku harian.
* **Barista & Kasir**: Staf garis depan yang mengoperasikan layar kasir kasir harian, memilih produk, menerima pembayaran tunai, dan mencatat pesanan invoice.
* **Manajer Operasional / Roaster**: Penanggung jawab stok yang membuat Purchase Order ke supplier, mencatat barang masuk, mengatur penyesuaian limbah (*spillage/wastage*), serta mencatat batch produksi sangrai (*batch roasting*).

---

## Core Features (Fitur Aktual)

* **Layar Kasir (POS Register)**:
  * Katalog menu dengan tab kategori.
  * Indikator stok virtual dinamis (menghitung batas porsi maksimal berdasarkan ketersediaan bahan baku paling sedikit di gudang).
  * Keranjang belanja, kalkulasi pajak otomatis, dan pembayaran tunai langsung.
  * Pembuatan faktur/invoice tempo (*unpaid*) yang terhubung ke data pelanggan.
* **Resep Bertingkat & HPP Dinamis (BOM Engine)**:
  * Pembuatan formula resep per produk menggunakan bahan mentah (`raw-material`) maupun produk setengah jadi (`product`).
  * Dukungan produk setengah jadi (*semi-finished goods*, harga jual Rp 0) seperti *Espresso Shot*.
  * Kalkulasi HPP otomatis (Bahan Baku + Biaya Tenaga Kerja + Overhead).
  * Pencegahan *circular dependency* (siklus resep melingkar).
* **Manajemen Bahan Mentah (Raw Materials)**:
  * Pencatatan bahan baku dengan satuan fisik (`gram`, `ml`, `pcs`), harga beli per unit, dan relasi ke supplier.
  * Kategori bahan baku terpisah dari kategori produk jadi.
* **Pengadaan Barang (Purchase Orders)**:
  * Pembuatan dokumen PO dengan status daur hidup (`draft` $\rightarrow$ `ordered` $\rightarrow$ `partially-received` $\rightarrow$ `completed` / `cancelled`).
  * Alur penerimaan barang masuk (*receiving modal*) yang secara otomatis menambah stok bahan baku di gudang.
* **Penyesuaian Stok & Pencatatan Limbah (Stock Adjustments)**:
  * Pencatatan bahan rusak/basi (*wastage*), konsumsi internal (*internal-use*), koreksi opname (*correction*), dan retur (*return*).
  * Validasi penguncian stok negatif.
* **Pelacakan Produksi Sangrai (Production / Batch Roasting)**:
  * Pencatatan batch produksi kopi (nomor lot, target output vs hasil timbangan aktual, tanggal sangrai, nama operator).
  * Pemotongan stok green beans otomatis saat batch berstatus selesai (`completed`).
  * Pelacak masa *resting* kopi (countdown hari hingga kopi siap seduh / *peak flavor*).
  * Kalkulasi susut bobot sangrai (*weight loss %*) dan HPP riil per batch.
* **Buku Kontak (Suppliers & Customers)**:
  * Manajemen data vendor pemasok bahan dan basis data pelanggan untuk penagihan invoice.
* **Pelacak Aset Toko & Depresiasi (Store Assets)**:
  * Pencatatan mesin kopi, grinder, dan perlengkapan toko dengan kalkulasi estimasi penyusutan garis lurus (*straight-line depreciation*).
* **Dashboard Penjualan Harian**:
  * Metrik total pendapatan harian, estimasi laba kotor, jumlah transaksi, nilai rata-rata struk, 5 menu terlaris, dan peringatan bahan menipis (< 50 unit).
* **Riwayat Penjualan & Cetak Struk (Sales History)**:
  * Daftar seluruh transaksi, modal HPP, margin laba, dan modal detail transaksi yang siap dicetak (*print receipt*).
* **Dukungan Dwibahasa (i18n)**:
  * Beralih secara instan antara Bahasa Indonesia (ID) dan Bahasa Inggris (EN).

---

## Main User Workflow

1. **Persiapan Data Master**:
   * Pengguna menginput Pemasok dan Kategori Bahan Mentah.
   * Menginput Bahan Mentah (misal: Biji Arabika Rp 200/gram, Susu Rp 15/ml).
   * Membuat Produk Setengah Jadi (misal: *Espresso Shot* = 18g Biji Kopi + 60ml Air).
   * Membuat Menu Jual (misal: *Cappuccino* = 1 Espresso Shot + 150ml Susu + Tenaga Kerja Rp 1.500 + Overhead Rp 500). Sistem langsung menghitung HPP dan batas stok yang bisa dibuat.
2. **Transaksi Kasir**:
   * Kasir memilih menu di layar POS.
   * Kasir memproses transaksi (Checkout Langsung atau Buat Faktur Tempo).
   * Sistem seketika mengurangi stok bahan baku mentah di gudang sesuai takaran resep.
3. **Pengadaan & Restock**:
   * Stok menipis $\rightarrow$ Pengguna membuat Purchase Order ke supplier.
   * Saat barang tiba, pengguna mencatat penerimaan barang (penuh atau bertahap).
   * Stok bahan mentah otomatis bertambah.
4. **Operasional Produksi / Sangrai**:
   * Roaster membuat batch sangrai baru, memilih green beans yang dipakai.
   * Saat selesai disangrai, roaster menginput berat hasil akhir dan mengubah status menjadi *Completed*. Stok green beans terpotong, dan masa resting kopi mulai dihitung.

---

## How the Application Works

Aplikasi ini dibangun menggunakan arsitektur **Single Page Application (SPA)** murni:
* **UI Layer**: Menggunakan React 19 dan TypeScript yang dikompilasi melalui Vite. Tampilan di-styling menggunakan Tailwind CSS (melalui script CDN di `index.html`) dengan tema gelap *slate/indigo*.
* **State Management**: Seluruh state global (`products`, `rawMaterials`, `salesHistory`, `purchaseOrders`, `productionBatches`) dimuat saat aplikasi pertama kali terbuka (`App.tsx`) dan disinkronisasikan ke `localStorage` via layer abstraksi `services/api.ts`.
* **Kalkulasi Virtual**: Stok produk jadi dihitung secara *on-the-fly* pada memori (`useMemo`) dengan mengevaluasi formula resep terhadap stok fisik bahan baku terkini, dilengkapi pendeteksi siklus melingkar (*circular dependency*).

---

## Technology Stack

* **Framework**: React 19 (`react`, `react-dom`)
* **Language**: TypeScript 5.8
* **Build Tool**: Vite 6.2
* **Styling**: Tailwind CSS (via CDN) + Custom CSS untuk scrollbar
* **Icons**: Kumpulan ikon SVG kustom mandiri (`components/icons.tsx`)
* **Storage**: Browser `localStorage` (Client-side offline storage)
* **Fonts / Theme**: Inter/sans font bawaan sistem dengan skema gelap Slate-900 / Indigo

---

## Current Status

**Status: Functional Prototype / Advanced Offline Single-Store POS**
* Seluruh alur logika kasir, resep BOM, purchase order, dan penyesuaian stok berjalan fungsional tanpa backend server.
* Fitur berjalan stabil pada satu browser / perangkat yang sama.

---

## Known Limitations

1. **Penyimpanan Terisolasi di Browser (`localStorage`)**:
   * Data tidak tersimpan di cloud atau database eksternal.
   * Jika cache browser dibersihkan atau aplikasi dibuka dari perangkat/browser lain, data tidak saling terhubung (kembali ke data bawaan di `constants.ts`).
   * Rentan terhadap batas kapasitas kuota `localStorage` (biasanya ~5MB).
2. **Tidak Ada Autentikasi Pengguna & Multi-User Role**:
   * Tidak ada pemisahan hak akses antara Kasir, Barista, dan Pemilik Toko. Siapa pun yang membuka aplikasi memiliki akses penuh ke seluruh menu dan pengaturan.
3. **Komponen Kosong / Dead Code**:
   * Berkas `components/Reports.tsx` dan `hooks/useLocalStorageState.ts` berukuran 0 byte (tidak terisi kode), navigasi *Reports* saat ini dialihkan langsung ke komponen `SalesHistory.tsx`.
4. **Dialog Masih Menggunakan Browser Alert**:
   * Notifikasi keberhasilan dan konfirmasi penghapusan masih mengandalkan fungsi bawaan browser (`window.alert()` dan `window.confirm()`).
5. **Tidak Terintegrasi Perangkat Keras Fisik**:
   * Belum ada integrasi langsung dengan *receipt printer* Bluetooth/ESC-POS atau laci kasir (*cash drawer*). Pencetakan nota mengandalkan fungsi cetak browser (`window.print()`).

---

## Important Notes for Future Developers

* **Pusat Logika Resep**: Seluruh logika resep rekursif dan penentuan stok virtual berada di file `App.tsx` dalam hook `useMemo` (`calculateHpp` dan `calculateStock`). Jika ingin memindahkan logika ini ke backend, kedua fungsi tersebut adalah inti logika yang harus diekstraksi.
* **Perbedaan Perhitungan di Form Produk**: Pada `components/ProductForm.tsx`, estimasi HPP untuk sub-produk sengaja tidak direkursifkan untuk mencegah lag saat mengetik. Kalkulasi final yang akurat tetap dihitung di `App.tsx`.
* **Rehidrasi Objek Date**: `localStorage` hanya menyimpan string JSON. Saat data dimuat, `services/api.ts` secara eksplisit mengubah kembali string tanggal menjadi objek `new Date()`. Penambahan entitas baru yang memiliki tanggal wajib didaftarkan pada fungsi `getData` di `services/api.ts`.
