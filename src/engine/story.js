// story.js
// Mesin cerita & state dunia — kini ditenagai 4 FSM:
//   DemeanorFSM (per wawancara, di Interview), HealthFSM (tiap orang),
//   BuildingFSM (kondisi gedung), TrustFSM (kepercayaan gedung).
// Merangkai wawancara jadi hari bercabang, memajukan kesehatan penghuni yang
// sudah diterima, dan menentukan ending.

import { getVisitors, DAY_SCHEDULE } from '../data/visitors.js';
import { Interview, VERDICT, makeRng } from './interview.js';
import { BuildingFSM, BUILDING } from '../fsm/BuildingTrustFSM.js';
import { TrustFSM } from '../fsm/BuildingTrustFSM.js';
import { HEALTH, restoreHealthFSM } from '../fsm/HealthFSM.js';

export class Story {
  constructor(seed = Date.now(), playerName = 'Penjaga') {
    this.seed = seed;
    this.playerName = playerName || 'Penjaga';
    this.rng = makeRng(seed);
    this.visitors = {};
    for (const v of getVisitors()) this.visitors[v.id] = v;

    this.day = 1;
    this.totalDays = 3;
    this.queue = [...DAY_SCHEDULE[1]];
    this.queueIndex = 0;

    // FSM tingkat-gedung
    this.building = new BuildingFSM();
    this.trust = new TrustFSM(60);

    // penghuni yang sudah diterima → HealthFSM mereka jalan tiap hari
    this.admitted = [];   // { id, name, health: HealthFSM }
    this.infections = 0;  // berapa kali wabah masuk
    this.deaths = 0;
    this.looted = false;
    this.lost = false;    // game over: salah memasukkan orang terinfeksi

    this.decisions = [];
    this.log = [];
    this.current = null;  // Interview aktif
    this.finished = false;
  }

  pushLog(text, tone = 'info') { this.log.push({ day: this.day, text, tone }); }

  // ---- Wawancara ----
  nextInterview() {
    if (this.queueIndex >= this.queue.length) return null;
    const id = this.queue[this.queueIndex];
    this.current = new Interview(this.visitors[id], () => this.rng());
    return this.current;
  }

  hasMoreToday() { return this.queueIndex < this.queue.length; }

  resolveCurrent(verdict) {
    if (!this.current) return null;
    const out = this.current.decide(verdict);
    const v = this.current.visitor;

    // efek ke FSM kepercayaan gedung
    this.trust.change(out.trustDelta);

    if (out.infectionHappened) { this.infections++; this.lost = true; }
    if (out.looting) this.looted = true;

    // orang yang diterima masuk → kesehatannya dilacak tiap hari
    if (out.accepted) {
      this.admitted.push({ id: v.id, name: v.name, health: this.current.health });
    }

    this.decisions.push({
      id: v.id, name: v.name, verdict, correct: out.correct, health: v.health,
    });
    this.pushLog(out.log, out.infectionHappened ? 'danger' : out.correct ? 'good' : 'warn');

    this.queueIndex++;
    return out;
  }

  // ---- Pergantian hari: majukan FSM kesehatan + gedung ----
  advanceDay() {
    if (this.day >= this.totalDays) { this.finished = true; return false; }

    // 1) Majukan HealthFSM tiap penghuni yang diterima; sebar antar mereka.
    const infectiousInside = this.admitted.filter((a) => a.health.isInfectious());
    for (const a of this.admitted) {
      // penularan internal sederhana: jika ada yg menular, yg sehat berisiko
      if (a.health.state === HEALTH.SEHAT && infectiousInside.length > 0) {
        const chance = Math.min(0.6, 0.25 * infectiousInside.length);
        if (this.rng() < chance) {
          a.health.expose(28 + Math.floor(this.rng() * 14));
          this.pushLog(`${a.name} tertular di dalam gedung.`, 'danger');
        }
      }
    }
    let deathsToday = 0;
    for (const a of this.admitted) {
      const before = a.health.state;
      a.health.advance(() => this.rng());
      if (before !== HEALTH.MENINGGAL && a.health.state === HEALTH.MENINGGAL) {
        deathsToday++; this.deaths++;
        this.pushLog(`${a.name} tidak bertahan malam itu.`, 'death');
      }
    }

    // 2) Majukan FSM gedung dari sinyal terkini
    this.day++;
    this.building.advance({
      infections: this.infections,
      deaths: this.deaths,
      hostiles: this.trust.state === 'hostile' ? 1 : 0,
      day: this.day, totalDays: this.totalDays,
    });

    // 3) Kepercayaan meluntur jika ada kematian
    if (deathsToday > 0) this.trust.change(-deathsToday * 8);

    this.queue = [...(DAY_SCHEDULE[this.day] || [])];
    this.queueIndex = 0;
    this.current = null;
    this.pushLog(`— Hari ${this.day} — ${this.building.description()}`, 'info');
    return true;
  }

  scoreCorrect() { return this.decisions.filter((d) => d.correct).length; }

  // ---- Ending: hanya 2 (menang / kalah) ----
  // Kalah jika pernah memasukkan orang terinfeksi (wabah masuk).
  // Menang jika bertahan sampai akhir hari ke-3 tanpa wabah masuk.
  isLost() { return this.lost; }

  computeEnding() {
    const total = this.decisions.length;
    const correct = this.scoreCorrect();
    const win = !this.lost;

    let title, summary, outro;
    if (win) {
      title = 'GEDUNG SELAMAT';
      summary = `Tiga hari berlalu. Tak satu pun yang terinfeksi berhasil kau loloskan. ${this.playerName}, kau menjaga pintu hingga akhir.`;
      outro =
        `Pagi hari keempat, sirene yang berbeda terdengar — bukan tanda bahaya, ` +
        `melainkan konvoi militer dan tim medis. Pemerintah mengumumkan bahwa antivirus ` +
        `untuk patogen bioweapon itu akhirnya berhasil disintesis dan tengah didistribusikan ` +
        `ke seluruh zona karantina.\n\n` +
        `Rumah susunmu — satu dari sedikit bangunan yang tak tersentuh wabah — menjadi ` +
        `titik evakuasi prioritas. Satu per satu penghuni keluar dengan selamat, melewati ` +
        `pintu yang selama tiga hari kau jaga dengan nyawamu sendiri.\n\n` +
        `Seorang petugas menepuk bahumu. "Kau menyelamatkan mereka semua, ${this.playerName}." ` +
        `Kau hanya mengangguk, lelah. Di luar sana kota masih berbenah dari mimpi buruk — ` +
        `tapi di sini, di Lantai 7, tak ada yang menjadi monster. Tidak satu pun.`;
    } else {
      title = 'WABAH MENEMBUS PINTU';
      summary = `Kau meloloskan seseorang yang terinfeksi. Dalam hitungan jam, wabah menyebar ke seisi rumah susun.`;
      outro = '';
    }

    return {
      win, title, summary, outro,
      correct, total, infections: this.infections, deaths: this.deaths,
      trust: this.trust.value, looted: this.looted,
      building: this.building.label(), trustState: this.trust.label(),
      playerName: this.playerName,
      decisions: this.decisions,
    };
  }

  // ---- Save / Restore (localStorage di GameScene) ----
  serialize() {
    return {
      v: 1,
      seed: this.seed,
      playerName: this.playerName,
      day: this.day,
      queueIndex: this.queueIndex,
      buildingState: this.building.state,
      buildingTension: this.building.tension,
      trustValue: this.trust.value,
      infections: this.infections,
      deaths: this.deaths,
      looted: this.looted,
      lost: this.lost,
      admitted: this.admitted.map((a) => ({ id: a.id, name: a.name, state: a.health.state, load: a.health.load })),
      decisions: this.decisions,
      log: this.log,
    };
  }

  static deserialize(data) {
    const s = new Story(data.seed, data.playerName);
    s.day = data.day;
    s.queue = [...(DAY_SCHEDULE[data.day] || [])];
    s.queueIndex = data.queueIndex;
    s.building.state = data.buildingState;
    s.building.tension = data.buildingTension;
    s.trust.value = data.trustValue; s.trust.resolve();
    s.infections = data.infections;
    s.deaths = data.deaths;
    s.looted = data.looted;
    s.lost = data.lost;
    s.decisions = data.decisions || [];
    s.log = data.log || [];
    // rebuild admitted health FSMs
    s.admitted = (data.admitted || []).map((a) => ({
      id: a.id, name: a.name, health: restoreHealthFSM(a.state, a.load),
    }));
    return s;
  }
}
