// TutorialScene.js — "Cara Bermain" untuk sistem pemeriksaan gejala.
import { t } from '../i18n.js';

export default class TutorialScene extends Phaser.Scene {
  constructor() { super('TutorialScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(300);

    const bgm = this.sound.get('bgm-main');
    if (bgm && !bgm.isPlaying) bgm.play();

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
        <div class="tut-head">${t('tut.head')}</div>
        <div class="tut-scroll">

          <section class="tut-sec">
            <h3>${t('tut.goal.h')}</h3>
            <p>${t('tut.goal.p')}</p>
          </section>

          <section class="tut-sec">
            <h3>${t('tut.how.h')}</h3>
            <p>${t('tut.how.p')}</p>
          </section>

          <section class="tut-sec">
            <h3>${t('tut.barrier.h')}</h3>
            <p>${t('tut.barrier.p')}</p>
          </section>

          <section class="tut-sec tut-tip">
            <h3>${t('tut.vrs.h')}</h3>
            <p>${t('tut.vrs.p')}</p>
            <div class="tut-actions">
              <div class="tut-act"><span class="ico">🩹</span><div>${t('tut.vrs.rash')}<small>${t('tut.vrs.rash.note')}</small></div></div>
              <div class="tut-act"><span class="ico">🌡</span><div>${t('tut.vrs.fever')}<small>${t('tut.vrs.fever.note')}</small></div></div>
              <div class="tut-act"><span class="ico">➕</span><div>${t('tut.vrs.support')}<small>${t('tut.vrs.support.note')}</small></div></div>
            </div>
            <p style="margin-top:8px">${t('tut.vrs.rule')}</p>
          </section>

          <section class="tut-sec">
            <h3>${t('tut.trap.h')}</h3>
            <div class="tut-actions">
              <div class="tut-act"><span class="ico">💧</span><div>${t('tut.trap.heat')}<small>${t('tut.trap.heat.note')}</small></div></div>
              <div class="tut-act"><span class="ico">🩸</span><div>${t('tut.trap.bp')}<small>${t('tut.trap.bp.note')}</small></div></div>
              <div class="tut-act"><span class="ico">💉</span><div>${t('tut.trap.spot')}<small>${t('tut.trap.spot.note')}</small></div></div>
              <div class="tut-act"><span class="ico">👴</span><div>${t('tut.trap.bald')}<small>${t('tut.trap.bald.note')}</small></div></div>
            </div>
          </section>

          <section class="tut-sec tut-tip">
            <p>${t('tut.tip')}</p>
          </section>

        </div>
        <button class="tut-btn" id="tut-back">${t('tut.back')}</button>
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