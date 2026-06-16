// NameScene.js — input nama player (boleh kosong → default sesuai bahasa).
import { t } from '../i18n.js';

export default class NameScene extends Phaser.Scene {
  constructor() { super('NameScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(380);
    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.85);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.5);

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="name-screen">
        <div class="name-title">${t('name.title')}</div>
        <div class="name-sub">${t('name.sub')}</div>
        <input id="name-input" class="name-input" type="text" maxlength="18"
          placeholder="${t('name.placeholder')}" autocomplete="off" />
        <button id="name-go" class="name-btn">${t('name.btn')}</button>
      </div>`;

    const input = document.getElementById('name-input');
    setTimeout(() => input.focus(), 100);
    const go = () => {
      const name = (input.value || '').trim() || t('name.default');
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(380, 5, 6, 10);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('IntroScene', { playerName: name }));
    };
    document.getElementById('name-go').onclick = go;
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  }
}