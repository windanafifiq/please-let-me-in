// MenuScene.js — Menu utama: Mulai · Lanjutkan (jika ada save) · Cara Bermain · Kredit
import { SaveManager } from '../engine/save.js';
import { UI } from '../ui.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    UI.unmount();

    // Ukuran adaptif: kecilkan judul di layar sempit/pendek agar tak nabrak tombol
    const isCompact = W < 760 || H < 680;
    const titleSize = isCompact ? '52px' : '80px';
    const subSize = isCompact ? '18px' : '24px';
    const titleY = H * 0.22;
    const subY = H * 0.38;

    const bgNormal = this.add
      .image(W / 2, H / 2, 'bg-plain')
      .setDisplaySize(W, H);

    const bgHorror = this.add
      .image(W / 2, H / 2, 'bg-horror')
      .setDisplaySize(W, H)
      .setAlpha(0)
      .setDepth(5);

    // Overlay gelap
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.42);

    // Flash putih untuk petir
    const flash = this.add
      .rectangle(W / 2, H / 2, W, H, 0xffffff)
      .setAlpha(0)
      .setDepth(20);

    // Efek petir
    const triggerLightning = () => {

      // cahaya petir lembut
      flash.setAlpha(0.12);

      this.cameras.main.shake(250, 0.002);

      // door2 muncul perlahan
      this.tweens.add({
        targets: bgHorror,
        alpha: 0.3,
        duration: 180,
        ease: 'Sine.out',

        onComplete: () => {

          // tahan sebentar supaya sempat terlihat
          this.time.delayedCall(250, () => {

            // hilang perlahan
            this.tweens.add({
              targets: bgHorror,
              alpha: 0,
              duration: 350,
              ease: 'Sine.in'
            });

            this.tweens.add({
              targets: flash,
              alpha: 0,
              duration: 350
            });

          });

        }
      });

      this.time.delayedCall(
        Phaser.Math.Between(5000, 10000),
        triggerLightning
      );
    };

    this.time.delayedCall(3000, triggerLightning);

    // Partikel
    this.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W },
      y: { min: 0, max: H },
      lifespan: 6000,
      speedY: { min: -8, max: -20 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.32, end: 0 },
      frequency: 260,
      tint: 0xe8c468,
    });

    const title = this.add.text(W / 2, titleY, 'PLEASE, LET ME IN!', {
      fontFamily: '"Creepster", cursive',
      fontSize: titleSize,
      color: '#B11226',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // RGB layers
    const titleRed = this.add.text(
      W / 2, titleY,
      'PLEASE, LET ME IN!',
      {
        fontFamily: '"Creepster", cursive',
        fontSize: titleSize,
        color: '#ff2d2d'
      }
    ).setOrigin(0.5).setAlpha(0);

    const titleBlue = this.add.text(
      W / 2, titleY,
      'PLEASE, LET ME IN!',
      {
        fontFamily: '"Creepster", cursive',
        fontSize: titleSize,
        color: '#00d9ff'
      }
    ).setOrigin(0.5).setAlpha(0);

    title.setDepth(10);
    titleRed.setDepth(9);
    titleBlue.setDepth(9);

    this.add.text(W / 2, subY,
      'Satu keputusanmu yang salah,\n' +
      'Satu gedung yang akan menanggung akibatnya!',
      {
        fontFamily: 'Special Elite, cursive',
        fontSize: subSize,
        color: '#B8B3C2',
        align: 'center',
        lineSpacing: 8
      }
    ).setOrigin(0.5);

    this.tweens.add({ targets: title, alpha: { from: 1, to: 0.82 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const glitch = () => {

      const offset = Phaser.Math.Between(2, 5);

      titleRed.setPosition(title.x - offset, title.y);
      titleBlue.setPosition(title.x + offset, title.y);

      titleRed.setAlpha(0.7);
      titleBlue.setAlpha(0.7);

      title.x += Phaser.Math.Between(-2, 2);

      this.time.delayedCall(80, () => {

        titleRed.setAlpha(0);
        titleBlue.setAlpha(0);

        title.x = W / 2;

        this.time.delayedCall(
          Phaser.Math.Between(1000, 3000),
          glitch
        );
      });
    };

    glitch();

    const hasSave = SaveManager.has();
    const sum = hasSave ? SaveManager.summary() : null;

    const btns = [];
    btns.push({ label: 'START GAME', action: () => this.startNew() });
    if (hasSave) {
      btns.push({ label: `CONTINUE`, action: () => this.continueGame(), accent: true });
    }
    btns.push({ label: 'CARA BERMAIN', action: () => this.scene.start('TutorialScene'), ghost: true });
    btns.push({ label: 'LORE & REFERENCE', action: () => this.scene.start('LoreScene'), ghost: true });
    btns.push({ label: 'CREDIT', action: () => this.scene.start('CreditScene'), ghost: true });

    // Susun tombol mulai DI BAWAH subtitle, bukan dari titik tengah layar.
    // Dengan begitu tombol tidak pernah naik menabrak teks di atasnya.
    const btnW = 380, btnH = 52;
    const safeTop = subY + 56;        // mulai sedikit di bawah subtitle
    const bottomPad = 70;             // sisakan ruang untuk teks footer di bawah
    // Hitung gap agar seluruh tombol muat antara safeTop dan bawah layar.
    const avail = (H - bottomPad) - safeTop;
    const gap = Math.min(62, avail / btns.length);  // padat otomatis jika sempit
    let y = safeTop + gap / 2;        // pusat tombol pertama
    for (const b of btns) {
      const bg = b.ghost ? 0x16141c : (b.accent ? 0x6e0b14 : 0xe8c468);
      const fg = b.ghost ? '#e8c468' : (b.accent ? '#ffffff' : '#16141c');

      const rect = this.add.rectangle(W / 2, y, btnW, btnH, bg).setInteractive({ useHandCursor: true });
      if (b.ghost) rect.setStrokeStyle(2, 0xe8c468, 0.5);

      const txt = this.add.text(W / 2, y, b.label, {
        fontFamily: 'syne, sans-serif', fontSize: '19px', color: fg, fontStyle: 'bold',
      }).setOrigin(0.5);

      rect.on('pointerover', () => { rect.setScale(1.05); txt.setScale(1.05); rect.setAlpha(0.9); });
      rect.on('pointerout', () => { rect.setScale(1); txt.setScale(1); rect.setAlpha(1); });
      rect.on('pointerdown', b.action);
      y += gap;
    }

    this.add.text(W / 2, H - 24, 'Tugas Final Projek Game Edukasi & Simulasi · Teknik Informatika ITS 2026 · © 2026 Please Let Me In! All rights reserved',
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