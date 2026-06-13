// BuildingTrustFSM.js
// Dua FSM tingkat-gedung yang bereaksi terhadap keputusan pemain.

// ---------- FSM Kondisi Gedung ----------
//   normal → waspada → lockdown → chaos → evakuasi
export const BUILDING = {
  NORMAL: 'normal', WASPADA: 'waspada', LOCKDOWN: 'lockdown',
  CHAOS: 'chaos', EVAKUASI: 'evakuasi',
};
export const BUILDING_LABELS = {
  normal: 'Normal', waspada: 'Waspada', lockdown: 'Lockdown',
  chaos: 'Chaos', evakuasi: 'Evakuasi',
};
export const BUILDING_DESC = {
  normal: 'Koridor tenang. Penghuni masih percaya semua terkendali.',
  waspada: 'Kabar wabah menyebar. Orang mulai mengintip dari balik pintu.',
  lockdown: 'Semua unit dikunci. Tidak ada lalu-lalang antar lantai.',
  chaos: 'Teriakan dan gedoran. Ketertiban nyaris runtuh.',
  evakuasi: 'Tim luar tiba. Pintu evakuasi terbuka.',
};
const B_ORDER = [BUILDING.NORMAL, BUILDING.WASPADA, BUILDING.LOCKDOWN, BUILDING.CHAOS, BUILDING.EVAKUASI];

export class BuildingFSM {
  constructor() { this.state = BUILDING.NORMAL; this.tension = 0; this.history = [this.state]; }

  advance({ infections = 0, deaths = 0, hostiles = 0, day = 1, totalDays = 3 }) {
    this.tension += infections * 14 + deaths * 18 + hostiles * 10;
    this.tension = Math.max(0, Math.min(100, this.tension));
    const finalDay = day >= totalDays;

    let next;
    if (finalDay) next = BUILDING.EVAKUASI;
    else if (this.tension >= 78) next = BUILDING.CHAOS;
    else if (this.tension >= 50) next = BUILDING.LOCKDOWN;
    else if (this.tension >= 22) next = BUILDING.WASPADA;
    else next = BUILDING.NORMAL;

    // ratchet: jangan turun kecuali evakuasi
    if (!finalDay) {
      const ci = B_ORDER.indexOf(this.state), ni = B_ORDER.indexOf(next);
      if (ni < ci) next = this.state;
    }
    if (next !== this.state) { this.state = next; this.history.push(next); }
    return this.state;
  }

  label() { return BUILDING_LABELS[this.state]; }
  description() { return BUILDING_DESC[this.state]; }
}

// ---------- FSM Kepercayaan Gedung ----------
//   kooperatif → ragu → panik → hostile  (bisa balik via penanganan baik)
export const TRUST = {
  KOOPERATIF: 'kooperatif', RAGU: 'ragu', PANIK: 'panik', HOSTILE: 'hostile',
};
export const TRUST_LABELS = {
  kooperatif: 'Kooperatif', ragu: 'Ragu', panik: 'Panik', hostile: 'Hostile',
};

export class TrustFSM {
  constructor(start = 60) {
    this.value = start; // 0..100
    this.state = TRUST.KOOPERATIF;
    this.history = [this.state];
    this.resolve();
  }

  change(delta) { this.value = Math.max(0, Math.min(100, this.value + delta)); this.resolve(); }

  resolve() {
    const prev = this.state;
    let next;
    if (this.value >= 55) next = TRUST.KOOPERATIF;
    else if (this.value >= 32) next = TRUST.RAGU;
    else if (this.value >= 14) next = TRUST.PANIK;
    else next = TRUST.HOSTILE;
    this.state = next;
    if (prev !== next && this.history) this.history.push(next);
    return next;
  }

  // State kepercayaan memengaruhi keandalan info NPC saat wawancara.
  infoReliability() {
    switch (this.state) {
      case TRUST.KOOPERATIF: return 1.0;   // info akurat
      case TRUST.RAGU: return 0.85;
      case TRUST.PANIK: return 0.6;         // mulai sebar info keliru
      case TRUST.HOSTILE: return 0.35;      // sering bohong/menyesatkan
      default: return 1.0;
    }
  }

  label() { return TRUST_LABELS[this.state]; }
}
