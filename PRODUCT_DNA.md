# Product DNA: Loja-62

## Core Idea
Memperlakukan operasional kasir makanan dan minuman (F&B) bukan sebagai pencatatan jual-beli barang jadi, melainkan sebagai perakitan manufaktur mikro (*kitchen assembly line*) di mana setiap pesanan kasir secara otomatis membongkar resep, memotong stok bahan mentah, dan menghitung laba bersih aktual.

---

## Core Problem
Sistem kasir biasa tidak memahami cara kerja dapur kuliner. Kasir ritel mencatat barang berkurang 1:1, padahal secangkir kopi atau seporsi makanan diracik dari kombinasi gramatur bahan mentah yang fluktuatif, melibatkan upah kerja, serta sering mengalami tumpah, basi, dan susut tanpa tercatat.

---

## Core User
Pemilik gerai kedai kopi, roastery mikro, dan artisan bakery (*owner-operator*) yang lelah dengan kebocoran stok bahan baku dan ingin tahu persis berapa rupiah laba bersih dari setiap cangkir yang keluar dari mejanya.

---

## Core Interaction
Kasir menekan tombol menu (misal: *Cappuccino*), sistem secara instan mengecek ketersediaan seluruh bahan pembentuknya dari gudang, kasir menekan "Bayar", dan detik itu juga stok biji kopi, susu, dan air berkurang secara presisi di catatan gudang tanpa kasir perlu menghitung gramatur manual.

---

## Core Value
**Kepastian Profit & Perlindungan Bahan Baku**: Menghilangkan tebak-tebakan HPP dan menghentikan penjualan menu yang bahan bakunya sudah habis sebelum pelanggan kecewa di kasir.

---

## Key Insight
Di bisnis kuliner, Anda tidak menjual stok yang ada di rak; Anda menjual **kapasitas racik** dari bahan baku mentah yang Anda miliki di dapur. Siapa yang menguasai resep (*Bill of Materials*), dialah yang menguasai profitabilitas.

---

## What Makes It Interesting
Perkawinan antara kecepatan mesin kasir ritel (*fast register*) dengan kedalaman kalkulasi manufaktur pabrik (*ERP Bill of Materials*), namun dikemas dalam antarmuka yang sangat sederhana sehingga barista pemula pun bisa menggunakannya tanpa pelatihan khusus.

---

## What Must Survive a Rebuild
1. **Engine Formula Resep Bertingkat (BOM)**: Kemampuan produk menggunakan bahan mentah sekaligus produk setengah jadi (*sub-products*).
2. **Kalkulasi Stok Virtual Real-Time**: Penghitungan batas porsi maksimal berdasarkan ketersediaan bahan baku paling sedikit (*bottleneck ingredient*).
3. **Kalkulasi HPP 3-Komponen**: Bahan Baku + Upah Tenaga Kerja Langsung + Biaya Overhead per porsi.
4. **Siklus Hidup Pembelian (PO) dengan Penerimaan Bertahap**: Memastikan stok gudang bertambah hanya saat barang benar-benar diterima di toko.
5. **Pelacak Lot Sangrai & Resting Kopi**: Relevansi khusus untuk ekosistem kedai kopi dan roastery.

---

## What Can Be Completely Replaced
1. **Media Penyimpanan `localStorage`**: Dapat diganti sepenuhnya dengan database cloud seperti Firebase Firestore, Supabase, atau PostgreSQL.
2. **Komponen Dialog Native Browser**: `alert()` dan `confirm()` dapat diganti dengan modal konfirmasi dan sistem toast modern.
3. **Mekanisme State Controller**: `App.tsx` yang monolitik dapat dipecah ke dalam modul state terdistribusi atau React Context per domain.

---

## What Should Never Be Lost
**Sensitivitas terhadap Realitas Dapur F&B**: Jangan pernah mengubah sistem ini menjadi kasir ritel barcode biasa yang hanya mencatat barang jadi. Nyawa dari Loja-62 adalah hubungan erat antara **resep di dapur** dan **tombol di meja kasir**.

---

## Product in One Sentence
Loja-62 adalah sistem kasir dan inventaris F&B yang secara otomatis memotong stok bahan mentah dan menghitung laba bersih riil berdasarkan formula resep bertingkat pada setiap transaksi.

---

## Product in Five Sentences
Loja-62 lahir untuk memecahkan masalah mendasar bisnis kuliner, di mana sistem kasir ritel konvensional gagal melacak bahan mentah yang diracik di dapur. 
Melalui sistem resep bertingkat (*Bill of Materials*), aplikasi ini menghubungkan penjualan menu di kasir langsung dengan pengurangan gramatur bahan mentah di gudang. 
Sistem secara cerdas menghitung batas stok virtual agar kasir tidak menjual menu yang kehabisan bahan, sembari mengkalkulasi HPP dinamis yang mencakup biaya bahan, upah tenaga kerja, dan overhead. 
Selain modul kasir, aplikasi mencakup rantai operasional harian lengkap: pengadaan barang ke supplier, pencatatan limbah dan bahan basi, hingga pelacakan batch sangrai biji kopi. 
Inti produk ini adalah menghadirkan ketelitian kalkulasi sekelas sistem ERP pabrik ke dalam kesederhanaan layar kasir tablet yang mudah dioperasikan siapa saja.
