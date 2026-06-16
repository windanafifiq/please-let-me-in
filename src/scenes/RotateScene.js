// RotateScene.js — Sambutan "putar perangkat" untuk pemain di layar portrait (HP).
import { t } from '../i18n.js';

export default class RotateScene extends Phaser.Scene {
  constructor() { super('RotateScene'); }
 
  preload() {
    this.load.audio('sfx-click', [
      'assets/music/click-sfx.ogg',
      'assets/music/click-sfx.mp3',
      'assets/music/click-sfx.wav'
    ]);
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(250);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0810, 1);
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a1228, 0.4);
    this.mountDom();
    this.time.delayedCall(4500, () => this.proceed());
  }

  mountDom() {
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="rotate-screen">
        <div class="rotate-card">
          <div class="rotate-icon" aria-hidden="true">
            <div class="rot-phone"></div>
          </div>
          <div class="rotate-title">${t('rotate.title')}</div>
          <div class="rotate-sub">${t('rotate.sub')}</div>
          <div class="rotate-dots"><span></span><span></span><span></span></div>
          <div class="rotate-note">${t('rotate.note')}</div>
        </div>
      </div>
    `;
  }

  proceed() {
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
    this.cameras.main.fadeOut(300, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('WarningScene'));
  }
}