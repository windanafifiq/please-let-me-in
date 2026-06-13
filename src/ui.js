// ui.js — Tampilan Visual Novel (karakter besar di tengah + speech bubble)
// Layout: HUD atas · panggung VN (karakter tengah, bubble, papan petunjuk kanan)
// · kartu pengunjung + menu wawancara + tombol keputusan di bawah.
//
// Foto karakter berganti ekspresi mengikuti DemeanorFSM (neutral/evade/emote).

import { VERDICT } from './engine/interview.js';
import { ACTION_LABELS } from './data/visitors.js';
import { demeanorToExpression } from './fsm/DemeanorFSM.js';

const SIGNAL_META = {
  clean:   { label: 'BERSIH', cls: 'sig-clean', mark: '○' },
  suspect: { label: 'CURIGA', cls: 'sig-suspect', mark: '⚠' },
  neutral: { label: 'TAK PASTI', cls: 'sig-neutral', mark: '—' },
};
const DEMEANOR_CLS = {
  tenang: 'dm-calm', defensif: 'dm-def', mengelak: 'dm-evade',
  membuka: 'dm-open', memberontak: 'dm-rebel',
};
const ACTION_ICONS = {
  ask_purpose: '❓', ask_symptom: '🤒', demand_id: '🪪', demand_arm: '✋',
  press_soft: '🫱', press_hard: '☝', reassure: '🕊', cross_log: '📋', observe: '🔎',
};

export const UI = {
  scene: null,

  mount(scene) {
    this.scene = scene;
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="hud">
        <div class="hud-day">HARI <b id="hud-day">1</b><small>/3</small></div>
        <div class="hud-fsms">
          <div class="fsm-chip" id="fsm-building"><label>Gedung</label><b>—</b></div>
          <div class="fsm-chip" id="fsm-trust"><label>Kepercayaan</label><b>—</b></div>
          <div class="hud-stat" id="hud-infections" title="Wabah lolos"><span>☣</span><b>0</b></div>
          <div class="hud-stat" id="hud-score" title="Penilaian benar"><span>✓</span><b>0</b></div>
        </div>
      </div>

      <div class="vn-stage">
        <!-- karakter besar di tengah -->
        <div class="vn-char-wrap">
          <div class="vn-demeanor" id="demeanor"><span class="dm-dot"></span><b id="dm-label">—</b></div>
          <div class="vn-char" id="vn-char"></div>
          <div class="vn-nameplate" id="vn-nameplate"></div>
        </div>

        <!-- papan petunjuk -->
        <aside class="clue-board">
          <div class="clue-board-title">CATATAN PEMERIKSAAN</div>
          <div class="clue-list" id="clue-list"></div>
        </aside>
      </div>

      <!-- speech bubble (baris saat ini) -->
      <div class="speech" id="speech">
        <div class="speech-who" id="speech-who"></div>
        <div class="speech-text" id="speech-text"></div>
      </div>

      <div class="vn-bottom">
        <div class="action-panel">
          <div class="action-head">WAWANCARA <small>bebas, tanpa batas</small></div>
          <div class="action-grid" id="action-grid"></div>
        </div>
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

  // pilih textur foto sesuai ekspresi; fallback ke neutral lalu placeholder
  charTexture(scene, expr) {
    const v = scene.interview.visitor;
    const reg = scene.registry.get('photoRegistry') || {};
    const set = reg[v.id] || {};
    if (set[expr]) return { type: 'photo', key: set[expr] };
    if (set.neutral) return { type: 'photo', key: set.neutral };
    return { type: 'placeholder', color: v.color, letter: v.name[0] };
  },

  renderChar(scene) {
    const iv = scene.interview;
    if (!iv) return;
    const expr = demeanorToExpression(iv.demeanor.state);
    const tex = this.charTexture(scene, expr);
    const el = document.getElementById('vn-char');
    if (tex.type === 'photo') {
      // cache base64 per texture key (encoding is expensive)
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
    // efek getar saat memberontak diatur lewat kelas
    el.classList.toggle('shake', iv.demeanor.state === 'memberontak');
  },

  showVisitor(scene, v) {
    document.getElementById('vn-nameplate').innerHTML =
      `<b>${v.name}</b><span>${v.floor ? 'Lantai ' + v.floor : 'Tak dikenal'}</span>`;
    document.getElementById('speech-who').textContent = v.name;
    document.getElementById('speech-text').textContent = v.intro;
    document.getElementById('speech-text').classList.add('narr');
    document.getElementById('clue-list').innerHTML =
      '<div class="clue-empty">Belum ada pemeriksaan.<br>Tanya & desak sesukamu.</div>';
    this.renderDemeanor(scene);
    this.renderChar(scene);
    this.renderActions(scene);
  },

  // tampilkan satu baris hasil aksi di speech bubble (mengganti, bukan menumpuk)
  showLine(scene, action, result) {
    const isNarr = result.line.text.startsWith('(') || action === 'observe' || action === 'cross_log';
    const who = document.getElementById('speech-who');
    const txt = document.getElementById('speech-text');
    who.textContent = isNarr ? '— pengamatan —' : result.line.speaker;
    txt.classList.toggle('narr', isNarr);
    this.typewriter(txt, result.line.text);

    // transisi sikap → toast kecil + ganti ekspresi
    if (result.transition.changed) {
      const word = {
        opened: 'mulai membuka diri', rebelled: 'memberontak!',
        guarded: 'menutup diri', calmed: 'lebih tenang', neutral: '',
      }[result.transition.reaction] || '';
      this.toast(`Sikap berubah: ${result.transition.to}${word ? ' · ' + word : ''}`);
    }
    if (result.clue) this.addClue(action, result.clue);
    this.renderDemeanor(scene);
    this.renderChar(scene);
    this.renderActions(scene);
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

  addClue(action, clue) {
    const meta = SIGNAL_META[clue.signal] || SIGNAL_META.neutral;
    const list = document.getElementById('clue-list');
    if (list.querySelector('.clue-empty')) list.innerHTML = '';
    if (list.querySelector(`[data-act="${action}"]`)) return;
    const el = document.createElement('div');
    el.className = 'clue ' + meta.cls;
    el.dataset.act = action;
    el.innerHTML = `<div class="clue-top"><span class="clue-mark">${meta.mark}</span>
      <span class="clue-probe">${ACTION_LABELS[action]}</span>
      <span class="clue-sig">${meta.label}</span></div>
      <div class="clue-text">${clue.note}</div>`;
    list.appendChild(el);
    list.scrollTop = list.scrollHeight;
  },

  renderDemeanor(scene) {
    const iv = scene.interview; if (!iv) return;
    const dm = document.getElementById('demeanor');
    dm.className = 'vn-demeanor ' + (DEMEANOR_CLS[iv.demeanor.state] || '');
    document.getElementById('dm-label').textContent = iv.demeanor.label();
  },

  renderActions(scene) {
    const iv = scene.interview;
    const grid = document.getElementById('action-grid');
    if (!iv) { grid.innerHTML = ''; return; }
    const v = iv.visitor;
    const locked = iv.isLocked();
    const actions = Object.keys(ACTION_LABELS).filter((a) => (v.lines && v.lines[a]) || (v.tells && v.tells[a]));
    grid.innerHTML = actions.map((a) => {
      const used = iv.usedActions.has(a);
      return `<button class="action-btn ${used ? 'used' : ''} ${locked ? 'disabled' : ''}"
        data-act="${a}" ${locked ? 'disabled' : ''}>
        <span class="ab-ico">${ACTION_ICONS[a] || '?'}</span>
        <span class="ab-label">${ACTION_LABELS[a]}</span>
        ${used ? '<span class="ab-done">↺</span>' : ''}</button>`;
    }).join('');
    grid.querySelectorAll('.action-btn:not(.disabled)').forEach((b) => {
      b.onclick = () => scene.doAction(b.dataset.act);
    });
  },

  render(scene) {
    const s = scene.story;
    document.getElementById('hud-day').textContent = s.day;
    const b = document.getElementById('fsm-building');
    b.querySelector('b').textContent = s.building.label();
    b.className = 'fsm-chip b-' + s.building.state;
    const tr = document.getElementById('fsm-trust');
    tr.querySelector('b').textContent = s.trust.label();
    tr.className = 'fsm-chip t-' + s.trust.state;
    document.querySelector('#hud-infections b').textContent = s.infections;
    document.querySelector('#hud-score b').textContent = s.scoreCorrect();
    this.renderDemeanor(scene);
    this.renderChar(scene);
    this.renderActions(scene);
  },

  // Kilatan singkat setelah keputusan — TANPA membocorkan benar/salah.
  // Hanya menandai pintu dibuka/ditutup, lalu lanjut.
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
    // auto-lanjut setelah jeda singkat (tetap bisa diklik untuk skip)
    const go = () => { ov.className = 'overlay'; ov.innerHTML = ''; clearTimeout(this._flashT); onContinue(); };
    ov.onclick = go;
    this._flashT = setTimeout(go, 1100);
  },

  // Kartu "wabah pecah" saat pemain ternyata sudah meloloskan yang terinfeksi.
  showOutbreakCard(scene, day, onContinue) {
    const ov = document.getElementById('overlay');
    ov.onclick = null;
    ov.className = 'overlay show';
    ov.innerHTML = `
      <div class="day-card outbreak">
        <div class="ob-ico">☣</div>
        <div class="day-num">MALAM HARI ${day}</div>
        <div class="day-sub">Jeritan membangunkan seisi lantai. Seseorang yang kau loloskan
        hari ini... berubah. Wabah pecah di dalam gedung.</div>
        <button class="oc-next" id="ob-next">LIHAT AKIBATNYA ▸</button>
      </div>`;
    document.getElementById('ob-next').onclick = () => { ov.className = 'overlay'; ov.innerHTML = ''; onContinue(); };
  },

  showDayCard(scene, day, desc, onContinue) {
    const ov = document.getElementById('overlay');
    ov.onclick = null;
    ov.className = 'overlay show';
    ov.innerHTML = `<div class="day-card"><div class="day-num">HARI ${day}</div>
      <div class="day-sub">${desc}</div>
      <button class="oc-next" id="day-next">MULAI ▸</button></div>`;
    document.getElementById('day-next').onclick = () => { ov.className = 'overlay'; ov.innerHTML = ''; this.render(scene); onContinue(); };
  },

  toast(msg) {
    const t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 2200);
  },

  unmount() {
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
  },
};
