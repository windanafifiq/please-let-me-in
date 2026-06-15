// visitors.js
// Data 6 pengunjung untuk game pemeriksaan gejala (1 hari penuh).
//
// MODEL DEDUKSI:
//   Cacar (VRS-24) dipastikan jika: RUAM MENYEBAR (banyak titik) + DEMAM (>=37.5)
//   + minimal 1 GEJALA PENDUKUNG (mata merah, tensi rendah, pucat, kebotakan).
//   Satu-dua bintik terpisah BUKAN ruam menyebar. Gejala tunggal punya alasan
//   alternatif (heat-stroke, anemia, imunisasi) — pemain harus baca POLA.
//
// STRUKTUR:
//   health: 'cacar' | 'sehat' | 'kondisi_lain'  → kebenaran tersembunyi (HealthFSM)
//   intro, claim: perkenalan & alasan datang
//   barriers: penghalang fisik (AksesFSM) — { id, label }
//   appearance: gejala terlihat langsung saat observasi (gratis)
//   exams: hasil tiap pemeriksaan { value, note, gatedBy }
//          gatedBy = id penghalang yang harus dibuka dulu (atau null)
//   verdict: 'reject' (cacar) | 'accept' (aman) — kebenaran utk penilaian
//
// Catatan: TIDAK ada warna/flag di data. Log menampilkan data mentah + catatan
// medis netral; pemain menyimpulkan sendiri.

export const VISITORS = [
  // ============ 1. ARUNIKA — CACAR (halus, tahap awal) ============
  {
    id: 'v01',
    name: 'Arunika',
    age: 30,
    job: 'Pegawai kantoran',
    floor: 3,
    color: '#c98fa0',
    health: 'cacar',
    verdict: 'reject',

    intro: 'Perempuan muda berpakaian rapi, mengenakan syal, masker, topi, dan jaket lengan panjang. Tertutup rapat untuk malam yang cukup gerah.',
    claim: 'Mengaku pegawai kantoran penghuni lantai 3. Baru pulang belanja dari mall.',

    // Penghalang dibuka BERURUTAN. 'stage' = nama gambar setelah penghalang ini dibuka.
    // Gambar awal (semua tertutup) = 'full'.
    barriers: [
      { id: 'masker', label: 'lepas masker', stage: 'nomask' },
      { id: 'syal_jaket', label: 'lepas syal & jaket lengan panjang', stage: 'arm' },
      { id: 'topi', label: 'lepas topi', stage: 'open' },
    ],

    appearance: 'Tubuhnya tertutup hampir seluruhnya. Gerak-geriknya tampak sedikit lelah.',

    exams: {
      observasi: { value: 'Setelah masker dibuka, wajahnya tampak sedikit pucat. Belum terlihat ruam di wajah.', note: 'Pucat bisa banyak sebabnya.', gatedBy: 'masker' },
      suhu: { value: '37.5°C', note: '37.5–38°C tergolong demam ringan. Bisa juga akibat terpapar panas.', gatedBy: null },
      ruam: { value: 'Di beberapa titik lengan dan leher terdapat ruam tipis yang menyebar.', note: 'Ruam menyebar di banyak titik.', gatedBy: 'syal_jaket' },
      mata: { value: 'Mata tampak baik-baik saja.', note: null, gatedBy: null },
      tekanan: { value: '90/60 mmHg', note: '90/60 adalah batas bawah normal.', gatedBy: null },
      rambut: { value: 'Rambut masih lebat, tidak ada kerontokan.', note: null, gatedBy: 'topi' },
    },

    truthReject: 'Arunika terinfeksi VRS-24. Ruam menyebar, demam ringan, mata merah, dan tekanan rendah — pola khas cacar tahap awal. Keputusan tepat.',
    truthAccept: 'Kau meloloskan Arunika yang terinfeksi. Gejalanya halus, tapi polanya jelas cacar. Wabah masuk.',
  },

  // ============ 2. GOPAL — SEHAT (bersih, penghalang = red herring) ============
  {
    id: 'v02',
    name: 'Gopal',
    age: 20,
    job: 'Mahasiswa semester 4',
    floor: 2,
    color: '#7fb088',
    health: 'sehat',
    verdict: 'accept',

    intro: 'Mahasiswa semester 4 mengenakan jaket hoodie dengan kupluk menutupi kepala. Tampak biasa saja, sedikit berkeringat.',
    claim: 'Tinggal bersama neneknya di lantai 2. Baru dari perpustakaan mengerjakan final project.',

    barriers: [
      { id: 'hoodie', label: 'lepas jaket hoodie', stage: 'open' },
    ],

    appearance: 'Terlihat normal. Ada sedikit keringat, wajar untuk yang baru berjalan.',

    exams: {
      observasi: { value: 'Tidak pucat. Berkeringat ringan, tampak seperti habis berjalan/beraktivitas.', note: 'Keringat ringan biasa setelah aktivitas.', gatedBy: null },
      suhu: { value: '36.5°C', note: 'Suhu normal.', gatedBy: null },
      ruam: { value: 'Setelah hoodie dibuka, ia memakai kaus pendek. Kulit bersih, tidak ada ruam.', note: null, gatedBy: 'hoodie' },
      mata: { value: 'Mata jernih, normal.', note: null, gatedBy: null },
      tekanan: { value: '120/80 mmHg', note: 'Tekanan normal untuk dewasa.', gatedBy: null },
      rambut: { value: 'Rambut lebat dan normal.', note: null, gatedBy: 'hoodie' },
    },

    truthAccept: 'Gopal sehat. Hoodie hanya gaya berpakaian, bukan penyembunyi gejala. Keputusan tepat.',
    truthReject: 'Kau menolak Gopal yang sehat. Penampilan tertutup ternyata tak menyembunyikan apa pun.',
  },

  // ============ 3. KAKEK HASAN — SEHAT (jebakan: demam+botak tanpa ruam) ============
  {
    id: 'v03',
    name: 'Kakek Hasan',
    age: 60,
    job: 'Pensiunan guru',
    floor: 2,
    color: '#a87f6b',
    health: 'kondisi_lain',   // heat-stroke ringan, BUKAN cacar
    verdict: 'accept',

    intro: 'Lelaki tua mengenakan topi dan kaus singlet. Keringatnya bercucuran cukup banyak.',
    claim: 'Pensiunan guru, tinggal sendiri di lantai 2. Baru mengunjungi kawan lamanya.',

    barriers: [
      { id: 'topi', label: 'lepas topi', stage: 'open' },
    ],

    appearance: 'Berkeringat banyak. Tampak kepanasan, napas sedikit terengah.',

    exams: {
      observasi: { value: 'Keringat berlebih, tetapi tidak pucat. Wajah justru kemerahan seperti kepanasan.', note: 'Kemerahan karena panas berbeda dari pucat sakit.', gatedBy: null },
      suhu: { value: '37.6°C', note: '37.5–38°C demam ringan. Bisa juga akibat kepanasan (heat-stroke ringan).', gatedBy: null },
      ruam: { value: 'Tidak ada ruam sama sekali di kulit.', note: null, gatedBy: null },
      mata: { value: 'Mata normal, tidak merah.', note: null, gatedBy: null },
      tekanan: { value: '130/80 mmHg', note: 'Normal untuk lansia.', gatedBy: null },
      rambut: { value: 'Setelah topi dibuka, kepalanya botak.', note: 'Kebotakan umum pada lansia, bukan selalu gejala.', gatedBy: 'topi' },
    },

    truthAccept: 'Kakek Hasan sehat. Demam ringannya akibat kepanasan, dan kebotakan wajar di usianya. Tanpa ruam, ia bukan kasus cacar. Keputusan tepat.',
    truthReject: 'Kau menolak Kakek Hasan yang sehat. Demam dan botaknya menggoda untuk dicurigai, tapi tanpa ruam ia tidak terinfeksi.',
  },

  // ============ 4. ADIT — CACAR (jelas, parah) ============
  {
    id: 'v04',
    name: 'Adit',
    age: 30,
    job: 'Teknisi AC',
    floor: 5,
    color: '#6c98b0',
    health: 'cacar',
    verdict: 'reject',

    intro: 'Pria mengenakan masker dan kacamata hitam. Berdiri agak goyah, napasnya berat.',
    claim: 'Teknisi AC, tinggal di lantai 5 bersama istrinya. Baru pulang shift kerja.',

    barriers: [
      { id: 'masker', label: 'lepas masker', stage: 'nomask' },
      { id: 'kacamata', label: 'lepas kacamata dan gulung lengan baju', stage: 'open' },
    ],

    appearance: 'Tampak lemah dan tidak sehat. Berdiri tidak stabil.',

    exams: {
      observasi: { value: 'Setelah masker dibuka, wajahnya pucat pasi.', note: null, gatedBy: 'masker' },
      suhu: { value: '39.0°C', note: 'Demam tinggi.', gatedBy: null },
      ruam: { value: 'Saat lengan digulung, terlihat ruam merah yang banyak dan menyebar.', note: 'Ruam menyebar luas.', gatedBy: 'kacamata' },
      mata: { value: 'Setelah kacamata dilepas, matanya merah berair.', note: null, gatedBy: 'kacamata' },
      tekanan: { value: '80/60 mmHg', note: 'Tekanan darah rendah.', gatedBy: null },
      rambut: { value: 'Rambut masih ada, belum rontok.', note: null, gatedBy: null },
    },

    truthReject: 'Adit terinfeksi VRS-24 parah. Demam tinggi, ruam menyebar, mata merah, tekanan rendah — semua tanda lengkap. Keputusan tepat.',
    truthAccept: 'Kau meloloskan Adit yang jelas terinfeksi parah. Wabah masuk dengan cepat.',
  },

  // ============ 5. RAHMA & TITA — SEHAT (jebakan: bayi habis imunisasi) ============
  {
    id: 'v05',
    name: 'Rahma & Tita',
    age: 27,
    job: 'Ibu rumah tangga',
    floor: 5,
    color: '#d18fb0',
    health: 'sehat',
    verdict: 'accept',

    intro: 'Seorang ibu menggendong anak perempuannya (Tita, 1,5 tahun). Si kecil tampak mengantuk di pelukan ibunya. Wajah keduanya tenang.',
    claim: 'Istri Adit (lantai 5). Baru pulang dari imunisasi rutin Tita.',

    barriers: [],   // tidak ada penghalang — semua terlihat

    appearance: 'Keduanya tampak tenang. Tidak ada yang pucat atau berkeringat berlebih.',

    exams: {
      observasi: { value: 'Ibu dan bayi tampak sehat. Tidak ada tanda lemah atau pucat.', note: null, gatedBy: null },
      suhu: { value: 'Rahma 36.5°C (normal). Tita 36.8°C (normal).', note: 'Keduanya suhu normal.', gatedBy: null },
      ruam: { value: 'Rahma: kulit bersih. Tita: ada SATU bintik kecil di lengan atas (bekas suntik imunisasi).', note: 'Satu bintik di lokasi suntik berbeda dari ruam.', gatedBy: null },
      mata: { value: 'Mata keduanya normal.', note: null, gatedBy: null },
      tekanan: { value: 'Rahma 140/90 mmHg (agak tinggi). Tita 80/55 (normal bayi).', note: '140/90 cenderung hipertensi, bukan gejala infeksi.', gatedBy: null },
      rambut: { value: 'Rahma normal. Tita berambut tipis halus (wajar untuk batita).', note: 'Rambut tipis pada anak kecil adalah hal normal.', gatedBy: null },
    },

    truthAccept: 'Rahma dan Tita sehat. Bintik di lengan Tita adalah bekas imunisasi (satu titik), bukan ruam cacar yang menyebar. Tekanan tinggi Rahma adalah hipertensi. Keputusan tepat.',
    truthReject: 'Kau menolak ibu dan bayi yang sehat. Satu bekas suntik bukan ruam cacar — kau salah membaca pola.',
  },

  // ============ 6. IBU MIMA — CACAR (menyamar: tiap gejala ada "alasan kerja") ============
  {
    id: 'v06',
    name: 'Ibu Mima',
    age: 45,
    job: 'Penjual pasar ikan',
    floor: 4,
    color: '#b0905f',
    health: 'cacar',
    verdict: 'reject',

    intro: 'Perempuan paruh baya yang ramah dan banyak tersenyum. Tampak segar, tidak seperti orang sakit. Lengan bajunya digulung sebagian.',
    claim: 'Penjual di pasar ikan, tinggal sendiri di lantai 4. Baru pulang dari pasar ikan.',

    barriers: [],   // dia tidak menutupi — justru disitu jebakannya: terlihat terbuka & ramah

    appearance: 'Wajah segar dan ramah. Tidak pucat. Tetapi tangannya tampak kemerahan.',

    exams: {
      observasi: { value: 'Tidak pucat, malah tampak sehat. Tangan memerah. Saat ditanya, ia tersenyum: "Biasa, Nak, seharian kena air es ikan."', note: 'Kemerahan diberi alasan pekerjaan — perlu diperiksa lebih lanjut.', gatedBy: null },
      suhu: { value: '38.1°C', note: 'Demam. Ia berdalih: "Pasar ikan itu pengap dan panas, Nak."', gatedBy: null },
      ruam: { value: 'Di lengan terdapat bintik-bintik kemerahan yang menyebar. Ia berkata: "Itu alergi udang, langganan saya."', note: 'Ruam menyebar di banyak titik — terlepas dari alasannya.', gatedBy: null },
      mata: { value: 'Mata agak merah. "Kurang tidur, Nak, bangun jam 3 ke pasar."', note: null, gatedBy: null },
      tekanan: { value: '110/70 mmHg', note: 'Tekanan normal.', gatedBy: null },
      rambut: { value: 'Rambut masih lebat.', note: null, gatedBy: null },
    },

    truthReject: 'Ibu Mima terinfeksi VRS-24. Tiap gejala diberi alasan pekerjaan yang masuk akal — tapi demam + ruam menyebar + mata merah adalah pola cacar, bukan kebetulan kerja. Keputusan tepat.',
    truthAccept: 'Kau meloloskan Ibu Mima. Alasan-alasannya meyakinkan, tapi pola gejalanya cacar. Konteks menipumu — wabah masuk.',
  },
];

// Daftar pemeriksaan yang tersedia (untuk membangun PemeriksaanFSM & menu UI).
export const EXAM_TYPES = [
  { id: 'observasi', label: 'Observasi pengunjung' },
  { id: 'suhu', label: 'Cek suhu tubuh' },
  { id: 'ruam', label: 'Periksa ruam (lengan/leher)' },
  { id: 'mata', label: 'Periksa mata' },
  { id: 'tekanan', label: 'Cek tekanan darah' },
  { id: 'rambut', label: 'Periksa rambut/kepala' },
];

export function getVisitors() {
  return VISITORS.map((v) => ({ ...v }));
}

// Urutan kedatangan (1 hari, 6 pengunjung).
export const DAY_SCHEDULE = ['v01', 'v02', 'v03', 'v04', 'v05', 'v06'];