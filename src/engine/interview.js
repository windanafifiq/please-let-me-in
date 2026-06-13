// interview.js
// Mesin wawancara — menggerakkan DemeanorFSM tiap orang dan mengungkap
// petunjuk (tell) berdasarkan state sikap. Inti gameplay observation-duty.
// Tidak ada kuota: pemain bertanya/mendesak bebas sampai memutuskan.

import { DemeanorFSM, INPUT, DEMEANOR } from '../fsm/DemeanorFSM.js';
import { HealthFSM, HEALTH } from '../fsm/HealthFSM.js';
import { ACTION_INPUT, SIGNAL } from '../data/visitors.js';

function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const VERDICT = { ACCEPT: 'accept', REJECT: 'reject' };

export class Interview {
  constructor(visitor, rng) {
    this.visitor = visitor;
    this.rng = rng || Math.random;
    this.demeanor = new DemeanorFSM(visitor.demeanor || {});
    // FSM kesehatan tersembunyi (untuk orang yg nanti diterima, dipakai lagi)
    this.health = new HealthFSM(
      visitor.health === 'terinfeksi' ? HEALTH.TERPAPAR : HEALTH.SEHAT
    );
    this.transcript = [];     // { speaker, text }
    this.clues = [];          // { action, note, signal }
    this.usedActions = new Set();
    this.resolved = false;
    this.outcome = null;
  }

  // Aksi yang masih relevan ditampilkan (left rebellious -> percakapan terkunci).
  isLocked() { return this.demeanor.isEnd() && this.demeanor.state === DEMEANOR.MEMBERONTAK; }

  /**
   * Jalankan satu aksi wawancara. Mengembalikan paket untuk UI:
   * { line, transition, clue }
   */
  act(action) {
    if (this.resolved) return null;
    const v = this.visitor;
    const inputType = ACTION_INPUT[action] || INPUT.PROBE;

    // 1) Gerakkan FSM sikap
    const before = this.demeanor.state;
    const tr = this.demeanor.apply(inputType);
    const stateNow = this.demeanor.state;

    // 2) Pilih baris dialog sesuai state (fallback ke default)
    const lineSet = (v.lines && v.lines[action]) || null;
    let text = null;
    if (lineSet) {
      text = lineSet[stateNow] || lineSet[before] || lineSet.default || null;
    }
    if (!text) {
      // generic fallback agar tetap ada respon
      if (tr.reaction === 'rebelled') text = '(Ia menolak menjawab dan berbalik pergi.)';
      else text = '(Tidak ada jawaban berarti.)';
    }

    this.transcript.push({ speaker: v.name, text, action });
    this.usedActions.add(action);

    // 3) Ungkap tell jika syarat state terpenuhi
    let clue = null;
    const tellDef = v.tells && v.tells[action];
    if (tellDef) {
      const stateOk = !tellDef.whenState || tellDef.whenState === stateNow;
      if (stateOk) {
        // info bisa terdistorsi jika sikap memberontak (tapi di sini fokus state)
        clue = { action, note: tellDef.note, signal: tellDef.signal };
        // hindari duplikat tell yang sama
        if (!this.clues.find((c) => c.action === action)) this.clues.push(clue);
      }
    }

    return {
      line: { speaker: v.name, text },
      transition: { from: before, to: stateNow, changed: tr.changed, reaction: tr.reaction },
      demeanorLabel: this.demeanor.label(),
      clue,
      locked: this.isLocked(),
    };
  }

  // Ringkasan sinyal yang sudah terkumpul.
  tally() {
    let suspect = 0, clean = 0, neutral = 0;
    for (const c of this.clues) {
      if (c.signal === SIGNAL.SUSPECT) suspect++;
      else if (c.signal === SIGNAL.CLEAN) clean++;
      else neutral++;
    }
    return { suspect, clean, neutral, total: this.clues.length };
  }

  decide(verdict) {
    if (this.resolved) return this.outcome;
    this.resolved = true;
    const v = this.visitor;
    const accepted = verdict === VERDICT.ACCEPT;
    const cons = accepted ? v.onAccept : v.onReject;

    const dangerous = v.health === 'terinfeksi' || !!(v.onAccept && v.onAccept.looting);
    const correct = accepted ? !dangerous : dangerous;

    let infectionHappened = false;
    // Menerima orang terinfeksi = wabah PASTI masuk (deterministik, adil).
    if (accepted && v.health === 'terinfeksi') {
      infectionHappened = true;
    }

    this.outcome = {
      verdict, accepted, correct,
      health: v.health,
      infectionHappened,
      looting: !!(cons.looting && accepted),
      trustDelta: cons.trust || 0,
      log: cons.log,
      truth: accepted ? v.truthAccept : v.truthReject,
    };
    return this.outcome;
  }
}

export { makeRng };
