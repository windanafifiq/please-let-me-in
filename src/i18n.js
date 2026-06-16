// i18n.js — Mesin bahasa & kamus bilingual (ID / EN).
// Cara pakai: import { t, setLang, getLang } from '../i18n.js';
//             t('warn.title')  →  teks sesuai bahasa aktif

const DICT = {
    // ─── WarningScene ───────────────────────────────────────────
    'warn.ico': { id: '⚠', en: '⚠' },
    'warn.title': { id: 'PERINGATAN', en: 'WARNING' },
    'warn.p1': {
        id: 'Permainan ini mengandung <b>efek kilatan cahaya dan visual berkedip</b> (petir, kilau, dan transisi cepat).',
        en: 'This game contains <b>flashing light effects and blinking visuals</b> (lightning, glare, and rapid transitions).',
    },
    'warn.p2': {
        id: 'Jika kamu memiliki <b>epilepsi fotosensitif</b> atau sensitif terhadap cahaya berkedip, mohon berhati-hati. Disarankan bermain di ruangan dengan pencahayaan cukup dan beristirahat bila merasa tidak nyaman.',
        en: 'If you have <b>photosensitive epilepsy</b> or are sensitive to flashing lights, please take caution. It is recommended to play in a well-lit room and take breaks if you feel uncomfortable.',
    },
    'warn.btn': { id: 'LANJUTKAN', en: 'CONTINUE' },

    // ─── RotateScene ────────────────────────────────────────────
    'rotate.title': { id: 'Putar Perangkatmu', en: 'Rotate Your Device' },
    'rotate.sub': { id: 'Untuk pengalaman terbaik, mainkan dalam mode lanskap (horizontal).', en: 'For the best experience, play in landscape (horizontal) mode.' },
    'rotate.note': { id: 'Abaikan jika perangkatmu sudah dalam mode lanskap.', en: 'Ignore this if your device is already in landscape mode.' },

    // ─── MenuScene ──────────────────────────────────────────────
    'menu.sub': { id: 'Satu keputusanmu yang salah,\nSatu gedung yang akan menanggung akibatnya!', en: 'One wrong decision from you,\nOne building that will bear the consequences!' },
    'menu.new': { id: 'MULAI GAME', en: 'NEW GAME' },
    'menu.continue': { id: 'LANJUTKAN', en: 'CONTINUE' },
    'menu.tutorial': { id: 'CARA BERMAIN', en: 'HOW TO PLAY' },
    'menu.lore': { id: 'CERITA DAN REFERENSI', en: 'STORY & REFERENCES' },
    'menu.credit': { id: 'KREDIT', en: 'CREDITS' },
    'menu.footer': { id: 'Tugas Final Projek Game Edukasi & Simulasi · Teknik Informatika ITS 2026 · © 2026 Please Let Me In! All rights reserved', en: 'Final Project · Educational & Simulation Game · Informatics ITS 2026 · © 2026 Please Let Me In! All rights reserved' },

    // ─── NameScene ──────────────────────────────────────────────
    'name.title': { id: 'SIAPA NAMAMU, PENJAGA?', en: 'WHAT IS YOUR NAME, GUARDIAN?' },
    'name.sub': { id: 'Nama ini akan dikenang oleh mereka yang kau selamatkan.', en: 'This name will be remembered by those you save.' },
    'name.placeholder': { id: 'Ketik nama (boleh dikosongkan)', en: 'Enter name (can be left blank)' },
    'name.btn': { id: 'LANJUT ▸', en: 'NEXT ▸' },
    'name.default': { id: 'Penjaga', en: 'Guardian' },

    // ─── TutorialScene ──────────────────────────────────────────
    'tut.head': { id: 'CARA BERMAIN', en: 'HOW TO PLAY' },
    'tut.back': { id: '◂ KEMBALI', en: '◂ BACK' },

    'tut.goal.h': { id: '🎯 Tujuanmu', en: '🎯 Your Goal' },
    'tut.goal.p': { id: 'Kau petugas pemeriksa di pintu gedung karantina. Tiap pengunjung ingin masuk. Tugasmu: <b>periksa gejala mereka, lalu putuskan TERIMA atau TOLAK.</b> Meloloskan satu orang yang terinfeksi VRS-24 berarti wabah masuk ke gedung.', en: 'You are an inspector at the door of a quarantine building. Every visitor wants to enter. Your job: <b>examine their symptoms, then decide ACCEPT or REJECT.</b> Letting one VRS-24-infected person in means the outbreak enters the building.' },

    'tut.how.h': { id: '🔬 Cara memeriksa', en: '🔬 How to Examine' },
    'tut.how.p': { id: 'Gunakan menu <b>PEMERIKSAAN</b>: observasi penampilan, cek suhu, cek tekanan darah, periksa ruam, mata, dan rambut. Tiap hasil dicatat otomatis di <b>CATATAN PEMERIKSAAN</b> sebagai data apa adanya — <b>kau sendiri yang menyimpulkan</b>.', en: 'Use the <b>EXAMINATION</b> menu: observe appearance, check temperature, blood pressure, rash, eyes, and hair. Each result is automatically logged in <b>EXAMINATION NOTES</b> as raw data — <b>you draw your own conclusions</b>.' },

    'tut.barrier.h': { id: '🧥 Penghalang', en: '🧥 Barriers' },
    'tut.barrier.p': { id: 'Sebagian gejala tersembunyi di balik pakaian (jaket, syal, kacamata, topi, masker). Gunakan tombol <b>"Minta buka"</b> untuk memintanya dibuka, lalu gejala di baliknya bisa diperiksa. Curigai penghalang yang janggal — kenapa pakai syal di malam gerah?', en: 'Some symptoms are hidden beneath clothing (jacket, scarf, sunglasses, hat, mask). Use the <b>"Request removal"</b> button to have it removed, then the symptoms beneath can be examined. Suspect unusual barriers — why wear a scarf on a warm night?' },

    'tut.vrs.h': { id: '🦠 Mengenali VRS-24 (Varion Rapid Syndrom 24)', en: '🦠 Identifying VRS-24 (Varion Rapid Syndrome 24)' },
    'tut.vrs.p': { id: 'Seseorang <b>terinfeksi</b> bila menunjukkan POLA berikut bersamaan:', en: 'A person is <b>infected</b> if they show the following PATTERN simultaneously:' },
    'tut.vrs.rash': { id: '<b>Ruam menyebar</b>', en: '<b>Spreading rash</b>' },
    'tut.vrs.rash.note': { id: 'Bintik di BANYAK titik (lengan, leher, dada). Bukan satu-dua bintik terpisah.', en: 'Spots at MANY locations (arms, neck, chest). Not one or two isolated spots.' },
    'tut.vrs.fever': { id: '<b>Demam</b>', en: '<b>Fever</b>' },
    'tut.vrs.fever.note': { id: 'Suhu 37.5°C ke atas. 37.5–38°C demam ringan; di atas 38°C demam jelas.', en: 'Temperature 37.5°C or above. 37.5–38°C is mild fever; above 38°C is clear fever.' },
    'tut.vrs.support': { id: '<b>Minimal 1 gejala pendukung</b>', en: '<b>At least 1 supporting symptom</b>' },
    'tut.vrs.support.note': { id: 'Mata merah berair, tekanan darah rendah, pucat, atau kebotakan.', en: 'Red watery eyes, low blood pressure, paleness, or baldness.' },
    'tut.vrs.rule': { id: '<b>Ruam menyebar + demam + 1 pendukung = VRS-24 → TOLAK.</b>', en: '<b>Spreading rash + fever + 1 supporting = VRS-24 → REJECT.</b>' },

    'tut.trap.h': { id: '🎭 Yang MENJEBAK (sebenarnya aman)', en: '🎭 TRAPS (actually safe)' },
    'tut.trap.heat': { id: '<b>Keringat & merah karena panas</b>', en: '<b>Sweat & redness from heat</b>' },
    'tut.trap.heat.note': { id: 'Heat-stroke ringan: demam tapi TANPA ruam. Wajah merah, bukan pucat.', en: 'Mild heat-stroke: fever but WITHOUT rash. Flushed face, not pale.' },
    'tut.trap.bp': { id: '<b>Tekanan darah rendah sendirian</b>', en: '<b>Low blood pressure alone</b>' },
    'tut.trap.bp.note': { id: 'Bisa anemia — bukan VRS-24 bila tanpa ruam & demam.', en: 'Could be anemia — not VRS-24 without rash & fever.' },
    'tut.trap.spot': { id: '<b>Satu bintik</b>', en: '<b>A single spot</b>' },
    'tut.trap.spot.note': { id: 'Bekas suntik imunisasi = satu titik di lengan atas. Bukan ruam menyebar.', en: 'Vaccination mark = one spot on the upper arm. Not a spreading rash.' },
    'tut.trap.bald': { id: '<b>Botak biasa</b>', en: '<b>Regular baldness</b>' },
    'tut.trap.bald.note': { id: 'Umum pada lansia. Bukan gejala bila tanpa ruam & demam.', en: 'Common in the elderly. Not a symptom without rash & fever.' },

    'tut.tip': { id: '💡 <b>Kunci:</b> jangan tertipu satu gejala atau alasan yang masuk akal. Baca <b>POLA</b>-nya. Gejala tunggal sering punya sebab lain; tapi ruam menyebar + demam bersamaan adalah VRS-24 — sekalipun pengunjung punya alasan untuk tiap gejalanya.', en: '💡 <b>Key:</b> don\'t be fooled by a single symptom or a plausible excuse. Read the <b>PATTERN</b>. A single symptom often has other causes; but a spreading rash + fever together means VRS-24 — even if the visitor has an excuse for each symptom.' },

    // ─── LoreScene ──────────────────────────────────────────────
    'lore.head1': { id: 'VIRUS DALAM GAME', en: 'VIRUS IN THE GAME' },
    'lore.head2': { id: 'REFERENSI GAME', en: 'GAME REFERENCES' },
    'lore.back': { id: '◁ KEMBALI', en: '◁ BACK' },

    'lore.vrs.h': { id: 'Apa itu VRS-24?', en: 'What is VRS-24?' },
    'lore.vrs.p': { id: '<b>VRS-24 (Varion Rapid Syndrome-24)</b> adalah penyakit menular fiktif yang diduga berasal dari sebuah program penelitian biologis rahasia. Virus ini pertama kali terdeteksi di Kota Nusaraya pada <b>4 Desember 2024</b> dan menyebar dengan sangat cepat hingga menginfeksi hampir <b>tiga perempat penduduk kota</b>. Hingga kini tidak diketahui secara pasti apakah wabah tersebut disebabkan oleh kecelakaan laboratorium atau pelepasan yang disengaja...', en: '<b>VRS-24 (Varion Rapid Syndrome-24)</b> is a fictional infectious disease believed to originate from a secret biological research program. The virus was first detected in Nusaraya City on <b>December 4, 2024</b> and spread rapidly, infecting nearly <b>three-quarters of the city\'s population</b>. It remains unknown whether the outbreak was caused by a laboratory accident or deliberate release...' },

    'lore.symp.h': { id: 'Bagaimana Gejala VRS-24?', en: 'What are VRS-24 Symptoms?' },
    'lore.symp.p': { id: 'Gejala VRS-24 meliputi <b>demam tinggi, kelelahan, pucat, mata memerah, dan ruam yang menyebar di seluruh tubuh</b>. Infeksi ini bersifat fatal dan akan menyebabkan kematian dalam waktu sekitar <b>48 jam</b> setelah gejala pertama muncul. Hingga saat ini, satu-satunya penanganan yang diketahui efektif adalah pemberian vaksin sebelum batas waktu tersebut, meskipun virus tetap menetap di dalam tubuh penyintas dalam kondisi tidak aktif.', en: 'VRS-24 symptoms include <b>high fever, fatigue, paleness, red eyes, and a spreading rash across the body</b>. The infection is fatal and will cause death within approximately <b>48 hours</b> after the first symptom appears. The only known effective treatment is vaccination before that deadline, though the virus remains dormant in survivors.' },

    'lore.weapon.h': { id: 'Cara Kerja VRS-24 Sebagai Senjata Biologis', en: 'How VRS-24 Works as a Biological Weapon' },
    'lore.weapon.p': { id: 'VRS-24 dirancang sebagai agen biologis yang mampu menyebar melalui <b>udara dan air yang terkontaminasi</b>. Berbeda dengan senjata konvensional, kerusakannya tidak terjadi dalam satu ledakan, melainkan menyebar diam-diam dari satu korban ke korban lain. Dalam hitungan hari, sebuah kota besar dapat berubah menjadi zona karantina penuh kepanikan. Tanpa vaksin dan tindakan darurat, VRS-24 diperkirakan mampu menginfeksi sebagian besar populasi serta menyebabkan runtuhnya layanan kesehatan, ketertiban masyarakat, dan ribuan kematian dalam waktu yang sangat singkat.', en: 'VRS-24 is designed as a biological agent capable of spreading through <b>contaminated air and water</b>. Unlike conventional weapons, its damage does not occur in a single explosion but spreads silently from one victim to another. Within days, a major city can turn into a panic-filled quarantine zone. Without vaccines and emergency measures, VRS-24 is estimated to infect most of the population and cause the collapse of healthcare, public order, and thousands of deaths in a very short time.' },

    'lore.disc1': { id: 'Virus dalam game ini terinspirasi dari penyakit nyata yang sudah diberantas yaitu <b>cacar (smallpox / virus variola)</b>. Mekanik dari game ini adalah melihat ciri-ciri warga yang ingin masuk ke dalam gedung, selalu observasi warga jika ingin masuk. Apabila ada indikasi warga terkena virus maka tolak masuk warga, namun apabila tidak ada indikasi maka izinkan masuk warga.', en: 'The virus in this game is inspired by a real eradicated disease: <b>smallpox (virus variola)</b>. The game mechanic involves observing the characteristics of residents who want to enter the building. Always examine visitors before entry. If there are indications the visitor is infected, reject entry; if not, allow entry.' },

    'lore.small.h': { id: 'Apa itu Cacar (Smallpox)?', en: 'What is Smallpox?' },
    'lore.small.p': { id: 'Cacar adalah penyakit menular akut yang disebabkan oleh <b>virus variola</b>, anggota keluarga orthopoxvirus. Diperkirakan sudah ada sejak lebih dari 3000 tahun lalu dan menjadi salah satu wabah paling mematikan dalam sejarah karena membunuh sekitar <b>3 dari 10 penderita</b>, dan menewaskan ratusan juta orang sepanjang abad ke-20.', en: 'Smallpox is an acute infectious disease caused by the <b>variola virus</b>, a member of the orthopoxvirus family. Estimated to have existed for more than 3,000 years, it became one of the deadliest outbreaks in history, killing about <b>3 in 10 sufferers</b> and causing hundreds of millions of deaths throughout the 20th century.' },

    'lore.tells.h': { id: 'Gejala Khas (dasar "tells" di game)', en: 'Key Symptoms (basis of "tells" in game)' },
    'lore.tells.p': { id: 'Gejala awal: <b>demam tinggi mendadak, kelelahan, dan nyeri punggung hebat</b>, kadang disertai mual. Dua sampai tiga hari kemudian muncul <b>ruam khas</b> — bintik berisi cairan bening yang lalu menjadi nanah, mengeras, lalu mengelupas. Ruam dimulai dari <b>wajah dan tangan</b>, lalu menyebar ke seluruh tubuh, sering meninggalkan bekas luka permanen.', en: 'Early symptoms: <b>sudden high fever, fatigue, and severe back pain</b>, sometimes accompanied by nausea. Two to three days later a <b>distinctive rash</b> appears — fluid-filled spots that turn to pus, harden, then crust over. The rash starts on the <b>face and hands</b>, then spreads to the entire body, often leaving permanent scars.' },

    'lore.bioweapon.h': { id: 'Bagaimana Cacar Pernah Jadi Senjata Biologis?', en: 'How Smallpox Was Used as a Biological Weapon?' },
    'lore.bioweapon.p1': { id: 'Setelah cacar dinyatakan diberantas (1980), sebagian pihak menyadari potensinya sebagai senjata: populasi dunia berhenti divaksinasi, sehingga kembali rentan. Catatan sejarah menyebutkan bekas Uni Soviet pernah mengembangkan dan menimbun virus variola dalam jumlah besar sebagai program senjata biologis hingga awal 1990-an, meski hal ini melanggar Konvensi Senjata Biologis (BTWC) 1972.', en: 'After smallpox was declared eradicated (1980), some recognized its potential as a weapon: the world\'s population stopped being vaccinated, becoming vulnerable again. Historical records indicate the former Soviet Union developed and stockpiled large amounts of the variola virus as part of a bioweapons program until the early 1990s, despite this violating the 1972 Biological Weapons Convention (BTWC).' },
    'lore.bioweapon.p2': { id: 'Karena itu, lembaga seperti <b>WHO dan CDC</b> tetap menyiapkan rencana tanggap darurat — termasuk cadangan vaksin — untuk kemungkinan (yang sangat kecil) virus ini disalahgunakan. Inilah premis fiksi yang dipakai game ini.', en: 'Because of this, organizations like <b>WHO and CDC</b> continue to maintain emergency response plans — including vaccine reserves — for the (very slim) possibility this virus could be misused. This is the fictional premise used in this game.' },

    'lore.end.h': { id: 'Akhir yang Nyata: Diberantas, 1980', en: 'The Real End: Eradicated, 1980' },
    'lore.end.p': { id: 'WHO meluncurkan program vaksinasi global intensif pada 1967. Kasus alami terakhir tercatat di <b>Somalia, 1977</b>. Pada <b>8 Mei 1980</b>, Majelis Kesehatan Dunia resmi menyatakan cacar <b>diberantas</b> — satu-satunya penyakit menular pada manusia yang pernah berhasil dimusnahkan sepenuhnya. Vaksin cacar (oleh Edward Jenner, 1796) juga merupakan vaksin pertama yang pernah dibuat.', en: 'WHO launched an intensive global vaccination program in 1967. The last natural case was recorded in <b>Somalia, 1977</b>. On <b>May 8, 1980</b>, the World Health Assembly officially declared smallpox <b>eradicated</b> — the only infectious human disease ever to be completely eliminated. The smallpox vaccine (by Edward Jenner, 1796) was also the first vaccine ever created.' },

    'lore.mechanic.h': { id: 'Referensi Mekanik Game', en: 'Game Mechanic References' },
    'lore.mechanic.p': { id: 'Referensi mekanik game <b>Please, Let Me In!</b> adalah dari game <b>Quarantine Zone</b>, <b>"Paper, Please"</b>, dan game-game anomali di roblox seperti <b>Scary Shawarma Kiosk: The Anomaly</b> dan juga <b>Bakso Malang Anomalies</b>. <i>Honorable Mention</i> saya berikan kepada game <b>Resident Evil</b> karena inspirasi lorenya terkait senjata biologis.', en: 'The game mechanic of <b>Please, Let Me In!</b> is inspired by <b>Quarantine Zone</b>, <b>"Papers, Please"</b>, and Roblox anomaly games such as <b>Scary Shawarma Kiosk: The Anomaly</b> and <b>Bakso Malang Anomalies</b>. An <i>Honorable Mention</i> goes to <b>Resident Evil</b> for its biological weapon lore inspiration.' },

    'lore.sources.h': { id: 'Sumber Edukasi: ', en: 'Educational Sources: ' },
    'lore.assets.h': { id: 'Sumber Aset: ', en: 'Asset Sources: ' },
    'lore.assets.img': { id: 'Gambar: Pinterest, Gemini AI', en: 'Images: Pinterest, Gemini AI' },
    'lore.assets.audio': { id: 'Backsound dan SFX: Pixabay, Storyblocks, Elevenlabs AI', en: 'Backsound and SFX: Pixabay, Storyblocks, Elevenlabs AI' },
    'lore.assets.font': { id: 'Font: Google Fonts', en: 'Fonts: Google Fonts' },

    'lore.disclaimer': { id: '<b>Disclaimer.</b> Game ini dibuat untuk tujuan edukasi dan simulasi (Tugas Final Projek Mata Kuliah Game Edukasi dan Simulasi — Informatika ITS 2026). Penyakit, tokoh, lokasi, dan kejadian di dalamnya telah dimodifikasi sedemikian rupa sehingga sepenuhnya fiksi dan tidak menggambarkan peristiwa nyata mana pun. Tidak ada informasi di sini yang ditujukan untuk penyalahgunaan; bagian sejarah disajikan sebagai pengetahuan kesehatan publik.', en: '<b>Disclaimer.</b> This game was created for educational and simulation purposes (Final Project for the Educational & Simulation Game course — Informatics ITS 2026). The diseases, characters, locations, and events within have been modified so that they are entirely fictional and do not depict any real events. No information here is intended for misuse; the historical sections are presented as public health knowledge.' },

    // ─── CreditScene ────────────────────────────────────────────
    'credit.head': { id: 'KREDIT', en: 'CREDITS' },
    'credit.task': { id: 'Tugas Final Project Mata Kuliah<br><b>Game Edukasi dan Simulasi</b><br>Teknik Informatika ITS 2026', en: 'Final Project for the Course<br><b>Educational & Simulation Game</b><br>Informatics ITS 2026' },
    'credit.role1': { id: 'Anggota 1', en: 'Member 1' },
    'credit.role2': { id: 'Anggota 2', en: 'Member 2' },
    'credit.roleLec': { id: 'Dosen Pengampu Mata Kuliah Game Simulasi dan Edukasi', en: 'Lecturer for Educational & Simulation Game Course' },
    'credit.back': { id: '◂ KEMBALI', en: '◂ BACK' },

    // ─── EndScene ───────────────────────────────────────────────
    'end.win': { id: '✓ SELAMAT', en: '✓ CONGRATULATIONS' },
    'end.lose': { id: '✕ GAGAL', en: '✕ FAILED' },
    'end.stats.correct': { id: 'penilaian benar', en: 'correct judgments' },
    'end.stats.leaked': { id: 'wabah lolos', en: 'outbreaks slipped through' },
    'end.recap.label': { id: 'REKAP KEPUTUSAN', en: 'DECISION RECAP' },
    'end.back': { id: 'KEMBALI KE MENU', en: 'BACK TO MENU' },
    'end.verdict.accept': { id: 'Terima', en: 'Accepted' },
    'end.verdict.reject': { id: 'Tolak', en: 'Rejected' },
    'end.cond.infected': { id: 'Terinfeksi', en: 'Infected' },
    'end.cond.safe': { id: 'Aman', en: 'Safe' },
    'end.meta.you': { id: 'Kau', en: 'You' },
    'end.meta.actually': { id: 'sebenarnya', en: 'actually' },

    // ─── UI (GameScene) ─────────────────────────────────────────
    'ui.hud.visitor': { id: 'PENGUNJUNG', en: 'VISITOR' },
    'ui.clue.title': { id: 'CATATAN PEMERIKSAAN', en: 'EXAMINATION NOTES' },
    'ui.clue.pending': { id: 'Belum diperiksa.', en: 'Not yet examined.' },
    'ui.clue.done': { id: 'DICATAT', en: 'NOTED' },
    'ui.exam.head': { id: 'PEMERIKSAAN', en: 'EXAMINATION' },
    'ui.barrier.ask': { id: 'Minta buka:', en: 'Request removal:' },
    'ui.verdict.reject.main': { id: 'TOLAK', en: 'REJECT' },
    'ui.verdict.reject.sub': { id: 'jangan biarkan masuk', en: 'do not allow entry' },
    'ui.verdict.accept.main': { id: 'TERIMA', en: 'ACCEPT' },
    'ui.verdict.accept.sub': { id: 'buka pintu', en: 'open the door' },
    'ui.flash.accept.word': { id: 'PINTU DIBUKA', en: 'DOOR OPENED' },
    'ui.flash.accept.sub': { id: 'Kau membiarkannya masuk.', 'en': 'You let them in.' },
    'ui.flash.reject.word': { id: 'PINTU DITUTUP', en: 'DOOR CLOSED' },
    'ui.flash.reject.sub': { id: 'Kau menyuruhnya pergi.', en: 'You sent them away.' },
    'ui.toast.barrier': { id: 'dibuka. Periksa gejala di baliknya.', en: 'removed. Examine the symptoms beneath.' },
    'ui.toast.locked': { id: 'Buka', en: 'Remove' },
    'ui.toast.locked2': { id: 'dulu untuk memeriksa', en: 'first to examine' },
    'ui.exam.observe.label': { id: 'Observasi pengunjung', en: 'Observe visitor' },
    'ui.exam.suhu.label': { id: 'Cek suhu tubuh', en: 'Check body temperature' },
    'ui.exam.ruam.label': { id: 'Periksa ruam (lengan/leher)', 'en': 'Check rash (arms/neck)' },
    'ui.exam.mata.label': { id: 'Periksa mata', en: 'Check eyes' },
    'ui.exam.tekanan.label': { id: 'Cek tekanan darah', en: 'Check blood pressure' },
    'ui.exam.rambut.label': { id: 'Periksa rambut/kepala', en: 'Check hair/head' },
    'ui.narr.barrier': { id: 'dibuka. Pemeriksaan baru kini tersedia.', en: 'removed. New examinations are now available.' },
    'ui.narr.observe': { id: '— Pengamatan —', en: '— Observation —' },
    'ui.visitor.floor': { id: 'Lantai', en: 'Floor' },
    'ui.visitor.unknown': { id: 'Tak dikenal', en: 'Unknown' },
    'ui.visitor.age': { id: 'th', en: 'yo' },

    // ─── IntroScene ─────────────────────────────────────────────
    'intro.next': { id: 'LANJUT ▸', en: 'NEXT ▸' },
    'intro.start': { id: 'MULAI BERTUGAS ▸', en: 'START YOUR SHIFT ▸' },

    // ─── Epilogue (story.js) ────────────────────────────────────
    'end.perfect.title': { id: 'Fajar yang Aman', en: 'A Safe Dawn' },
    'end.perfect.summary': {
        id: 'Tidak ada satu pun kesalahan sepanjang shift. Mereka yang terinfeksi berhasil dihentikan sebelum memasuki gedung, sementara para penghuni yang sehat dapat kembali ke rumah mereka dengan aman.',
        en: 'Not a single mistake was made during the shift. The infected were successfully stopped before entering the building, while healthy residents were able to return to their homes safely.',
    },
    'end.perfect.outro': {
        id: 'Fajar tiba.\n\nUntuk pertama kalinya setelah berminggu-minggu, berita pagi membawa sedikit harapan.\n\nPemerintah mengumumkan bahwa vaksin VRS-24 mulai didistribusikan ke berbagai kota. Jumlahnya masih terbatas, tetapi cukup untuk memberi harapan bahwa wabah ini tidak akan berlangsung selamanya.\n\nDi dalam gedung, para penghuni memulai hari seperti biasa.\n\nAnak-anak berangkat sekolah. Para pekerja bersiap menjalani shift mereka. Lampu-lampu apartemen menyala satu per satu tanpa ketakutan yang selama ini menyelimuti kota.\n\nSebagian dari mereka tidak pernah tahu betapa dekatnya wabah dengan rumah mereka malam itu.\n\nDan mereka memang tidak perlu tahu.\n\nTugas seorang penjaga bukan menjadi pahlawan yang dikenang.\n\nTugasnya adalah memastikan semua orang bisa menjalani hari esok.',
        en: 'Dawn arrives.\n\nFor the first time in weeks, the morning news brought a glimmer of hope.\n\nThe government announced that the VRS-24 vaccine has begun distribution to various cities. The quantity is still limited, but enough to offer hope that this outbreak will not last forever.\n\nInside the building, residents start their day as usual.\n\nChildren head to school. Workers prepare for their shifts. Apartment lights flicker on one by one without the fear that has gripped the city for so long.\n\nSome of them never knew how close the outbreak came to their homes that night.\n\nAnd they don\'t need to know.\n\nThe job of a guardian isn\'t to be a remembered hero.\n\nThe job is to ensure everyone can face tomorrow.',
    },

    'end.reject.title': { id: 'Keputusan yang Salah', en: 'A Wrong Decision' },
    'end.reject.summary': {
        id: 'Tidak ada wabah yang masuk, tetapi {n} penghuni sehat kau tolak karena kecurigaan yang keliru.',
        en: 'No outbreak entered, but you rejected {n} healthy residents based on mistaken suspicion.',
    },
    'end.reject.outro': {
        id: 'Gedung memang tetap aman malam itu.\n\nNamun beberapa penghuni yang sehat terpaksa menghabiskan malam di luar tempat yang seharusnya menjadi rumah mereka.\n\nKeesokan harinya, kabar tentang keputusanmu menyebar dari pintu ke pintu.\n\nTidak ada wabah yang masuk.\n\nTetapi kepercayaan para penghuni mulai retak.',
        en: 'The building remained safe that night.\n\nHowever, some healthy residents were forced to spend the night outside the place that should have been their home.\n\nThe next day, word of your decisions spread from door to door.\n\nNo outbreak entered.\n\nBut the residents\' trust has begun to fracture.',
    },

    'end.leaked.title': { id: 'Wabah Menembus Pintu', en: 'Outbreak Breaches the Door' },
    'end.leaked.summary': {
        id: 'Kau meloloskan {n} orang yang terinfeksi VRS-24. Pada awalnya tidak ada yang terlihat berbeda, tetapi wabah telah memasuki gedung.',
        en: 'You let {n} VRS-24 infected people in. At first, nothing seemed different, but the outbreak has entered the building.',
    },
    'end.leaked.outro': {
        id: 'Beberapa jam kemudian laporan pertama masuk.\n\nDemam. Ruam. Mata merah.\n\nSebelum fajar tiba, semakin banyak penghuni mulai menunjukkan gejala yang sama.\n\nVRS-24 menyebar jauh lebih cepat daripada yang diperkirakan.\n\nKeputusan yang tampak kecil malam itu menjadi awal dari sebuah wabah.',
        en: 'A few hours later, the first reports came in.\n\nFever. Rash. Red eyes.\n\nBefore dawn arrived, more and more residents began showing the same symptoms.\n\nVRS-24 spreads much faster than anticipated.\n\nA seemingly small decision that night became the start of an entire outbreak.',
    },

    'end.worst.title': { id: 'Malam yang Gagal', en: 'A Failed Night' },
    'end.worst.summary': {
        id: 'Kau meloloskan {l} orang yang terinfeksi dan menolak {r} penghuni yang sebenarnya sehat.',
        en: 'You let {l} infected people in and rejected {r} residents who were actually healthy.',
    },
    'end.worst.outro': {
        id: 'Menjelang fajar, laporan kasus pertama mulai berdatangan.\n\nDemam. Ruam. Mata merah.\n\nDi saat yang sama, beberapa penghuni yang sehat masih berada di luar gedung karena keputusanmu.\n\nMereka yang seharusnya dilindungi justru dihukum.\n\nMereka yang seharusnya dihentikan justru berhasil masuk.\n\nKetika matahari terbit, tidak ada yang bisa disebut sebagai kemenangan.\n\nMalam itu, kau gagal di kedua sisi pintu.',
        en: 'As dawn approached, reports of the first cases began to pour in.\n\nFever. Rash. Red eyes.\n\nAt the same time, several healthy residents remained outside the building because of your decisions.\n\nThose who should have been protected were punished.\n\nThose who should have been stopped successfully entered.\n\nWhen the sun rose, there was nothing that could be called a victory.\n\nThat night, you failed on both sides of the door.',
    },

    // ─── Secret Ending: tolak semua ──────────────────────────────
    'end.secret.title': { id: 'ENDING RAHASIA', en: 'SECRET ENDING' },
    'end.secret.summary': {
        id: 'Tidak seorang pun kau izinkan masuk malam itu. Tidak yang sakit. Tidak yang sehat. Tidak ada seorang pun.',
        en: 'You let no one in that night. Not the sick. Not the healthy. Not a single soul.',
    },
    'end.secret.outro': {
        id: 'Malam semakin larut.\n\nDari atap gedung, kau memandangi Kota Nusaraya yang perlahan tenggelam dalam kekacauan.\n\nSirene ambulans bersahut-sahutan. Lampu darurat berkedip di kejauhan. Orang-orang berlarian mencari tempat yang aman.\n\nDi jalan raya, beberapa korban mulai roboh satu per satu.\n\nKau tidak menunjukkan ekspresi apa pun.\n\nKarena semua ini bukan kecelakaan.\n\nBukan bagi dirimu.\n\nKau mengetahui keberadaan laboratorium bawah tanah itu jauh sebelum wabah terjadi.\n\nKau melaporkannya.\n\nKau memperingatkan mereka.\n\nTak seorang pun mau mendengar.\n\nMaka kau memutuskan memberikan sesuatu yang tidak bisa mereka abaikan.\n\nBesok pagi, seluruh negeri akan mengetahui apa yang tersembunyi di bawah Rumah Sakit Umum Nusaraya.\n\nMereka akan menyebutmu penjahat.\n\nMungkin mereka benar.\n\nTetapi akhirnya...\n\nMereka juga akan mengetahui kebenaran.',
        en: 'The night grows late.\n\nFrom the rooftop, you watch Nusaraya City slowly sink into chaos.\n\nAmbulance sirens wail back and forth. Emergency lights blink in the distance. People run searching for somewhere safe.\n\nOn the main road, victims begin to collapse one by one.\n\nYou show no expression at all.\n\nBecause none of this was an accident.\n\nNot for you.\n\nYou knew about the underground laboratory long before the outbreak.\n\nYou reported it.\n\nYou warned them.\n\nNo one would listen.\n\nSo you decided to give them something they could not ignore.\n\nTomorrow morning, the whole country will know what was hidden beneath Nusaraya General Hospital.\n\nThey will call you a criminal.\n\nPerhaps they are right.\n\nBut in the end...\n\nThey will also know the truth.',
    },

    // ─── Visitors (data/visitors.js) ────────────────────────────
    'v01.name': { id: 'Arunika', en: 'Arunika' },
    'v01.job': { id: 'Pegawai kantoran', en: 'Office worker' },
    'v01.intro': { id: 'Seorang perempuan muda berdiri sambil memegang beberapa kantong belanja. Ia mengenakan masker, syal, topi, dan jaket lengan panjang meski malam terasa cukup gerah.', en: 'A young woman stands holding several shopping bags. She wears a mask, scarf, hat, and long-sleeved jacket even though the night feels quite warm.' },
    'v01.claim': { id: 'Mengaku pegawai kantoran penghuni lantai 3. Baru pulang berbelanja dari mall.', en: 'Claims to be an office worker and resident of the 3rd floor. Just returned from shopping at the mall.' },
    'v01.appearance': { id: 'Tampak lelah setelah berjalan cukup jauh. Sesekali ia mengusap keringat di lehernya.', en: 'Appears tired after walking quite a distance. She occasionally wipes sweat from her neck.' },
    'v01.masker': { id: 'lepas masker', en: 'remove mask' },
    'v01.syal_jaket': { id: 'lepas syal & jaket lengan panjang', en: 'remove scarf & long-sleeved jacket' },
    'v01.topi': { id: 'lepas topi', en: 'remove hat' },
    'v01.exam.observasi': { id: 'Setelah masker dibuka, wajahnya tampak sedikit pucat. Ia tersenyum canggung dan berkata, "Mungkin karena belum makan dari sore."', en: 'After the mask is removed, her face appears slightly pale. She smiles awkwardly and says, "Maybe because I haven\'t eaten since this afternoon."' },
    'v01.exam.observasi.n': { id: 'Pucat bisa disebabkan banyak hal.', en: 'Paleness can be caused by many things.' },
    'v01.exam.suhu.n': { id: '"Di luar panas sekali, mungkin karena itu suhu saya naik sedikit."', en: '"It\'s so hot outside, maybe that\'s why my temperature went up a bit."' },
    'v01.exam.ruam': { id: 'Di beberapa titik lengan dan leher terlihat ruam tipis yang menyebar. Arunika cepat-cepat berkata, "Kulit saya memang sensitif kalau habis seharian pakai baju tebal."', en: 'In several spots on her arms and neck, a thin, spreading rash is visible. Arunika quickly says, "My skin is sensitive if I wear thick clothes all day."' },
    'v01.exam.ruam.n': { id: 'Ruam menyebar tetap perlu dicurigai.', en: 'A spreading rash should still be treated as suspicious.' },
    'v01.exam.tekanan.n': { id: '"Saya memang sering tekanan darah rendah."', en: '"I frequently have low blood pressure."' },
    'v01.exam.suhu': { id: '37.5°C', en: '37.5°C' },
    'v01.exam.mata': { id: 'Mata tampak normal.', en: 'Eyes appear normal.' },
    'v01.exam.tekanan': { id: '90/60 mmHg', en: '90/60 mmHg' },
    'v01.exam.rambut': { id: 'Rambut masih lebat, tidak ada kerontokan.', en: 'Hair is still thick, no hair loss.' },

    'v02.name': { id: 'Gopal', en: 'Gopal' },
    'v02.job': { id: 'Mahasiswa semester 4', en: '4th-semester student' },
    'v02.intro': { id: 'Mahasiswa semester 4 mengenakan jaket hoodie dengan kupluk menutupi kepala. Tampak biasa saja, sedikit berkeringat. Ia tampak lelah dan beberapa kali menguap saat menunggu pemeriksaan.', en: 'A 4th-semester student wearing a hoodie with the hood covering his head. Appears ordinary, sweating slightly. He looks tired and yawns several times while waiting for the examination.' },
    'v02.claim': { id: 'Tinggal bersama neneknya di lantai 2. Baru pulang dari perpustakaan kampus mengerjakan final project.', en: 'Lives with his grandmother on the 2nd floor. Just returned from the campus library working on a final project.' },
    'v02.appearance': { id: 'Terlihat lelah dan sedikit berkeringat. Sesekali mengucek matanya.', en: 'Looks tired and is sweating slightly. Occasionally rubs his eyes.' },
    'v02.hoodie': { id: 'lepas jaket hoodie', en: 'remove hoodie jacket' },
    'v02.exam.observasi': { id: 'Tidak pucat. Berkeringat ringan dan tampak mengantuk. "Saya belum tidur dari semalam karena deadline tugas."', en: 'Not pale. Sweating lightly and appears sleepy. "I haven\'t slept since last night because of a project deadline."' },
    'v02.exam.observasi.n': { id: 'Kurang tidur dapat menyebabkan kelelahan dan keringat ringan.', en: 'Lack of sleep can cause fatigue and light sweating.' },
    'v02.exam.ruam': { id: 'Setelah hoodie dibuka, ia memakai kaus pendek. Kulit bersih tanpa ruam atau bintik mencurigakan.', en: 'After removing the hoodie, he is wearing a short-sleeved shirt. Skin is clear without a rash or suspicious spots.' },
    'v02.exam.mata': { id: 'Mata sedikit merah. Ia mengaku terlalu lama menatap layar laptop.', en: 'Eyes are slightly red. He claims to have spent too much time staring at his laptop screen.' },
    'v02.exam.mata.n': { id: 'Mata merah tidak selalu berarti infeksi.', en: 'Red eyes do not always indicate an infection.' },
    'v02.exam.suhu': { id: '36.5°C', en: '36.5°C' },
    'v02.exam.suhu.n': { id: 'Suhu normal.', en: 'Normal temperature.' },
    'v02.exam.tekanan': { id: '120/80 mmHg', en: '120/80 mmHg' },
    'v02.exam.tekanan.n': { id: 'Tekanan normal.', en: 'Normal blood pressure.' },
    'v02.exam.rambut': { id: 'Rambut lebat dan normal.', en: 'Hair is thick and normal.' },

    'v03.name': { id: 'Kakek Hasan', en: 'Grandpa Hasan' },
    'v03.job': { id: 'Pensiunan guru', en: 'Retired teacher' },
    'v03.intro': { id: 'Seorang lelaki tua mengenakan topi lusuh dan kaus singlet. Bajunya basah oleh keringat seolah baru berjalan jauh. Ia mengipasi dirinya dengan koran yang digulung.', en: 'An old man wearing a frayed hat and an undershirt. His clothes are soaked with sweat as if he has just walked a long way. He fans himself with a rolled-up newspaper.' },
    'v03.claim': { id: 'Pensiunan guru yang tinggal sendiri di lantai 2. Baru pulang mengunjungi kawan lamanya di ujung kota.', en: 'A retired teacher living alone on the 2nd floor. Just returned from visiting an old friend at the other end of town.' },
    'v03.appearance': { id: 'Berkeringat deras dan tampak kepanasan. Napasnya sedikit terengah, tetapi ia masih bisa bercanda dan berbicara dengan lancar.', en: 'Sweating profusely and appears overheated. His breathing is slightly labored, but he is still able to joke and speak clearly.' },
    'v03.topi': { id: 'lepas topi', en: 'remove hat' },
    'v03.exam.observasi': { id: 'Keringat berlebih, tetapi tidak pucat. Wajahnya justru kemerahan. "Aduh, panas sekali hari ini. Tadi angkotnya penuh sesak."', en: 'Excessive sweating, but not pale. His face is actually flushed. "My, it\'s hot today. The public van was packed."' },
    'v03.exam.observasi.n': { id: 'Kemerahan karena panas berbeda dengan pucat akibat sakit.', en: 'Redness from heat is different from paleness caused by sickness.' },
    'v03.exam.suhu.n': { id: '"Mungkin karena saya jalan kaki dari halte, Nak."', en: '"Perhaps because I walked from the bus stop, son."' },
    'v03.exam.rambut': { id: 'Setelah topi dibuka, kepalanya botak.', en: 'After removing the hat, his head is bald.' },
    'v03.exam.rambut.n': { id: '"Sudah botak sejak sepuluh tahun lalu," katanya sambil tertawa.', en: '"Been bald for ten years," he says with a laugh.' },
    'v03.exam.suhu': { id: '37.6°C', en: '37.6°C' },
    'v03.exam.mata': { id: 'Mata normal dan tidak merah.', en: 'Eyes are normal and not red.' },
    'v03.exam.tekanan': { id: '130/80 mmHg', en: '130/80 mmHg' },
    'v03.exam.tekanan.n': { id: 'Normal untuk lansia.', en: 'Normal for the elderly.' },

    'v04.name': { id: 'Adit', en: 'Adit' },
    'v04.job': { id: 'Teknisi AC', en: 'AC Technician' },
    'v04.intro': { id: 'Seorang pria mengenakan masker dan kacamata hitam. Ia membawa tas perkakas teknisi AC di bahunya. Dari kejauhan ia tampak biasa saja, tetapi sesekali harus bersandar untuk menjaga keseimbangan.', en: 'A man wearing a mask and sunglasses. He carries an AC technician\'s tool bag on his shoulder. From a distance he looks ordinary, but he occasionally leans against things to maintain his balance.' },
    'v04.claim': { id: 'Teknisi AC, tinggal di lantai 5 bersama istrinya. Baru pulang dari shift kerja.', en: 'AC technician, lives on the 5th floor with his wife. Just returned from a work shift.' },
    'v04.appearance': { id: 'Ia berusaha terlihat tenang dan terus mengatakan dirinya baik-baik saja, tetapi gerakannya tampak lambat dan tenaganya seperti terkuras.', en: 'He tries to appear calm and keeps saying he\'s fine, but his movements are slow and his energy seems drained.' },
    'v04.masker': { id: 'lepas masker', en: 'remove mask' },
    'v04.kacamata': { id: 'lepas kacamata dan gulung lengan baju', en: 'remove sunglasses and roll up sleeves' },
    'v04.exam.observasi': { id: 'Setelah masker dibuka, wajahnya terlihat pucat. Ia berkata, "Cuma capek kerja dari pagi, Pak."', en: 'After removing the mask, his face appears pale. He says, "Just tired from working since morning, sir."' },
    'v04.exam.observasi.n': { id: 'Kelelahan memang bisa membuat wajah terlihat pucat.', en: 'Fatigue can indeed make a face look pale.' },
    'v04.exam.suhu.n': { id: '"Tadi kerja di atap gedung. Panasnya luar biasa."', en: '"Was working on the building rooftop. It was incredibly hot."' },
    'v04.exam.ruam': { id: 'Saat lengan digulung, terlihat ruam merah yang menyebar luas di kedua lengan.', en: 'When the sleeves are rolled up, a widespread red rash is visible on both arms.' },
    'v04.exam.ruam.n': { id: 'Ruam menyebar merupakan tanda yang sulit dijelaskan oleh kelelahan biasa.', en: 'A spreading rash is a sign difficult to explain by mere fatigue.' },
    'v04.exam.mata': { id: 'Setelah kacamata dilepas, matanya merah dan berair.', en: 'After removing the sunglasses, his eyes are red and watery.' },
    'v04.exam.mata.n': { id: '"Kena debu waktu servis AC."', en: '"Got dust in them while servicing the AC."' },
    'v04.exam.suhu': { id: '39.0°C', en: '39.0°C' },
    'v04.exam.tekanan': { id: '80/60 mmHg', en: '80/60 mmHg' },
    'v04.exam.tekanan.n': { id: 'Tekanan darah rendah.', en: 'Low blood pressure.' },
    'v04.exam.rambut': { id: 'Rambut masih normal.', en: 'Hair is still normal.' },

    'v05.name': { id: 'Rahma & Tita', en: 'Rahma & Tita' },
    'v05.job': { id: 'Ibu rumah tangga', en: 'Housewife' },
    'v05.intro': { id: 'Seorang ibu muda menggendong anak perempuannya yang berusia sekitar satu setengah tahun. Tita tampak mengantuk di pelukan ibunya. Keduanya terlihat tenang dan sehat.', en: 'A young mother carrying her daughter who is about a year and a half old. Tita appears sleepy in her mother\'s arms. Both look calm and healthy.' },
    'v05.claim': { id: 'Istri Adit penghuni lantai 5. Baru pulang dari puskesmas setelah imunisasi rutin Tita.', en: 'Wife of Adit, resident of the 5th floor. Just returned from the clinic after Tita\'s routine immunization.' },
    'v05.appearance': { id: 'Rahma tampak lelah karena seharian mengurus anak, tetapi tidak menunjukkan tanda-tanda sakit.', en: 'Rahma looks tired from taking care of the child all day, but shows no signs of illness.' },
    'v05.exam.observasi': { id: 'Ibu dan anak tampak sehat. Saat ditanya soal Adit, Rahma menjawab, "Mas Adit berangkat kerja pagi tadi. Mungkin sudah sampai rumah duluan."', en: 'Mother and child appear healthy. When asked about Adit, Rahma answers, "Adit left for work this morning. Maybe he got home before us."' },
    'v05.exam.observasi.n': { id: 'Tidak ada tanda infeksi yang terlihat.', en: 'No visible signs of infection.' },
    'v05.exam.suhu': { id: 'Rahma 36.5°C (normal). Tita 36.8°C (normal).', en: 'Rahma 36.5°C (normal). Tita 36.8°C (normal).' },
    'v05.exam.suhu.n': { id: 'Keduanya dalam rentang normal.', en: 'Both are within normal range.' },
    'v05.exam.ruam': { id: 'Rahma: kulit bersih. Tita: terdapat satu bintik kecil di lengan atas bekas suntikan imunisasi.', en: 'Rahma: skin clear. Tita: there is one small spot on the upper arm from an immunization shot.' },
    'v05.exam.ruam.n': { id: 'Satu titik bekas suntikan berbeda dari ruam yang menyebar.', en: 'A single injection spot is different from a spreading rash.' },
    'v05.exam.tekanan': { id: 'Rahma 140/90 mmHg (agak tinggi). Tita 80/55 (normal bayi).', en: 'Rahma 140/90 mmHg (slightly high). Tita 80/55 (normal for babies).' },
    'v05.exam.tekanan.n': { id: '140/90 cenderung hipertensi, bukan gejala infeksi.', en: '140/90 suggests hypertension, not an infection symptom.' },
    'v05.exam.rambut': { id: 'Rahma normal. Tita berambut tipis halus (wajar untuk batita).', en: 'Rahma normal. Tita has thin fine hair (normal for toddlers).' },
    'v05.exam.rambut.n': { id: 'Rambut tipis pada anak kecil adalah hal normal.', en: 'Thin hair on young children is normal.' },
    'v05.exam.mata': { id: 'Mata keduanya normal.', en: 'Both have normal eyes.' },

    'v06.name': { id: 'Ibu Mima', en: 'Mrs. Mima' },
    'v06.job': { id: 'Penjual pasar ikan', en: 'Fish market seller' },
    'v06.intro': { id: 'Perempuan paruh baya yang ramah dan banyak tersenyum. Tampak segar, tidak seperti orang sakit. Lengan bajunya digulung sebagian.', en: 'A friendly middle-aged woman who smiles a lot. Appears fresh, not like someone who is sick. Her sleeves are partially rolled up.' },
    'v06.claim': { id: 'Penjual di pasar ikan, tinggal sendiri di lantai 4. Baru pulang dari pasar ikan.', en: 'Seller at the fish market, lives alone on the 4th floor. Just returned from the fish market.' },
    'v06.appearance': { id: 'Wajah segar dan ramah. Tidak pucat. Tetapi tangannya tampak kemerahan.', en: 'Face is fresh and friendly. Not pale. However, her hands appear reddish.' },
    'v06.exam.observasi': { id: 'Tidak pucat, malah tampak sehat. Tangan memerah. Saat ditanya, ia tersenyum: "Biasa, Nak, seharian kena air es ikan."', en: 'Not pale, instead appears healthy. Hands are flushed. When asked, she smiles: "Ordinary, son, spent the day in iced fish water."' },
    'v06.exam.observasi.n': { id: 'Kemerahan diberi alasan pekerjaan — perlu diperiksa lebih lanjut.', en: 'Redness given a work-related excuse — needs further examination.' },
    'v06.exam.suhu.n': { id: '"Pasar ikan itu pengap dan panas, Nak."', en: '"The fish market is stuffy and hot, son."' },
    'v06.exam.ruam': { id: 'Di lengan terdapat bintik-bintik kemerahan yang menyebar. Ia berkata: "Itu alergi udang, langganan saya."', en: 'On the arms, there are spreading red spots. She says: "That\'s my usual shrimp allergy."' },
    'v06.exam.ruam.n': { id: 'Ruam menyebar di banyak titik — terlepas dari alasannya.', en: 'Rash spreading across many spots — regardless of the reason.' },
    'v06.exam.mata': { id: 'Mata agak merah. "Kurang tidur, Nak, bangun jam 3 ke pasar."', en: 'Eyes are slightly red. "Lack of sleep, son, woke up at 3 for the market."' },
    'v06.exam.suhu': { id: '38.1°C', en: '38.1°C' },
    'v06.exam.tekanan': { id: '110/70 mmHg', en: '110/70 mmHg' },
    'v06.exam.tekanan.n': { id: 'Tekanan normal.', en: 'Normal blood pressure.' },
    'v06.exam.rambut': { id: 'Rambut masih lebat.', en: 'Hair is still thick.' },

    // ─── Intro Story (IntroScene.js) ───────────────────────────
    'intro.p1.1': { id: '4 Desember 2024, 01:45 AM.', en: 'December 4, 2024, 01:45 AM.' },
    'intro.p1.2': { id: 'Di Nusaraya, sebuah kota pelabuhan yang tenang, aktivitas berjalan seperti biasa.', en: 'In Nusaraya, a quiet port city, life goes on as usual.' },
    'intro.p1.3': { id: 'Di bawah Rumah Sakit Umum Nusaraya, tersembunyi sebuah laboratorium rahasia milik negara.', en: 'Beneath Nusaraya General Hospital, a secret state-owned laboratory is hidden.' },
    'intro.p1.4': { id: 'Keberadaannya dirahasiakan dari publik dan hanya diketahui oleh segelintir pejabat tinggi.', en: 'Its existence is kept secret from the public, known only to a handful of high-ranking officials.' },
    'intro.p1.5': { id: 'Dini hari, sebuah insiden terjadi.', en: 'In the early hours, an incident occurs.' },
    'intro.p1.6': { id: 'Sesuatu berhasil keluar dari laboratorium tersebut.', en: 'Something has managed to escape from the laboratory.' },

    'intro.p2.1': { id: '4 Desember 2024, 19:30 PM.', en: 'December 4, 2024, 19:30 PM.' },
    'intro.p2.2': { id: 'Beberapa warga mulai berdatangan ke rumah sakit dengan gejala yang tidak biasa.', en: 'Several citizens began arriving at the hospital with unusual symptoms.' },
    'intro.p2.3': { id: 'Demam tinggi. Nyeri hebat. Kelelahan mendadak.', en: 'High fever. Severe pain. Sudden fatigue.' },
    'intro.p2.4': { id: 'Sebagian dokter menganggapnya sebagai penyakit musiman.', en: 'Some doctors dismissed it as a seasonal illness.' },
    'intro.p2.5': { id: 'Namun jumlah pasien terus bertambah dari jam ke jam.', en: 'But the number of patients continues to grow hour by hour.' },
    'intro.p2.6': { id: 'Sementara itu, pemerintah masih menutup informasi mengenai insiden yang terjadi pagi tadi.', en: 'Meanwhile, the government still suppresses information regarding the incident that happened earlier today.' },
    'intro.p2.7': { id: 'Tidak ada yang tahu apakah kebocoran itu merupakan kecelakaan... atau sesuatu yang disengaja.', en: 'No one knows if the leak was an accident... or something intentional.' },

    'intro.p3.1': { id: '4 Desember 2024, 23:50 PM.', en: 'December 4, 2024, 23:50 PM.' },
    'intro.p3.2': { id: 'Kota Nusaraya memasuki fase outbreak.', en: 'Nusaraya City enters the outbreak phase.' },
    'intro.p3.3': { id: 'Ruang gawat darurat penuh. Ambulans terus berdatangan. Jalan-jalan mulai ditutup.', en: 'Emergency rooms are full. Ambulances keep arriving. Roads are starting to close.' },
    'intro.p3.4': { id: 'Karantina darurat diumumkan di seluruh kota.', en: 'An emergency quarantine is announced citywide.' },
    'intro.p3.5': { id: 'Mereka yang terinfeksi tidak langsung terlihat sakit.', en: 'Those who are infected do not immediately look sick.' },
    'intro.p3.6': { id: 'Mereka masih bisa berjalan. Masih bisa berbicara. Masih bisa memohon untuk diselamatkan.', en: 'They can still walk. Still talk. Still beg to be saved.' },
    'intro.p3.7': { id: 'Namun dalam waktu kurang dari 48 jam, sebagian besar korban akan mati.', en: 'But in less than 48 hours, most victims will die.' },
    'intro.p3.8': { id: 'Kau, {name}, kini menjaga sebuah rumah susun yang tersegel dari dunia luar.', en: 'You, {name}, now guard an apartment building sealed off from the outside world.' },
    'intro.p3.9': { id: 'Selama beberapa hari ke depan, setiap orang yang mengetuk pintumu harus diperiksa.', en: 'Over the next few days, every person who knocks at your door must be examined.' },
    'intro.p3.10': { id: 'Satu keputusan yang salah.', en: 'One wrong decision.' },
    'intro.p3.11': { id: 'Satu gedung yang mati.', en: 'One dead building.' },
    'intro.next': { id: 'LANJUT', en: 'NEXT' },
    'intro.start': { id: 'MULAI PENJAGAAN', en: 'START SHIFT' },
    'intro.skipHint': { id: 'Klik untuk lewati animasi', en: 'Click to skip animation' },
};

// ─── State ───────────────────────────────────────────────────────────────────
let _lang = localStorage.getItem('plmi_lang') || 'id';

export function getLang() { return _lang; }

export function setLang(lang) {
    _lang = lang === 'en' ? 'en' : 'id';
    localStorage.setItem('plmi_lang', _lang);
}

/**
 * t('warn.title') → teks sesuai bahasa aktif.
 * Fallback ke ID jika kunci tidak ada di EN, fallback ke kunci itu sendiri jika
 * kunci tidak ditemukan sama sekali.
 */
export function t(key) {
    const entry = DICT[key];
    if (!entry) return key;               // kunci tidak ada → tampilkan key itu sendiri
    return entry[_lang] ?? entry['id'] ?? key;
}