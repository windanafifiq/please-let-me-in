// DemeanorFSM.js
// FSM Sikap NPC saat diwawancara — INTI gameplay observation-duty.
//
//   tenang  ──(tekanan)──►  defensif  ──(minta bukti)──►  mengelak
//      ▲                        │                            │
//      │                   (didesak halus)            (didesak keras)
//      └────(diyakinkan)────────┘                            ▼
//                                                  membuka / memberontak
//
// Input dari pemain (pertanyaan/aksi) memicu transisi. State menentukan
// jawaban NPC DAN apakah "tell" (petunjuk kondisi) terungkap.

export const DEMEANOR = {
  TENANG: 'tenang',
  DEFENSIF: 'defensif',
  MENGELAK: 'mengelak',
  MEMBUKA: 'membuka',       // akhirnya jujur / menunjukkan bukti
  MEMBERONTAK: 'memberontak', // marah, menolak, bisa pergi
};

export const DEMEANOR_LABELS = {
  tenang: 'Tenang',
  defensif: 'Defensif',
  mengelak: 'Mengelak',
  membuka: 'Membuka diri',
  memberontak: 'Memberontak',
};

// Jenis input pemain yang memicu transisi.
export const INPUT = {
  PROBE: 'probe',       // pertanyaan/pemeriksaan biasa
  DEMAND: 'demand',     // mendesak menunjukkan bukti (KTP, lengan, dll)
  PRESS_SOFT: 'press_soft', // mendesak halus / menenangkan lalu menggali
  PRESS_HARD: 'press_hard', // mendesak keras / mengancam
  REASSURE: 'reassure', // menenangkan, menurunkan tensi
};

export class DemeanorFSM {
  /**
   * @param {object} cfg { start, patience, guardedness }
   *   patience: 0..100, makin rendah makin cepat memberontak saat ditekan
   *   guardedness: 0..100, makin tinggi makin mudah jatuh ke mengelak
   */
  constructor(cfg = {}) {
    this.state = cfg.start || DEMEANOR.TENANG;
    this.patience = cfg.patience ?? 60;
    this.tension = 0;             // 0..100 akumulasi tekanan
    this.history = [this.state];
    this.guardedness = cfg.guardedness ?? 40;
  }

  isEnd() {
    return this.state === DEMEANOR.MEMBUKA || this.state === DEMEANOR.MEMBERONTAK;
  }

  /**
   * Terapkan satu input pemain. Mengembalikan { state, changed, reaction }.
   * reaction: 'opened' | 'rebelled' | 'guarded' | 'calmed' | 'neutral'
   */
  apply(input) {
    if (this.isEnd()) return { state: this.state, changed: false, reaction: 'locked' };
    const prev = this.state;
    let reaction = 'neutral';

    // tension dynamics
    if (input === INPUT.PRESS_HARD || input === INPUT.DEMAND) this.tension += 30;
    else if (input === INPUT.PRESS_SOFT) this.tension += 12;
    else if (input === INPUT.PROBE) this.tension += 6;
    else if (input === INPUT.REASSURE) this.tension = Math.max(0, this.tension - 25);
    this.tension = Math.min(100, this.tension);

    switch (this.state) {
      case DEMEANOR.TENANG:
        if (input === INPUT.DEMAND) {
          // guarded people get evasive when asked for proof
          this.state = this.guardedness >= 55 ? DEMEANOR.MENGELAK : DEMEANOR.DEFENSIF;
          reaction = this.state === DEMEANOR.MENGELAK ? 'guarded' : 'neutral';
        } else if (input === INPUT.PRESS_HARD) {
          this.state = DEMEANOR.DEFENSIF; reaction = 'guarded';
        }
        break;

      case DEMEANOR.DEFENSIF:
        if (input === INPUT.REASSURE) {
          this.state = DEMEANOR.TENANG; reaction = 'calmed';
        } else if (input === INPUT.DEMAND) {
          this.state = this.guardedness >= 40 ? DEMEANOR.MENGELAK : DEMEANOR.MEMBUKA;
          reaction = this.state === DEMEANOR.MEMBUKA ? 'opened' : 'guarded';
        } else if (input === INPUT.PRESS_HARD) {
          this.state = DEMEANOR.MENGELAK; reaction = 'guarded';
        }
        break;

      case DEMEANOR.MENGELAK:
        if (input === INPUT.PRESS_SOFT) {
          // patient soft pressure can crack them open
          this.state = DEMEANOR.MEMBUKA; reaction = 'opened';
        } else if (input === INPUT.PRESS_HARD || input === INPUT.DEMAND) {
          // hard pressure on an evasive person: depends on patience vs tension
          if (this.tension > this.patience) {
            this.state = DEMEANOR.MEMBERONTAK; reaction = 'rebelled';
          } else {
            this.state = DEMEANOR.MEMBUKA; reaction = 'opened';
          }
        } else if (input === INPUT.REASSURE) {
          this.state = DEMEANOR.DEFENSIF; reaction = 'calmed';
        }
        break;
    }

    const changed = this.state !== prev;
    if (changed) this.history.push(this.state);
    return { state: this.state, changed, reaction };
  }

  label() { return DEMEANOR_LABELS[this.state]; }
}

// Petakan state sikap -> "bucket" ekspresi untuk foto karakter.
//   neutral: tenang, defensif
//   evade:   mengelak
//   emote:   membuka (lega/sedih) atau memberontak (marah)
export function demeanorToExpression(state) {
  switch (state) {
    case DEMEANOR.TENANG:
    case DEMEANOR.DEFENSIF: return 'neutral';
    case DEMEANOR.MENGELAK: return 'evade';
    case DEMEANOR.MEMBUKA:
    case DEMEANOR.MEMBERONTAK: return 'emote';
    default: return 'neutral';
  }
}
