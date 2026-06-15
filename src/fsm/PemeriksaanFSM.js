// PemeriksaanFSM.js
// FSM Pemeriksaan — satu instance per jenis pemeriksaan (suhu, ruam, mata, dll).
//
//   BELUM ──(periksa)──► DIPERIKSA
//
// Tiap pemeriksaan punya state sendiri: sudah dilakukan atau belum. Ini yang
// menggerakkan checklist/log: begitu diperiksa, hasilnya (data mentah gejala)
// dicatat. Beberapa pemeriksaan TERKUNCI di balik AksesFSM (penghalang) —
// tak bisa diperiksa sebelum penghalangnya dibuka.
//
// Pemain TIDAK wajib memeriksa semua. Tapi makin sedikit diperiksa, makin besar
// risiko salah menyimpulkan. Tidak ada warna/penilaian di log — pemain sendiri
// yang menafsir data mentahnya.

export const PERIKSA = {
  BELUM: 'belum',
  DIPERIKSA: 'diperiksa',
};

export const PERIKSA_LABELS = {
  belum: 'Belum diperiksa',
  diperiksa: 'Diperiksa',
};

export class PemeriksaanFSM {
  /**
   * @param {string} id       id pemeriksaan (mis. 'suhu', 'ruam', 'mata')
   * @param {string} label    nama tampil (mis. 'Cek suhu tubuh')
   * @param {string|null} gatedBy  id penghalang yang harus dibuka dulu (atau null)
   */
  constructor(id, label, gatedBy = null) {
    this.id = id;
    this.label = label || id;
    this.gatedBy = gatedBy;          // id AksesFSM yang mengunci, jika ada
    this.state = PERIKSA.BELUM;
    this.result = null;              // diisi data gejala saat diperiksa
    this.history = [this.state];
  }

  isDone() { return this.state === PERIKSA.DIPERIKSA; }

  // Lakukan pemeriksaan, simpan hasil (data gejala mentah dari visitor).
  // @param resultData  { value, note, hint } dari data visitor
  examine(resultData) {
    const prev = this.state;
    this.state = PERIKSA.DIPERIKSA;
    this.result = resultData || null;
    const changed = this.state !== prev;
    if (changed) this.history.push(this.state);
    return { state: this.state, changed, result: this.result };
  }

  serialize() {
    return { id: this.id, label: this.label, gatedBy: this.gatedBy, state: this.state, result: this.result };
  }

  static deserialize(data) {
    const fsm = new PemeriksaanFSM(data.id, data.label, data.gatedBy);
    fsm.state = data.state || PERIKSA.BELUM;
    fsm.result = data.result || null;
    fsm.history = [fsm.state];
    return fsm;
  }
}
