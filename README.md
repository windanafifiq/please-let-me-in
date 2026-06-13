<!-- # PLEASE, LET ME IN! — Lantai 7

Visual-novel **observation-duty** bertema thriller wabah, ditenagai **4 Finite
State Machine** yang saling memengaruhi. Kamu menjaga pintu Lantai 7: tiap hari
orang mengetuk minta masuk. Sebagian sehat, sebagian membawa wabah, sebagian
berbohong. **Wawancarai, desak, deduksi — lalu putuskan: terima atau tolak.**

Tugas Mata Kuliah Game Edukasi dan Simulasi — Informatika ITS 2026.

## Cara Menjalankan
ES Modules → harus lewat HTTP server (bukan `file://`):
```bash
cd floor7-vn
python3 -m http.server 8000   # buka http://localhost:8000
```

## Simulasi & Multi-FSM (inti tugas)
Game ini memodelkan **skrining wabah di pintu** lewat 4 FSM:

1. **DemeanorFSM — sikap NPC saat diwawancara** (inti gameplay)
   `tenang → defensif → mengelak → membuka / memberontak`
   Tiap pertanyaan/desakan pemain adalah *input* yang memicu transisi. Minta KTP
   ke orang tertutup → ia "mengelak" ("KTP saya hilang"). Desak halus → ia bisa
   "membuka" (akhirnya jujur). Desak terlalu keras → "memberontak" (pergi).
   Dialog & petunjuk yang muncul tergantung state ini.

2. **HealthFSM — kondisi kesehatan tersembunyi tiap orang**
   `sehat → terpapar → bergejala → kritis → pulih / meninggal`
   State disembunyikan; pemeriksaan hanya mengungkap petunjuk ambigu. Orang yang
   sudah kamu terima, FSM-nya **terus jalan tiap hari** di dalam gedung dan bisa
   menulari penghuni lain — konsekuensi nyata dari keputusanmu.

3. **BuildingFSM — kondisi gedung**
   `normal → waspada → lockdown → chaos → evakuasi`
   Naik berdasarkan jumlah wabah yang lolos & kematian.

4. **TrustFSM — kepercayaan gedung**
   `kooperatif → ragu → panik → hostile`
   Salah usir orang sehat / loloskan wabah → kepercayaan turun, memengaruhi
   keandalan info.

Diagram keempat FSM tersedia dalam format **draw.io** (lihat folder `docs/`,
ditambahkan saat finishing).

## Loop Gameplay
1. Pengunjung muncul di tengah layar + transkrip dialog.
2. **Wawancara bebas tanpa kuota:** tanya keperluan, tanya gejala, minta
   identitas, periksa lengan, desak halus/keras, tenangkan, cek catatan gedung,
   amati diam-diam. Tiap aksi menggerakkan DemeanorFSM & bisa membuka petunjuk.
3. Petunjuk masuk ke **Catatan Pemeriksaan** dengan sinyal: bersih /
   mencurigakan / tak pasti. **Tidak pernah pasti** — orang gugup bisa beri
   sinyal palsu; pembohong bisa menyembunyikan sampai didesak.
4. Putuskan **TERIMA** atau **TOLAK**. Kondisi sebenarnya baru terungkap setelah
   keputusan → cerita bercabang.
5. Antar hari, HealthFSM & BuildingFSM maju.

## Kunci Deduksi
- Orang **terinfeksi** biasanya punya ≥2 sinyal mencurigakan konsisten.
- **Kontradiksi cerita** (cek catatan gedung) = sinyal terkuat.
- Orang **mengelak** (mis. "KTP hilang") harus **didesak** dulu agar petunjuk
  asli (lengan, pengakuan) terbuka — tapi desakan keras bisa bikin memberontak.
- **Sehat ≠ aman:** ada penipu sehat yang berniat menjarah. Periksa identitas.

## 5 Ending
Ditentukan akurasi penilaian + wabah lolos + kematian + kepercayaan:
Penjaga Tanpa Cela → Penjaga yang Bijak → Bertahan dengan Ragu →
Pintu yang Salah → Gerbang Runtuh. Layar akhir menampilkan rekap tiap keputusan.

## Struktur
```
index.html          entry point
styles.css          tema VN/observation-duty
src/
  main.js           bootstrap Phaser
  scenes/           BootScene, MenuScene, GameScene, EndScene
  fsm/
    DemeanorFSM.js       FSM sikap NPC (inti wawancara)
    HealthFSM.js         FSM kesehatan tersembunyi
    BuildingTrustFSM.js  FSM gedung + FSM kepercayaan
  engine/
    interview.js    mesin wawancara (menggerakkan DemeanorFSM, ungkap tell)
    story.js        alur hari, majukan HealthFSM/BuildingFSM, ending
  data/visitors.js  6 pengunjung: skrip dialog bercabang per-state + tells
  ui.js             overlay: transkrip, indikator sikap, menu aksi, papan petunjuk
assets/             taruh latar/potret/audio asli di sini (lihat README tiap folder)
```

## Belum dikerjakan (untuk finishing sebelum 20 Juni)
- [ ] Halaman **KREDIT** (foto, email pembuat, teks tugas ITS 2026) — menu awal
- [ ] **Diagram multi-FSM draw.io** di `docs/`
- [ ] **Aset grafis & audio legal** (Storyblocks/Suno/Freesound) menggantikan
      placeholder prosedural
- [ ] **Video playdemo** YouTube (maks 5 menit)

## Catatan Teknis
Game berjalan tanpa aset eksternal (potret & latar prosedural di BootScene).
Howler.js sudah dimuat & siap untuk SFX/BGM. Rasio 16:9 (Phaser FIT 1280×720),
ada CSS mobile-friendly.

## Alur Game (terbaru)
Menu Utama → [Mulai Baru → Input Nama → Intro Cerita → Game] atau
[Lanjutkan (jika ada save)] atau [Kredit]. Game: 5 pengunjung/hari × 3 hari = 15.
Akhir: **2 ending** — MENANG (bertahan 3 hari tanpa meloloskan yang terinfeksi,
ada outro antivirus ditemukan) / KALAH (begitu meloloskan satu yang terinfeksi).

## Save / Continue
Progres otomatis tersimpan (localStorage) tiap keputusan & pergantian hari.
Tombol "Lanjutkan" muncul di menu jika ada save. Save terhapus saat game tamat.
(Berfungsi saat game dijalankan via server lokal/web di browser pemain.)

## Halaman Kredit
3 kolom: Pembuat 1, Pembuat 2 (foto + nama + NRP + email), dan Dosen (nama + email),
plus teks "Tugas Mata Kuliah Game Edukasi dan Simulasi — Informatika ITS 2026".
Edit data di `src/scenes/CreditScene.js`; taruh foto di `assets/credits/`.

## Foto Karakter & Ekspresi (FSM → visual)
Taruh di `assets/portraits/` dengan nama `v01_neutral.png`, `v01_evade.png`,
`v01_emote.png` (sampai v15). Wajah karakter otomatis berganti mengikuti
state DemeanorFSM (neutral/evade/emote) — bukti visual FSM bekerja. Minimal
cukup `_neutral` saja; varian lain opsional.

## Desain Feedback Tersembunyi (fog of consequence)
Keputusan terima/tolak TIDAK langsung diberi tahu benar/salah — pemain hanya
melihat "pintu dibuka/ditutup" lalu lanjut ke orang berikutnya. Ini menjaga
ketegangan & misteri ("siapa yang salah aku loloskan?").
- Jika meloloskan orang terinfeksi: baru ketahuan saat pergantian hari lewat
  kartu "wabah pecah semalam" → langsung ending KALAH.
- Semua keputusan (benar/salah + kondisi asli tiap orang) baru diungkap penuh
  di layar ending (recap). Ini juga memperkuat realisme simulasi skrining wabah:
  konsekuensi muncul belakangan, seperti masa inkubasi penyakit nyata. -->