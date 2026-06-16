// MenuScene.js — Menu utama + tombol bendera bahasa (🇮🇩/🇬🇧) pojok kanan atas
import { SaveManager } from '../engine/save.js';
import { UI } from '../ui.js';
import { t, getLang, setLang } from '../i18n.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    UI.unmount();

    // Suara judul ala Resident Evil (sekali per sesi game)
    if (!this.registry.get('titleVoicePlayed')) {
      this.registry.set('titleVoicePlayed', true);
      this.time.delayedCall(500, () => {
        this.sound.play('sfx-title-voice', { volume: 0.8 });
        this.time.delayedCall(2200, () => { this.playMenuBGM(); });
      });
    } else {
      this.playMenuBGM();
    }

    const isCompact = W < 760 || H < 680;
    const titleSize = isCompact ? '52px' : '80px';
    const subSize = isCompact ? '18px' : '24px';
    const titleY = H * 0.22;
    const subY = H * 0.38;

    const bgNormal = this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H);

    const bgHorror = this.add
      .image(W / 2, H / 2, 'bg-horror').setDisplaySize(W, H).setAlpha(0).setDepth(5);

    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.42);

    const flash = this.add
      .rectangle(W / 2, H / 2, W, H, 0xffffff).setAlpha(0).setDepth(20);

    const triggerLightning = () => {
      this.sound.play('sfx-thunder', { volume: 0.8 });
      this.time.delayedCall(800, () => {
        flash.setAlpha(0.3).setBlendMode(Phaser.BlendModes.ADD);
        this.cameras.main.shake(200, 0.005);
        this.tweens.add({
          targets: bgHorror, alpha: 0.3, duration: 180, ease: 'Sine.out',
          onComplete: () => {
            this.time.delayedCall(750, () => {
              this.tweens.add({ targets: bgHorror, alpha: 0, duration: 600, ease: 'Sine.in' });
              this.tweens.add({ targets: flash, alpha: 0, duration: 350 });
            });
          }
        });
      });
      this.time.delayedCall(Phaser.Math.Between(5000, 10000), triggerLightning);
    };
    this.time.delayedCall(3000, triggerLightning);

    this.add.particles(0, 0, 'dot', {
      x: { min: 0, max: W }, y: { min: 0, max: H }, lifespan: 6000,
      speedY: { min: -8, max: -20 }, scale: { start: 0.5, end: 0 },
      alpha: { start: 0.32, end: 0 }, frequency: 260, tint: 0xe8c468,
    });

    const title = this.add.text(W / 2, titleY, 'PLEASE, LET ME IN!', {
      fontFamily: '"Creepster", cursive', fontSize: titleSize, color: '#B11226', fontStyle: 'bold',
    }).setOrigin(0.5);

    const titleRed = this.add.text(W / 2, titleY, 'PLEASE, LET ME IN!', {
      fontFamily: '"Creepster", cursive', fontSize: titleSize, color: '#ff2d2d',
    }).setOrigin(0.5).setAlpha(0);

    const titleBlue = this.add.text(W / 2, titleY, 'PLEASE, LET ME IN!', {
      fontFamily: '"Creepster", cursive', fontSize: titleSize, color: '#00d9ff',
    }).setOrigin(0.5).setAlpha(0);

    title.setDepth(10); titleRed.setDepth(9); titleBlue.setDepth(9);

    this.subText = this.add.text(W / 2, subY, t('menu.sub'), {
      fontFamily: 'Special Elite, cursive', fontSize: subSize,
      color: '#B8B3C2', align: 'center', lineSpacing: 8,
    }).setOrigin(0.5);

    this.tweens.add({ targets: title, alpha: { from: 1, to: 0.82 }, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const glitch = () => {
      const offset = Phaser.Math.Between(2, 5);
      titleRed.setPosition(title.x - offset, title.y);
      titleBlue.setPosition(title.x + offset, title.y);
      titleRed.setAlpha(0.7); titleBlue.setAlpha(0.7);
      title.x += Phaser.Math.Between(-2, 2);
      this.time.delayedCall(80, () => {
        titleRed.setAlpha(0); titleBlue.setAlpha(0);
        title.x = W / 2;
        this.time.delayedCall(Phaser.Math.Between(1000, 3000), glitch);
      });
    };
    glitch();

    const hasSave = SaveManager.has();

    const btns = [];
    btns.push({ label: t('menu.new'), action: () => this.startNew() });
    if (hasSave) {
      btns.push({ label: t('menu.continue'), action: () => this.continueGame(), accent: true });
    }
    btns.push({ label: t('menu.tutorial'), action: () => this.scene.start('TutorialScene'), ghost: true });
    btns.push({ label: t('menu.lore'), action: () => this.scene.start('LoreScene'), ghost: true });
    btns.push({ label: t('menu.credit'), action: () => this.scene.start('CreditScene'), ghost: true });

    const btnW = 380, btnH = 52;
    const safeTop = subY + 56;
    const bottomPad = 70;
    const avail = (H - bottomPad) - safeTop;
    const gap = Math.min(62, avail / btns.length);
    let y = safeTop + gap / 2;
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
      rect.on('pointerdown', () => { window.playClickSFX(); b.action(); });
      y += gap;
    }

    this.add.text(W / 2, H - 24, t('menu.footer'), {
      fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5e5868',
    }).setOrigin(0.5);

    // ── Tombol bendera bahasa (pojok kanan atas) ──────────────
    this._addLangButton(W, H);
  }

  _addLangButton(W, H) {
    const lang = getLang();
    const label = lang === 'id' ? 'INDONESIA' : 'ENGLISH';

    const bw = 158, bh = 44;
    const bx = W - bw / 2 - 20;
    const by = bh / 2 + 20;

    // ── Container biar semua gerak bareng & scale dari tengah ──
    const cont = this.add.container(bx, by).setDepth(100);

    // Background (digambar relatif ke center container → 0,0)
    const bg = this.add
      .rectangle(0, 0, bw, bh, 0x1a1821, 0.85)
      .setStrokeStyle(2, 0xe8c468, 0.6)
      .setInteractive({ useHandCursor: true });

    // ── Bendera vektor, posisi KIRI dalam tombol ──
    const fw = 30, fh = 20;
    const flagX = -bw / 2 + 16 + fw / 2;   // 16px padding dari kiri
    const flag = this.add.graphics();
    this._drawFlag(flag, lang, flagX, 0, fw, fh);

    // ── Teks, tepat di kanan bendera ──
    const txt = this.add.text(flagX + fw / 2 + 12, 0, label, {
      fontFamily: 'Syne, sans-serif',
      fontSize: '13px',
      color: '#e8c468',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    cont.add([bg, flag, txt]);

    const toggle = () => {
      window.playClickSFX();
      setLang(lang === 'id' ? 'en' : 'id');
      this.scene.restart();
    };

    bg.on('pointerover', () => {
      bg.setFillStyle(0x322e3c, 0.95);
      cont.setScale(1.05);          // scale SELURUH container dari center
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x1a1821, 0.85);
      cont.setScale(1);
    });
    bg.on('pointerdown', toggle);
  }

  // Gambar bendera terpusat di (cx, cy) relatif ke origin Graphics.
  _drawFlag(g, lang, cx, cy, w, h) {
    const x = cx - w / 2, y = cy - h / 2, r = 3;

    if (lang === 'id') {
      g.fillStyle(0xce1126, 1);
      g.fillRoundedRect(x, y, w, h / 2 + 1, { tl: r, tr: r, bl: 0, br: 0 });
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(x, y + h / 2, w, h / 2, { tl: 0, tr: 0, bl: r, br: r });
    } else {
      g.fillStyle(0x012169, 1);
      g.fillRoundedRect(x, y, w, h, r);
      g.lineStyle(5, 0xffffff, 1);
      g.beginPath(); g.moveTo(x, y);     g.lineTo(x + w, y + h); g.strokePath();
      g.beginPath(); g.moveTo(x + w, y); g.lineTo(x, y + h);     g.strokePath();
      g.lineStyle(2, 0xc8102e, 1);
      g.beginPath(); g.moveTo(x, y);     g.lineTo(x + w, y + h); g.strokePath();
      g.beginPath(); g.moveTo(x + w, y); g.lineTo(x, y + h);     g.strokePath();
      g.fillStyle(0xffffff, 1);
      g.fillRect(x + w / 2 - 4, y, 8, h);
      g.fillRect(x, y + h / 2 - 3, w, 6);
      g.fillStyle(0xc8102e, 1);
      g.fillRect(x + w / 2 - 2, y, 4, h);
      g.fillRect(x, y + h / 2 - 1.5, w, 3);
    }

    g.lineStyle(1, 0xe8c468, 0.7);
    g.strokeRoundedRect(x, y, w, h, r);
  }

  // Gambar bendera vektor terpusat di (cx, cy) dengan ukuran w×h.
  _drawFlag(g, lang, cx, cy, w, h) {
    const x = cx - w / 2, y = cy - h / 2, r = 3;

    if (lang === 'id') {
      // Indonesia: merah di atas, putih di bawah
      g.fillStyle(0xce1126, 1);
      g.fillRoundedRect(x, y, w, h / 2 + 1, { tl: r, tr: r, bl: 0, br: 0 });
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(x, y + h / 2, w, h / 2, { tl: 0, tr: 0, bl: r, br: r });
    } else {
      // Inggris (Union Jack disederhanakan, tetap rapi di ukuran kecil)
      g.fillStyle(0x012169, 1);
      g.fillRoundedRect(x, y, w, h, r);
      // diagonal putih
      g.lineStyle(5, 0xffffff, 1);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + h); g.strokePath();
      g.beginPath(); g.moveTo(x + w, y); g.lineTo(x, y + h); g.strokePath();
      // diagonal merah (lebih tipis)
      g.lineStyle(2, 0xc8102e, 1);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + h); g.strokePath();
      g.beginPath(); g.moveTo(x + w, y); g.lineTo(x, y + h); g.strokePath();
      // salib putih tengah
      g.fillStyle(0xffffff, 1);
      g.fillRect(x + w / 2 - 4, y, 8, h);
      g.fillRect(x, y + h / 2 - 3, w, 6);
      // salib merah tengah
      g.fillStyle(0xc8102e, 1);
      g.fillRect(x + w / 2 - 2, y, 4, h);
      g.fillRect(x, y + h / 2 - 1.5, w, 3);
    }

    // bingkai tipis emas agar nyatu tema
    g.lineStyle(1, 0xe8c468, 0.7);
    g.strokeRoundedRect(x, y, w, h, r);
  }

  startNew() {
    this.sound.stopByKey('bgm-main');
    this.cameras.main.fadeOut(380, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('NameScene'));
  }

  continueGame() {
    this.sound.stopByKey('bgm-main');
    this.cameras.main.fadeOut(380, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameScene', { continue: true }));
  }

  playMenuBGM() {
    let bgm = this.sound.get('bgm-main');
    if (!bgm) {
      bgm = this.sound.add('bgm-main', { loop: true, volume: 0.3 });
      bgm.play();
    } else if (!bgm.isPlaying) {
      bgm.play();
    }
  }
}