// BootScene.js
// Memuat foto karakter asli jika ada (dengan varian ekspresi), dan menyiapkan
// placeholder potret VN yang lebih baik bila foto belum tersedia.
//
// Konvensi file (taruh di assets/portraits/):
//   v01_neutral.png  v01_evade.png  v01_emote.png   (evade & emote opsional)
// Minimal cukup v01_neutral.png. Game tetap jalan tanpa foto sama sekali.

import { VISITORS } from '../data/visitors.js';

const EXPR = ['neutral', 'evade', 'emote'];

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
    this.load.image('bg-plain', 'assets/bg/door.png');
    this.load.image('bg-horror', 'assets/bg/door2.png');

    // Coba muat foto asli (silently ignored bila tidak ada).
    // Catat key yg dicoba agar kita tahu mana yg berhasil di create().
    this._tried = {};
    for (const v of VISITORS) {
      this._tried[v.id] = [];
      for (const e of EXPR) {
        const key = `photo-${v.id}-${e}`;
        // .png lebih dulu; bila gagal, .jpg
        this.load.image(key, `assets/portraits/${v.id}_${e}.png`);
        this._tried[v.id].push({ key, expr: e });
      }
    }
    // Latar opsional
    this.load.image('photo-door', 'assets/bg/susun.png');
    // Foto kredit (opsional) — taruh di assets/credits/
    this.load.image('credit-maker1', 'assets/credits/maker1.png');
    this.load.image('credit-maker2', 'assets/credits/maker2.png');
    this.load.image('credit-lecturer', 'assets/credits/lecturer.png');

    // tangani file yg tidak ada tanpa menggagalkan boot
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
    // catat ketersediaan foto utk dipakai UI
    const registry = {};
    for (const v of VISITORS) {
      registry[v.id] = {};
      for (const e of EXPR) {
        const key = `photo-${v.id}-${e}`;
        registry[v.id][e] = this.textures.exists(key) && !this._failed.has(key) ? key : null;
      }
    }
    this.registry.set('photoRegistry', registry);
    this.registry.set('hasDoorPhoto', this.textures.exists('photo-door') && !this._failed.has('photo-door'));
    this.scene.start('MenuScene');
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
      // doorway frame glow
      g.fillStyle(d.glow, 0.22);
      g.fillRoundedRect(W / 2 - 220, 70, 440, H - 120, 36);
      g.lineStyle(2, d.glow, 0.45);
      g.strokeRoundedRect(W / 2 - 220, 70, 440, H - 120, 36);
      g.lineStyle(1, 0x2a2733, 0.5);
      g.lineBetween(0, H - 90, W, H - 90);
      g.generateTexture(d.key, W, H);
      g.destroy();
    }
    // Latar polos (tanpa frame pintu) untuk menu/nama/intro
    const p = this.add.graphics();
    for (let y = 0; y < H; y += 4) {
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.IntegerToColor(0x12101a),
        Phaser.Display.Color.IntegerToColor(0x070509), H, y);
      p.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
      p.fillRect(0, y, W, 4);
    }
    // sentuhan halus: cahaya redup di tengah-atas (radial), tanpa kotak
    p.fillStyle(0x2a2238, 0.10);
    p.fillCircle(W / 2, H * 0.34, 360);
    p.generateTexture('bg-plain', W, H);
    p.destroy();
  }

  // Placeholder potret VN (dipakai hanya jika foto asli tidak ada).
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
      // silhouette
      g.fillStyle(0x000000, 0.34);
      g.fillCircle(w / 2, h * 0.30, w * 0.20);
      g.fillRoundedRect(w * 0.22, h * 0.50, w * 0.56, h * 0.6, 48);
      g.lineStyle(3, Phaser.Display.Color.GetColor(
        Math.min(255, base.red + 50), Math.min(255, base.green + 50), Math.min(255, base.blue + 50)), 0.45);
      g.strokeCircle(w / 2, h * 0.30, w * 0.20);
      g.generateTexture('ph-' + v.id, w, h);
      g.destroy();

      const rt = this.add.renderTexture(0, 0, w, h).setVisible(false);
      const img = this.add.image(0, 0, 'ph-' + v.id).setOrigin(0);
      const letter = this.add.text(w / 2, h * 0.30, (v.name[0] || '?').toUpperCase(), {
        fontFamily: 'Syne, sans-serif', fontSize: '96px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5).setAlpha(0.82);
      rt.draw(img); rt.draw(letter);
      rt.saveTexture('ph-' + v.id);
      img.destroy(); letter.destroy(); rt.destroy();
    }
  }

  makeDots() {
    const d = this.add.graphics();
    d.fillStyle(0xe8c468, 1); d.fillCircle(3, 3, 3);
    d.generateTexture('dot', 6, 6); d.destroy();
  }
}
