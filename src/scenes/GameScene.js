// GameScene.js — alur wawancara VN dengan save/continue + 2 ending.
import { Story } from '../engine/story.js';
import { VERDICT } from '../engine/interview.js';
import { SaveManager } from '../engine/save.js';
import { UI } from '../ui.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  init(data) { this.initData = data || {}; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(400);

    // muat game: lanjutkan dari save, atau baru
    if (this.initData.continue) {
      const data = SaveManager.load();
      this.story = data ? Story.deserialize(data) : new Story(Date.now(), 'Penjaga');
    } else {
      this.story = new Story(Date.now(), this.initData.playerName || 'Penjaga');
      this.story.pushLog('Hari pertama. Lift mati, koridor dikunci. Hanya kau yang menjaga pintu.', 'info');
    }

    const hasDoor = this.registry.get('hasDoorPhoto');
    this.bg = this.add.image(W / 2, H / 2, hasDoor ? 'photo-door' : 'bg-door')
      .setDisplaySize(W, H).setAlpha(hasDoor ? 0.6 : 0.85);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.32);
    this.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W }, y: { min: 0, max: H }, lifespan: 7000,
      speedY: { min: -6, max: -14 }, scale: { start: 0.4, end: 0 },
      alpha: { start: 0.14, end: 0 }, frequency: 560, tint: 0xe8c468,
    });

    UI.mount(this);
    this.autosave();
    this.beginInterview();
  }

  autosave() {
    if (!this.story.finished) SaveManager.save(this.story.serialize());
  }

  beginInterview() {
    const iv = this.story.nextInterview();
    if (!iv) { this.endDay(); return; }
    this.interview = iv;
    UI.showVisitor(this, iv.visitor);
    UI.render(this);
  }

  doAction(action) {
    if (!this.interview || this.interview.resolved) return;
    if (this.interview.isLocked()) { UI.toast('Ia menolak bicara. Putuskan sekarang.'); return; }
    const result = this.interview.act(action);
    if (!result) return;
    UI.showLine(this, action, result);
    if (result.transition.reaction === 'rebelled') this.cameras.main.shake(180, 0.004);
  }

  decide(verdict) {
    if (!this.interview || this.interview.resolved) return;
    this.story.resolveCurrent(verdict);
    this.autosave();
    // Tidak ada kartu hasil benar/salah — langsung lanjut, jaga misteri.
    // Transisi singkat "pintu" agar terasa ada konsekuensi tanpa membocorkan.
    UI.showVerdictFlash(this, verdict, () => {
      if (this.story.hasMoreToday()) this.beginInterview();
      else this.endDay();
    });
  }

  endDay() {
    // Jika sepanjang hari ini ada yang terinfeksi diloloskan → wabah pecah semalam.
    if (this.story.isLost()) {
      this.autosave();
      UI.showOutbreakCard(this, this.story.day, () => this.finish());
      return;
    }
    const more = this.story.advanceDay();
    this.autosave();
    if (!more) { this.finish(); return; }
    UI.showDayCard(this, this.story.day, this.story.building.description(), () => this.beginInterview());
  }

  finish() {
    this.story.finished = true;
    SaveManager.clear(); // selesai → hapus save
    const ending = this.story.computeEnding();
    UI.unmount();
    this.cameras.main.fadeOut(500, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('EndScene', { ending, story: this.story });
    });
  }
}
