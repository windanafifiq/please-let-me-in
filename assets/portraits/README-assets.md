# Daftar Aset Gambar — Sistem Pemeriksaan Bertahap

Game ini menampilkan gambar karakter yang berubah TIAP penghalang dibuka.
Penghalang dibuka BERURUTAN, jadi tiap tahap punya gambarnya sendiri.

## Penamaan file
`{id}_{tahap}.png` — taruh di `assets/portraits/`
Contoh: `v01_full.png`, `v01_nomask.png`, `v01_arm.png`, `v01_open.png`

## Daftar gambar per visitor (TOTAL 13 gambar)

### v01 Arunika — CACAR (4 gambar)
Urutan buka: masker → syal+jaket → topi
| File | Kondisi | Yang harus tampak |
|------|---------|-------------------|
| `v01_full.png` | semua dipakai | pakai masker, syal, jaket lengan panjang, topi |
| `v01_nomask.png` | lepas masker | wajah terlihat sedikit pucat; masih pakai syal+jaket+topi |
| `v01_arm.png` | lepas syal+jaket | lengan & leher terlihat: ruam TIPIS MENYEBAR; masih pakai topi |
| `v01_open.png` | lepas topi | terbuka penuh; rambut masih lebat (normal); mata merah |

### v02 Gopal — SEHAT (2 gambar)
Urutan buka: hoodie
| File | Kondisi | Yang harus tampak |
|------|---------|-------------------|
| `v02_full.png` | pakai hoodie+kupluk | tampak normal, sedikit berkeringat |
| `v02_open.png` | lepas hoodie | kaus pendek, kulit BERSIH tanpa ruam, rambut lebat |

### v03 Kakek Hasan — SEHAT/jebakan (2 gambar)
Urutan buka: topi
| File | Kondisi | Yang harus tampak |
|------|---------|-------------------|
| `v03_full.png` | pakai topi | singlet, berkeringat banyak, wajah KEMERAHAN (panas, bukan pucat) |
| `v03_open.png` | lepas topi | kepala BOTAK; TANPA ruam di kulit |

### v04 Adit — CACAR (3 gambar)
Urutan buka: masker → kacamata
| File | Kondisi | Yang harus tampak |
|------|---------|-------------------|
| `v04_full.png` | semua dipakai | pakai masker & kacamata, berdiri goyah |
| `v04_nomask.png` | lepas masker | wajah PUCAT PASI; masih pakai kacamata |
| `v04_open.png` | lepas kacamata | mata MERAH BERAIR; ruam banyak menyebar di lengan terlihat |

### v05 Rahma & Tita — SEHAT/jebakan (1 gambar)
Tak ada penghalang. Tita 1,5 tahun (batita), digendong.
| File | Kondisi | Yang harus tampak |
|------|---------|-------------------|
| `v05_open.png` | semua terlihat | ibu menggendong batita; keduanya tampak sehat; Tita: SATU bintik kecil di lengan atas (bekas suntik) |

### v06 Ibu Mima — CACAR menyamar (1 gambar)
Tak ada penghalang — justru terlihat terbuka & ramah (itu jebakannya).
| File | Kondisi | Yang harus tampak |
|------|---------|-------------------|
| `v06_open.png` | semua terlihat | wajah RAMAH & SEGAR (tidak seperti sakit); tapi ada ruam menyebar di lengan, mata agak merah, tangan kemerahan |

## Catatan visual KUNCI (jangan sampai tertukar)

1. **Ruam menyebar vs 1 bintik**: Arunika/Adit/Mima = banyak titik tersebar.
   Tita = SATU titik di lengan atas (bekas suntik). Harus beda jelas.
2. **Pucat (sakit) vs merah (panas)**: Adit/Arunika pucat. Kakek Hasan merah
   karena kepanasan — jangan digambar pucat.
3. **Ibu Mima terlihat sehat & ramah** walau bergejala — itu jebakannya.
4. **Penghalang harus jelas** di tiap tahap supaya pemain paham apa yang dibuka.

## Fallback
Tanpa gambar, game pakai placeholder (kotak warna + huruf nama). Jadi bisa
dites dulu sebelum semua gambar jadi. Begitu file PNG ditaruh, otomatis kepakai.

## Ringkasan: 4 + 2 + 2 + 3 + 1 + 1 = **13 gambar**
