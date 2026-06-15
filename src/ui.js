// ui.js — Tampilan sistem PEMERIKSAAN GEJALA (pivot dari wawancara).
// Layout: HUD atas · panggung (karakter tengah + log pemeriksaan kanan) ·
// menu pemeriksaan + tombol penghalang + keputusan di bawah.
//
// Tidak ada warna penilaian di log — pemain membaca data mentah & menyimpulkan.
// Gambar karakter berganti antara state "tertutup" dan "terbuka" (AksesFSM).

import { VERDICT } from './engine/inspection.js';
import { EXAM_TYPES } from './data/visitors.js';

const EXAM_ICONS = {
  observasi: '🔎', suhu: '🌡', ruam: '🩹', mata: '👁', tekanan: '🩸', rambut: '💈',
};

export const UI = {
  scene: null,

  mount(scene) {
    this.scene = scene;
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="hud">
        <div class="hud-day">PENGUNJUNG <b id="hud-idx">1</b></div>
        <div class="hud-fsms">
          <div class="hud-stat" id="hud-checked" title="Pemeriksaan dilakukan"><span>🔬</span><b>0</b></div>
        </div>
      </div>

      <div class="vn-stage">
        <div class="vn-char-wrap">
          <div class="vn-char" id="vn-char"></div>
          <div class="vn-nameplate" id="vn-nameplate"></div>
        </div>

        <aside class="clue-board">
          <div class="clue-board-title">CATATAN PEMERIKSAAN</div>
          <div class="clue-list" id="clue-list"></div>
        </aside>
      </div>

      <div class="speech" id="speech">
        <div class="speech-who" id="speech-who"></div>
        <div class="speech-text" id="speech-text"></div>
      </div>

      <div class="vn-bottom">
        <div class="action-panel">
          <div class="action-head">PEMERIKSAAN</div>
          <div class="action-grid" id="action-grid"></div>
        </div>
        <div class="barrier-row" id="barrier-row"></div>
        <div class="verdict-bar" id="verdict-bar">
          <button class="verdict-btn reject" id="btn-reject"><span class="vb-ico">✕</span> TOLAK<small>jangan biarkan masuk</small></button>
          <button class="verdict-btn accept" id="btn-accept"><span class="vb-ico">✓</span> TERIMA<small>buka pintu</small></button>
        </div>
      </div>

      <div class="overlay" id="overlay"></div>
      <div class="toast" id="toast"></div>
    `;
    document.getElementById('btn-accept').onclick = () => scene.decide(VERDICT.ACCEPT);
    document.getElementById('btn-reject').onclick = () => scene.decide(VERDICT.REJECT);
  },

  // ---- Gambar karakter per TAHAP keterbukaan ----
  // photoRegistry[visitorId] = { full, nomask, arm, open, ... } sesuai tahap.
  charTexture(scene, stage) {
    const insp = scene.inspection;
    const v = insp.visitor;
    const reg = scene.registry.get('photoRegistry') || {};
    const set = reg[v.id] || {};
    if (set[stage]) return { type: 'photo', key: set[stage] };
    // fallback berjenjang: open → full → placeholder
    if (set.open) return { type: 'photo', key: set.open };
    if (set.full) return { type: 'photo', key: set.full };
    return { type: 'placeholder', color: v.color, letter: v.name[0] };
  },

  renderChar(scene) {
    const insp = scene.inspection;
    if (!insp) return;
    const stage = insp.currentStage();
    const tex = this.charTexture(scene, stage);
    const el = document.getElementById('vn-char');
    if (tex.type === 'photo') {
      this._b64 = this._b64 || {};
      if (el.dataset.tex !== tex.key) {
        if (!this._b64[tex.key]) this._b64[tex.key] = scene.textures.getBase64(tex.key);
        el.style.background = `center/contain no-repeat url(${this._b64[tex.key]})`;
        el.dataset.tex = tex.key;
      }
      el.classList.remove('is-placeholder');
      el.textContent = '';
    } else {
      el.dataset.tex = '';
      el.classList.add('is-placeholder');
      el.style.background = `radial-gradient(circle at 50% 35%, ${tex.color}, #0c0a12)`;
      el.textContent = tex.letter;
    }
  },

  showVisitor(scene, v) {
    document.getElementById('vn-nameplate').innerHTML =
      `<b>${v.name}</b><span>${v.floor ? 'Lantai ' + v.floor : 'Tak dikenal'}${v.age ? ' · ' + v.age + ' th' : ''}</span>`;
    document.getElementById('speech-who').textContent = v.name;
    // perkenalan: intro + claim
    document.getElementById('speech-text').textContent = `${v.intro} ${v.claim}`;
    document.getElementById('speech-text').classList.add('narr');
    this.buildLog(scene);
    this.renderChar(scene);
    this.renderActions(scene);
    this.renderBarriers(scene);
  },

  // ---- Log pemeriksaan: mulai dari daftar exam yang "belum diperiksa" ----
  buildLog(scene) {
    const insp = scene.inspection;
    const list = document.getElementById('clue-list');
    const ids = Object.keys(insp.exams);
    list.innerHTML = ids.map((id) => {
      const ex = insp.exams[id];
      return `
        <div class="clue pending" data-exam="${id}">
          <div class="clue-check"></div>
          <div class="clue-body">
            <div class="clue-top">
              <span class="clue-probe">${ex.label}</span>
              <span class="clue-sig">—</span>
            </div>
            <div class="clue-text">Belum diperiksa.</div>
          </div>
        </div>`;
    }).join('');
  },

  // Isi satu baris log saat exam dilakukan. TANPA warna penilaian.
  fillLog(examId, entry) {
    const list = document.getElementById('clue-list');
    const row = list.querySelector(`[data-exam="${examId}"]`);
    if (!row) return;
    row.className = 'clue done';
    row.querySelector('.clue-check').textContent = '✓';
    row.querySelector('.clue-sig').textContent = 'DICATAT';
    // tampilkan data mentah + catatan medis netral
    const noteHtml = entry.note
      ? `<div class="clue-text">${entry.value}</div><div class="clue-note">${entry.note}</div>`
      : `<div class="clue-text">${entry.value}</div>`;
    row.querySelector('.clue-body').innerHTML = `
      <div class="clue-top">
        <span class="clue-probe">${entry.label}</span>
        <span class="clue-sig">DICATAT</span>
      </div>${noteHtml}`;
  },

  // ---- Menu pemeriksaan ----
  renderActions(scene) {
    const insp = scene.inspection;
    const grid = document.getElementById('action-grid');
    if (!insp) { grid.innerHTML = ''; return; }

    const ids = Object.keys(insp.exams);
    grid.innerHTML = ids.map((id) => {
      const ex = insp.exams[id];
      const done = ex.isDone();
      const locked = insp.isExamLocked(id);
      return `<button class="action-btn ${done ? 'used' : ''} ${locked ? 'gated' : ''}"
        data-exam="${id}" title="${locked ? 'Buka penghalang dulu' : ''}">
        <span class="ab-ico">${EXAM_ICONS[id] || '🔬'}</span>
        <span class="ab-label">${ex.label}</span>
        ${done ? '<span class="ab-done">✓</span>' : ''}
        ${locked ? '<span class="ab-lock">🔒</span>' : ''}</button>`;
    }).join('');

    grid.querySelectorAll('.action-btn').forEach((b) => {
      b.onclick = () => scene.doExamine(b.dataset.exam);
    });
  },

  // ---- Tombol penghalang (minta buka) ----
  renderBarriers(scene) {
    const insp = scene.inspection;
    const row = document.getElementById('barrier-row');
    if (!insp) { row.innerHTML = ''; return; }
    const closed = insp.closedBarriers();
    if (closed.length === 0) { row.innerHTML = ''; return; }
    row.innerHTML = `<div class="barrier-label">Minta buka:</div>` +
      closed.map((b) => `<button class="barrier-btn" data-bar="${b.id}">🧥 ${b.label}</button>`).join('');
    row.querySelectorAll('.barrier-btn').forEach((btn) => {
      btn.onclick = () => scene.doOpenBarrier(btn.dataset.bar);
    });
  },

  // ---- Dipanggil GameScene saat exam dilakukan ----
  showExam(scene, examId, result) {
    if (result.locked) {
      this.toast(`Buka "${result.gate.label}" dulu untuk memeriksa ${result.examLabel}.`);
      return;
    }
    this.fillLog(examId, result.entry);
    // tampilkan hasil di speech bubble juga
    const txt = document.getElementById('speech-text');
    const who = document.getElementById('speech-who');
    who.textContent = '— ' + result.entry.label + ' —';
    txt.classList.add('narr');
    this.typewriter(txt, result.entry.value + (result.entry.note ? '  (' + result.entry.note + ')' : ''));
    this.renderActions(scene);
    this.updateChecked(scene);
  },

  // ---- Dipanggil GameScene saat penghalang dibuka ----
  showBarrierOpened(scene, label) {
    this.toast(`${label} dibuka. Periksa gejala di baliknya.`);
    const txt = document.getElementById('speech-text');
    const who = document.getElementById('speech-who');
    who.textContent = '— Pengamatan —';
    txt.classList.add('narr');
    this.typewriter(txt, `${label} dibuka. Pemeriksaan baru kini tersedia.`);
    this.renderChar(scene);       // mungkin ganti ke gambar "terbuka"
    this.renderActions(scene);    // exam yang tadi terkunci kini aktif
    this.renderBarriers(scene);   // hapus tombol penghalang yang sudah dibuka
  },

  updateChecked(scene) {
    const insp = scene.inspection;
    document.querySelector('#hud-checked b').textContent = insp.examinedCount();
  },

  typewriter(el, text) {
    clearInterval(this._tw);
    el.textContent = '';
    let i = 0;
    this._tw = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(this._tw);
    }, 14);
  },

  render(scene) {
    const s = scene.story;
    document.getElementById('hud-idx').textContent = (s.index + 1);
    this.updateChecked(scene);
    this.renderChar(scene);
    this.renderActions(scene);
    this.renderBarriers(scene);
  },

  showVerdictFlash(scene, verdict, onContinue) {
    const accepted = verdict === VERDICT.ACCEPT;
    const ov = document.getElementById('overlay');
    ov.className = 'overlay show flash';
    ov.innerHTML = `
      <div class="flash-card ${accepted ? 'fl-accept' : 'fl-reject'}">
        <div class="flash-ico">${accepted ? '🔓' : '🔒'}</div>
        <div class="flash-word">${accepted ? 'PINTU DIBUKA' : 'PINTU DITUTUP'}</div>
        <div class="flash-sub">${accepted ? 'Kau membiarkannya masuk.' : 'Kau menyuruhnya pergi.'}</div>
      </div>`;
    const go = () => { ov.className = 'overlay'; ov.innerHTML = ''; clearTimeout(this._flashT); onContinue(); };
    ov.onclick = go;
    this._flashT = setTimeout(go, 1100);
  },

  toast(msg) {
    const t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 2400);
  },

  unmount() {
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
  },
};
