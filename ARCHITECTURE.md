# Architecture Documentation: Loja-62

## Technology Stack

### Core Foundation
* **Framework**: React 19.2.0 (`react`, `react-dom`)
* **Language**: TypeScript 5.8.2 (Target ESNext, strict typing)
* **Build System & Dev Server**: Vite 6.2.0
* **Styling Engine**: Tailwind CSS via CDN script tag (`https://cdn.tailwindcss.com`) di `index.html` + custom webkit-scrollbar styling
* **Icons**: Standalone custom SVG React components (`components/icons.tsx`)
* **Storage Engine**: Browser Web Storage API (`window.localStorage`)
* **Target Execution Environment**: Modern Evergreen Web Browsers (Desktop & Tablet)

---

## Project Structure

Struktur direktori aktual di dalam workspace:

```text
/
├── index.html                 # Entry point HTML utama, memuat Tailwind CDN & script module
├── index.tsx                  # Root bootstrapping React (ReactDOM.createRoot)
├── App.tsx                    # Komponen utama: orkestrator state aplikasi & routing tampilan
├── types.ts                   # Definisi tipe data TypeScript global & domain models
├── constants.ts               # Data awal/seeding (kategori, bahan baku, produk, mock transactions)
├── package.json               # Konfigurasi dependensi npm dan skrip Vite
├── tsconfig.json              # Konfigurasi compiler TypeScript
├── vite.config.ts             # Konfigurasi bundler Vite (port 3000, host 0.0.0.0, path aliases)
├── components/                # Komponen antarmuka (UI Components & Modals)
│   ├── Cart.tsx               # Komponen keranjang belanja POS & kalkulasi subtotal/pajak
│   ├── Categories.tsx         # Manajemen kategori produk
│   ├── CategoryForm.tsx       # Formulir input kategori produk
│   ├── CategoryTabs.tsx       # Tab navigasi kategori pada layar kasir
│   ├── CreateInvoiceModal.tsx # Modal konfirmasi faktur / invoice tempo ke pelanggan
│   ├── CustomerForm.tsx       # Formulir input data pelanggan
│   ├── Customers.tsx          # Tabel master data pelanggan
│   ├── Dashboard.tsx          # Panel ringkasan metrik penjualan hari ini & peringatan stok
│   ├── Header.tsx             # Bilah navigasi atas, identitas toko, dan pemilih bahasa
│   ├── icons.tsx              # Pustaka ikon SVG modular mandiri
│   ├── Inventory.tsx          # Tabel produk jadi & produk setengah jadi
│   ├── InvoiceSettings.tsx    # Pengaturan template faktur & prefiks penomoran
│   ├── Modal.tsx              # Wrapper modal dialog serbaguna
│   ├── ProductForm.tsx        # Formulir produk & builder formula resep (BOM)
│   ├── ProductList.tsx        # Grid kartu produk di layar POS kasir
│   ├── ProductionOrderForm.tsx# Formulir input batch produksi sangrai kopi
│   ├── ProductionOrders.tsx   # Dasbor & daftar lot batch produksi sangrai
│   ├── PurchaseOrderForm.tsx  # Formulir pembuatan pesanan pembelian supplier
│   ├── PurchaseOrders.tsx     # Tabel daftar PO & tombol pelacakan penerimaan
│   ├── RawMaterialCategories.tsx      # Manajemen kategori bahan baku
│   ├── RawMaterialCategoryForm.tsx    # Formulir kategori bahan baku
│   ├── RawMaterialForm.tsx    # Formulir input data bahan baku
│   ├── RawMaterials.tsx       # Tabel master data persediaan bahan baku
│   ├── ReceivePOModal.tsx     # Modal penerimaan barang bertahap dari PO
│   ├── Reports.tsx            # [KOSONG / 0 Byte] Berkas belum diisi
│   ├── SalesHistory.tsx       # Tabel riwayat transaksi penjualan & filter tanggal
│   ├── Settings.tsx           # Formulir profil toko & konfigurasi pajak
│   ├── StockAdjustmentForm.tsx# Formulir input limbah / opname stok
│   ├── StockAdjustments.tsx   # Riwayat penyesuaian stok bahan baku
│   ├── StoreAssetForm.tsx     # Formulir input aset toko
│   ├── StoreAssets.tsx        # Tabel aset & kalkulasi depresiasi
│   ├── SupplierForm.tsx       # Formulir input data pemasok
│   ├── Suppliers.tsx          # Tabel master data pemasok
│   └── TransactionDetailModal.tsx # Modal detail struk transaksi & cetak struk
├── context/
│   └── LanguageContext.tsx    # React Context untuk lokalisasi dwibahasa (ID/EN)
├── hooks/
│   └── useLocalStorageState.ts# [KOSONG / 0 Byte] Berkas belum diisi
├── services/
│   └── api.ts                 # Layer abstraksi CRUD & persistence ke localStorage
└── translations/
    ├── en.ts                  # Kamus terjemahan Bahasa Inggris
    └── id.ts                  # Kamus terjemahan Bahasa Indonesia
```

---

## Application Structure

Aplikasi ini menggunakan pola **Monolithic Client-Side State Controller**:
1. **Entry & Bootstrapping**: `index.html` memanggil `/index.tsx` yang membungkus komponen `<App />` dengan `<LanguageProvider>`.
2. **Central Controller (`App.tsx`)**: Berfungsi sebagai *Single Source of Truth* untuk seluruh state operasional (produk, bahan baku, transaksi, keranjang, pengaturan, batch produksi).
3. **View Router Sederhana**: Navigasi antar halaman dilakukan melalui state lokal `currentView` bertipe union `View` yang merender komponen yang sesuai secara kondisional di dalam elemen `<main>`.

---

## Main Components

1. **`App.tsx`**: Menampung state utama, memicu kalkulasi rekursif memoized (`useMemo`) untuk HPP dan stok virtual produk, serta menangani aksi buka-tutup semua modal.
2. **`services/api.ts`**: Menjalankan fungsi serialisasi/deserialisasi JSON ke `localStorage`, mutasi stok, rehidrasi tanggal, dan logika checkout kasir.
3. **`ProductForm.tsx`**: Interface interaktif untuk merakit resep (memilih bahan mentah atau produk antara, memasukkan takaran, serta memasukkan estimasi biaya upah dan overhead).
4. **`Cart.tsx` & `ProductList.tsx`**: Inti antarmuka kasir untuk memilih produk, memvalidasi ketersediaan stok, menghitung pajak, dan mengeksekusi pembayaran.
5. **`ProductionOrders.tsx` & `ProductionOrderForm.tsx`**: Modul pelacakan lot sangrai kopi, penghitungan susut bobot, dan pemotongan stok otomatis saat batch selesai.
6. **`Header.tsx`**: Mengatur navigasi dropdown (Produk, Kontak, Manajemen) dan pengalihan bahasa.

---

## Data Model

Seluruh data dimodelkan secara eksplisit dalam `types.ts`:

```text
[RawMaterialCategory] 1 ──── * [RawMaterial] * ──── 1 [Supplier]
                                      │
                                      │ (digunakan dalam)
                                      ▼
[Category] 1 ──── * [Product] 1 ──── * [RecipeItem]
                          │ (dapat mereferensikan Product lain)
                          ▼
             [ProductWithDetails] (Calculated in-memory)
                          │
                          ├────> [CartItem] ────> [SaleTransaction] * ──── 0..1 [Customer]
                          │
                          └────> [ProductionBatch] (Inputs: RawMaterial / Product)
```

* **Relasi Polimorfik**: `RecipeItem` memiliki properti `itemType: 'raw-material' | 'product'` yang memungkinkan formula resep bersarang (*nested assembly*).
* **Snapshot Immutability**: Pada `SaleTransaction`, item disimpan dalam bentuk `SoldItem` yang menyalin nama, harga jual, dan snapshot HPP saat transaksi terjadi guna menjaga histori akuntansi.

---

## State Management

* **Pola State**: Berbasis React Hook bawaan (`useState`, `useMemo`, `useCallback`, `useEffect`).
* **Ketiadaan External Store**: Tidak menggunakan Redux, Zustand, MobX, atau Jotai.
* **Perilaku Sinkronisasi**:
  * Saat komponen `<App />` di-mount, data diambil secara asinkron dari `services/api.ts` yang membaca `localStorage`.
  * Ketika terjadi mutasi (misalnya checkout atau simpan produk), data disimpan ke `localStorage` via fungsi `api.saveX()`, lalu state React diupdate dengan data baru untuk memicu re-render.
* **Derived State / Komputasi di Memori**:
  * `productsWithDetails`: Menghitung HPP aktual dan stok virtual setiap kali `products`, `rawMaterials`, atau `categories` berubah. Menggunakan `Map` cache internal dan `Set` untuk melacak siklus rekursi tak berujung (*circular reference prevention*).

---

## Data Flow

```text
[ Interaksi Pengguna (Klik / Input) ]
                 │
                 ▼
     [ Handler di App.tsx ]
                 │
                 ▼
    [ services/api.ts (Async) ]
                 │
                 ├───> [ Baca / Tulis window.localStorage ]
                 │
                 ▼
[ Set React State (setProducts / setRawMaterials) ]
                 │
                 ▼
[ useMemo: calculateHpp() & calculateStock() ]
                 │
                 ▼
     [ Re-render UI Components ]
```

---

## Storage / Persistence

* **Media**: Browser `window.localStorage`.
* **Karakteristik**:
  * Sinkronus dan berbasis pasangan kunci-nilai (*key-value*) bertipe teks string.
  * Diisolasi per domain/origin peramban.
  * Kapasitas terbatas (~5 MB tergantung vendor peramban).
  * Tidak ada enkripsi data (data tersimpan dalam format plaintext JSON).
* **Seeding Otomatis**: Jika kunci `localStorage` belum ditemukan, `services/api.ts` secara otomatis mengisinya dengan data awal dari `constants.ts`.

---

## External Services & AI Integration

* **External Services**: **Nol (0)**. Tidak ada panggilan API jaringan ke luar (`fetch` / `axios` / WebSocket) selain pemuatan skrip Tailwind CDN dari `index.html` dan placeholder gambar dari `picsum.photos`.
* **AI Integration**: **Nol (0)**. Tidak ada keterhubungan dengan Google GenAI SDK atau model LLM mana pun di dalam kode aplikasi aktual.

---

## Important Dependencies

Berdasarkan `package.json`:
* `react`: ^19.2.0 (UI runtime)
* `react-dom`: ^19.2.0 (DOM renderer)
* `@vitejs/plugin-react`: ^5.0.0 (Vite React compilation plugin)
* `vite`: ^6.2.0 (Dev server & bundler)
* `typescript`: ~5.8.2 (Type checker)

*Catatan Dependensi*: Proyek ini sangat ramping tanpa library pihak ketiga untuk charting (seperti Recharts), tanpa date-fns/moment (menggunakan native `Date`), dan tanpa library form/validation (menggunakan native HTML form).

---

## Architectural Patterns

1. **Client-Side Monolithic SPA**: Seluruh aplikasi, routing, dan database lokal berjalan dalam satu proses di tab browser pengguna.
2. **Virtual Factory / BOM Pattern**: Pemodelan stok berbasis bill-of-materials yang mengevaluasi kuantitas bahan terkecil yang membatasi produksi (*Theory of Constraints / Bottleneck Analysis*).
3. **Repository / Service Abstraction**: Pemisahan antarmuka penyimpanan ke dalam `services/api.ts`, mempermudah jika di masa depan fungsi `localStorage` diganti dengan REST API atau Firebase Firestore.

---

## Security Considerations

1. **Penyimpanan Plaintext Tanpa Proteksi**: Data transaksi, nama pelanggan, nomor telepon, dan nominal uang tersimpan terbuka di `localStorage`, yang dapat dibaca oleh skrip JavaScript apa pun yang berjalan pada origin yang sama (rentan terhadap Cross-Site Scripting / XSS).
2. **Ketiadaan Access Control / Auth**: Tidak ada mekanisme login, verifikasi session, atau otorisasi peran.
3. **Tailwind CDN di Production**: `index.html` memuat `https://cdn.tailwindcss.com` secara langsung, yang menurut dokumentasi resmi Tailwind tidak disarankan untuk lingkungan production karena overhead kompilasi runtime di browser.

---

## Current Technical Debt

1. **Komponen Kosong / Yatim (Dead Code)**:
   * `components/Reports.tsx` (0 byte)
   * `hooks/useLocalStorageState.ts` (0 byte)
2. **Ukuran File `App.tsx` Terlalu Besar (Fat Controller)**:
   * `App.tsx` memiliki panjang 928 baris kode, menangani lebih dari 15 modal dialog, puluhan handler CRUD, routing tampilan, dan kalkulasi bisnis.
3. **Disparitas Estimasi HPP pada Form Produk**:
   * Di `ProductForm.tsx` (baris 130), penghitungan HPP untuk sub-produk dinonaktifkan (`return 0`) untuk efisiensi render form, sementara di `App.tsx` dihitung secara rekursif penuh. Hal ini menyebabkan angka HPP pratinjau di dalam form bisa berbeda dengan angka HPP yang muncul setelah disimpan.
4. **Penggunaan Native Browser Dialogs**:
   * `alert()` dan `confirm()` digunakan di lebih dari 10 tempat. Pada browser modern di dalam iframe, dialog native ini terkadang diblokir oleh kebijakan keamanan peramban.
5. **Skrip Uji & Linting Absen**:
   * `package.json` tidak memiliki script `lint` atau automated tests (`npm test`).

---

## Scalability Considerations

* **Batas Data Transaksi**: Karena seluruh `salesHistory` dimuat sekaligus ke dalam memori array React saat pertama kali buka, aplikasi akan mengalami penurunan performa jika riwayat transaksi mencapai ribuan entri.
* **Kapasitas Kuota Browser**: Penyimpanan foto produk dalam format Base64 data URL (`FileReader.readAsDataURL`) di `ProductForm.tsx` dapat menghabiskan kuota 5MB `localStorage` hanya dengan beberapa gambar produk beresolusi tinggi.

---

## Maintainability Considerations

* **Kelebihan**: Struktur penamaan tipe data sangat jelas (`types.ts`), kode komponen bersih dan modular, serta penggunaan CSS Tailwind yang konsisten.
* **Tantangan**: Jika ada penambahan relasi entitas baru, pengembang harus memodifikasi banyak tempat di `App.tsx` (menambah state, modal, handler simpan, handler hapus, dan prop drilling ke komponen anak).

---

## Architecture Assessment

* **Temuan Aktual (*What Was Actually Found*)**: Aplikasi adalah prototipe SPA frontend mandiri yang sangat fungsional, rapi, dan cepat, yang menggabungkan logika manufaktur F&B ke dalam antarmuka kasir tanpa memerlukan server.
* **Interpretasi (*Interpretation*)**: Arsitektur ini sengaja dibuat tanpa backend agar dapat langsung dicoba dan dievaluasi seketika (*zero configuration setup*) di lingkungan browser/preview.
* **Asumsi (*Assumptions*)**: Pengembang awal menargetkan kesederhanaan penggunaan untuk satu toko fisik (*single offline terminal*), bukan sistem cloud multi-cabang.
