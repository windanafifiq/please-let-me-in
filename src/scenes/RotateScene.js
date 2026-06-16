// RotateScene.js — Sambutan "putar perangkat" untuk pemain di layar portrait (HP).
// - Di laptop/desktop (layar lebar / landscape): LANGSUNG skip ke WarningScene.
// - Di HP/portrait: tampilkan animasi putar HP, lalu AUTO-lanjut setelah beberapa
//   detik (tanpa tombol) ke WarningScene.

export default class RotateScene extends Phaser.Scene {
  constructor() { super('RotateScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    const isPortrait = window.innerHeight > window.innerWidth;

    this.cameras.main.fadeIn(250);
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0810, 1);
    this.add.rectangle(W / 2, H / 2, W, H, 0x1a1228, 0.4);

    this.mountDom(isPortrait);

    // Selalu auto-lanjut ke WarningScene (tak menunggu input pemain).
    this.time.delayedCall(4500, () => this.proceed());
  }

  mountDom(isPortrait) {
    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';
    root.innerHTML = `
      <div class="rotate-screen">
        <div class="rotate-card">
          <div class="rotate-icon" aria-hidden="true">
            <div class="rot-phone"></div>
          </div>
          <div class="rotate-title">Putar Perangkatmu</div>
          <div class="rotate-sub">Untuk pengalaman terbaik, mainkan dalam mode lanskap (horizontal).</div>
          <div class="rotate-dots"><span></span><span></span><span></span></div>
          <div class="rotate-note">Abaikan jika perangkatmu sudah dalam mode lanskap.</div>
        </div>
      </div>
    `;
  }

  proceed() {
    const root = document.getElementById('ui-root');
    if (root) { root.innerHTML = ''; root.style.pointerEvents = 'none'; }
    this.cameras.main.fadeOut(300, 5, 6, 10);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('WarningScene'));
  }
}