// GameScene.js — alur PEMERIKSAAN GEJALA (1 hari, 6 pengunjung) + 2 ending.
import { Story } from '../engine/story.js';
import { VERDICT } from '../engine/inspection.js';
import { SaveManager } from '../engine/save.js';
import { UI } from '../ui.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  init(data) { this.initData = data || {}; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(400);

    // Pastikan BGM game (bg-2) tetap jalan
    const bgm = this.sound.get('bgm-game');
    if (bgm && !bgm.isPlaying) bgm.play();
    else if (!bgm) {
      this.sound.play('bgm-game', { loop: true, volume: 0.35 });
    }

    if (this.initData.continue) {
      const data = SaveManager.load();
      this.story = data ? Story.deserialize(data) : new Story(Date.now(), 'Penjaga');
    } else {
      this.story = new Story(Date.now(), this.initData.playerName || 'Penjaga');
    }

    // background pintu (statis — tak ada lagi BuildingFSM)
    const bgTexture = this.textures.exists('photo-door') ? 'photo-door' : 'bg-plain';
    this.bg = this.add.image(W / 2, H / 2, bgTexture).setDisplaySize(W, H).setAlpha(0.85);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.32);
    this.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W }, y: { min: 0, max: H }, lifespan: 7000,
      speedY: { min: -6, max: -14 }, scale: { start: 0.4, end: 0 },
      alpha: { start: 0.14, end: 0 }, frequency: 560, tint: 0xe8c468,
    });

    UI.mount(this);
    this.autosave();
    this.beginInspection();
  }

  autosave() {
    if (!this.story.finished) SaveManager.save(this.story.serialize());
  }

  beginInspection() {
    const insp = this.story.nextInspection();
    if (!insp) { this.finish(); return; }
    this.inspection = insp;
    UI.showVisitor(this, insp.visitor);
    UI.render(this);
  }

  // Pemain klik menu pemeriksaan (suhu/ruam/mata/dll)
  doExamine(examId) {
    if (!this.inspection || this.inspection.resolved) return;
    const result = this.inspection.examine(examId);
    if (!result) return;
    UI.showExam(this, examId, result);
  }

  // Pemain klik "minta buka penghalang"
  doOpenBarrier(barrierId) {
    if (!this.inspection || this.inspection.resolved) return;
    const r = this.inspection.openBarrier(barrierId);
    if (r && r.changed) UI.showBarrierOpened(this, barrierId);
  }

  decide(verdict) {
    if (!this.inspection || this.inspection.resolved) return;
    this.story.resolveCurrent(verdict);
    this.autosave();
    UI.showVerdictFlash(this, verdict, () => {
      if (this.story.hasMore()) this.beginInspection();
      else this.finish();
    });
  }

  finish() {
    this.story.finished = true;
    SaveManager.clear();
    const ending = this.story.computeEnding();
    UI.unmount();
    this.cameras.main.fadeOut(500, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('EndScene', { ending, story: this.story });
    });
  }
}
