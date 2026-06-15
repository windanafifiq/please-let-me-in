// AksesFSM.js
// FSM Penghalang Fisik — satu instance per penutup (jaket, syal, masker, kacamata, topi).
//
//   TERTUTUP ──(minta buka)──► TERBUKA
//
// Beberapa gejala (ruam di lengan, mata merah, kebotakan) tersembunyi di balik
// penghalang. Pemain harus meminta visitor membuka penghalang dulu sebelum bisa
// memeriksa gejala di baliknya. Tanpa konsekuensi sosial — murni gerbang akses.
//
// Penghalang sengaja dipasang sebagai SINYAL HALUS: kenapa pakai syal di malam
// gerah? Pemain jeli akan curiga dan minta buka; yang ceroboh melewatkannya.

export const AKSES = {
  TERTUTUP: 'tertutup',
  TERBUKA: 'terbuka',
};

export const AKSES_LABELS = {
  tertutup: 'Tertutup',
  terbuka: 'Terbuka',
};

export class AksesFSM {
  /**
   * @param {string} id     id penghalang (mis. 'jaket', 'kacamata', 'topi')
   * @param {string} label  nama tampil (mis. 'Jaket lengan panjang')
   */
  constructor(id, label) {
    this.id = id;
    this.label = label || id;
    this.state = AKSES.TERTUTUP;
    this.history = [this.state];
  }

  isOpen() { return this.state === AKSES.TERBUKA; }

  // Minta visitor membuka penghalang ini. Mengembalikan { state, changed }.
  open() {
    const prev = this.state;
    this.state = AKSES.TERBUKA;
    const changed = this.state !== prev;
    if (changed) this.history.push(this.state);
    return { state: this.state, changed };
  }

  serialize() { return { id: this.id, label: this.label, state: this.state }; }

  static deserialize(data) {
    const fsm = new AksesFSM(data.id, data.label);
    fsm.state = data.state || AKSES.TERTUTUP;
    fsm.history = [fsm.state];
    return fsm;
  }
}