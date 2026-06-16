// WarningScene.js — Peringatan kilatan cahaya (photosensitivity / epilepsy).
import { t } from '../i18n.js';

export default class WarningScene extends Phaser.Scene {
  constructor() { super('WarningScene'); }

  preload() {
    this.load.audio('sfx-click', 'assets/music/click-sfx.wav');
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(300);
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 1);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a0f, 0.6);
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
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
    this.cameras.main.fadeOut(350, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('BootScene'));
  }
}