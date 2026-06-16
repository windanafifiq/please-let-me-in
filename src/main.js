// main.js
import BootScene from './scenes/BootScene.js';
import RotateScene from './scenes/RotateScene.js';
import WarningScene from './scenes/WarningScene.js';
import MenuScene from './scenes/MenuScene.js';
import NameScene from './scenes/NameScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameScene from './scenes/GameScene.js';
import EndScene from './scenes/EndScene.js';
import CreditScene from './scenes/CreditScene.js';
import LoreScene from './scenes/LoreScene.js';
import TutorialScene from './scenes/TutorialScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#05060a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    min: { width: 320, height: 180 },
    max: { width: 2560, height: 1440 }
  },
  render: { antialias: true, pixelArt: false },
  // Alur awal: RotateScene (HP saja) → WarningScene → BootScene (loading) → MenuScene
  scene: [RotateScene, WarningScene, BootScene, MenuScene, NameScene, IntroScene, GameScene, EndScene, CreditScene, LoreScene, TutorialScene],
};
window.__GAME__ = new Phaser.Game(config);

// Global Helper untuk SFX Klik
window.playClickSFX = () => {
  if (!window.__GAME__ || !window.__GAME__.sound) return;

  const sm = window.__GAME__.sound;
  if (sm.context && sm.context.state === 'suspended') {
    sm.context.resume();
  }
  
  if (window.__GAME__.cache.audio.exists('sfx-click')) {
    // Volume stabil 0.6 tanpa variasi nada agar suara tetap bulat/utuh
    sm.play('sfx-click', { volume: 0.6 });
  }
};

// Pancingan Audio: Paksa bangunkan AudioContext pada klik pertama di layar
const unlockAudio = () => {
  if (window.__GAME__ && window.__GAME__.sound && window.__GAME__.sound.context) {
    if (window.__GAME__.sound.context.state === 'suspended') {
      window.__GAME__.sound.context.resume();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  }
};
document.addEventListener('click', unlockAudio);
document.addEventListener('touchstart', unlockAudio);


// Global DOM Click Listener (untuk tombol di UI-root)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, .action-btn, .barrier-btn, .verdict-btn, .warn-btn, .intro-btn, .name-btn, .end-btn, .lore-btn, .credit-btn, .tut-btn');
  if (btn) {
    window.playClickSFX();
  }
}, true);