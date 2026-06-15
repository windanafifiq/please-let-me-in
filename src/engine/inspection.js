// inspection.js
// Mesin pemeriksaan satu pengunjung — menyatukan 4 FSM:
//   HealthFSM (kebenaran tersembunyi) · AksesFSM (penghalang) ·
//   PemeriksaanFSM (per gejala) · VerdictFSM (keputusan).
//
// Menggantikan interview.js lama (sistem desak/resolve dibuang).

import { HealthFSM } from '../fsm/HealthFSM.js';
import { AksesFSM } from '../fsm/AksesFSM.js';
import { PemeriksaanFSM, PERIKSA } from '../fsm/PemeriksaanFSM.js';
import { VerdictFSM, VERDICT } from '../fsm/VerdictFSM.js';
import { EXAM_TYPES } from '../data/visitors.js';

export { VERDICT };

export class Inspection {
  constructor(visitor) {
    this.visitor = visitor;

    // 1) FSM kesehatan tersembunyi (kebenaran)
    this.health = new HealthFSM(visitor.health);

    // 2) FSM penghalang (satu per barrier), DIBUKA BERURUTAN sesuai data.
    this.barrierOrder = (visitor.barriers || []).map((b) => b.id);
    this.barrierStage = {};   // id → nama stage gambar setelah dibuka
    this.barriers = {};
    (visitor.barriers || []).forEach((b) => {
      this.barriers[b.id] = new AksesFSM(b.id, b.label);
      this.barrierStage[b.id] = b.stage || 'open';
    });
    this.openedCount = 0;     // berapa penghalang sudah dibuka (untuk urutan)
    this.stage = 'full';      // nama gambar tahap saat ini

    // 3) FSM pemeriksaan (satu per jenis exam yang punya data di visitor)
    this.exams = {};
    EXAM_TYPES.forEach((t) => {
      const data = visitor.exams && visitor.exams[t.id];
      if (data) {
        this.exams[t.id] = new PemeriksaanFSM(t.id, t.label, data.gatedBy || null);
      }
    });

    // 4) FSM keputusan
    this.verdict = new VerdictFSM();

    this.log = [];          // catatan pemeriksaan { id, label, value, note }
    this.resolved = false;
  }

  // ---- Penghalang ----
  // Penghalang BERIKUTNYA yang harus dibuka (urutan wajib). Hanya satu —
  // pemain buka satu per satu sesuai urutan supaya gambar tahap selalu cocok.
  // Kembalikan array (0 atau 1 item) agar UI lama tetap kompatibel.
  closedBarriers() {
    if (this.openedCount >= this.barrierOrder.length) return [];
    const nextId = this.barrierOrder[this.openedCount];
    const b = this.barriers[nextId];
    return b && !b.isOpen() ? [b] : [];
  }

  openBarrier(id) {
    // hanya boleh buka penghalang berikutnya dalam urutan
    const expectedId = this.barrierOrder[this.openedCount];
    if (id !== expectedId) return null;     // bukan giliran penghalang ini
    const b = this.barriers[id];
    if (!b) return null;
    const r = b.open();
    if (r.changed) {
      this.openedCount += 1;
      this.stage = this.barrierStage[id] || 'open';   // update gambar tahap
    }
    return { id, label: b.label, changed: r.changed, stage: this.stage };
  }

  // Apakah sebuah pemeriksaan terkunci penghalang yang belum dibuka?
  isExamLocked(examId) {
    const ex = this.exams[examId];
    if (!ex || !ex.gatedBy) return false;
    const gate = this.barriers[ex.gatedBy];
    return gate ? !gate.isOpen() : false;
  }

  // ---- Pemeriksaan ----
  // Lakukan pemeriksaan. Jika terkunci penghalang, kembalikan info itu.
  examine(examId) {
    const ex = this.exams[examId];
    if (!ex) return null;

    if (this.isExamLocked(examId)) {
      const gate = this.barriers[ex.gatedBy];
      return { locked: true, gate: { id: gate.id, label: gate.label }, examLabel: ex.label };
    }

    const data = this.visitor.exams[examId];
    ex.examine({ value: data.value, note: data.note || null });

    const entry = { id: examId, label: ex.label, value: data.value, note: data.note || null };
    // hindari duplikat di log
    if (!this.log.find((e) => e.id === examId)) this.log.push(entry);

    return { locked: false, entry };
  }

  examinedCount() {
    return Object.values(this.exams).filter((e) => e.isDone()).length;
  }
  totalExams() {
    return Object.keys(this.exams).length;
  }

  // Nama gambar tahap saat ini (full / nomask / arm / open / dst).
  // Untuk visitor tanpa penghalang, langsung 'open'.
  currentStage() {
    if (this.barrierOrder.length === 0) return 'open';
    return this.stage;
  }

  // ---- Keputusan ----
  decide(verdict) {
    if (this.resolved) return null;
    const shouldReject = this.health.shouldBeRejected();
    const r = this.verdict.decide(verdict, shouldReject);
    this.resolved = true;
    return {
      verdict: r.verdict,
      correct: r.correct,
      dangerous: this.verdict.isDangerousMistake(shouldReject),
      health: this.health.state,
    };
  }

  // Untuk rekap ending.
  summary() {
    return {
      id: this.visitor.id,
      name: this.visitor.name,
      health: this.health.state,
      verdict: this.verdict.verdict,
      correct: this.verdict.correct,
    };
  }
}