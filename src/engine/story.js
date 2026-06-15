// story.js
// Engine alur 1 hari: antri 6 pengunjung, kumpulkan keputusan, hitung ending.
// Ending: SEMUA benar → good. ADA salah → bad (terutama meloloskan cacar).

import { Inspection, VERDICT } from './inspection.js';
import { getVisitors, DAY_SCHEDULE } from '../data/visitors.js';

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

    // kesalahan fatal: meloloskan cacar (verdict accept, health cacar)
    const leaked = this.decisions.filter(
      (d) => d.verdict === VERDICT.ACCEPT && d.health === 'cacar'
    ).length;
    // salah tolak orang sehat
    const wrongReject = this.decisions.filter(
      (d) => d.verdict === VERDICT.REJECT && d.health !== 'cacar'
    ).length;

    const win = wrong === 0;

    return {
      win,
      total,
      correct,
      wrong,
      leaked,
      wrongReject,
      title: win ? 'Gedung Selamat' : 'Wabah Menembus Pintu',
      summary: win
        ? 'Sepanjang shift, tidak ada satu pun kesalahan. Setiap orang sakit kau tahan, setiap orang sehat kau izinkan. Gedung aman malam ini.'
        : (leaked > 0
            ? `Kau meloloskan ${leaked} orang yang terinfeksi. Menjelang dini hari, gejala menyebar ke seluruh lantai.`
            : `Kau menolak ${wrongReject} orang yang sebenarnya sehat. Mereka terlantar di luar, dan kepercayaan pada penjaga runtuh.`),
      outro: win
        ? 'Fajar tiba. Koridor masih sunyi dan aman. Untuk hari ini, kau telah menjaga mereka semua.'
        : null,
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