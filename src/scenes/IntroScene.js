// IntroScene.js — cerita pembuka (outbreak bioweapon), pakai nama player.
export default class IntroScene extends Phaser.Scene {
  constructor() { super('IntroScene'); }
  init(data) { this.playerName = data.playerName || 'Penjaga'; }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.cameras.main.fadeIn(400);

    // Mulai music latar game (bg-2)
    const bgm = this.sound.get('bgm-game');
    if (!bgm) {
      this.sound.play('bgm-game', { loop: true, volume: 0.35 });
    } else if (!bgm.isPlaying) {
      bgm.play();
    }

    this.add.image(W / 2, H / 2, 'photo-door')
      .setDisplaySize(W, H)
      .setAlpha(0.7);

    this.add.rectangle(
      W / 2,
      H / 2,
      W,
      H,
      0x05060a,
      0.6
    );

    const name = this.playerName;

    const pages = [
      [
        '4 Desember 2024, 01:45 AM.',

        'Di Nusaraya, sebuah kota pelabuhan yang tenang, aktivitas berjalan seperti biasa.',

        'Di bawah Rumah Sakit Umum Nusaraya, tersembunyi sebuah laboratorium rahasia milik negara.',

        'Keberadaannya dirahasiakan dari publik dan hanya diketahui oleh segelintir pejabat tinggi.',

        'Dini hari, sebuah insiden terjadi.',

        'Sesuatu berhasil keluar dari laboratorium tersebut.'
      ],

      [
        '4 Desember 2024, 19:30 PM.',

        'Beberapa warga mulai berdatangan ke rumah sakit dengan gejala yang tidak biasa.',

        'Demam tinggi. Nyeri hebat. Kelelahan mendadak.',

        'Sebagian dokter menganggapnya sebagai penyakit musiman.',

        'Namun jumlah pasien terus bertambah dari jam ke jam.',

        'Sementara itu, pemerintah masih menutup informasi mengenai insiden yang terjadi pagi tadi.',

        'Tidak ada yang tahu apakah kebocoran itu merupakan kecelakaan... atau sesuatu yang disengaja.'
      ],

      [
        '4 Desember 2024, 23:50 PM.',

        'Kota Nusaraya memasuki fase outbreak.',

        'Ruang gawat darurat penuh. Ambulans terus berdatangan. Jalan-jalan mulai ditutup.',

        'Karantina darurat diumumkan di seluruh kota.',

        'Mereka yang terinfeksi tidak langsung terlihat sakit.',

        'Mereka masih bisa berjalan. Masih bisa berbicara. Masih bisa memohon untuk diselamatkan.',

        'Namun dalam waktu kurang dari 48 jam, sebagian besar korban akan mati.',

        `Kau, ${name}, kini menjaga sebuah rumah susun yang tersegel dari dunia luar.`,

        'Selama beberapa hari ke depan, setiap orang yang mengetuk pintumu harus diperiksa.',

        'Satu keputusan yang salah.',

        'Satu gedung yang mati.'
      ]
    ];

    const root = document.getElementById('ui-root');
    root.style.pointerEvents = 'auto';

    root.innerHTML = `
      <div class="intro-screen">
        <div class="intro-body" id="intro-body"></div>
        <button id="intro-next" class="intro-btn">
          LANJUT ▸
        </button>
      </div>
    `;

    const body = document.getElementById('intro-body');
    const nextBtn = document.getElementById('intro-next');

    let currentPage = 0;

    const renderPage = () => {
      body.innerHTML = '';

      let i = 0;

      const showNext = () => {
        if (i >= pages[currentPage].length) return;

        const p = document.createElement('p');

        p.className =
          'intro-p' + (i === 0 ? ' intro-stamp' : '');

        p.textContent = pages[currentPage][i];

        body.appendChild(p);

        setTimeout(() => {
          p.classList.add('show');
          p.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }, 50);

        i++;

        if (i < pages[currentPage].length) {
          this.time.delayedCall(850, showNext);
        }
      };

      showNext();

      if (currentPage === pages.length - 1) {
        nextBtn.textContent = 'MULAI BERTUGAS ▸';
      } else {
        nextBtn.textContent = 'LANJUT ▸';
      }
    };

    renderPage();

    nextBtn.onclick = () => {
      currentPage++;

      if (currentPage >= pages.length) {
        root.innerHTML = '';
        root.style.pointerEvents = 'none';

        this.cameras.main.fadeOut(420, 5, 6, 10);

        this.cameras.main.once(
          'camerafadeoutcomplete',
          () => {
            this.scene.start('GameScene', {
              newGame: true,
              playerName: name
            });
          }
        );

        return;
      }

      renderPage();
    };
  }
}