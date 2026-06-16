// IntroScene.js — cerita pembuka ala "dokumen" Resident Evil (geser horizontal, tanpa animasi reveal).
import { t } from '../i18n.js';

export default class IntroScene extends Phaser.Scene {
  constructor() { super('IntroScene'); }
  init(data) { this.playerName = data.playerName || t('name.default'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(400);

    const bgm = this.sound.get('bgm-game');
    if (!bgm) {
      this.sound.play('bgm-game', { loop: true, volume: 0.35 });
    } else if (!bgm.isPlaying) {
      bgm.play();
    }

    this.add.image(W / 2, H / 2, 'photo-door').setDisplaySize(W, H).setAlpha(0.7);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.6);

    const name = this.playerName;

    const pages = [
      [
        t('intro.p1.1'), t('intro.p1.2'), t('intro.p1.3'),
        t('intro.p1.4'), t('intro.p1.5'), t('intro.p1.6')
      ],
      [
        t('intro.p2.1'), t('intro.p2.2'), t('intro.p2.3'), t('intro.p2.4'),
        t('intro.p2.5'), t('intro.p2.6'), t('intro.p2.7')
      ],
      [
        t('intro.p3.1'), t('intro.p3.2'), t('intro.p3.3'), t('intro.p3.4'),
        t('intro.p3.5'), t('intro.p3.6'), t('intro.p3.7'),
        t('intro.p3.8').replace('{name}', name),
        t('intro.p3.9'), t('intro.p3.10'), t('intro.p3.11')
      ]
    ];

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';

    // semua teks langsung dirender penuh, tanpa reveal
    const renderPageContent = (page, idx) => page.map((line, i) =>
      `<p class="intro-p${i === 0 ? ' intro-stamp' : ''}">${line}</p>`
    ).join('');

    root.innerHTML = `
      <div class="intro-screen" id="intro-screen">
        <button id="intro-prev" class="intro-nav intro-nav-prev" aria-label="Sebelumnya">‹</button>

        <div class="intro-viewport" id="intro-viewport">
          <div class="intro-track" id="intro-track">
            ${pages.map((page, idx) => `
              <section class="intro-page" data-page="${idx}">
                <div class="intro-page-inner">${renderPageContent(page, idx)}</div>
                <div class="intro-page-num">${idx + 1} / ${pages.length}</div>
              </section>
            `).join('')}
          </div>
        </div>

        <button id="intro-next" class="intro-nav intro-nav-next" aria-label="Berikutnya">›</button>

        <button id="intro-start" class="intro-btn intro-start">${t('intro.start')}</button>
      </div>
    `;

    const track   = document.getElementById('intro-track');
    const prevBtn = document.getElementById('intro-prev');
    const nextBtn = document.getElementById('intro-next');
    const startBtn = document.getElementById('intro-start');
    let currentPage = 0;
    const lastPage = pages.length - 1;

    const update = () => {
      track.style.transform = `translateX(-${currentPage * 100}%)`;
      // panah kiri disembunyikan di halaman pertama, panah kanan di halaman terakhir
      prevBtn.classList.toggle('hidden', currentPage === 0);
      nextBtn.classList.toggle('hidden', currentPage === lastPage);
      // tombol mulai cuma di halaman terakhir
      startBtn.classList.toggle('visible', currentPage === lastPage);
    };

    prevBtn.onclick = () => { if (currentPage > 0) { currentPage--; update(); } };
    nextBtn.onclick = () => { if (currentPage < lastPage) { currentPage++; update(); } };

    startBtn.onclick = () => {
      root.innerHTML = '';
      root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(420, 5, 6, 10);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', { newGame: true, playerName: name });
      });
    };

    // (opsional) navigasi keyboard ←/→
    this.input.keyboard.on('keydown-LEFT',  () => prevBtn.onclick());
    this.input.keyboard.on('keydown-RIGHT', () => nextBtn.onclick());

    update();
  }
}