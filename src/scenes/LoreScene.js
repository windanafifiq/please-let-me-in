// LoreScene.js — Lore VRS-24 + referensi game (bilingual)
import { t } from '../i18n.js';

export default class LoreScene extends Phaser.Scene {
  constructor() { super('LoreScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(360);

    const bgm = this.sound.get('bgm-main');
    if (bgm && !bgm.isPlaying) bgm.play();

    this.add.image(W / 2, H / 2, 'bg-plain').setDisplaySize(W, H).setAlpha(0.6);
    this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.55);

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="lore-screen">
        <div class="lore-head">${t('lore.head1')}</div>
        <div class="lore-scroll">
          <div class="lore-sec">
            <h3>${t('lore.vrs.h')}</h3>
            <p>${t('lore.vrs.p')}</p>
          </div>

          <div class="lore-sec">
            <h3>${t('lore.symp.h')}</h3>
            <p>${t('lore.symp.p')}</p>
          </div>

          <div class="lore-sec">
            <h3>${t('lore.weapon.h')}</h3>
            <p>${t('lore.weapon.p')}</p>
          </div>
        </div>

        <div class="lore-head">${t('lore.head2')}</div>
        <div class="lore-scroll">

          <div class="lore-disc lore-disc-top">
            ${t('lore.disc1')}
          </div>

          <div class="lore-sec">
            <h3>${t('lore.small.h')}</h3>
            <p>${t('lore.small.p')}</p>
          </div>

          <div class="lore-sec">
            <h3>${t('lore.tells.h')}</h3>
            <p>${t('lore.tells.p')}</p>
          </div>

          <div class="lore-sec">
            <h3>${t('lore.bioweapon.h')}</h3>
            <p>${t('lore.bioweapon.p1')}</p>
            <p>${t('lore.bioweapon.p2')}</p>
          </div>

          <div class="lore-sec">
            <h3>${t('lore.end.h')}</h3>
            <p>${t('lore.end.p')}</p>
          </div>

          <div class="lore-sec">
            <h3>${t('lore.mechanic.h')}</h3>
            <p>${t('lore.mechanic.p')}</p>
          </div>

          <div class="lore-sec lore-sources">
            <h3>${t('lore.sources.h')}</h3>
            <ul>
              <li>World Health Organization (WHO) — Smallpox overview &amp; history</li>
              <li>Centers for Disease Control and Prevention (CDC) — About Smallpox; Bioterrorism &amp; Smallpox</li>
              <li>NIH / NCBI Bookshelf — Smallpox and Vaccinia</li>
              <li>Encyclopædia Britannica — Smallpox</li>
              <li>History of Vaccines — Biological Weapons, Bioterrorism, and Vaccines</li>
            </ul>
          </div>

          <div class="lore-sec lore-sources">
            <h3>${t('lore.assets.h')}</h3>
            <ul>
              <li>${t('lore.assets.img')}</li>
              <li>${t('lore.assets.audio')}</li>
              <li>${t('lore.assets.font')}</li>
            </ul>
          </div>

          <div class="lore-disc">
            ${t('lore.disclaimer')}
          </div>

          <div style="display: flex; justify-content: center; width: 100%; margin-top: 20px; padding-bottom: 20px;">
            <button id="lore-back" class="lore-btn">${t('lore.back')}</button>
          </div>
        </div>
      </div>`;

    document.getElementById('lore-back').onclick = () => {
      root.innerHTML = ''; root.style.pointerEvents = 'none';
      this.cameras.main.fadeOut(320);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MenuScene'));
    };
  }
}