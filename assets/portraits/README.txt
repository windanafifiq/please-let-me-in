FOTO KARAKTER — konvensi penamaan
==================================
Taruh foto half-body / potret karakter di folder ini.

Format: PNG (transparan lebih bagus) atau JPG. Disarankan ~600x800 px (potret).

Penamaan per karakter (id: v01..v06):
  v01_neutral.png   v01_evade.png   v01_emote.png
  v02_neutral.png   v02_evade.png   v02_emote.png
  ... dst

Keterangan ekspresi (dipetakan dari DemeanorFSM):
  neutral  -> sikap "tenang" & "defensif"   (ekspresi biasa/tenang)
  evade    -> sikap "mengelak"               (gugup, mata menghindar)
  emote    -> sikap "membuka" / "memberontak"(lega-sedih ATAU marah)

MINIMAL: cukup sediakan v0X_neutral.png saja — game tetap jalan (statis).
Kalau ada evade/emote, ekspresi otomatis berganti mengikuti state FSM.

Karakter:
  v01 = Deni        (teknisi muda, pucat)        — terinfeksi
  v02 = Ibu Sari    (bidan pensiunan, paruh baya)— sehat
  v03 = Rina        (mahasiswi, panik)           — sehat
  v04 = Joko        (sopir, jaket tebal)         — terinfeksi (pembohong)
  v05 = Pak Hadi    (kakek renta, tongkat)       — terinfeksi (jujur)
  v06 = Orang Asing (berseragam, mencurigakan)   — sehat (penipu)

Latar (opsional) taruh di assets/bg/ :
  door.png  (koridor + pintu, 1280x720)
