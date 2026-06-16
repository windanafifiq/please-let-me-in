// BootScene.js
// Memuat foto karakter asli jika ada (varian tertutup/terbuka), dan menyiapkan
// placeholder potret bila foto belum tersedia.
//
// Konvensi file (taruh di assets/portraits/):
//   v01_tertutup.png  v01_terbuka.png
//   - tertutup : penampilan awal (masih pakai penghalang: jaket/syal/masker/dll)
//   - terbuka  : setelah penghalang dibuka (gejala terlihat)
// Minimal cukup v01_tertutup.png. Game tetap jalan tanpa foto (pakai placeholder).

import { VISITORS } from '../data/visitors.js';

// Kumpulkan nama tahap gambar tiap visitor dari urutan penghalangnya:
//   'full' (semua tertutup) + tiap 'stage' setelah penghalang dibuka.
// Visitor tanpa penghalang: hanya 'open'.
function stagesFor(v) {
  const barriers = v.barriers || [];
  if (barriers.length === 0) return ['open'];
  const stages = ['full'];
  for (const b of barriers) stages.push(b.stage || 'open');
  return stages;
}

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    const W = this.scale.width, H = this.scale.height;
    this.add.rectangle(W / 2, H / 2 + 30, 320, 6, 0x2a2730);
    const bar = this.add.rectangle(W / 2 - 160, H / 2 + 30, 4, 6, 0xe8c468).setOrigin(0, 0.5);
    this.add.text(W / 2, H / 2 - 24, 'PLEASE WAIT', {
      fontFamily: 'Syne, sans-serif', fontSize: '40px', color: '#e8c468', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.load.on('progress', (p) => { bar.width = 4 + 316 * p; });

    this.load.image('bg-plain', 'assets/bg/door.webp');
    this.load.image('bg-horror', 'assets/bg/door2.webp');

    this._stages = {};
    for (const v of VISITORS) {
      const stages = stagesFor(v);
      this._stages[v.id] = stages;
      for (const s of stages) {
        const key = `photo-${v.id}-${s}`;
        this.load.image(key, `assets/portraits/${v.id}_${s}.webp`);
      }
    }
    // Latar pintu opsional
    this.load.image('photo-door', 'assets/bg/susun.webp');
    // Foto kredit (opsional)
    this.load.image('credit-maker1', 'assets/credits/maker1.png');
    this.load.image('credit-maker2', 'assets/credits/maker2.png');
    this.load.image('credit-lecturer', 'assets/credits/lecturer.png');

    // ── Audio: guard agar tidak ada key yang di-register dua kali ──
    // sfx-click sudah di-load di WarningScene; loadAudioOnce membuatnya aman
    // walau dipanggil lagi di sini, dan melindungi semua key lain juga.
    const loadAudioOnce = (key, urls) => {
      if (!this.cache.audio.exists(key)) this.load.audio(key, urls);
    };
    loadAudioOnce('sfx-click', ['assets/music/click-sfx.ogg', 'assets/music/click-sfx.mp3', 'assets/music/click-sfx.wav']);
    loadAudioOnce('sfx-thunder', ['assets/music/thunder-sfx.ogg', 'assets/music/thunder-sfx.mp3', 'assets/music/thunder-sfx.wav']);
    loadAudioOnce('bgm-main', ['assets/music/bg-1.ogg', 'assets/music/bg-1.mp3', 'assets/music/bg-1.wav']);
    loadAudioOnce('bgm-game', ['assets/music/bg-2.ogg', 'assets/music/bg-2.mp3', 'assets/music/bg-2.wav']);
    loadAudioOnce('bgm-good', ['assets/music/bg-good.ogg', 'assets/music/bg-good.mp3', 'assets/music/bg-good.wav']);
    loadAudioOnce('sfx-title-voice', ['assets/music/title-sfx.ogg', 'assets/music/title-sfx.mp3', 'assets/music/title-sfx.wav']);
    loadAudioOnce('secret-bgm', ['assets/music/secret-bg.ogg', 'assets/music/secret-bg.mp3']);

    this.load.on('loaderror', (file) => {
      this._failed = this._failed || new Set();
      this._failed.add(file.key);
    });
  }

  create() {
    this._failed = this._failed || new Set();
    this.makeBackgrounds();
    this.makePortraits();
    this.makeDots();

    // catat ketersediaan foto per tahap utk dipakai UI
    const registry = {};
    for (const v of VISITORS) {
      registry[v.id] = {};
      const stages = this._stages[v.id] || ['open'];
      for (const s of stages) {
        const key = `photo-${v.id}-${s}`;
        registry[v.id][s] = this.textures.exists(key) && !this._failed.has(key) ? key : null;
      }
      // fallback placeholder: tahap apa pun yg kosong → placeholder visitor
      const ph = 'ph-' + v.id;
      for (const s of stages) {
        if (!registry[v.id][s]) registry[v.id][s] = ph;
      }
      // pastikan 'full' & 'open' selalu ada (UI fallback ke sana)
      if (!registry[v.id].full) registry[v.id].full = registry[v.id][stages[0]] || ph;
      if (!registry[v.id].open) registry[v.id].open = registry[v.id][stages[stages.length - 1]] || ph;
    }
    this.registry.set('photoRegistry', registry);
    this.registry.set('hasDoorPhoto', this.textures.exists('photo-door') && !this._failed.has('photo-door'));

    Promise.all([
      document.fonts.load('80px Creepster'),
      document.fonts.load('20px "Special Elite"'),
      document.fonts.load('15px Syne'),
    ]).then(() => {
      this.scene.start('MenuScene');
    });
  }

  makeBackgrounds() {
    const W = 1280, H = 720;
    const defs = [
      { key: 'bg-door', top: 0x161019, bot: 0x070509, glow: 0x3a2238 },
      { key: 'bg-end', top: 0x101820, bot: 0x05080c, glow: 0x294a5e },
    ];
    for (const d of defs) {
      const g = this.add.graphics();
      for (let y = 0; y < H; y += 4) {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.IntegerToColor(d.top),
          Phaser.Display.Color.IntegerToColor(d.bot), H, y);
        g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
        g.fillRect(0, y, W, 4);
      }
      g.fillStyle(d.glow, 0.22);
      g.fillRoundedRect(W / 2 - 220, 70, 440, H - 120, 36);
      g.lineStyle(2, d.glow, 0.45);
      g.strokeRoundedRect(W / 2 - 220, 70, 440, H - 120, 36);
      g.lineStyle(1, 0x2a2733, 0.5);
      g.lineBetween(0, H - 90, W, H - 90);
      g.generateTexture(d.key, W, H);
      g.destroy();
    }
    const p = this.add.graphics();
    for (let y = 0; y < H; y += 4) {
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.IntegerToColor(0x12101a),
        Phaser.Display.Color.IntegerToColor(0x070509), H, y);
      p.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
      p.fillRect(0, y, W, 4);
    }
    p.fillStyle(0x2a2238, 0.10);
    p.fillCircle(W / 2, H * 0.34, 360);
    p.generateTexture('bg-plain', W, H);
    p.destroy();
  }

  // Placeholder potret (dipakai bila foto asli tidak ada).
  makePortraits() {
    for (const v of VISITORS) {
      const w = 460, h = 640;
      const g = this.add.graphics();
      const base = Phaser.Display.Color.HexStringToColor(v.color || '#888');
      const dark = base.clone().darken(64);
      for (let y = 0; y < h; y += 3) {
        const c = Phaser.Display.Color.Interpolate.ColorWithColor(base, dark, h, y);
        g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
        g.fillRect(0, y, w, 3);
      }
      g.fillStyle(0x000000, 0.34);
      g.fillCircle(w / 2, h * 0.30, w * 0.20);
      g.fillRoundedRect(w * 0.22, h * 0.50, w * 0.56, h * 0.6, 48);

      const tempKey = 'temp-ph-bg-' + v.id;
      g.generateTexture(tempKey, w, h);
      g.destroy();

      const rt = this.add.renderTexture(0, 0, w, h).setVisible(false);
      const img = this.add.image(0, 0, tempKey).setOrigin(0);
      const letter = this.add.text(w / 2, h * 0.30, (v.name[0] || '?').toUpperCase(), {
        fontFamily: 'Syne, sans-serif', fontSize: '96px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5).setAlpha(0.82);
      rt.draw(img); rt.draw(letter);
      rt.saveTexture('ph-' + v.id);

      this.textures.remove(tempKey);
      img.destroy(); letter.destroy(); rt.destroy();
    }
  }

  makeDots() {
    const d = this.add.graphics();
    d.fillStyle(0xe8c468, 1); d.fillCircle(3, 3, 3);
    d.generateTexture('dot', 6, 6); d.destroy();
  }
}