# CAKRA (Cikarang Access for Kommuter Route and Area)

## 🚀 Cara Menjalankan Project Pertama Kali

Ikuti langkah-langkah berikut jika kamu baru pertama kali melakukan clone atau mengunduh project ini:

1. **Install Dependencies**
   Buka terminal di dalam folder project (folder `CAKRA`), lalu jalankan perintah berikut untuk mengunduh semua library yang dibutuhkan:
   ```bash
   npm install
   ```

2. **Siapkan Environment Variables**
   Buat file bernama `.env` di folder utama project (sejajar dengan `package.json`). Kamu bisa bertanya kepada tim untuk isi dari `.env` ini, atau minta file `.env` langsung.
   
   Minimal file ini harus berisi URL koneksi ke database kamu:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/nama_database"
   ```

3. **Jalankan Development Server**
   Setelah semua library terinstall dan `.env` sudah siap, jalankan aplikasi di komputermu dengan perintah:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat website yang berjalan.

---

## 💾 Cara Memasukkan (Import) Database dari Orang Lain

Project ini menggunakan **MySQL** dan **Drizzle ORM**. Jika kamu menerima file backup database (biasanya berformat `.sql`) dari anggota tim lain, berikut cara memasukkannya:

### Opsi 1: Menggunakan Aplikasi (Disarankan: phpMyAdmin, DBeaver, TablePlus, XAMPP)
1. Buka aplikasi database client kamu dan pastikan server MySQL sudah menyala (contoh: nyalakan module MySQL di XAMPP).
2. Buat database kosong baru (misalnya dengan nama `cakra_db`).
3. Cari menu **Import**, lalu pilih file `.sql` yang diberikan oleh temanmu.
4. Klik **Go** atau **Run** untuk memulai proses import.
5. Pastikan `DATABASE_URL` di file `.env` kamu sudah di-update sesuai dengan nama database, username, dan password MySQL di komputermu.

### Opsi 2: Menggunakan Command Line (Terminal) MySQL
Jika kamu terbiasa dengan terminal/command prompt, jalankan perintah berikut:
```bash
mysql -u root -p nama_database < "path/ke/file/database.sql"
```

## 🛠️ Teknologi yang Digunakan
- **Next.js** (App Router)
- **React**
- **Tailwind CSS**
- **Drizzle ORM** (MySQL)
- **Better Auth**
- **Leaflet** (Maps)
