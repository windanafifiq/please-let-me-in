// ui.js — Tampilan sistem PEMERIKSAAN GEJALA (bilingual via i18n)
import { VERDICT } from './engine/inspection.js';
import { EXAM_TYPES } from './data/visitors.js';
import { t } from './i18n.js';

const EXAM_ICONS = {
  observasi: '🔎', suhu: '🌡', ruam: '🩹', mata: '👁', tekanan: '🩸', rambut: '💈',
};

// Label exam per key — dibaca dari i18n saat dibutuhkan
const EXAM_LABEL = (id) => ({
  observasi: t('ui.exam.observe.label'),
  suhu: t('ui.exam.suhu.label'),
  ruam: t('ui.exam.ruam.label'),
  mata: t('ui.exam.mata.label'),
  tekanan: t('ui.exam.tekanan.label'),    
  rambut: t('ui.exam.rambut.label'),
}[id] || id);

export const UI = {
  scene: null,

  mount(scene) {
    this.scene = scene;
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="hud">
        <div class="hud-day">${t('ui.hud.visitor')} <b id="hud-idx">1</b></div>
        <div class="hud-fsms">
          <div class="hud-stat" id="hud-checked" title="${t('ui.exam.head')}"><span>🔬</span><b>0</b></div>
        </div>
      </div>

      <div class="vn-stage">
        <div class="vn-char-wrap">
          <div class="vn-char" id="vn-char"></div>
          <div class="vn-nameplate" id="vn-nameplate"></div>
        </div>

        <aside class="clue-board">
          <div class="clue-board-title">${t('ui.clue.title')}</div>
          <div class="clue-list" id="clue-list"></div>
        </aside>
      </div>

      <div class="speech" id="speech">
        <div class="speech-who" id="speech-who"></div>
        <div class="speech-text" id="speech-text"></div>
      </div>

      <div class="vn-bottom">
        <div class="action-panel">
          <div class="action-head">${t('ui.exam.head')}</div>
          <div class="action-grid" id="action-grid"></div>
        </div>
        <div class="barrier-row" id="barrier-row"></div>
        <div class="verdict-bar" id="verdict-bar">
          <button class="verdict-btn reject" id="btn-reject">
            <span class="vb-ico">✕</span> ${t('ui.verdict.reject.main')}
            <small>${t('ui.verdict.reject.sub')}</small>
          </button>
          <button class="verdict-btn accept" id="btn-accept">
            <span class="vb-ico">✓</span> ${t('ui.verdict.accept.main')}
            <small>${t('ui.verdict.accept.sub')}</small>
          </button>
        </div>
      </div>

      <div class="overlay" id="overlay"></div>
      <div class="toast" id="toast"></div>
    `;
    document.getElementById('btn-accept').onclick = () => scene.decide(VERDICT.ACCEPT);
    document.getElementById('btn-reject').onclick = () => scene.decide(VERDICT.REJECT);
  },

  // ---- Gambar karakter per TAHAP keterbukaan ----
  charTexture(scene, stage) {
    const insp = scene.inspection;
    const v = insp.visitor;
    const reg = scene.registry.get('photoRegistry') || {};
    const set = reg[v.id] || {};
    if (set[stage]) return { type: 'photo', key: set[stage] };
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
    const floorLabel = v.floor
      ? `${t('ui.visitor.floor')} ${v.floor}`
      : t('ui.visitor.unknown');
    const ageLabel = v.age ? ` · ${v.age} ${t('ui.visitor.age')}` : '';

    const name = t(`${v.id}.name`) || v.name;
    document.getElementById('vn-nameplate').innerHTML =
      `<b>${name}</b><span>${floorLabel}${ageLabel}</span>`;
    document.getElementById('speech-who').textContent = name;
    document.getElementById('speech-text').textContent = `${t(`${v.id}.intro`)} ${t(`${v.id}.claim`)}`;
    document.getElementById('speech-text').classList.add('narr');
    this.buildLog(scene);
    this.renderChar(scene);
    this.renderActions(scene);
    this.renderBarriers(scene);
  },

  // ---- Log pemeriksaan ----
  buildLog(scene) {
    const insp = scene.inspection;
    const list = document.getElementById('clue-list');
    const ids = Object.keys(insp.exams);
    list.innerHTML = ids.map((id) => {
      const ex = insp.exams[id];
      const label = EXAM_LABEL(id) || ex.label;
      return `
        <div class="clue pending" data-exam="${id}">
          <div class="clue-check"></div>
          <div class="clue-body">
            <div class="clue-top">
              <span class="clue-probe">${label}</span>
              <span class="clue-sig">—</span>
            </div>
            <div class="clue-text">${t('ui.clue.pending')}</div>
          </div>
        </div>`;
    }).join('');
  },

  fillLog(scene, examId, entry) {
    const list = document.getElementById('clue-list');
    const row = list.querySelector(`[data-exam="${examId}"]`);
    if (!row) {
      console.warn('[fillLog] row tidak ditemukan untuk', examId);
      return;
    }

    const label = EXAM_LABEL(examId) || entry.label || examId;
    const keyBase = `${scene.inspection.visitor.id}.exam.${examId}`;
    const tVal = t(keyBase);
    const tNote = t(`${keyBase}.n`);

    const finalVal = (tVal !== keyBase) ? tVal : (entry.value || '');
    const finalNote = (tNote !== `${keyBase}.n`) ? tNote : (entry.note || null);

    const noteHtml = finalNote
      ? `<div class="clue-text">${finalVal}</div><div class="clue-note">${finalNote}</div>`
      : `<div class="clue-text">${finalVal}</div>`;

    row.className = 'clue done';
    row.innerHTML = `
      <div class="clue-check">✓</div>
      <div class="clue-body">
        <div class="clue-top">
          <span class="clue-probe">${label}</span>
          <span class="clue-sig">${t('ui.clue.done')}</span>
        </div>
        ${noteHtml}
      </div>`;
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
      const label = EXAM_LABEL(id) || ex.label;
      return `<button class="action-btn ${done ? 'used' : ''} ${locked ? 'gated' : ''}"
        data-exam="${id}" title="${locked ? t('ui.toast.locked') : ''}">
        <span class="ab-ico">${EXAM_ICONS[id] || '🔬'}</span>
        <span class="ab-label">${label}</span>
        ${done ? '<span class="ab-done">✓</span>' : ''}
        ${locked ? '<span class="ab-lock">🔒</span>' : ''}</button>`;
    }).join('');

    grid.querySelectorAll('.action-btn').forEach((b) => {
      b.onclick = () => scene.doExamine(b.dataset.exam);
    });
  },

  // ---- Tombol penghalang ----
  renderBarriers(scene) {
    const insp = scene.inspection;
    const row = document.getElementById('barrier-row');
    if (!insp) { row.innerHTML = ''; return; }
    const closed = insp.closedBarriers();
    if (closed.length === 0) { row.innerHTML = ''; return; }
    row.innerHTML = `<div class="barrier-label">${t('ui.barrier.ask')}</div>` +
      closed.map((b) => {
        const transLabel = t(`${insp.visitor.id}.${b.id}`);
        const label = (transLabel !== `${insp.visitor.id}.${b.id}`) ? transLabel : b.label;
        return `<button class="barrier-btn" data-bar="${b.id}">🧥 ${label}</button>`;
      }).join('');
    row.querySelectorAll('.barrier-btn').forEach((btn) => {
      btn.onclick = () => scene.doOpenBarrier(btn.dataset.bar);
    });
  },

  // ---- Exam result ----
  showExam(scene, examId, result) {
    if (result.locked) {
      const bId = result.gate.id;
      const vId = scene.inspection.visitor.id;
      const transB = t(`${vId}.${bId}`);
      const bLabel = (transB !== `${vId}.${bId}`) ? transB : result.gate.label;
      this.toast(`${t('ui.toast.locked')} "${bLabel}" ${t('ui.toast.locked2')} ${result.examLabel}.`);
      return;
    }

    this.fillLog(scene, examId, result.entry);

    const txt = document.getElementById('speech-text');
    const who = document.getElementById('speech-who');
    const label = EXAM_LABEL(examId) || result.entry.label || examId;
    who.textContent = '— ' + label + ' —';
    txt.classList.add('narr');

    const keyBase = `${scene.inspection.visitor.id}.exam.${examId}`;
    const tVal = t(keyBase);
    const tNote = t(`${keyBase}.n`);
    const val = (tVal !== keyBase) ? tVal : (result.entry.value || '');
    const note = (tNote !== `${keyBase}.n`) ? tNote : (result.entry.note || null);

    this.typewriter(txt, val + (note ? '  (' + note + ')' : ''));
    this.renderActions(scene);
    this.updateChecked(scene);
  },

  showBarrierOpened(scene, barrierId) {
    const vId = scene.inspection.visitor.id;
    const transB = t(`${vId}.${barrierId}`);
    // Jika tidak ada di i18n, pakai label default dari engine (asumsi dikirim di argumen sebelumnya)
    // Tapi di GameScene.js dilempar r.label. Kita lebih baik cari dari ID saja.
    const label = (transB !== `${vId}.${barrierId}`) ? transB : barrierId;

    this.toast(`${label} ${t('ui.toast.barrier')}`);
    const txt = document.getElementById('speech-text');
    const who = document.getElementById('speech-who');
    who.textContent = t('ui.narr.observe');
    txt.classList.add('narr');
    this.typewriter(txt, `${label} ${t('ui.narr.barrier')}`);
    this.renderChar(scene);
    this.renderActions(scene);
    this.renderBarriers(scene);
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
        <div class="flash-word">${accepted ? t('ui.flash.accept.word') : t('ui.flash.reject.word')}</div>
        <div class="flash-sub">${accepted ? t('ui.flash.accept.sub') : t('ui.flash.reject.sub')}</div>
      </div>`;
    const go = () => { ov.className = 'overlay'; ov.innerHTML = ''; clearTimeout(this._flashT); onContinue(); };
    ov.onclick = go;
    this._flashT = setTimeout(go, 1100);
  },

  toast(msg) {
    const t2 = document.getElementById('toast'); if (!t2) return;
    t2.textContent = msg; t2.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => t2.classList.remove('show'), 2400);
  },

  unmount() {
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
  },
};