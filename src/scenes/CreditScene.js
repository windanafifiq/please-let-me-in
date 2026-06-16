// CreditScene.js — bilingual
import { t } from '../i18n.js';

export default class CreditScene extends Phaser.Scene {
  constructor() { super('CreditScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(360);

    const bgm = this.sound.get('bgm-main');
    if (bgm && !bgm.isPlaying) bgm.play();

    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.6);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.55);

    const makers = [
      { role: t('credit.role1'), name: 'Winda Nafiqih Irawan', nrp: 'NRP 5025231065', email: 'windaforkwork@gmail.com', photo: 'credit-maker1' },
      { role: t('credit.role2'), name: 'Miskiyah', nrp: 'NRP 5025231119', email: 'ayamiskiyah46@gmail.com', photo: 'credit-maker2' },
    ];
    const lecturer = {
      role: t('credit.roleLec'),
      name: 'Imam Kuswardayan, S.Kom., MT.',
      email: 'imam@its.ac.id',
      photo: 'credit-lecturer',
    };

    const photoUrl = (key) => this.textures.exists(key) ? this.textures.getBase64(key) : null;

    const card = (p, showNrp) => {
      const url = photoUrl(p.photo);
      const avatar = url
        ? `<div class="cr-photo" style="background:center/cover no-repeat url(${url})"></div>`
        : `<div class="cr-photo cr-ph">${p.name[0]}</div>`;
      return `
        <div class="cr-card">
          <div class="cr-role">${p.role}</div>
          ${avatar}
          <div class="cr-name">${p.name}</div>
          ${showNrp ? `<div class="cr-nrp">${p.nrp}</div>` : ''}
          <div class="cr-email">${p.email}</div>
        </div>`;
    };

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="credit-screen">
        <div class="credit-head">${t('credit.head')}</div>
        <div class="credit-task">${t('credit.task')}</div>
        <div class="credit-grid">
          ${card(makers[0], true)}
          ${card(makers[1], true)}
          ${card(lecturer, false)}
        </div>
        <button id="credit-back" class="credit-btn">${t('credit.back')}</button>
      </div>`;

    document.getElementById('credit-back').onclick = () => {
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(320);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    };
  }
}