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

    const leaked = this.decisions.filter(
      (d) => d.verdict === VERDICT.ACCEPT && d.health === 'cacar'
    ).length;

    const wrongReject = this.decisions.filter(
      (d) => d.verdict === VERDICT.REJECT && d.health !== 'cacar'
    ).length;

    let win = false;
    let title = '';
    let summary = '';
    let outro = '';

    // ===== PERFECT ENDING =====
    if (leaked === 0 && wrongReject === 0) {
      win = true;

      title = 'Fajar yang Aman';

      summary =
        'Tidak ada satu pun kesalahan sepanjang shift. Mereka yang terinfeksi berhasil dihentikan sebelum memasuki gedung, sementara para penghuni yang sehat dapat kembali ke rumah mereka dengan aman.';

      outro =
        'Fajar tiba.\n\n' +
        'Untuk pertama kalinya setelah berminggu-minggu, berita pagi membawa sedikit harapan.\n\n' +
        'Pemerintah mengumumkan bahwa vaksin VRS-24 mulai didistribusikan ke berbagai kota. Jumlahnya masih terbatas, tetapi cukup untuk memberi harapan bahwa wabah ini tidak akan berlangsung selamanya.\n\n' +
        'Di dalam gedung, para penghuni memulai hari seperti biasa.\n\n' +
        'Anak-anak berangkat sekolah. Para pekerja bersiap menjalani shift mereka. Lampu-lampu apartemen menyala satu per satu tanpa ketakutan yang selama ini menyelimuti kota.\n\n' +
        'Sebagian dari mereka tidak pernah tahu betapa dekatnya wabah dengan rumah mereka malam itu.\n\n' +
        'Dan mereka memang tidak perlu tahu.\n\n' +
        'Tugas seorang penjaga bukan menjadi pahlawan yang dikenang.\n\n' +
        'Tugasnya adalah memastikan semua orang bisa menjalani hari esok.';

    }

    // ===== WRONG REJECT ONLY =====
    else if (leaked === 0 && wrongReject > 0) {
      title = 'Keputusan yang Salah';

      summary =
        `Tidak ada wabah yang masuk, tetapi ${wrongReject} penghuni sehat kau tolak karena kecurigaan yang keliru.`;

      outro =
        'Gedung memang tetap aman malam itu.\n\n' +
        'Namun beberapa penghuni yang sehat terpaksa menghabiskan malam di luar tempat yang seharusnya menjadi rumah mereka.\n\n' +
        'Keesokan harinya, kabar tentang keputusanmu menyebar dari pintu ke pintu.\n\n' +
        'Tidak ada wabah yang masuk.\n\n' +
        'Tetapi kepercayaan para penghuni mulai retak.';

    }

    // ===== LEAKED ONLY =====
    else if (leaked > 0 && wrongReject === 0) {
      title = 'Wabah Menembus Pintu';

      summary =
        `Kau meloloskan ${leaked} orang yang terinfeksi VRS-24. Pada awalnya tidak ada yang terlihat berbeda, tetapi wabah telah memasuki gedung.`;

      outro =
        'Beberapa jam kemudian laporan pertama masuk.\n\n' +
        'Demam. Ruam. Mata merah.\n\n' +
        'Sebelum fajar tiba, semakin banyak penghuni mulai menunjukkan gejala yang sama.\n\n' +
        'VRS-24 menyebar jauh lebih cepat daripada yang diperkirakan.\n\n' +
        'Keputusan yang tampak kecil malam itu menjadi awal dari sebuah wabah.';

    }

    // ===== WORST ENDING =====
    else {
      title = 'Malam yang Gagal';

      summary =
        `Kau meloloskan ${leaked} orang yang terinfeksi dan menolak ${wrongReject} penghuni yang sebenarnya sehat.`;

      outro =
        'Menjelang fajar, laporan kasus pertama mulai berdatangan.\n\n' +
        'Demam. Ruam. Mata merah.\n\n' +
        'Di saat yang sama, beberapa penghuni yang sehat masih berada di luar gedung karena keputusanmu.\n\n' +
        'Mereka yang seharusnya dilindungi justru dihukum.\n\n' +
        'Mereka yang seharusnya dihentikan justru berhasil masuk.\n\n' +
        'Ketika matahari terbit, tidak ada yang bisa disebut sebagai kemenangan.\n\n' +
        'Malam itu, kau gagal di kedua sisi pintu.';

    }

    return {
      win,
      total,
      correct,
      wrong,
      leaked,
      wrongReject,
      title,
      summary,
      outro,
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