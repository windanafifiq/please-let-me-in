// WarningScene.js — Peringatan kilatan cahaya (photosensitivity / epilepsy).
// Klik konsisten berbunyi di setiap refresh; tidak menyentuh AudioContext
// sebelum gesture user, sehingga tidak memicu warning autoplay dari kode kita.
import { t } from '../i18n.js';

export default class WarningScene extends Phaser.Scene {
  constructor() { super('WarningScene'); }

  preload() {
    // WarningScene adalah scene pertama, jadi sfx-click di-load di sini.
    // Guard mencegah register ganda saat scene restart atau BootScene punya key sama.
    if (!this.cache.audio.exists('sfx-click')) {
      this.load.audio('sfx-click', [
        'assets/music/click-sfx.ogg',
        'assets/music/click-sfx.mp3',
        'assets/music/click-sfx.wav'
      ]);
    }
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(300);
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 1);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a0f, 0.6);

    this._proceeding = false;
    // ⚠️ Sengaja TIDAK menyentuh this.sound di sini.
    // Menyentuh audio sebelum gesture user-lah yang memicu warning autoplay.
    this.mountDom();
  }

  mountDom() {
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="warn-screen">
        <div class="warn-card">
          <div class="warn-ico">${t('warn.ico')}</div>
          <div class="warn-title">${t('warn.title')}</div>
          <div class="warn-body">
            <p>${t('warn.p1')}</p>
            <p>${t('warn.p2')}</p>
          </div>
          <button class="warn-btn" id="warn-next">${t('warn.btn')}</button>
        </div>
      </div>
    `;
    document.getElementById('warn-next').onclick = () => this.proceed();
  }

  proceed() {
    if (this._proceeding) return;          // cegah double-click
    this._proceeding = true;

    const root = document.getElementById('ui-root');
    if (root) root.style.pointerEvents = 'none';

    let advanced = false;
    const go = () => {
      if (advanced) return;
      advanced = true;
      if (root) root.innerHTML = '';
      this.cameras.main.fadeOut(350, 5, 6, 10);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('BootScene'));
    };

    // Semua aktivitas audio terjadi DI DALAM gesture user (klik tombol).
    // Resume di sini diizinkan browser → tidak ada warning, suara berbunyi.
    const playClick = () => {
      try {
        const click = this.sound.add('sfx-click', { volume: 0.6 });
        click.once('complete', go);        // lanjut setelah klik selesai (tidak kepotong)
        click.play();
        this.time.delayedCall(600, go);    // jaring pengaman bila 'complete' tak terpanggil
      } catch (e) {
        go();                              // kalau audio gagal, tetap lanjut
      }
    };

    const ctx = this.sound.context;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(playClick).catch(go);
    } else {
      playClick();
    }
  }
}