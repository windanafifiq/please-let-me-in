// IntroScene.js — cerita pembuka (konten narasi tetap ID, tombol bilingual).
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

    root.innerHTML = `
      <div class="intro-screen" id="intro-screen">
        <div class="intro-body" id="intro-body"></div>
        <button id="intro-next" class="intro-btn">${t('intro.next')}</button>
        <div class="intro-skip-hint" id="intro-skip-hint">${t('intro.skipHint') || 'Klik untuk lewati animasi'}</div>
      </div>
    `;

    const screen = document.getElementById('intro-screen');
    const body = document.getElementById('intro-body');
    const nextBtn = document.getElementById('intro-next');
    const skipHint = document.getElementById('intro-skip-hint');
    let currentPage = 0;

    // ── state animasi ──────────────────────────────
    this._revealing = false;       // true selama teks lagi muncul satu-satu
    this._pendingTimer = null;     // simpan delayedCall biar bisa dibatalkan

    const renderPage = () => {
      body.innerHTML = '';
      this._revealing = true;
      if (skipHint) skipHint.style.opacity = '1';
      let i = 0;

      const showNext = () => {
        if (i >= pages[currentPage].length) {
          this._revealing = false;
          if (skipHint) skipHint.style.opacity = '0';
          return;
        }
        const p = document.createElement('p');
        p.className = 'intro-p' + (i === 0 ? ' intro-stamp' : '');
        p.textContent = pages[currentPage][i];
        body.appendChild(p);
        setTimeout(() => {
          p.classList.add('show');
          p.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 50);
        i++;
        if (i < pages[currentPage].length) {
          this._pendingTimer = this.time.delayedCall(850, showNext);
        } else {
          this._revealing = false;
          if (skipHint) skipHint.style.opacity = '0';
        }
      };
      showNext();

      nextBtn.textContent = currentPage === pages.length - 1
        ? t('intro.start')
        : t('intro.next');
    };

    // ── SKIP: tampilkan semua teks halaman ini sekaligus ──
    const skipReveal = () => {
      if (!this._revealing) return;
      if (this._pendingTimer) { this._pendingTimer.remove(false); this._pendingTimer = null; }
      // render ulang seluruh halaman langsung tampil penuh
      body.innerHTML = '';
      for (let j = 0; j < pages[currentPage].length; j++) {
        const p = document.createElement('p');
        p.className = 'intro-p show' + (j === 0 ? ' intro-stamp' : '');
        p.textContent = pages[currentPage][j];
        body.appendChild(p);
      }
      body.lastChild?.scrollIntoView({ behavior: 'auto', block: 'end' });
      this._revealing = false;
      if (skipHint) skipHint.style.opacity = '0';
    };

    // klik area kosong (bukan tombol) → skip animasi
    screen.addEventListener('click', (e) => {
      if (e.target === nextBtn) return;   // tombol Next biar jalan normal
      skipReveal();
    });

    renderPage();

    nextBtn.onclick = () => {
      // kalau masih animasi, klik Next pertama = skip dulu, bukan langsung pindah
      if (this._revealing) { skipReveal(); return; }

      currentPage++;
      if (currentPage >= pages.length) {
        root.innerHTML = '';
        root.style.pointerEvents = 'none';
        this.cameras.main.fadeOut(420, 5, 6, 10);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('GameScene', { newGame: true, playerName: name });
        });
        return;
      }
      renderPage();
    };
  }
}