// EndScene.js — 2 ending: menang (dengan outro cerita) / kalah. + rekap keputusan.
export default class EndScene extends Phaser.Scene {
  constructor() { super('EndScene'); }
  init(data) { this.ending = data.ending; this.story = data.story; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(500);
    const bg = 'bg-plain';
    this.add.image(W / 2, H / 2, bg).setDisplaySize(W, H).setAlpha(0.55);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, this.ending.win ? 0.5 : 0.66);
    this.mountUI();
  }

  mountUI() {
    const e = this.ending;
    const root = document.getElementById('ui-root');
    root.innerHTML = ''; root.style.pointerEvents = 'auto';

    const recap = e.decisions.map((d) => {
      const v = this.story.visitors[d.id];
      const verdictWord = d.verdict === 'accept' ? 'Terima' : 'Tolak';
      const condWord = d.health === 'terinfeksi' ? 'Terinfeksi' : 'Sehat';
      return `<div class="recap-row ${d.correct ? 'ok' : 'bad'}">
        <div class="recap-av" style="--c:${v.color}">${v.name[0]}</div>
        <div class="recap-info"><div class="recap-name">${v.name}</div>
        <div class="recap-meta">Kau <b>${verdictWord}</b> · sebenarnya <b class="cond-${d.health}">${condWord}</b></div></div>
        <div class="recap-judge">${d.correct ? '✓' : '✕'}</div></div>`;
    }).join('');

    const outroHtml = e.win && e.outro
      ? `<div class="outro">${e.outro.split('\n\n').map((p) => `<p>${p}</p>`).join('')}</div>`
      : '';

    root.innerHTML = `
      <div class="end-screen">
        <div class="end-badge ${e.win ? 'win' : 'lose'}">${e.win ? '✓ SELAMAT' : '✕ GAGAL'}</div>
        <h1 class="end-title">${e.title}</h1>
        <p class="end-summary">${e.summary}</p>
        ${outroHtml}
        <div class="end-stats">
          <span><b>${e.correct}</b>/${e.total} penilaian benar</span>
          <span><b>${e.infections}</b> wabah lolos</span>
        </div>
        <div class="recap-label">REKAP KEPUTUSAN</div>
        <div class="recap">${recap}</div>
        <button class="end-btn" id="end-restart">KEMBALI KE MENU</button>
      </div>`;

    document.getElementById('end-restart').onclick = () => {
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    };
  }
}
