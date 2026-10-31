# byquinie

Website menulis pribadi Quinie — esai, cerpen, puisi, dan catatan. Dibuat dengan [Jekyll](https://jekyllrb.com), jadi bisa langsung di-host gratis di GitHub Pages.

## Menulis tulisan baru

Buat file baru di folder `_posts/` dengan nama `TAHUN-BULAN-TANGGAL-judul-singkat.md`, misalnya `_posts/2026-11-03-surat-untuk-diri-sendiri.md`:

```markdown
---
title: Surat untuk Diri Sendiri
category: Esai          # Esai, Cerpen, Puisi, Catatan — atau kategori baru apa saja
subtitle: Opsional, kalimat kecil di bawah judul.
---

Paragraf pembuka. Kalimat ini akan muncul sebagai cuplikan di beranda.

<!--more-->

Lanjutan tulisan…
```

Hal-hal kecil yang perlu tahu:

- **Cuplikan** di beranda diambil dari teks sebelum `<!--more-->` (kalau tidak ada, paragraf pertama).
- **Pemisah adegan**: tulis `---` di baris sendiri, akan tampil sebagai `· · ·`.
- **Kutipan**: awali baris dengan `>`.
- **Puisi**: bungkus dengan `<div class="poem" markdown="1">` … `</div>` supaya setiap baris tetap patah di tempatnya.
- **Gambar**: taruh di `assets/img/`, lalu tulis `![keterangan](/assets/img/nama.jpg)`.

## Panel admin

Semua isi bisa diubah tanpa menyentuh kode lewat **[Pages CMS](https://pagescms.org)** (gratis):

1. Buka https://app.pagescms.org dan masuk dengan akun GitHub.
2. Pilih repo **byquinie**. Menu-menunya diatur di file `.pages.yml`:
   - **Tulisan**: esai, cerpen, puisi, catatan. Isi "Kalimat favorit" supaya tampil besar dengan tulisan sambung. Pilih bentuk "puisi" supaya judulnya tegak di samping.
   - **Novel & e-book**: satu entri = satu buku. Isi sinopsis, tagline, sampul (gambar atau warna), tombol toko buku online, dan harga e-book.
   - **Bab novel**: isi tiap bab. Kolom "Judul novel" harus sama persis dengan judul bukunya.
   - **Halaman Tentang**.
   - **Pengaturan tampilan**: warna, huruf, foto beranda, teks pintu pembuka, nomor WhatsApp.
3. Tekan *Save*. GitHub Pages membangun ulang website dalam satu-dua menit.

Halaman `/admin/` di website juga berisi tombol ke panel ini.

## Novel, bab, dan e-book

- Buku ada di folder `_novel/` (satu file per buku), bab di `_bab/` (satu file per bab).
- Setiap buku punya halamannya sendiri di `/novel/judul-buku/`, berisi sinopsis, tombol toko buku online, kotak e-book, dan daftar bab.
- Halaman **E-book** (`/ebook/`) menampilkan semua buku yang kolom `ebook.jual`-nya dicentang.

### Menjual e-book

Website ini statis, jadi pembayarannya diproses oleh layanan lain:

- **Paling rapi**: buat produk digital di layanan seperti Lynk.id, Mayar, KaryaKarsa, atau Gumroad. Mereka menerima pembayaran dan mengirim file e-book otomatis ke pembeli. Tempel link produknya di kolom **Link pembayaran**.
- **Paling sederhana**: kosongkan link pembayaran dan isi nomor WhatsApp di Pengaturan tampilan. Tombolnya akan jadi "Pesan lewat WhatsApp" dengan pesan yang sudah terisi.
- Kalau dua-duanya kosong, tombolnya tampil "Segera hadir".

## Huruf & ukuran

Pembaca bisa mengatur sendiri lewat tombol **Aa** di pojok kanan atas: pilih Lora, Garamond, Inter, atau Mesin tik, lalu perbesar/perkecil (90–130%). Pilihannya tersimpan di perangkat mereka.

Huruf bawaan untuk semua pengunjung diatur di `_data/tampilan.yml` (`font.isi`), atau lewat panel admin.

## Mengubah identitas situs

Semua ada di `_config.yml`: nama situs, nama penulis, tagline, dan tautan sosial (Instagram, X, surel). Halaman “Tentang” ada di `tentang.md`.

## Online-kan lewat GitHub Pages

1. Buka **Settings → Pages** di repo ini.
2. Di **Build and deployment**, pilih *Deploy from a branch*, lalu pilih branch dan folder `/ (root)`.
3. Karena alamatnya akan jadi `https://<username>.github.io/byquinie/`, isi `baseurl: "/byquinie"` di `_config.yml`. (Kalau pakai domain sendiri, biarkan kosong.)

## Menjalankan di komputer sendiri (opsional)

```bash
bundle install
bundle exec jekyll serve
```

Lalu buka http://localhost:4000.
