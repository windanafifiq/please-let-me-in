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

    intro: 'Seorang perempuan muda berdiri sambil memegang beberapa kantong belanja. Ia mengenakan masker, syal, topi, dan jaket lengan panjang meski malam terasa cukup gerah.',

    claim: 'Mengaku pegawai kantoran penghuni lantai 3. Baru pulang berbelanja dari mall.',

    barriers: [
      { id: 'masker', label: 'lepas masker', stage: 'nomask' },
      { id: 'syal_jaket', label: 'lepas syal & jaket lengan panjang', stage: 'arm' },
      { id: 'topi', label: 'lepas topi', stage: 'open' },
    ],

    appearance: 'Tampak lelah setelah berjalan cukup jauh. Sesekali ia mengusap keringat di lehernya.',

    exams: {
      observasi: {
        value: 'Setelah masker dibuka, wajahnya tampak sedikit pucat. Ia tersenyum canggung dan berkata, "Mungkin karena belum makan dari sore."',
        note: 'Pucat bisa disebabkan banyak hal.',
        gatedBy: 'masker'
      },

      suhu: {
        value: '37.5°C',
        note: '"Di luar panas sekali, mungkin karena itu suhu saya naik sedikit."',
        gatedBy: null
      },

      ruam: {
        value: 'Di beberapa titik lengan dan leher terlihat ruam tipis yang menyebar. Arunika cepat-cepat berkata, "Kulit saya memang sensitif kalau habis seharian pakai baju tebal."',
        note: 'Ruam menyebar tetap perlu dicurigai.',
        gatedBy: 'syal_jaket'
      },

      mata: {
        value: 'Mata tampak normal.',
        note: null,
        gatedBy: null
      },

      tekanan: {
        value: '90/60 mmHg',
        note: '"Saya memang sering tekanan darah rendah."',
        gatedBy: null
      },

      rambut: {
        value: 'Rambut masih lebat, tidak ada kerontokan.',
        note: null,
        gatedBy: 'topi'
      },

    },

    truthReject: 'Arunika terinfeksi VRS-24 tahap awal. Setiap gejalanya memang memiliki penjelasan yang terdengar masuk akal, tetapi ruam yang menyebar ditambah demam ringan dan tekanan darah rendah membentuk pola yang konsisten dengan infeksi.',

    truthAccept: 'Kau meloloskan Arunika. Alasannya terdengar masuk akal satu per satu, tetapi jika dilihat bersama, gejalanya membentuk pola infeksi VRS-24 tahap awal.'
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

    intro: 'Mahasiswa semester 4 mengenakan jaket hoodie dengan kupluk menutupi kepala. Tampak biasa saja, sedikit berkeringat. Ia tampak lelah dan beberapa kali menguap saat menunggu pemeriksaan.',
    claim: 'Tinggal bersama neneknya di lantai 2. Baru pulang dari perpustakaan kampus mengerjakan final project.',

    barriers: [
      { id: 'hoodie', label: 'lepas jaket hoodie', stage: 'open' },
    ],

    appearance: 'Terlihat lelah dan sedikit berkeringat. Sesekali mengucek matanya.',

    exams: {
      observasi: {
        value: 'Tidak pucat. Berkeringat ringan dan tampak mengantuk. "Saya belum tidur dari semalam karena deadline tugas."',
        note: 'Kurang tidur dapat menyebabkan kelelahan dan keringat ringan.',
        gatedBy: null
      },

      suhu: {
        value: '36.5°C',
        note: 'Suhu normal.',
        gatedBy: null
      },

      ruam: {
        value: 'Setelah hoodie dibuka, ia memakai kaus pendek. Kulit bersih tanpa ruam atau bintik mencurigakan.',
        note: null,
        gatedBy: 'hoodie'
      },

      mata: {
        value: 'Mata sedikit merah. Ia mengaku terlalu lama menatap layar laptop.',
        note: 'Mata merah tidak selalu berarti infeksi.',
        gatedBy: null
      },

      tekanan: {
        value: '120/80 mmHg',
        note: 'Tekanan normal.',
        gatedBy: null
      },

      rambut: {
        value: 'Rambut lebat dan normal.',
        note: null,
        gatedBy: 'hoodie'
      }
    },

    truthAccept: 'Gopal sehat. Kelelahan, mata merah, dan keringat ringan berasal dari kurang tidur dan aktivitasnya sebagai mahasiswa. Tidak ada demam maupun ruam yang mengarah pada VRS-24. Keputusan tepat.',
    truthReject: 'Kau menolak Gopal yang sehat. Penampilannya memang terlihat lelah, tetapi tidak ada pola gejala yang mengarah pada VRS-24.',
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

    intro: 'Seorang lelaki tua mengenakan topi lusuh dan kaus singlet. Bajunya basah oleh keringat seolah baru berjalan jauh. Ia mengipasi dirinya dengan koran yang digulung.',
    claim: 'Pensiunan guru yang tinggal sendiri di lantai 2. Baru pulang mengunjungi kawan lamanya di ujung kota.',

    barriers: [
      { id: 'topi', label: 'lepas topi', stage: 'open' },
    ],

    appearance: 'Berkeringat deras dan tampak kepanasan. Napasnya sedikit terengah, tetapi ia masih bisa bercanda dan berbicara dengan lancar.',

    exams: {
      observasi: {
        value: 'Keringat berlebih, tetapi tidak pucat. Wajahnya justru kemerahan. "Aduh, panas sekali hari ini. Tadi angkotnya penuh sesak."',
        note: 'Kemerahan karena panas berbeda dengan pucat akibat sakit.',
        gatedBy: null
      },

      suhu: {
        value: '37.6°C',
        note: '"Mungkin karena saya jalan kaki dari halte, Nak."',
        gatedBy: null
      },

      mata: {
        value: 'Mata normal dan tidak merah.',
        note: null,
        gatedBy: null
      },

      tekanan: {
        value: '130/80 mmHg',
        note: 'Normal untuk lansia.',
        gatedBy: null
      },

      rambut: {
        value: 'Setelah topi dibuka, kepalanya botak.',
        note: '"Sudah botak sejak sepuluh tahun lalu," katanya sambil tertawa.',
        gatedBy: 'topi'
      }
    },

    truthAccept: 'Kakek Hasan tidak terinfeksi. Keringat berlebih dan suhu tubuh yang sedikit meningkat berasal dari kelelahan serta cuaca panas. Tidak ditemukan ruam maupun tanda khas VRS-24. Keputusan tepat.',
    truthReject: 'Kau menolak Kakek Hasan yang sehat. Usia lanjut, demam ringan, dan kebotakan memang terlihat mencurigakan, tetapi tidak ada pola gejala yang mengarah pada VRS-24.'
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

    intro: 'Seorang pria mengenakan masker dan kacamata hitam. Ia membawa tas perkakas teknisi AC di bahunya. Dari kejauhan ia tampak biasa saja, tetapi sesekali harus bersandar untuk menjaga keseimbangan.',

    claim: 'Teknisi AC, tinggal di lantai 5 bersama istrinya. Baru pulang dari shift kerja.',

    barriers: [
      { id: 'masker', label: 'lepas masker', stage: 'nomask' },
      { id: 'kacamata', label: 'lepas kacamata dan gulung lengan baju', stage: 'open' },
    ],

    appearance: 'Ia berusaha terlihat tenang dan terus mengatakan dirinya baik-baik saja, tetapi gerakannya tampak lambat dan tenaganya seperti terkuras.',

    exams: {
      observasi: {
        value: 'Setelah masker dibuka, wajahnya terlihat pucat. Ia berkata, "Cuma capek kerja dari pagi, Pak."',
        note: 'Kelelahan memang bisa membuat wajah terlihat pucat.',
        gatedBy: 'masker'
      },

      suhu: {
        value: '39.0°C',
        note: '"Tadi kerja di atap gedung. Panasnya luar biasa."',
        gatedBy: null
      },

      ruam: {
        value: 'Saat lengan digulung, terlihat ruam merah yang menyebar luas di kedua lengan.',
        note: 'Ruam menyebar merupakan tanda yang sulit dijelaskan oleh kelelahan biasa.',
        gatedBy: 'kacamata'
      },

      mata: {
        value: 'Setelah kacamata dilepas, matanya merah dan berair.',
        note: '"Kena debu waktu servis AC."',
        gatedBy: 'kacamata'
      },

      tekanan: {
        value: '80/60 mmHg',
        note: 'Tekanan darah rendah.',
        gatedBy: null
      },

      rambut: {
        value: 'Rambut masih normal.',
        note: null,
        gatedBy: null
      }
    },

    truthReject: 'Adit terinfeksi VRS-24 tahap lanjut. Ia mencoba menjelaskan setiap gejala dengan pekerjaannya, tetapi demam tinggi, ruam menyebar, mata merah, dan tekanan darah rendah membentuk pola yang sangat jelas. Keputusan tepat.',

    truthAccept: 'Kau meloloskan Adit. Alasan-alasannya terdengar masuk akal jika dilihat satu per satu, tetapi keseluruhan gejalanya menunjukkan infeksi VRS-24 yang sudah cukup parah.'
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

    intro: 'Seorang ibu muda menggendong anak perempuannya yang berusia sekitar satu setengah tahun. Tita tampak mengantuk di pelukan ibunya. Keduanya terlihat tenang dan sehat.',

    claim: 'Istri Adit penghuni lantai 5. Baru pulang dari puskesmas setelah imunisasi rutin Tita.',

    barriers: [],   // tidak ada penghalang — semua terlihat

    appearance: 'Rahma tampak lelah karena seharian mengurus anak, tetapi tidak menunjukkan tanda-tanda sakit.',

    exams: {
      observasi: {
        value: 'Ibu dan anak tampak sehat. Saat ditanya soal Adit, Rahma menjawab, "Mas Adit berangkat kerja pagi tadi. Mungkin sudah sampai rumah duluan."',
        note: 'Tidak ada tanda infeksi yang terlihat.',
        gatedBy: null
      },

      suhu: { value: 'Rahma 36.5°C (normal). Tita 36.8°C (normal).', note: 'Keduanya dalam rentang normal.', gatedBy: null },
      ruam: { value: 'Rahma: kulit bersih. Tita: terdapat satu bintik kecil di lengan atas bekas suntikan imunisasi.', note: 'Satu titik bekas suntikan berbeda dari ruam yang menyebar.', gatedBy: null },
      mata: { value: 'Mata keduanya normal.', note: null, gatedBy: null },
      tekanan: { value: 'Rahma 140/90 mmHg (agak tinggi). Tita 80/55 (normal bayi).', note: '140/90 cenderung hipertensi, bukan gejala infeksi.', gatedBy: null },
      rambut: { value: 'Rahma normal. Tita berambut tipis halus (wajar untuk batita).', note: 'Rambut tipis pada anak kecil adalah hal normal.', gatedBy: null },
    },

    truthAccept: 'Rahma dan Tita sehat. Hubungan keluarga dengan Adit memang menimbulkan kecurigaan, tetapi pemeriksaan tidak menemukan gejala VRS-24 pada keduanya. Keputusan tepat.',

truthReject: 'Kau menolak Rahma dan Tita karena mengaitkan mereka dengan kondisi Adit. Pemeriksaan menunjukkan keduanya sehat. Kecurigaanmu didasarkan pada hubungan keluarga, bukan bukti infeksi.',
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

    truthReject: 'Ibu Mima terinfeksi VRS-24. Tiap gejala diberi alasan pekerjaan yang masuk akal — tapi demam + ruam menyebar + mata merah adalah pola VRS-24, bukan kebetulan kerja. Keputusan tepat.',
    truthAccept: 'Kau meloloskan Ibu Mima. Alasan-alasannya meyakinkan, tapi pola gejalanya VRS-24. Konteks menipumu — wabah masuk.',
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