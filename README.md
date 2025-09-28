
<div align="center">

# 🏭 BSMCartonBox

**Sistem Manajemen Produksi Karton**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

```
 ██████╗ ███████╗███████╗███╗   ███╗ █████╗ ██████╗  ██████╗ ██╗    ██╗
 ██╔══██╗██╔════╝██╔════╝████╗ ████║██╔══██╗██╔══██╗██╔═══██╗██║    ██║
 ██████╔╝███████╗█████╗  ██╔████╔██║███████║██████╔╝██║   ██║██║ █╗ ██║
 ██╔══██╗╚════██║██╔══╝  ██║╚██╔╝██║██╔══██║██╔══██╗██║   ██║██║███╗██║
 ██████╔╝███████║███████╗██║ ╚═╝ ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝
 ╚═════╝ ╚══════╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝
```

> Aplikasi web komprehensif untuk mengelola seluruh alur kerja operasional pada perusahaan manufaktur karton. Memusatkan data dan menyederhanakan proses mulai dari manajemen pelanggan, pesanan pembelian (PO), pelacakan produksi, hingga pengiriman barang.

</div>

## 🚀 Tutorial Penggunaan

<div align="center">

| ⚡ Quick Start | 📊 Features | 🛠️ Tech Stack |
|:---:|:---:|:---:|
| 🚀 **5 min setup** | 📈 **Real-time Dashboard** | ⚛️ **Next.js 15** |
| 🔥 **Auto-calculation** | 👥 **Customer Management** | 🔥 **TypeScript** |
| 📦 **PDF Generation** | 📋 **PO Management** | 🎨 **Tailwind CSS** |
| 📱 **Responsive** | 🚚 **Delivery Tracking** | 🔥 **Firebase** |

</div>

### Prerequisites

Sebelum menjalankan aplikasi ini, pastikan sistem Anda sudah terinstall:

- **Node.js** (versi 18 atau lebih tinggi)
- **npm** (biasanya sudah terinstall bersama Node.js)
- **Git** (untuk clone repository)

### 📦 Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/mrizkymxx/bmscartonbox.git
   cd bmscartonbox
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   > **Catatan**: Firebase dan Vercel Blob sudah termasuk dalam dependencies dan akan terinstall otomatis. Tidak perlu install secara terpisah.

3. **Setup Environment Variables**

   Buat file `.env.local` di root directory dan isi dengan konfigurasi berikut:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

   # Blob Storage (Vercel Blob)
   BLOB_READ_WRITE_TOKEN=your_blob_token_here
   ```

   > **Catatan**: Untuk mendapatkan konfigurasi Firebase, buat project baru di [Firebase Console](https://console.firebase.google.com/) dan aktifkan Firestore Database.

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

   Aplikasi akan berjalan di `http://localhost:9002`

### 🎯 Cara Penggunaan

1. **Akses Dashboard**
   - Buka browser dan navigasi ke `http://localhost:9002`
   - Anda akan melihat dashboard dengan ringkasan data

2. **Manajemen Pelanggan**
   - Klik menu "Customers" di sidebar
   - Klik tombol "Add Customer" untuk menambah pelanggan baru
   - Isi form dengan data pelanggan (nama, alamat, kontak)

3. **Membuat Purchase Order (PO)**
   - Klik menu "Purchase Orders" di sidebar
   - Klik tombol "Add PO"
   - Pilih pelanggan yang sudah terdaftar
   - Input detail item:
     - **Ukuran Jadi (cm)**: Masukkan ukuran dalam centimeter
     - **Jumlah**: Quantity yang dipesan
     - **Tipe**: Pilih Box atau Layer
   - Sistem akan **otomatis menghitung** ukuran bahan baku (mm)

4. **Pelacakan Produksi**
   - Klik menu "Production" di sidebar
   - Lihat daftar item yang perlu diproduksi
   - Update jumlah barang yang sudah selesai diproduksi

5. **Membuat Pengiriman**
   - Klik menu "Deliveries" di sidebar
   - Klik tombol "Add Delivery"
   - Pilih pelanggan
   - Sistem akan menampilkan item yang ready to ship
   - Buat Surat Jalan dan cetak PDF jika diperlukan

6. **Menggunakan Tema**
   - Klik avatar/profile di kanan atas
   - Pilih "Light Mode" atau "Dark Mode" sesuai preferensi

### 🛠️ Scripts yang Tersedia

- `npm run dev` - Jalankan development server dengan Turbopack
- `npm run build` - Build aplikasi untuk production
- `npm start` - Jalankan production server
- `npm run lint` - Periksa kode untuk error linting
- `npm run typecheck` - Periksa TypeScript errors

## Fitur Utama

Aplikasi ini dibangun dengan serangkaian fitur yang saling terintegrasi untuk memberikan kontrol penuh atas proses bisnis:

-   **Dashboard Analitis**: Halaman utama yang menyajikan ringkasan data penting secara visual. Ini termasuk jumlah total pelanggan, jumlah PO yang masih aktif (belum selesai), total kuantitas barang yang siap kirim dari semua PO aktif, dan jumlah pengiriman yang dilakukan pada bulan berjalan. Dashboard juga menampilkan 5 aktivitas terbaru (baik PO baru maupun surat jalan yang baru dibuat) dan dilengkapi grafik batang untuk memantau tren volume pesanan vs. pengiriman per bulan dalam setahun.

-   **Manajemen Pelanggan (CRM)**: Modul untuk mengelola data pelanggan (Create, Read, Update, Delete). Tampilan daftar pelanggan bersifat responsif; pada layar besar (desktop), data ditampilkan dalam bentuk tabel yang dapat diurutkan dan dicari. Pada layar kecil (mobile), data ditampilkan dalam bentuk kartu (cards) untuk keterbacaan yang lebih baik.

-   **Manajemen Purchase Order (PO)**:
    -   **Pembuatan PO**: Memungkinkan pencatatan PO baru dari pelanggan yang sudah terdaftar. Form input dirancang untuk menangani detail item pesanan yang kompleks.
    -   **Kalkulasi Material Otomatis**: Salah satu fitur inti, di mana sistem secara otomatis menghitung ukuran bahan baku (dalam milimeter) yang dibutuhkan berdasarkan "ukuran jadi" (dalam sentimeter) yang dimasukkan pengguna. Rumus ini disesuaikan berdasarkan tipe item (`Box` atau `Layer`), menghemat waktu dan mengurangi potensi kesalahan manusia.
    -   **Manajemen Status**: Status setiap PO (`Open`, `Completed`, `Cancelled`) dapat dikelola dengan mudah. Status PO akan otomatis menjadi `Completed` jika semua item di dalamnya sudah terkirim sepenuhnya.

-   **Pelacakan Produksi**: Halaman khusus untuk tim produksi memantau semua item dari seluruh PO yang perlu dibuat. Setiap item ditampilkan bersama progress bar visual yang menunjukkan perbandingan antara jumlah yang sudah diproduksi dengan total pesanan. Tim produksi dapat dengan mudah memperbarui jumlah barang yang sudah selesai diproduksi melalui sebuah dialog modal.

-   **Manajemen Pengiriman**: Fasilitas untuk membuat Surat Jalan (Delivery Note) berdasarkan item-item yang stoknya sudah siap kirim (`Ready to Ship`). Saat membuat surat jalan, pengguna memilih pelanggan, dan sistem akan secara otomatis menampilkan daftar item dari semua PO pelanggan tersebut yang memiliki stok siap kirim.

-   **Otomatisasi Stok & Status**: Proses pembuatan surat jalan secara otomatis akan memperbarui sisa stok pada PO yang bersangkutan. Jumlah `delivered` (terkirim) pada item PO akan bertambah, dan jumlah `availableToShip` (siap kirim) akan berkurang. Jika seluruh item dalam sebuah PO sudah terkirim, status PO tersebut akan otomatis diperbarui menjadi `Completed`.

-   **Cetak PDF Surat Jalan**: Surat Jalan yang telah dibuat dapat langsung dicetak atau diunduh dalam format PDF. Dokumen PDF ini memiliki desain profesional, berisi semua detail pengiriman, informasi pelanggan, dan kolom tanda tangan, siap untuk diberikan kepada pengemudi dan pelanggan.

-   **Pengaturan Tampilan**: Pengguna dapat memilih antara tema terang (light mode) dengan dominasi abu-abu yang lembut dan tema gelap (dark mode) dengan warna hitam kebiruan yang modern, sesuai preferensi untuk kenyamanan visual.

## Tumpukan Teknologi (Tech Stack)

CartonFlow dibangun menggunakan teknologi modern yang berfokus pada performa, skalabilitas, dan pengalaman pengembang.

-   **Framework**: **Next.js 15** (dengan App Router) - Memberikan performa tinggi melalui Server Components dan rendering sisi server.
-   **Bahasa**: **TypeScript** - Menjamin keamanan tipe (type-safety) dan membuat kode lebih mudah dikelola.
-   **Styling**: **Tailwind CSS** - Kerangka kerja CSS utility-first untuk membangun desain kustom dengan cepat dan efisien.
-   **Komponen UI**: **shadcn/ui** - Kumpulan komponen antarmuka yang indah, dapat digunakan ulang, dan sangat mudah dikustomisasi.
-   **Database**: **Google Firestore** - Database NoSQL yang fleksibel dan real-time, digunakan sebagai backend untuk menyimpan semua data aplikasi.
-   **Manajemen Form**: **React Hook Form** & **Zod** - Kombinasi kuat untuk mengelola state form dan melakukan validasi skema data.
-   **Visualisasi Data**: **Recharts** - Pustaka grafik untuk menampilkan data analitis di dashboard.
-   **Generasi PDF**: **jsPDF** & **jspdf-autotable** - Digunakan untuk membuat dokumen PDF Surat Jalan secara dinamis di sisi klien.

## Struktur Proyek

Struktur folder proyek diorganisir untuk menjaga keterbacaan dan kemudahan pemeliharaan:

-   `src/app/`: Berisi semua halaman dan rute aplikasi, menggunakan sistem App Router Next.js.
-   `src/components/`: Kumpulan komponen React yang dapat digunakan kembali, diorganisir berdasarkan fitur (misalnya, `dashboard`, `customers`, `ui`).
-   `src/lib/`: Berisi logika bisnis inti, termasuk:
    -   `actions/`: Fungsi Server Actions untuk berinteraksi dengan database Firestore (CRUD).
    -   `firebase.ts`: Konfigurasi dan inisialisasi koneksi Firebase.
    -   `types.ts`: Definisi tipe data TypeScript untuk seluruh aplikasi.
    -   `pdf.ts`: Logika untuk membuat dokumen PDF.
-   `src/hooks/`: Berisi custom hooks React, seperti `use-toast` untuk notifikasi.

## Diagram Aplikasi

### Entity-Relationship Diagram (ERD)

Diagram ini menjelaskan struktur dan hubungan antar data di dalam database Firestore.

```mermaid
erDiagram
    CUSTOMERS ||--o{ PURCHASE_ORDERS : "memiliki"
    CUSTOMERS ||--o{ DELIVERIES : "menerima"

    PURCHASE_ORDERS {
        string id PK "Unique ID"
        string customerId FK "ID Pelanggan"
        string customerName "Nama Pelanggan"
        string poNumber "Nomor PO"
        string orderDate "Tanggal Pesanan"
        string status "Status PO (Open, Completed, Cancelled)"
        OrderItem[] items "Daftar Item Pesanan"
    }

    DELIVERIES {
        string id PK "Unique ID"
        string customerId FK "ID Pelanggan"
        string customerName "Nama Pelanggan"
        string deliveryNoteNumber "Nomor Surat Jalan"
        string deliveryDate "Tanggal Pengiriman"
        DeliveryItem[] items "Daftar Item Pengiriman"
    }

    PURCHASE_ORDERS }o--o{ DELIVERIES : "terkait melalui"

```
*   Seorang `CUSTOMER` dapat memiliki banyak `PURCHASE_ORDERS` dan `DELIVERIES`.
*   Setiap `PURCHASE_ORDER` berisi array `OrderItem`. Di dalam `OrderItem` tersimpan detail lengkap seperti ukuran, jumlah pesanan, jumlah terproduksi, dan jumlah terkirim.
*   Setiap `DELIVERY` berisi array `DeliveryItem`.
*   `DeliveryItem` mengambil referensi dari `OrderItem` di dalam `PurchaseOrder` untuk mengurangi jumlah stok yang tersedia untuk dikirim.

### Flowchart Alur Kerja

Diagram ini menggambarkan alur kerja utama dari pesanan hingga pengiriman.

```mermaid
graph TD
    A[Mulai] --> B{Manajemen Pelanggan};
    B --> C[Tambah/Update Data Pelanggan];
    C --> D{Manajemen PO};
    D --> E[Buat PO Baru & Pilih Pelanggan];
    E --> F[Input Detail Item Pesanan & Ukuran Jadi];
    F -- Kalkulasi Otomatis --> F;
    F --> G{Pelacakan Produksi};
    G --> H[Tim Produksi Memperbarui Jumlah Barang Selesai];
    H --> I{Manajemen Pengiriman};
    I --> J[Pilih Pelanggan & Item yang 'Ready to Ship'];
    J --> K[Buat Surat Jalan];
    K --> L[Cetak/Simpan PDF Surat Jalan];
    L -- Update Stok --> G;
    L -- Update Status --> D;
    K --> M[Selesai];

    subgraph "Dashboard"
        B -- Ringkasan --> Z[Dashboard Monitoring];
        D -- Ringkasan --> Z;
        I -- Ringkasan --> Z;
    end

```
**Penjelasan Alur Rinci:**
1.  **Manajemen Pelanggan**: Admin dapat menambah atau mengubah data pelanggan. Data ini akan digunakan di seluruh aplikasi.
2.  **Manajemen PO**: Admin membuat Purchase Order baru untuk pelanggan yang sudah terdaftar. Saat memasukkan item, admin hanya perlu mengisi **Ukuran Jadi (cm)**, dan sistem akan **otomatis menghitung Ukuran Bahan (mm)**.
3.  **Pelacakan Produksi**: Tim produksi melihat daftar item dari semua PO yang aktif. Mereka mengupdate jumlah barang yang sudah **diproduksi**.
4.  **Manajemen Pengiriman**: Admin membuat surat jalan. Sistem hanya akan menampilkan item-item dari pelanggan terkait yang stoknya siap kirim (yaitu, `jumlah diproduksi` > `jumlah sudah dikirim`).
5.  **Otomatisasi**: Pembuatan surat jalan secara otomatis mengurangi jumlah barang yang "tersedia untuk dikirim" dari PO yang bersangkutan. Jika semua item dalam PO sudah terkirim, status PO akan diperbarui menjadi `Completed`.
6.  **Dashboard**: Semua aktivitas ini dirangkum dalam dashboard untuk pemantauan secara real-time, memberikan gambaran cepat tentang kesehatan operasional bisnis.

---

Proyek ini siap untuk di-hosting di platform modern seperti Firebase App Hosting atau Vercel.
# bsmcarton
