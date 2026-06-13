// MenuScene.js — Menu utama: Mulai · Lanjutkan (jika ada save) · Kredit
import { SaveManager } from '../engine/save.js';
import { UI } from '../ui.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    UI.unmount();
    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.9);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.42);
    this.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W }, y: { min: 0, max: H }, lifespan: 6000,
      speedY: { min: -8, max: -20 }, scale: { start: 0.5, end: 0 },
      alpha: { start: 0.32, end: 0 }, frequency: 260, tint: 0xe8c468,
    });

    const title = this.add.text(W / 2, H * 0.26, 'PLEASE, LET ME IN!', {
      fontFamily: 'Syne, sans-serif', fontSize: '60px', color: '#f2e6c9', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(W / 2, H * 0.26 + 50, 'L A N T A I   7', {
      fontFamily: 'Syne, sans-serif', fontSize: '18px', color: '#e8c468', letterSpacing: 8,
    }).setOrigin(0.5);
    this.add.text(W / 2, H * 0.40,
      'Wabah bioweapon mengubah orang jadi zombie — tapi mereka tampak\n' +
      'normal berjam-jam. Sebagai penjaga rusun, periksa tiap penghuni\n' +
      'yang mengetuk, lalu putuskan: buka pintu, atau tolak mereka.',
      { fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#a9a2b3', align: 'center', lineSpacing: 6 }
    ).setOrigin(0.5);

    this.tweens.add({ targets: title, alpha: { from: 1, to: 0.82 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const hasSave = SaveManager.has();
    const sum = hasSave ? SaveManager.summary() : null;

    const btns = [];
    btns.push({ label: 'MULAI BARU', action: () => this.startNew() });
    if (hasSave) {
      btns.push({ label: `LANJUTKAN  (Hari ${sum.day})`, action: () => this.continueGame(), accent: true });
    }
    btns.push({ label: 'LORE & REFERENSI', action: () => this.scene.start('LoreScene'), ghost: true });
    btns.push({ label: 'KREDIT', action: () => this.scene.start('CreditScene'), ghost: true });

    let y = H * 0.56;
    const gap = btns.length >= 5 ? 56 : 62;
    for (const b of btns) {
      const bg = b.ghost ? 0x16141c : (b.accent ? 0x2f6a5c : 0xe8c468);
      const fg = b.ghost ? '#e8c468' : (b.accent ? '#ffffff' : '#16141c');
      const rect = this.add.rectangle(W / 2, y, 280, 46, bg).setInteractive({ useHandCursor: true });
      if (b.ghost) rect.setStrokeStyle(1, 0x35313f);
      const txt = this.add.text(W / 2, y, b.label, {
        fontFamily: 'Syne, sans-serif', fontSize: '15px', color: fg, fontStyle: 'bold',
      }).setOrigin(0.5);
      rect.on('pointerover', () => { rect.setScale(1.04); txt.setScale(1.04); });
      rect.on('pointerout', () => { rect.setScale(1); txt.setScale(1); });
      rect.on('pointerdown', b.action);
      y += gap;
    }

    this.add.text(W / 2, H - 24, 'Tugas Game Edukasi & Simulasi · Informatika ITS 2026',
      { fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5e5868' }).setOrigin(0.5);
  }

  startNew() {
    this.cameras.main.fadeOut(380, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('NameScene'));
  }
  continueGame() {
    this.cameras.main.fadeOut(380, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameScene', { continue: true }));
  }
}
