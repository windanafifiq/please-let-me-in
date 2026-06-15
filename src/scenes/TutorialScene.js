// TutorialScene.js — "Cara Bermain" untuk sistem pemeriksaan gejala.
export default class TutorialScene extends Phaser.Scene {
  constructor() { super('TutorialScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(300);
    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.5);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.55);
    this.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W }, y: { min: 0, max: H }, lifespan: 6000,
      speedY: { min: -6, max: -16 }, scale: { start: 0.4, end: 0 },
      alpha: { start: 0.12, end: 0 }, frequency: 420, tint: 0xe8c468,
    });
    this.mountDom();
  }

  mountDom() {
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="tut-screen">
        <div class="tut-head">CARA BERMAIN</div>
        <div class="tut-scroll">

          <section class="tut-sec">
            <h3>🎯 Tujuanmu</h3>
            <p>Kau petugas pemeriksa di pintu gedung karantina. Tiap pengunjung ingin masuk.
            Tugasmu: <b>periksa gejala mereka, lalu putuskan TERIMA atau TOLAK.</b>
            Meloloskan satu orang yang terinfeksi VRS-24 berarti wabah masuk ke gedung.</p>
          </section>

          <section class="tut-sec">
            <h3>🔬 Cara memeriksa</h3>
            <p>Gunakan menu <b>PEMERIKSAAN</b>: observasi penampilan, cek suhu, cek tekanan
            darah, periksa ruam, mata, dan rambut. Tiap hasil dicatat otomatis di
            <b>CATATAN PEMERIKSAAN</b> sebagai data apa adanya — <b>kau sendiri yang menyimpulkan</b>.</p>
          </section>

          <section class="tut-sec">
            <h3>🧥 Penghalang</h3>
            <p>Sebagian gejala tersembunyi di balik pakaian (jaket, syal, kacamata, topi, masker).
            Gunakan tombol <b>"Minta buka"</b> untuk memintanya dibuka, lalu gejala di baliknya
            bisa diperiksa. Curigai penghalang yang janggal — kenapa pakai syal di malam gerah?</p>
          </section>

          <section class="tut-sec tut-tip">
            <h3>🦠 Mengenali VRS-24 (Varion Rapid Syndrom 24)</h3>
            <p>Seseorang <b>terinfeksi</b> bila menunjukkan POLA berikut bersamaan:</p>
            <div class="tut-actions">
              <div class="tut-act"><span class="ico">🩹</span><div><b>Ruam menyebar</b><small>Bintik di BANYAK titik (lengan, leher, dada). Bukan satu-dua bintik terpisah.</small></div></div>
              <div class="tut-act"><span class="ico">🌡</span><div><b>Demam</b><small>Suhu 37.5°C ke atas. 37.5–38°C demam ringan; di atas 38°C demam jelas.</small></div></div>
              <div class="tut-act"><span class="ico">➕</span><div><b>Minimal 1 gejala pendukung</b><small>Mata merah berair, tekanan darah rendah, pucat, atau kebotakan.</small></div></div>
            </div>
            <p style="margin-top:8px"><b>Ruam menyebar + demam + 1 pendukung = VRS-24 → TOLAK.</b></p>
          </section>

          <section class="tut-sec">
            <h3>🎭 Yang MENJEBAK (sebenarnya aman)</h3>
            <div class="tut-actions">
              <div class="tut-act"><span class="ico">💧</span><div><b>Keringat & merah karena panas</b><small>Heat-stroke ringan: demam tapi TANPA ruam. Wajah merah, bukan pucat.</small></div></div>
              <div class="tut-act"><span class="ico">🩸</span><div><b>Tekanan darah rendah sendirian</b><small>Bisa anemia — bukan VRS-24 bila tanpa ruam & demam.</small></div></div>
              <div class="tut-act"><span class="ico">💉</span><div><b>Satu bintik</b><small>Bekas suntik imunisasi = satu titik di lengan atas. Bukan ruam menyebar.</small></div></div>
              <div class="tut-act"><span class="ico">👴</span><div><b>Botak biasa</b><small>Umum pada lansia. Bukan gejala bila tanpa ruam & demam.</small></div></div>
            </div>
          </section>

          <section class="tut-sec tut-tip">
            <p>💡 <b>Kunci:</b> jangan tertipu satu gejala atau alasan yang masuk akal. Baca
            <b>POLA</b>-nya. Gejala tunggal sering punya sebab lain; tapi ruam menyebar + demam
            bersamaan adalah VRS-24 — sekalipun pengunjung punya alasan untuk tiap gejalanya.</p>
          </section>

        </div>
        <button class="tut-btn" id="tut-back">◂ KEMBALI</button>
      </div>
    `;
    document.getElementById('tut-back').onclick = () => this.back();
  }

  back() {
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
    this.cameras.main.fadeOut(300, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
  }
}