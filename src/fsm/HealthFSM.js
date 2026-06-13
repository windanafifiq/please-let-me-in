// HealthFSM.js
// FSM Kesehatan tersembunyi setiap orang:
//   sehat → terpapar → bergejala → kritis → pulih / meninggal
// State ini TERSEMBUNYI dari pemain. Pemeriksaan hanya mengungkap PETUNJUK
// yang berkorelasi dengan state (ambigu). Untuk orang yang sudah diterima
// masuk gedung, FSM ini terus maju tiap hari (konsekuensi keputusan).

export const HEALTH = {
  SEHAT: 'sehat',
  TERPAPAR: 'terpapar',
  BERGEJALA: 'bergejala',
  KRITIS: 'kritis',
  PULIH: 'pulih',
  MENINGGAL: 'meninggal',
};

export const HEALTH_LABELS = {
  sehat: 'Sehat', terpapar: 'Terpapar', bergejala: 'Bergejala',
  kritis: 'Kritis', pulih: 'Pulih', meninggal: 'Meninggal',
};

export class HealthFSM {
  constructor(start = HEALTH.SEHAT) {
    this.state = start;
    this.load = start === HEALTH.SEHAT ? 0 : 30; // viral load tersembunyi
    this.treated = false;
    this.isolated = false;
    this.daysCritical = 0;
    this.history = [start];
  }

  isInfectious() {
    return this.state === HEALTH.TERPAPAR || this.state === HEALTH.BERGEJALA || this.state === HEALTH.KRITIS;
  }
  isAlive() { return this.state !== HEALTH.MENINGGAL; }
  isTerminal() { return this.state === HEALTH.MENINGGAL || this.state === HEALTH.PULIH; }

  expose(load = 30) {
    if (this.state === HEALTH.SEHAT) {
      this.state = HEALTH.TERPAPAR; this.load = load; this.history.push(this.state);
    }
  }

  treat() { this.treated = true; }
  setIsolated(v) { this.isolated = v; }

  /** Maju satu hari (untuk orang di dalam gedung). */
  advance(rng) {
    if (this.isTerminal()) return this.state;
    const prev = this.state;

    if (this.treated) this.load -= 28;
    else if (this.state !== HEALTH.SEHAT) this.load += this.isolated ? 10 : 18;
    this.load = Math.max(0, Math.min(100, this.load));

    let next = this.state;
    if (this.state !== HEALTH.SEHAT) {
      if (this.load <= 5) next = HEALTH.PULIH;
      else if (this.load >= 88) {
        if (this.state === HEALTH.KRITIS) {
          const p = 0.4 + this.daysCritical * 0.25;
          next = rng() < p ? HEALTH.MENINGGAL : HEALTH.KRITIS;
        } else next = HEALTH.KRITIS;
      } else if (this.load >= 65) next = HEALTH.KRITIS;
      else if (this.load >= 40) next = HEALTH.BERGEJALA;
      else next = HEALTH.TERPAPAR;
    }

    if (next === HEALTH.KRITIS && prev === HEALTH.KRITIS) this.daysCritical++;
    else if (next === HEALTH.KRITIS) this.daysCritical = 1;

    this.state = next;
    if (next !== prev) this.history.push(next);
    this.treated = false;
    return this.state;
  }

  label() { return HEALTH_LABELS[this.state]; }
}

// Restore HealthFSM dari data tersimpan (save game).
export function restoreHealthFSM(state, load) {
  const h = new HealthFSM(state);
  h.load = typeof load === 'number' ? load : h.load;
  return h;
}
