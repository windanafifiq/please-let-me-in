// main.js
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import NameScene from './scenes/NameScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameScene from './scenes/GameScene.js';
import EndScene from './scenes/EndScene.js';
import CreditScene from './scenes/CreditScene.js';
import LoreScene from './scenes/LoreScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#05060a',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720, forceOrientation: true, orientation: Phaser.Scale.LANDSCAPE },
  render: { antialias: true, pixelArt: false },
  scene: [BootScene, MenuScene, NameScene, IntroScene, GameScene, EndScene, CreditScene, LoreScene],
};
window.__GAME__ = new Phaser.Game(config);
