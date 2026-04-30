# Rencana Implementasi: Sistem Informasi Transportasi Cikarang (CAKRA)

## 1. Arsitektur & Tech Stack
*   **Framework:** Next.js (App Router)
*   **Database:** MySQL (Local via Laragon)
*   **ORM:** Drizzle ORM
*   **Autentikasi:** Better Auth (Khusus untuk peran Admin)
*   **UI/Styling:** Tailwind CSS v4, Shadcn UI (Tema Soft Blue), Lucide Icons
*   **Integrasi Peta:** Leaflet.js & React-Leaflet

---

## 2. Desain Database (Skema Drizzle)

1.  **Users & Auth Tables** (Dibuat otomatis oleh Better Auth untuk login Admin).
2.  **transportations**
    *   `id`, `name` (misal: K.17, AO5), `type` (Angkot, Bus, KRL, Shuttle), `capacity`, `facilities`, `created_at`
3.  **stops (Halte / Titik)**
    *   `id`, `name`, `type` (Halte, Terminal, Stasiun, Jalan), `latitude`, `longitude`
4.  **routes (Rute Utama)**
    *   `id`, `transportation_id`, `name` (misal: Cikarang - Cibarusah), `origin_stop_id`, `destination_stop_id`, `polyline_data` (untuk menggambar garis di peta)
5.  **route_stops (Titik Henti per Rute)**
    *   `id`, `route_id`, `stop_id`, `stop_order` (urutan halte, misal: 1, 2, 3...)
6.  **schedules (Jadwal Operasional)**
    *   `id`, `route_id`, `start_time` (05:00), `end_time` (22:00), `headway_minutes` (interval, misal tiap 15 menit), `operational_days`
7.  **fares (Struktur Tarif)**
    *   `id`, `transportation_id`, `base_fare` (tarif datar/awal), `fare_per_km` (jika ada tarif jarak)

---

## 3. Logika Sistem Rekomendasi & Komparasi

Fitur utama (Mencari rute Tercepat, Termurah, Nyaman, Sedikit Transit) akan dibangun dengan:
1.  **Pencarian Langsung (Direct Route):** Mencari rute yang melewati halte A dan halte B tanpa ganti angkot.
2.  **Pencarian 1x Transit (1-Stop Route):** Mencari persimpangan/halte transit antara rute asal dan rute tujuan.
3.  **Pembobotan (Scoring):**
    *   *Termurah:* Diurutkan berdasarkan akumulasi kolom `fares`.
    *   *Tercepat:* Estimasi jarak (Haversine Formula/Map distance) dibagi kecepatan rata-rata moda.
    *   *Paling Sedikit Transit:* Diurutkan dari yang *Direct* (0 transit) ke yang butuh ganti kendaraan.
    *   *Paling Nyaman:* Diurutkan berdasarkan skor `facilities` (misal: AC, Bus > Angkot).

---

## 4. Fase Eksekusi (Langkah demi Langkah)

### Fase 1: Setup & Konfigurasi Dasar ✅ *(Selesai)*
- [x] Inisialisasi Next.js, Shadcn, Tailwind v4
- [x] Set dependensi (Drizzle, MySQL2, Leaflet)
- [x] Konfigurasi warna tema (Soft Blue)

### Fase 2: Database & Autentikasi 🚧 *(Tahap Selanjutnya)*
- [ ] Setup koneksi database `.env` ke MySQL Laragon.
- [ ] Membuat file `schema.ts` di Drizzle sesuai desain nomor 2.
- [ ] Menjalankan `drizzle-kit push` untuk membuat tabel di MySQL.
- [ ] Setup Better Auth untuk fitur Login Admin.

### Fase 3: Pembuatan Halaman Admin (CRUD) ✅ *(Selesai UI Layout)*
- [x] Membuat layout Admin (Sidebar, Header).
- [x] Halaman Kelola Data Transportasi.
- [x] Halaman Kelola Halte & Rute (termasuk input koordinat).
- [x] Halaman Kelola Jadwal & Tarif.

### Fase 4: Halaman Publik (Customer) & Peta
- [ ] Halaman Utama (Landing Page) & Header Navigasi.
- [ ] Halaman Daftar Transportasi.
- [ ] Komponen Peta (React-Leaflet) untuk menampilkan rute & sebaran halte.
- [ ] Halaman Detail Rute, Tarif, dan Jadwal.

### Fase 5: Mesin Pencari, Rekomendasi & Komparasi
- [ ] Form pencarian (Asal -> Tujuan).
- [ ] Algoritma routing & rekomendasi (Tercepat, Termurah, dll).
- [ ] Tampilan halaman hasil perbandingan (Compare page).

### Fase 6: Scraping & Seeding Data
- [ ] Melakukan *scraping*/pengumpulan data trayek di Cikarang.
- [ ] Memasukkan data awal (Seeding) ke MySQL agar sistem langsung dapat diuji coba.
