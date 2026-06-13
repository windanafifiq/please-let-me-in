// save.js — penyimpanan progres via localStorage (berfungsi di server lokal/web).
// Game ini file mandiri, jadi localStorage aman dipakai di browser pemain.

const KEY = 'floor7_save_v1';

export const SaveManager = {
  has() {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  },
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (e) { return false; }
  },
  clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  },
  // ringkasan untuk ditampilkan di tombol Continue
  summary() {
    const d = this.load();
    if (!d) return null;
    return { playerName: d.playerName || 'Penjaga', day: d.day || 1 };
  },
};
