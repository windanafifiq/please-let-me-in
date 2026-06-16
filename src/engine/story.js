// story.js
// Engine alur 1 hari: antri 6 pengunjung, kumpulkan keputusan, hitung ending.
// Ending: SEMUA benar → good. ADA salah → bad (terutama meloloskan cacar).

import { Inspection, VERDICT } from './inspection.js';
import { getVisitors, DAY_SCHEDULE } from '../data/visitors.js';
import { t } from '../i18n.js';

export { VERDICT };

export class Story {
  constructor(seed = Date.now(), playerName = 'Penjaga') {
    this.playerName = playerName;
    this.seed = seed;
    this.queue = [...DAY_SCHEDULE];     // id visitor berurutan
    this.index = 0;
    this.decisions = [];                // { id, name, health, verdict, correct }
    this.visitorsById = {};
    getVisitors().forEach((v) => { this.visitorsById[v.id] = v; });
    this.current = null;
    this.finished = false;
  }

  // Mulai pemeriksaan visitor berikutnya. null jika habis.
  nextInspection() {
    if (this.index >= this.queue.length) return null;
    const id = this.queue[this.index];
    const visitor = this.visitorsById[id];
    this.current = new Inspection(visitor);
    return this.current;
  }

  hasMore() { return this.index < this.queue.length; }

  // Selesaikan keputusan visitor saat ini, simpan hasilnya.
  resolveCurrent(verdict) {
    if (!this.current) return null;
    const r = this.current.decide(verdict);
    this.decisions.push(this.current.summary());
    this.index += 1;
    return r;
  }

  // Hitung ending dari semua keputusan.
  computeEnding() {
    const total = this.decisions.length;
    const correct = this.decisions.filter((d) => d.correct).length;
    const wrong = total - correct;

    const leaked = this.decisions.filter(
      (d) => d.verdict === VERDICT.ACCEPT && d.health === 'cacar'
    ).length;

    const wrongReject = this.decisions.filter(
      (d) => d.verdict === VERDICT.REJECT && d.health !== 'cacar'
    ).length;

    let win = false;
    let title = '';
    let summary = '';
    let outro = '';

    // ===== PERFECT ENDING =====
    if (leaked === 0 && wrongReject === 0) {
      win = true;
      title = t('end.perfect.title');
      summary = t('end.perfect.summary');
      outro = t('end.perfect.outro');
    }

    // ===== WRONG REJECT ONLY =====
    else if (leaked === 0 && wrongReject > 0) {
      title = t('end.reject.title');
      summary = t('end.reject.summary').replace('{n}', wrongReject);
      outro = t('end.reject.outro');
    }

    // ===== LEAKED ONLY =====
    else if (leaked > 0 && wrongReject === 0) {
      title = t('end.leaked.title');
      summary = t('end.leaked.summary').replace('{n}', leaked);
      outro = t('end.leaked.outro');
    }

    // ===== WORST ENDING =====
    else {
      title = t('end.worst.title');
      summary = t('end.worst.summary').replace('{l}', leaked).replace('{r}', wrongReject);
      outro = t('end.worst.outro');
    }

    return {
      win,
      total,
      correct,
      wrong,
      leaked,
      wrongReject,
      title,
      summary,
      outro,
      decisions: this.decisions,
    };
  }

  // ---- Save/load ----
  serialize() {
    return {
      playerName: this.playerName,
      seed: this.seed,
      index: this.index,
      decisions: this.decisions,
      finished: this.finished,
    };
  }

  static deserialize(data) {
    const s = new Story(data.seed, data.playerName);
    s.index = data.index || 0;
    s.decisions = data.decisions || [];
    s.finished = !!data.finished;
    return s;
  }
}