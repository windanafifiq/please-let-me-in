// LoreScene.js — Halaman "Lore & Referensi": menjelaskan bahwa bioweapon dalam
// game ini terinspirasi dari smallpox (variola) yang diberantas 1980, lengkap
// dengan sejarah, gejala, sejarah penggunaannya sebagai senjata biologis,
// sumber kredibel, dan DISCLAIMER bahwa game ini fiksi.
export default class LoreScene extends Phaser.Scene {
  constructor() { super('LoreScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(360);
    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.6);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.55);

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="lore-screen">
        <div class="lore-head">LORE &amp; REFERENSI</div>
        <div class="lore-scroll">
          <div class="lore-disc lore-disc-top">
            <b>Catatan Game:</b> <i>"VRS-24"</i> atau <i>Varion Rapid Syndrome 24</i> adalah nama virus yang menginfeksi
            para warga kota Nusaraya dalam game <b>Please, Let Me In!</b>. Virus dalam game ini terinspirasi dari penyakit nyata yang sudah diberantas yaitu:
            <b>cacar (smallpox / virus variola)</b>. Mekanik dari game ini adalah melihat ciri-ciri warga yang ingin masuk ke dalam gedung, selalu interogasi 
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
            <p class="lore-note">Dalam game, gejala inilah yang kau cari saat "Periksa lengan"
            atau "Amati" — demam, kulit memerah/ruam, dan napas memberat.</p>
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
            <p class="lore-note">Outro kemenangan di game — "antivirus ditemukan, kota
            selamat" — terinspirasi dari kemenangan nyata umat manusia ini.</p>
          </div>

          <div class="lore-sec">
            <h3>Referensi Keseluruhan Game</h3>
            <p>Referensi mekanik game <b>Please, Let Me In!</b> adalah dari game <b>Quarantine Zone</b>,
            dan game-game anomali di roblox seperti <b>Scary Shawarma Kiosk: The Anomaly</b> dan juga <b>Bakso Malang Anomalies</b>.
            <i>Honorable Mention</i> saya berikan kepada game <b>Resident Evil</b> karena inspirasi lorenya terkait senjata biologis.</p>
          </div>

          <div class="lore-sec lore-sources">
            <h3>Sumber</h3>
            <ul>
              <li>World Health Organization (WHO) — Smallpox overview &amp; history</li>
              <li>Centers for Disease Control and Prevention (CDC) — About Smallpox; Bioterrorism &amp; Smallpox</li>
              <li>NIH / NCBI Bookshelf — Smallpox and Vaccinia</li>
              <li>Encyclopædia Britannica — Smallpox</li>
              <li>History of Vaccines — Biological Weapons, Bioterrorism, and Vaccines</li>
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
        </div>
        <button id="lore-back" class="lore-btn">&#9666; KEMBALI</button>
      </div>`;
    document.getElementById('lore-back').onclick = () => {
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(320);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    };
  }
}
