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
