// IntroScene.js — cerita pembuka (outbreak bioweapon), pakai nama player.
export default class IntroScene extends Phaser.Scene {
  constructor() { super('IntroScene'); }
  init(data) { this.playerName = data.playerName || 'Penjaga'; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(400);
    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.7);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.6);

    const name = this.playerName;
    const paragraphs = [
      '25 Desember 2025 — 19:25.',
      'Di Novarka, sebuah kota pelabuhan di benua terpencil, sebuah senjata biologis bocor dari fasilitas rahasia. Bukan kecelakaan — sebuah sindikat bioterorisme melepaskannya dengan sengaja.',
      'Mereka menyebutnya "Wabah Variol". Patogen itu menyebar dalam hitungan jam. Yang terinfeksi tidak langsung berubah; mereka tampak normal, bicara, bahkan memohon — sebelum demam, ruam, dan kegilaan merenggut tubuh mereka.',
      `Kau, ${name}, adalah seorang pegawai yang selamat — kini menjaga sebuah rumah susun warga yang tersegel. Lift mati, koridor dikunci, dan dunia luar menjadi neraka.`,
      'Selama tiga hari hingga bantuan tiba, hanya kau yang berdiri di antara para penghuni dan wabah. Setiap orang yang mengetuk harus kau periksa. Satu kesalahan, dan semua yang kau lindungi akan binasa.',
    ];

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="intro-screen">
        <div class="intro-body" id="intro-body"></div>
        <button id="intro-go" class="intro-btn">MULAI BERTUGAS ▸</button>
      </div>`;
    const body = document.getElementById('intro-body');

    // tampilkan paragraf bertahap (fade-in)
    let i = 0;
    const showNext = () => {
      if (i >= paragraphs.length) return;
      const p = document.createElement('p');
      p.className = 'intro-p' + (i === 0 ? ' intro-stamp' : '');
      p.textContent = paragraphs[i];
      body.appendChild(p);
      requestAnimationFrame(() => p.classList.add('show'));
      i++;
      if (i < paragraphs.length) this.time.delayedCall(900, showNext);
    };
    showNext();

    document.getElementById('intro-go').onclick = () => {
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(420, 5, 6, 10);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('GameScene', { newGame: true, playerName: name }));
    };
  }
}
