// Untuk menu lore dan reference
export default class LoreScene extends Phaser.Scene {
  constructor() { super('LoreScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(360);

    // Pastikan BGM tetap jalan
    const bgm = this.sound.get('bgm-main');
    if (bgm && !bgm.isPlaying) bgm.play();

    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.6);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.55);

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="lore-screen">
        <div class="lore-head">VIRUS DALAM GAME</div>
        <div class="lore-scroll">
          <div class="lore-sec">
            <h3>Apa itu VRS-24?</h3>
            <p><b>VRS-24 (Varion Rapid Syndrome-24)</b> adalah penyakit menular fiktif yang
            diduga berasal dari sebuah program penelitian biologis rahasia. Virus ini
            pertama kali terdeteksi di Kota Nusaraya pada <b>4 Desember 2024</b> dan
            menyebar dengan sangat cepat hingga menginfeksi hampir <b>tiga perempat
            penduduk kota</b>. Hingga kini tidak diketahui secara pasti apakah wabah
            tersebut disebabkan oleh kecelakaan laboratorium atau pelepasan yang
            disengaja...</p>
          </div>

          <div class="lore-sec">
            <h3>Bagaimana Gejala VRS-24?</h3>
            <p>Gejala VRS-24 meliputi <b>demam tinggi, kelelahan, pucat, mata memerah, 
            dan ruam yang menyebar di seluruh tubuh</b>. Infeksi ini bersifat fatal dan akan 
            menyebabkan kematian dalam waktu sekitar <b>48 jam</b> setelah gejala pertama muncul. 
            Hingga saat ini, satu-satunya penanganan yang diketahui efektif adalah pemberian vaksin 
            sebelum batas waktu tersebut, meskipun virus tetap menetap di dalam tubuh penyintas 
            dalam kondisi tidak aktif.
            </p>
          </div>

          <div class="lore-sec">
            <h3>Cara Kerja VRS-24 Sebagai Senjata Biologis</h3>
            <p>VRS-24 dirancang sebagai agen biologis yang mampu menyebar melalui <b>udara dan air yang terkontaminasi</b>. 
            Berbeda dengan senjata konvensional, kerusakannya tidak terjadi dalam satu ledakan, melainkan menyebar diam-diam 
            dari satu korban ke korban lain. Dalam hitungan hari, sebuah kota besar dapat berubah menjadi zona karantina 
            penuh kepanikan. Tanpa vaksin dan tindakan darurat, VRS-24 diperkirakan mampu menginfeksi sebagian besar populasi 
            serta menyebabkan runtuhnya layanan kesehatan, ketertiban masyarakat, dan ribuan kematian dalam waktu yang sangat singkat.
            </p>
          </div>

        </div>
          
        <div class="lore-head">REFERENSI GAME</div>
        <div class="lore-scroll">

          <div class="lore-disc lore-disc-top">
            Virus dalam game ini terinspirasi dari penyakit nyata yang sudah diberantas yaitu
            <b>cacar (smallpox / virus variola)</b>. Mekanik dari game ini adalah melihat ciri-ciri warga yang ingin masuk ke dalam gedung, selalu observasi 
            warga jika ingin masuk. Apabila ada indikasi warga terkena virus maka tolak masuk warga, namun apabila tidak ada indikasi maka izinkan masuk warga.
          </div>

          <div class="lore-sec">
            <h3>Apa itu Cacar (Smallpox)?</h3>
            <p>Cacar adalah penyakit menular akut yang disebabkan oleh <b>virus variola</b>,
            anggota keluarga orthopoxvirus. Diperkirakan sudah ada sejak lebih dari 3000
            tahun lalu dan menjadi salah satu wabah paling mematikan dalam sejarah karena
            membunuh sekitar <b>3 dari 10 penderita</b>, dan menewaskan ratusan juta orang
            sepanjang abad ke-20.</p>
          </div>

          <div class="lore-sec">
            <h3>Gejala Khas (dasar "tells" di game)</h3>
            <p>Gejala awal: <b>demam tinggi mendadak, kelelahan, dan nyeri punggung hebat</b>,
            kadang disertai mual. Dua sampai tiga hari kemudian muncul <b>ruam khas</b> —
            bintik berisi cairan bening yang lalu menjadi nanah, mengeras, lalu mengelupas.
            Ruam dimulai dari <b>wajah dan tangan</b>, lalu menyebar ke seluruh tubuh,
            sering meninggalkan bekas luka permanen.</p>
          </div>

          <div class="lore-sec">
            <h3>Bagaimana Cacar Pernah Jadi Senjata Biologis?</h3>
            <p>Setelah cacar dinyatakan diberantas (1980), sebagian pihak menyadari
            potensinya sebagai senjata: populasi dunia berhenti divaksinasi, sehingga
            kembali rentan. Catatan sejarah menyebutkan bekas Uni Soviet pernah
            mengembangkan dan menimbun virus variola dalam jumlah besar sebagai program
            senjata biologis hingga awal 1990-an, meski hal ini melanggar Konvensi Senjata
            Biologis (BTWC) 1972.</p>
            <p>Karena itu, lembaga seperti <b>WHO dan CDC</b> tetap menyiapkan rencana
            tanggap darurat — termasuk cadangan vaksin — untuk kemungkinan (yang sangat
            kecil) virus ini disalahgunakan. Inilah premis fiksi yang dipakai game ini.</p>
          </div>

          <div class="lore-sec">
            <h3>Akhir yang Nyata: Diberantas, 1980</h3>
            <p>WHO meluncurkan program vaksinasi global intensif pada 1967. Kasus alami
            terakhir tercatat di <b>Somalia, 1977</b>. Pada <b>8 Mei 1980</b>, Majelis
            Kesehatan Dunia resmi menyatakan cacar <b>diberantas</b> — satu-satunya penyakit
            menular pada manusia yang pernah berhasil dimusnahkan sepenuhnya. Vaksin cacar
            (oleh Edward Jenner, 1796) juga merupakan vaksin pertama yang pernah dibuat.</p>
          </div>

          <div class="lore-sec">
            <h3>Referensi Mekanik Game</h3>
            <p>Referensi mekanik game <b>Please, Let Me In!</b> adalah dari game <b>Quarantine Zone</b>, <b>"Paper, Please"</b>,
            dan game-game anomali di roblox seperti <b>Scary Shawarma Kiosk: The Anomaly</b> dan juga <b>Bakso Malang Anomalies</b>.
            <i>Honorable Mention</i> saya berikan kepada game <b>Resident Evil</b> karena inspirasi lorenya terkait senjata biologis.</p>
          </div>

          <div class="lore-sec lore-sources">
            <h3>Sumber Edukasi: </h3>
            <ul>
              <li>World Health Organization (WHO) — Smallpox overview &amp; history</li>
              <li>Centers for Disease Control and Prevention (CDC) — About Smallpox; Bioterrorism &amp; Smallpox</li>
              <li>NIH / NCBI Bookshelf — Smallpox and Vaccinia</li>
              <li>Encyclopædia Britannica — Smallpox</li>
              <li>History of Vaccines — Biological Weapons, Bioterrorism, and Vaccines</li>
            </ul>
          </div>

          <div class="lore-sec lore-sources">
            <h3>Sumber Asset: </h3>
            <ul>
              <li>Gambar: Pinterest, Gemini AI</li>
              <li>Backsound and SFX: Pixabay, Storyblocks, Elevenlabs AI</li>
              <li>Font: Google Fonts</li
            </ul>
          </div>

          <div class="lore-disc">
            <b>Disclaimer.</b> Game ini dibuat untuk tujuan edukasi dan simulasi
            (Tugas Final Projek Mata Kuliah Game Edukasi dan Simulasi — Informatika ITS 2026).
            Penyakit, tokoh, lokasi, dan kejadian di dalamnya telah dimodifikasi
            sedemikian rupa sehingga sepenuhnya fiksi dan tidak menggambarkan
            peristiwa nyata mana pun. Tidak ada informasi di sini yang ditujukan untuk
            penyalahgunaan; bagian sejarah disajikan sebagai pengetahuan kesehatan publik.
          </div>
          <div style="display: flex; justify-content: center; width: 100%; margin-top: 20px; padding-bottom: 20px;">
            <button id="lore-back" class="lore-btn">&#9666; KEMBALI</button>
          </div>
        </div>
      </div>`;
    document.getElementById('lore-back').onclick = () => {
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(320);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    };
  }
}