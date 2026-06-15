// HealthFSM.js
// FSM Kesehatan TERSEMBUNYI tiap pengunjung — "kebenaran" yang harus ditebak pemain.
//
//   sehat ──(terinfeksi)──► cacar
//   sehat ──(punya kondisi lain)──► kondisi_lain   (anemia, heat-stroke, dll)
//
// State ini TIDAK terlihat pemain. Ia MENENTUKAN gejala apa yang muncul saat
// diperiksa. Pemain mengamati gejala lalu menyimpulkan state ini sendiri.
//
// Versi 1-hari: FSM tidak "maju tiap hari". State ditetapkan saat visitor dibuat
// (dari data), dan tetap sepanjang pemeriksaan. Kesederhanaan ini disengaja —
// satu shift jaga, satu keputusan per orang.

export const HEALTH = {
  SEHAT: 'sehat',         // benar-benar sehat, tak ada gejala berarti
  CACAR: 'cacar',         // terinfeksi VRS-24 — HARUS ditolak
  KONDISI_LAIN: 'kondisi_lain', // punya gejala mirip tapi BUKAN cacar (anemia, heat-stroke, dsb)
};

export const HEALTH_LABELS = {
  sehat: 'Sehat',
  cacar: 'Terinfeksi VRS-24',
  kondisi_lain: 'Kondisi Lain (non-infeksius)',
};

export class HealthFSM {
  /**
   * @param {string} start  state awal dari data visitor (HEALTH.*)
   */
  constructor(start = HEALTH.SEHAT) {
    this.state = start;
    this.history = [start];
  }

  // Apakah orang ini berbahaya bagi gedung? Hanya cacar yang menular.
  isInfectious() {
    return this.state === HEALTH.CACAR;
  }

  // "Kebenaran" untuk penilaian keputusan pemain:
  //   - cacar  → seharusnya DITOLAK
  //   - selain → seharusnya DITERIMA (sehat / kondisi lain non-infeksius)
  shouldBeRejected() {
    return this.state === HEALTH.CACAR;
  }

  label() { return HEALTH_LABELS[this.state]; }

  serialize() { return { state: this.state }; }

  static deserialize(data) {
    return new HealthFSM(data && data.state ? data.state : HEALTH.SEHAT);
  }
}
