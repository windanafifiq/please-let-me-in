// VerdictFSM.js
// FSM Keputusan — alur penilaian satu pengunjung sampai ke ending.
//
//   MEMERIKSA ──(terima)──► DITERIMA ──► (benar/salah dinilai) ──► SELESAI
//             ──(tolak)───► DITOLAK  ──► (benar/salah dinilai) ──► SELESAI
//
// Menggerakkan progres game: tiap visitor diputuskan, lalu dicocokkan dengan
// kebenaran HealthFSM. Akumulasi keputusan menentukan ending:
//   - SEMUA benar  → good ending
//   - ADA yang salah (terutama meloloskan cacar) → bad ending

export const VERDICT = {
  ACCEPT: 'accept',
  REJECT: 'reject',
};

export const VSTATE = {
  MEMERIKSA: 'memeriksa',   // sedang diperiksa, belum diputuskan
  DITERIMA: 'diterima',
  DITOLAK: 'ditolak',
  SELESAI: 'selesai',
};

export class VerdictFSM {
  constructor() {
    this.state = VSTATE.MEMERIKSA;
    this.verdict = null;     // 'accept' | 'reject'
    this.correct = null;     // true/false setelah dinilai
    this.history = [this.state];
  }

  isDecided() { return this.verdict !== null; }

  /**
   * Putuskan terima/tolak, lalu nilai benar/salah terhadap kebenaran kesehatan.
   * @param {string} verdict    VERDICT.ACCEPT | VERDICT.REJECT
   * @param {boolean} shouldReject  apakah orang ini SEHARUSNYA ditolak (cacar)
   * @returns { verdict, correct }
   */
  decide(verdict, shouldReject) {
    this.verdict = verdict;
    this.state = verdict === VERDICT.ACCEPT ? VSTATE.DITERIMA : VSTATE.DITOLAK;
    this.history.push(this.state);

    // benar jika: tolak orang yang harusnya ditolak, ATAU terima orang yang harusnya diterima
    const rejected = verdict === VERDICT.REJECT;
    this.correct = (rejected === shouldReject);

    this.state = VSTATE.SELESAI;
    this.history.push(this.state);
    return { verdict, correct: this.correct };
  }

  // Kesalahan paling fatal: meloloskan orang cacar (verdict accept, harusnya reject).
  isDangerousMistake(shouldReject) {
    return this.verdict === VERDICT.ACCEPT && shouldReject;
  }

  serialize() {
    return { state: this.state, verdict: this.verdict, correct: this.correct };
  }

  static deserialize(data) {
    const fsm = new VerdictFSM();
    fsm.state = data.state || VSTATE.MEMERIKSA;
    fsm.verdict = data.verdict || null;
    fsm.correct = data.correct;
    fsm.history = [fsm.state];
    return fsm;
  }
}
