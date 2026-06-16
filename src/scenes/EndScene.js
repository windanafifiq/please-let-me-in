// EndScene.js — 2 ending bilingual
import { t } from '../i18n.js';

export default class EndScene extends Phaser.Scene {
  constructor() { super('EndScene'); }
  init(data) { this.ending = data.ending; this.story = data.story; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(500);
    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.55);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, this.ending.win ? 0.5 : 0.66);

    // stop dulu semua BGM yang mungkin masih jalan, biar tidak numpuk
    this.sound.stopByKey('bgm-game');
    this.sound.stopByKey('bgm-good');

    if (this.ending.secret) {
      this.sound.play('secret-bgm', { loop: true, volume: 0.4 });
    } else if (this.ending.win) {
      this.sound.play('bgm-good', { loop: true, volume: 0.4 });
    } else {
      const bgm = this.sound.get('bgm-game');
      if (bgm && !bgm.isPlaying) bgm.play();
    }

    this.mountUI();
  }

  mountUI() {
    const e = this.ending;
    const root = document.getElementById('ui-root');
    root.innerHTML = ''; root.style.pointerEvents = 'auto';

    const recap = e.decisions.map((d) => {
      const v = this.story.visitorsById[d.id];
      const verdictWord = d.verdict === 'accept' ? t('end.verdict.accept') : t('end.verdict.reject');
      const condWord = d.health === 'cacar' ? t('end.cond.infected') : t('end.cond.safe');
      const condCls = d.health === 'cacar' ? 'cond-terinfeksi' : 'cond-sehat';
      return `<div class="recap-row ${d.correct ? 'ok' : 'bad'}">
        <div class="recap-av" style="--c:${v ? v.color : '#888'}">${d.name[0]}</div>
        <div class="recap-info"><div class="recap-name">${d.name}</div>
        <div class="recap-meta">${t('end.meta.you')} <b>${verdictWord}</b> · ${t('end.meta.actually')} <b class="${condCls}">${condWord}</b></div></div>
        <div class="recap-judge">${d.correct ? '✓' : '✕'}</div></div>`;
    }).join('');

    const outroHtml = e.outro
      ? `<div class="outro">${e.outro.split('\n\n').map((p) => `<p>${p}</p>`).join('')}</div>`
      : '';

    root.innerHTML = `
      <div class="end-screen">
        <div class="end-badge ${e.win ? 'win' : 'lose'}">${e.win ? t('end.win') : t('end.lose')}</div>
        <h1 class="end-title">${e.title}</h1>
        <p class="end-summary">${e.summary}</p>
        ${outroHtml}
        <div class="end-stats">
          <span><b>${e.correct}</b>/${e.total} ${t('end.stats.correct')}</span>
          <span><b>${e.leaked}</b> ${t('end.stats.leaked')}</span>
        </div>
        <div class="recap-label">${t('end.recap.label')}</div>
        <div class="recap">${recap}</div>
        <button class="end-btn" id="end-restart">${t('end.back')}</button>
      </div>`;

    document.getElementById('end-restart').onclick = () => {
      this.sound.stopByKey('bgm-game');
      this.sound.stopByKey('bgm-good');
      this.sound.stopByKey('secret-bgm');
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    };
  }
}