# Product Documentation: Loja-62

## Product Overview
**Loja-62** adalah aplikasi kasir (Point of Sale) dan sistem manajemen operasional mikro berbasis web yang dirancang khusus untuk bisnis makanan dan minuman (F&B), kedai kopi mandiri, dan roastery mikro. Inti pembeda produk ini terletak pada pemodelan produk sebagai formula manufaktur (*Bill of Materials*): transaksi kasir tidak hanya mencatat uang masuk, melainkan secara otomatis menghitung dan memotong gramatur bahan baku mentah dari inventaris serta menghitung HPP aktual dan laba kotor secara instan.

---

## Problem Statement
1. **Ketidaksesuaian Model Stok Ritel vs F&B**: Sistem kasir ritel standar berasumsi barang dibeli dan dijual dalam wujud yang identik (1 botol dibeli = 1 botol dijual). Dalam industri kuliner, produk yang dijual diracik dari berbagai bahan baku (misal: kopi, susu, gula, cup, sedotan).
2. **Ketiadaan Visibilitas HPP Dinamis**: Pelaku usaha kuliner mikro kesulitan mengetahui secara pasti keuntungan bersih dari tiap porsi menu karena harga bahan baku sering berubah, serta biaya tenaga kerja dan operasional sering diabaikan dalam kalkulasi kasir.
3. **Pencatatan Limbah & Pembelian Terfragmentasi**: Bahan baku sering terbuang (rusak, tumpah, basi, atau dipakai staf) tanpa pencatatan rapi, menyebabkan stok di gudang dan catatan di aplikasi kasir sering tidak cocok.

---

## Target Users
* **Pemilik Usaha F&B Mikro/Kecil (Owner-Operator)** *[Implemented in concept]*: Pengambil keputusan yang memantau laba harian, menetapkan harga jual, dan mengontrol biaya bahan baku.
* **Barista & Kasir Bar** *[Implemented]*: Staf garis depan yang membutuhkan layar kasir cepat, mudah memilih menu, memproses pembayaran, dan mencetak struk.
* **Manajer Gudang / Roaster** *[Implemented]*: Penanggung jawab yang mengurus pemesanan ke supplier (*Purchase Order*), menerima barang masuk, mencatat bahan terbuang, dan mengelola batch sangrai biji kopi.

---

## User Needs
1. **Kebutuhan Kasir Cepat**: Memasukkan pesanan pelanggan tanpa hambatan dan melihat secara real-time apakah bahan baku menu tersebut masih mencukupi.
2. **Kebutuhan Kontrol Bahan Otomatis**: Pengurangan otomatis stok bahan mentah (gram/ml) di gudang setiap kali kasir menyelesaikan transaksi.
3. **Kebutuhan Kalkulasi Modal Akurat**: Mengetahui HPP riil tiap cangkir kopi dengan memasukkan komponen biaya bahan mentah, upah barista per porsi, dan biaya listrik/sewa per porsi.
4. **Kebutuhan Jejak Pengadaan & Penyesuaian**: Dokumen formal untuk memesan barang ke pemasok dan mencatat bahan baku yang basi atau tumpah.

---

## Core Use Cases
* **UC-01: Transaksi Penjualan Langsung di Kasir (POS Direct Sale)**: Kasir memilih menu, sistem mengecek stok virtual dari ketersediaan bahan baku, kasir menerima pembayaran, bahan mentah terpotong, dan transaksi tercatat dengan data HPP serta laba.
* **UC-02: Pembuatan Faktur Tagihan / Tempo (Credit / Unpaid Invoice)**: Kasir membuat pesanan atas nama pelanggan terdaftar dengan status belum lunas (*unpaid*).
* **UC-03: Manajemen Resep Bertingkat (Nested BOM Management)**: Pemilik membuat produk setengah jadi (misal *Espresso Shot* dari biji kopi + air), kemudian menggunakannya kembali sebagai bahan pada menu akhir (*Cappuccino* atau *Iced Latte*).
* **UC-04: Pengadaan Bahan Baku (Purchase Order Lifecycle)**: Membuat draft PO ke pemasok $\rightarrow$ mengirim pesanan $\rightarrow$ menerima barang (parsial/lengkap) $\rightarrow$ penambahan otomatis ke stok bahan baku.
* **UC-05: Penyesuaian Stok & Pencatatan Limbah (Stock Wastage / Opname)**: Mencatat pengurangan atau penambahan stok bahan akibat tumpah, kadaluarsa, atau koreksi hitung fisik.
* **UC-06: Pelacakan Batch Produksi Sangrai (Roastery Batch Tracking)**: Mencatat lot sangrai green beans, menghitung susut bobot (*shrinkage %*), memantau masa degassing/resting kopi hingga siap seduh, dan memotong stok green beans.
* **UC-07: Pemantauan Performa Harian (Dashboard & Sales History)**: Melihat omzet hari ini, estimasi laba bersih kotor, produk terlaris, dan rincian transaksi masa lalu.

---

## User Workflows
1. **Alur Transaksi Kasir**:
   Buka Tab POS $\rightarrow$ Filter Kategori $\rightarrow$ Klik Produk untuk Masuk Keranjang $\rightarrow$ Verifikasi Jumlah & Pajak $\rightarrow$ Klik "Bayar Sekarang" $\rightarrow$ Konfirmasi $\rightarrow$ Stok Bahan Berkurang & Transaksi Masuk Riwayat.
2. **Alur Pembuatan Menu Baru**:
   Menu Manajemen Produk $\rightarrow$ Tambah Produk Baru $\rightarrow$ Isi Nama & Harga Jual $\rightarrow$ Masukkan Formula Resep (pilih bahan mentah/sub-produk & tentukan gramatur) $\rightarrow$ Masukkan Biaya Tenaga Kerja & Overhead $\rightarrow$ Simpan.
3. **Alur Pengadaan Bahan Baku**:
   Menu Purchase Orders $\rightarrow$ Tambah PO Baru $\rightarrow$ Pilih Pemasok & Bahan yang Dipesan $\rightarrow$ Simpan (Status Draft / Ordered) $\rightarrow$ Klik Tombol "Terima Barang" saat kiriman tiba $\rightarrow$ Masukkan kuantitas riil yang diterima $\rightarrow$ Stok gudang bertambah otomatis.
4. **Alur Produksi Sangrai Kopi**:
   Menu Pelacakan Produksi $\rightarrow$ Tambah Batch Sangrai $\rightarrow$ Pilih Target Produk Kopi Jadi & Input Green Beans yang Dipakai $\rightarrow$ Jalankan Proses $\rightarrow$ Update Status Menjadi Selesai & Input Berat Akhir $\rightarrow$ Sistem menghitung susut bobot dan memotong stok green beans.

---

## Functional Requirements
* **FR-01 (Katalog & POS)**: *[Implemented]* Menampilkan produk dengan filter kategori, harga jual, dan stok virtual. Produk dengan harga Rp 0 otomatis disembunyikan dari POS (ditetapkan sebagai produk setengah jadi).
* **FR-02 (Keranjang & Checkout)**: *[Implemented]* Menghitung subtotal, pajak (persentase dinamis dari pengaturan), dan total harga. Mencegah penambahan kuantitas melebihi batas stok bahan.
* **FR-03 (Engine Resep & HPP)**: *[Implemented]* Menghitung HPP secara rekursif: `Biaya Bahan + Tenaga Kerja Langsung + Overhead`. Mampu mendeteksi siklus melingkar (*circular dependency*).
* **FR-04 (Stok Virtual)**: *[Implemented]* Menghitung stok produk siap jual berdasarkan bahan mentah dengan rasio terendah (*bottleneck material*).
* **FR-05 (Purchase Order)**: *[Implemented]* Mendukung status `draft`, `ordered`, `partially-received`, `completed`, `cancelled`. Penerimaan barang mengupdate stok bahan secara langsung.
* **FR-06 (Stock Adjustment)**: *[Implemented]* Mendukung jenis mutasi `wastage`, `correction`, `internal-use`, `return`. Mencegah stok bernilai negatif.
* **FR-07 (Production Orders)**: *[Implemented]* Mencatat lot sangrai, operator, target output vs aktual, susut bobot sangrai, dan tanggal masa *resting* kopi.
* **FR-08 (Kontak)**: *[Implemented]* CRUD untuk data Pemasok (Supplier) dan Pelanggan (Customer).
* **FR-09 (Aset Toko)**: *[Implemented]* CRUD aset tetap dengan kalkulasi penyusutan garis lurus tahunan.
* **FR-10 (Pengaturan Toko & Pajak)**: *[Implemented]* Mengubah nama toko, alamat, tarif pajak, simbol mata uang, prefix nomor invoice, dan catatan kaki struk.
* **FR-11 (Laporan & Cetak)**: *[Implemented]* Riwayat transaksi dengan rincian HPP, profit, dan modal cetak struk via `window.print()`.
* **FR-12 (Dukungan Bahasa)**: *[Implemented]* Pilihan bahasa Indonesia dan Inggris.

---

## Business Rules
1. **Aturan Produk Setengah Jadi**: Produk dengan `sellPrice === 0` tidak boleh tampil di halaman penjualan kasir (POS), melainkan hanya dapat dipilih sebagai komponen resep pada produk lain.
2. **Aturan Penguncian Stok Virtual**: Kuantitas produk yang dapat ditambahkan ke keranjang kasir dibatasi oleh stok bahan baku paling kritis. Kasir tidak dapat menambahkan kuantitas jika stok virtual bernilai 0 atau sudah habis di keranjang.
3. **Aturan Deduplikasi & Snapshot Transaksi**: Ketika transaksi diselesaikan, data nama produk, harga jual saat itu, dan HPP saat transaksi terjadi dikunci (*snapshot*) ke dalam `SaleTransaction`. Perubahan harga bahan mentah di masa depan tidak akan mengubah riwayat profit transaksi masa lalu.
4. **Integritas Penghapusan Entitas (Referential Integrity)**:
   * Bahan baku tidak dapat dihapus jika masih digunakan dalam resep produk apa pun.
   * Produk tidak dapat dihapus jika masih digunakan sebagai sub-produk dalam resep produk lain.
   * Kategori tidak dapat dihapus jika masih memiliki produk atau bahan terkait.
   * Pemasok tidak dapat dihapus jika masih terhubung dengan bahan mentah aktif.
5. **Aturan Siklus Daur Hidup PO**: Jika seluruh kuantitas bahan yang dipesan telah diterima (`totalReceived >= totalOrdered`), status PO otomatis beralih menjadi `completed`. Jika baru sebagian, status menjadi `partially-received`.
6. **Aturan Mutasi Stok Produksi**: Pemotongan stok bahan baku mentah pada batch produksi hanya terjadi ketika status diubah menjadi `completed`. Jika batch yang sudah selesai kemudian dibatalkan atau dihapus, stok bahan mentah otomatis dikembalikan (*revert*).

---

## Data / Entities
* `Category` *[Implemented]*: Kelompok produk jual (`id`, `name`).
* `RawMaterialCategory` *[Implemented]*: Kelompok bahan mentah (`id`, `name`).
* `RawMaterial` *[Implemented]*: Bahan baku dasar (`id`, `name`, `categoryId`, `stock`, `unit`, `costPerUnit`, `supplierId`). Satuan fisik: `gram`, `ml`, `pcs`.
* `RecipeItem` *[Implemented]*: Komponen penyusun resep (`itemId`, `itemType: 'raw-material' | 'product'`, `quantity`).
* `Product` *[Implemented]*: Menu jual / produk antara (`id`, `name`, `categoryId`, `recipe`, `sellPrice`, `imageUrl`, `directLaborCost`, `productionOverheadCost`).
* `SaleTransaction` *[Implemented]*: Transaksi penjualan kasir (`id`, `timestamp`, `items`, `subtotal`, `tax`, `total`, `totalHpp`, `profit`, `customerId`, `paymentStatus`).
* `PurchaseOrder` *[Implemented]*: Pesanan pembelian supplier (`id`, `supplierId`, `items`, `status`, `orderDate`, `expectedDeliveryDate`, `receivedDate`, `totalCost`, `notes`).
* `StockAdjustment` *[Implemented]*: Penyesuaian stok manual / limbah (`id`, `date`, `type`, `items`, `notes`).
* `StoreAsset` *[Implemented]*: Aset fisik toko (`id`, `name`, `purchaseDate`, `purchasePrice`, `residualValue`, `usefulLife`).
* `ProductionBatch` *[Implemented]*: Batch kerja produksi/sangrai (`id`, `batchNumber`, `targetProductId`, `targetQuantity`, `actualQuantity`, `productionDate`, `roastDate`, `restingDays`, `operatorName`, `status`, `inputs`, `directLaborCost`, `overheadCost`, `totalCost`, `unitCost`, `yieldPercentage`, `weightLossPercentage`, `notes`).
* `Supplier` & `Customer` *[Implemented]*: Kontak bisnis (`id`, `name`, `phone`, `email`, dll.).
* `AppSettings` *[Implemented]*: Konfigurasi toko, tarif pajak, mata uang, dan template faktur.

---

## AI Capabilities
* **Status**: *[None / Non-existent in code]*
* **Temuan Aktual**: Meskipun di `metadata.json` tercantum capability `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` dan di `vite.config.ts` terdapat define untuk `GEMINI_API_KEY`, **tidak ada kode kecerdasan buatan (Gemini API, LLM, atau machine learning)** yang diimpor, dipanggil, atau diimplementasikan dalam aplikasi saat ini. Seluruh logika berjalan murni secara deterministik berbasis aturan matematika.

---

## Integrations
* **Status**: *[Zero External Integrations]*
* **Temuan Aktual**: Tidak ada integrasi pihak ketiga (tanpa payment gateway, tanpa cloud database, tanpa webhook, tanpa integrasi printer thermal Bluetooth/ESC-POS, tanpa sistem akuntansi eksternal). Semua interaksi bersifat internal pada browser client.

---

## UX Principles
1. **Tema Antarmuka Gelap "Aurora UI"**: Menggunakan latar gradasi gelap slate-900 dengan aksen warna ungu/indigo untuk menjaga kenyamanan mata staf di lingkungan gerai/kafe.
2. **Kepadatan Informasi Terstruktur**: Menampilkan data metrik kunci (stok, HPP, profit) langsung pada kartu produk dan tabel tanpa navigasi bertumpuk yang membingungkan.
3. **Feedback Sederhana**: Menggunakan badge status berwarna tegas (kuning = proses/draft, hijau = selesai, merah = batal) untuk memudahkan pemindaian status secara visual.

---

## Current Scope
* Operasional kasir mandiri pada satu perangkat komputer / tablet browser.
* Manajemen formula resep dan persediaan bahan baku internal.
* Pemantauan laba-rugi kotor dan rekapitulasi penjualan harian lokal.
* Pencatatan pengadaan, limbah, aset toko, dan batch sangrai roastery.

---

## Out of Scope
* Sistem multi-cabang / multi-outlet (*multi-store synchronization*).
* Sistem otentikasi login karyawan dan manajemen hak akses (RBAC).
* Pembayaran kartu debit/kredit online atau e-wallet (QRIS terintegrasi langsung).
* Sinkronisasi data ke cloud backend atau database relasional.
* Pengiriman notifikasi otomatis (WhatsApp/Email invoice).

---

## Known Limitations
* **Kerapuhan Data**: Data disimpan di `localStorage`. Jika pengguna menghapus histori/cache browser atau berganti gawai, seluruh data kembali ke kondisi awal (*default mock data*).
* **Reports.tsx Kosong**: Berkas komponen laporan (`Reports.tsx`) belum terisi kode; tombol navigasi laporan saat ini menampilkan `SalesHistory`.
* **Notifikasi Primitif**: Menggunakan dialog bawaan peramban (`alert()` dan `confirm()`) yang menghentikan eksekusi thread JavaScript browser.

---

## Future Opportunities
1. **Migrasi Cloud Backend**: Menghubungkan aplikasi ke database berbasis cloud (Firebase Firestore atau PostgreSQL) agar data tersimpan aman dan dapat diakses dari beberapa perangkat secara bersamaan.
2. **Otentikasi & Multi-Role**: Menambahkan login pengguna untuk membedakan hak akses Pemilik, Kasir, dan Manajer Gudang.
3. **Integrasi Hardware POS**: Menambahkan koneksi cetak struk via Bluetooth/USB ESC-POS dan integrasi QRIS dinamis.
4. **Analitik Lanjutan & AI**: Pemanfaatan AI untuk prediksi kebutuhan belanja bahan baku berdasarkan tren penjualan hari-hari sebelumnya.
