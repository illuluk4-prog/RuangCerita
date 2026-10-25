export const quizSubjects = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fiqih",
  "Bahasa Arab",
  "Ekonomi",
  "Geografi",
  "Kimia",
  "Biologi",
  "Fisika",
  "Sosiologi",
] as const;

export type QuizSubject = (typeof quizSubjects)[number];
export type QuizLevel = 1 | 2 | 3;
export type QuizOptionLabel = "A" | "B" | "C" | "D";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { label: QuizOptionLabel; text: string }[];
  answer: QuizOptionLabel;
  explanation: string;
};

export const quizData: Record<QuizSubject, QuizQuestion[]> = {
  Matematika: [
    { id: "mat-01", prompt: "Berapakah 25% dari 200?", options: [{ label: "A", text: "25" }, { label: "B", text: "40" }, { label: "C", text: "50" }, { label: "D", text: "75" }], answer: "C", explanation: "25% sama dengan 1/4. Seperempat dari 200 adalah 50." },
    { id: "mat-02", prompt: "Jika x + 7 = 15, berapakah nilai x?", options: [{ label: "A", text: "6" }, { label: "B", text: "8" }, { label: "C", text: "9" }, { label: "D", text: "22" }], answer: "B", explanation: "Kurangi kedua ruas dengan 7: x = 15 - 7 = 8." },
    { id: "mat-03", prompt: "Sebuah persegi panjang memiliki panjang 8 cm dan lebar 5 cm. Berapa luasnya?", options: [{ label: "A", text: "13 cm²" }, { label: "B", text: "26 cm²" }, { label: "C", text: "40 cm²" }, { label: "D", text: "80 cm²" }], answer: "C", explanation: "Luas persegi panjang adalah panjang × lebar, yaitu 8 × 5 = 40 cm²." },
    { id: "mat-04", prompt: "Berapakah hasil 3/4 + 1/4?", options: [{ label: "A", text: "1/2" }, { label: "B", text: "1" }, { label: "C", text: "4/8" }, { label: "D", text: "2" }], answer: "B", explanation: "Penyebutnya sama, jadi jumlahkan pembilang: (3 + 1)/4 = 4/4 = 1." },
    { id: "mat-05", prompt: "Berapakah nilai 2³?", options: [{ label: "A", text: "6" }, { label: "B", text: "8" }, { label: "C", text: "9" }, { label: "D", text: "12" }], answer: "B", explanation: "Pangkat tiga berarti mengalikan 2 sebanyak tiga kali: 2 × 2 × 2 = 8." },
  ],
  "Bahasa Indonesia": [
    { id: "ind-01", prompt: "Kalimat yang paling tepat sebagai gagasan utama paragraf tentang manfaat membaca adalah ...", options: [{ label: "A", text: "Membaca menambah pengetahuan dan memperluas wawasan." }, { label: "B", text: "Buku itu berwarna biru." }, { label: "C", text: "Perpustakaan buka pukul delapan." }, { label: "D", text: "Kemarin hujan turun." }], answer: "A", explanation: "Gagasan utama menyatakan pokok pembahasan. Pilihan A merangkum manfaat membaca, sedangkan pilihan lain tidak mendukung topik itu." },
    { id: "ind-02", prompt: "Manakah penulisan kata baku yang benar?", options: [{ label: "A", text: "Aktifitas" }, { label: "B", text: "Ijin" }, { label: "C", text: "Risiko" }, { label: "D", text: "Nasehat" }], answer: "C", explanation: "Bentuk baku menurut KBBI adalah risiko. Bentuk baku lainnya ialah aktivitas, izin, dan nasihat." },
    { id: "ind-03", prompt: "Kalimat manakah yang menggunakan tanda baca dengan tepat?", options: [{ label: "A", text: "Ibu membeli beras gula dan telur." }, { label: "B", text: "Ibu membeli beras, gula, dan telur." }, { label: "C", text: "Ibu membeli, beras gula dan telur." }, { label: "D", text: "Ibu, membeli beras gula, dan telur." }], answer: "B", explanation: "Tanda koma memisahkan unsur-unsur dalam perincian, termasuk koma sebelum kata dan pada perincian tiga unsur." },
    { id: "ind-04", prompt: "Kata 'namun' dalam sebuah paragraf biasanya menyatakan hubungan ...", options: [{ label: "A", text: "Penambahan" }, { label: "B", text: "Pertentangan" }, { label: "C", text: "Sebab" }, { label: "D", text: "Tujuan" }], answer: "B", explanation: "Namun adalah konjungsi antarkalimat yang menandai pertentangan dengan pernyataan sebelumnya." },
    { id: "ind-05", prompt: "Manakah contoh kalimat efektif?", options: [{ label: "A", text: "Para siswa-siswa sedang belajar." }, { label: "B", text: "Mereka semua bersama-sama berkumpul." }, { label: "C", text: "Siswa kelas delapan mengikuti upacara." }, { label: "D", text: "Agar supaya sehat, kita berolahraga." }], answer: "C", explanation: "Kalimat C hemat dan memiliki susunan yang jelas. Pilihan lain memakai pengulangan yang tidak diperlukan." },
  ],
  "Bahasa Inggris": [
    { id: "eng-01", prompt: "Choose the correct word: 'She ___ to school every day.'", options: [{ label: "A", text: "go" }, { label: "B", text: "goes" }, { label: "C", text: "going" }, { label: "D", text: "gone" }], answer: "B", explanation: "In the simple present, a third-person singular subject such as 'she' takes a verb ending in -s or -es: goes." },
    { id: "eng-02", prompt: "What is the past form of 'visit'?", options: [{ label: "A", text: "Visits" }, { label: "B", text: "Visiting" }, { label: "C", text: "Visited" }, { label: "D", text: "Visitor" }], answer: "C", explanation: "Visit is a regular verb. Add -ed to form its simple past: visited." },
    { id: "eng-03", prompt: "Which word is closest in meaning to 'happy'?", options: [{ label: "A", text: "Glad" }, { label: "B", text: "Angry" }, { label: "C", text: "Tired" }, { label: "D", text: "Afraid" }], answer: "A", explanation: "Glad is a synonym of happy; both describe a positive feeling." },
    { id: "eng-04", prompt: "Complete the sentence: 'There are ___ apples in the basket.'", options: [{ label: "A", text: "much" }, { label: "B", text: "a" }, { label: "C", text: "three" }, { label: "D", text: "any" }], answer: "C", explanation: "Three is a countable number that fits the plural noun 'apples' in this affirmative sentence." },
    { id: "eng-05", prompt: "Which word is an adjective in 'The tall building is new.'?", options: [{ label: "A", text: "The" }, { label: "B", text: "building" }, { label: "C", text: "tall" }, { label: "D", text: "is" }], answer: "C", explanation: "Tall describes the noun building, so it functions as an adjective." },
  ],
  Fiqih: [
    { id: "fiq-01", prompt: "Bersuci dari hadas kecil sebelum salat dilakukan dengan ...", options: [{ label: "A", text: "Wudu" }, { label: "B", text: "Zakat" }, { label: "C", text: "Puasa" }, { label: "D", text: "Iktikaf" }], answer: "A", explanation: "Wudu adalah cara bersuci dari hadas kecil sebagai salah satu syarat sah salat." },
    { id: "fiq-02", prompt: "Zakat fitrah umumnya ditunaikan pada bulan ...", options: [{ label: "A", text: "Muharam" }, { label: "B", text: "Rajab" }, { label: "C", text: "Ramadan" }, { label: "D", text: "Safar" }], answer: "C", explanation: "Zakat fitrah ditunaikan pada bulan Ramadan dan batas waktunya sebelum salat Idulfitri." },
    { id: "fiq-03", prompt: "Salat wajib yang jumlah rakaatnya tiga adalah ...", options: [{ label: "A", text: "Subuh" }, { label: "B", text: "Zuhur" }, { label: "C", text: "Asar" }, { label: "D", text: "Magrib" }], answer: "D", explanation: "Salat Magrib terdiri dari tiga rakaat, sedangkan Subuh dua rakaat dan Zuhur serta Asar empat rakaat." },
    { id: "fiq-04", prompt: "Dalam akad mudharabah, pihak yang menyediakan modal disebut ...", options: [{ label: "A", text: "Mudharib" }, { label: "B", text: "Shahibul mal" }, { label: "C", text: "Mustahik" }, { label: "D", text: "Muzakki" }], answer: "B", explanation: "Shahibul mal menyediakan modal, sedangkan mudharib mengelola usaha dalam akad mudharabah." },
    { id: "fiq-05", prompt: "Salah satu hal yang membatalkan puasa dengan sengaja adalah ...", options: [{ label: "A", text: "Tidur siang" }, { label: "B", text: "Mandi" }, { label: "C", text: "Makan dan minum" }, { label: "D", text: "Membaca buku" }], answer: "C", explanation: "Makan atau minum dengan sengaja pada siang hari Ramadan membatalkan puasa; rincian hukum mengikuti tuntunan fikih yang dipelajari." },
  ],
  "Bahasa Arab": [
    { id: "ara-01", prompt: "Apa arti kata كِتَابٌ (kitābun)?", options: [{ label: "A", text: "Buku" }, { label: "B", text: "Pintu" }, { label: "C", text: "Rumah" }, { label: "D", text: "Meja" }], answer: "A", explanation: "Kata كِتَابٌ dibaca kitābun dan berarti buku." },
    { id: "ara-02", prompt: "Kata ganti أَنَا (anā) berarti ...", options: [{ label: "A", text: "Kamu laki-laki" }, { label: "B", text: "Saya" }, { label: "C", text: "Dia perempuan" }, { label: "D", text: "Kami" }], answer: "B", explanation: "أَنَا adalah kata ganti orang pertama tunggal yang berarti saya atau aku." },
    { id: "ara-03", prompt: "Kalimat هَذَا طَالِبٌ berarti ...", options: [{ label: "A", text: "Ini seorang siswi" }, { label: "B", text: "Itu seorang guru" }, { label: "C", text: "Ini seorang siswa" }, { label: "D", text: "Mereka siswa" }], answer: "C", explanation: "هَذَا berarti ini untuk kata benda maskulin, sedangkan طَالِبٌ berarti seorang siswa laki-laki." },
    { id: "ara-04", prompt: "Manakah bentuk jamak dari طَالِبٌ (siswa laki-laki)?", options: [{ label: "A", text: "طَالِبَةٌ" }, { label: "B", text: "طُلَّابٌ" }, { label: "C", text: "مَكْتَبٌ" }, { label: "D", text: "مُعَلِّمٌ" }], answer: "B", explanation: "طُلَّابٌ (ṭullābun) adalah bentuk jamak taksir yang umum untuk طَالِبٌ." },
    { id: "ara-05", prompt: "Kata kerja يَكْتُبُ (yaktubu) berarti ...", options: [{ label: "A", text: "Dia sedang/akan menulis" }, { label: "B", text: "Dia telah membaca" }, { label: "C", text: "Dia sedang duduk" }, { label: "D", text: "Dia sedang pergi" }], answer: "A", explanation: "يَكْتُبُ adalah fi'il mudhari dari كَتَبَ dan berarti dia menulis atau sedang/akan menulis." },
  ],
  Ekonomi: [
    { id: "eko-01", prompt: "Jika harga suatu barang naik dan faktor lain tetap, jumlah yang diminta biasanya ...", options: [{ label: "A", text: "Naik" }, { label: "B", text: "Turun" }, { label: "C", text: "Tetap selalu" }, { label: "D", text: "Menjadi nol" }], answer: "B", explanation: "Hukum permintaan menyatakan harga dan jumlah yang diminta bergerak berlawanan arah, dengan faktor lain dianggap tetap." },
    { id: "eko-02", prompt: "Kegiatan menghasilkan barang atau jasa disebut ...", options: [{ label: "A", text: "Konsumsi" }, { label: "B", text: "Distribusi" }, { label: "C", text: "Produksi" }, { label: "D", text: "Investasi" }], answer: "C", explanation: "Produksi adalah kegiatan menciptakan atau menambah nilai guna barang dan jasa." },
    { id: "eko-03", prompt: "Contoh kebutuhan primer adalah ...", options: [{ label: "A", text: "Pangan" }, { label: "B", text: "Perhiasan mewah" }, { label: "C", text: "Koleksi kendaraan" }, { label: "D", text: "Liburan ke luar negeri" }], answer: "A", explanation: "Pangan termasuk kebutuhan primer yang penting untuk kelangsungan hidup." },
    { id: "eko-04", prompt: "Orang atau lembaga yang menggunakan barang dan jasa disebut ...", options: [{ label: "A", text: "Produsen" }, { label: "B", text: "Distributor" }, { label: "C", text: "Konsumen" }, { label: "D", text: "Eksportir" }], answer: "C", explanation: "Konsumen memakai atau menghabiskan nilai guna barang dan jasa untuk memenuhi kebutuhan." },
    { id: "eko-05", prompt: "Harga keseimbangan pasar terbentuk ketika ...", options: [{ label: "A", text: "Permintaan lebih besar dari penawaran" }, { label: "B", text: "Penawaran lebih besar dari permintaan" }, { label: "C", text: "Jumlah diminta sama dengan jumlah ditawarkan" }, { label: "D", text: "Tidak ada transaksi" }], answer: "C", explanation: "Pada titik keseimbangan, jumlah barang yang ingin dibeli konsumen sama dengan jumlah yang ingin dijual produsen." },
  ],
  Geografi: [
    { id: "geo-01", prompt: "Lapisan atmosfer tempat sebagian besar gejala cuaca terjadi adalah ...", options: [{ label: "A", text: "Troposfer" }, { label: "B", text: "Stratosfer" }, { label: "C", text: "Mesosfer" }, { label: "D", text: "Eksosfer" }], answer: "A", explanation: "Troposfer adalah lapisan terbawah atmosfer dan menjadi tempat berlangsungnya awan, hujan, serta gejala cuaca lainnya." },
    { id: "geo-02", prompt: "Pada peta berskala 1:100.000, jarak 1 cm di peta mewakili jarak sebenarnya ...", options: [{ label: "A", text: "100 m" }, { label: "B", text: "1 km" }, { label: "C", text: "10 km" }, { label: "D", text: "100 km" }], answer: "B", explanation: "Satu sentimeter pada peta mewakili 100.000 cm di lapangan, yaitu 1.000 m atau 1 km." },
    { id: "geo-03", prompt: "Garis khayal 0° lintang disebut ...", options: [{ label: "A", text: "Meridian utama" }, { label: "B", text: "Garis balik utara" }, { label: "C", text: "Khatulistiwa" }, { label: "D", text: "Garis tanggal" }], answer: "C", explanation: "Khatulistiwa adalah garis lintang 0° yang membagi Bumi menjadi belahan utara dan selatan." },
    { id: "geo-04", prompt: "Pengikisan tanah oleh aliran air disebut ...", options: [{ label: "A", text: "Sedimentasi" }, { label: "B", text: "Erosi" }, { label: "C", text: "Vulkanisme" }, { label: "D", text: "Tektonisme" }], answer: "B", explanation: "Erosi adalah pengikisan dan pemindahan material permukaan oleh air, angin, es, atau gravitasi." },
    { id: "geo-05", prompt: "Gempa yang disebabkan oleh pergeseran lempeng kerak Bumi disebut gempa ...", options: [{ label: "A", text: "Tektonik" }, { label: "B", text: "Vulkanik" }, { label: "C", text: "Runtuhan" }, { label: "D", text: "Buatan" }], answer: "A", explanation: "Gempa tektonik terjadi akibat pelepasan energi saat batuan atau lempeng tektonik bergeser." },
  ],
  Kimia: [
    { id: "kim-01", prompt: "Rumus kimia air adalah ...", options: [{ label: "A", text: "CO₂" }, { label: "B", text: "H₂O" }, { label: "C", text: "O₂" }, { label: "D", text: "NaCl" }], answer: "B", explanation: "Satu molekul air tersusun atas dua atom hidrogen dan satu atom oksigen, sehingga rumusnya H₂O." },
    { id: "kim-02", prompt: "Larutan dengan pH kurang dari 7 bersifat ...", options: [{ label: "A", text: "Asam" }, { label: "B", text: "Basa" }, { label: "C", text: "Netral" }, { label: "D", text: "Selalu berbahaya" }], answer: "A", explanation: "Pada skala pH yang umum, nilai kurang dari 7 menunjukkan sifat asam, sedangkan 7 netral dan lebih dari 7 basa." },
    { id: "kim-03", prompt: "Campuran yang komponennya tercampur merata disebut ...", options: [{ label: "A", text: "Campuran heterogen" }, { label: "B", text: "Campuran homogen" }, { label: "C", text: "Unsur" }, { label: "D", text: "Senyawa murni" }], answer: "B", explanation: "Campuran homogen memiliki komposisi seragam sehingga bagian-bagiannya tidak dapat dibedakan secara langsung." },
    { id: "kim-04", prompt: "Nomor atom suatu unsur menunjukkan jumlah ...", options: [{ label: "A", text: "Neutron" }, { label: "B", text: "Kulit elektron" }, { label: "C", text: "Proton" }, { label: "D", text: "Proton dan neutron" }], answer: "C", explanation: "Nomor atom menyatakan jumlah proton di dalam inti atom. Pada atom netral, jumlah itu juga sama dengan jumlah elektronnya." },
    { id: "kim-05", prompt: "Persamaan setara untuk pembentukan air adalah ...", options: [{ label: "A", text: "H₂ + O₂ → H₂O" }, { label: "B", text: "2H₂ + O₂ → 2H₂O" }, { label: "C", text: "H₂ + 2O₂ → H₂O" }, { label: "D", text: "2H₂ + 2O₂ → H₂O" }], answer: "B", explanation: "Persamaan 2H₂ + O₂ → 2H₂O memiliki empat atom H dan dua atom O pada kedua ruas." },
  ],
  Biologi: [
    { id: "bio-01", prompt: "Unit struktural dan fungsional terkecil makhluk hidup adalah ...", options: [{ label: "A", text: "Organ" }, { label: "B", text: "Jaringan" }, { label: "C", text: "Sel" }, { label: "D", text: "Sistem organ" }], answer: "C", explanation: "Sel adalah unit terkecil yang mampu menjalankan fungsi kehidupan; jaringan dan organ tersusun dari sel." },
    { id: "bio-02", prompt: "Pigmen yang menangkap energi cahaya untuk fotosintesis adalah ...", options: [{ label: "A", text: "Hemoglobin" }, { label: "B", text: "Klorofil" }, { label: "C", text: "Melanin" }, { label: "D", text: "Keratin" }], answer: "B", explanation: "Klorofil pada kloroplas menyerap energi cahaya yang digunakan tumbuhan dalam fotosintesis." },
    { id: "bio-03", prompt: "Organ yang memompa darah ke seluruh tubuh manusia adalah ...", options: [{ label: "A", text: "Paru-paru" }, { label: "B", text: "Ginjal" }, { label: "C", text: "Jantung" }, { label: "D", text: "Lambung" }], answer: "C", explanation: "Jantung berkontraksi untuk mengalirkan darah melalui pembuluh ke paru-paru dan seluruh tubuh." },
    { id: "bio-04", prompt: "Dalam rantai makanan, tumbuhan hijau umumnya berperan sebagai ...", options: [{ label: "A", text: "Produsen" }, { label: "B", text: "Konsumen tingkat dua" }, { label: "C", text: "Pengurai" }, { label: "D", text: "Predator puncak" }], answer: "A", explanation: "Tumbuhan membuat bahan organik melalui fotosintesis sehingga menjadi produsen pada banyak rantai makanan." },
    { id: "bio-05", prompt: "Molekul yang menyimpan sebagian besar informasi genetik pada makhluk hidup adalah ...", options: [{ label: "A", text: "Pati" }, { label: "B", text: "DNA" }, { label: "C", text: "Air" }, { label: "D", text: "Glukosa" }], answer: "B", explanation: "DNA membawa informasi genetik yang diwariskan dan digunakan dalam pengaturan banyak fungsi sel." },
  ],
  Fisika: [
    { id: "fis-01", prompt: "Satuan gaya dalam Sistem Internasional adalah ...", options: [{ label: "A", text: "Joule" }, { label: "B", text: "Watt" }, { label: "C", text: "Newton" }, { label: "D", text: "Pascal" }], answer: "C", explanation: "Gaya diukur dalam newton (N), sesuai hubungan F = m × a." },
    { id: "fis-02", prompt: "Sebuah benda menempuh 120 meter dalam 20 detik. Kelajuan rata-ratanya adalah ...", options: [{ label: "A", text: "4 m/s" }, { label: "B", text: "6 m/s" }, { label: "C", text: "20 m/s" }, { label: "D", text: "100 m/s" }], answer: "B", explanation: "Kelajuan rata-rata = jarak ÷ waktu = 120 ÷ 20 = 6 m/s." },
    { id: "fis-03", prompt: "Pada rangkaian listrik seri, kuat arus yang melalui setiap komponen adalah ...", options: [{ label: "A", text: "Sama" }, { label: "B", text: "Selalu nol" }, { label: "C", text: "Berbeda di setiap komponen" }, { label: "D", text: "Tidak dapat diukur" }], answer: "A", explanation: "Rangkaian seri hanya memiliki satu jalur, sehingga arus yang sama melewati setiap komponen." },
    { id: "fis-04", prompt: "Pemantulan cahaya pada cermin datar mengikuti aturan bahwa ...", options: [{ label: "A", text: "Sudut datang sama dengan sudut pantul" }, { label: "B", text: "Sudut datang selalu dua kali sudut pantul" }, { label: "C", text: "Cahaya berhenti di cermin" }, { label: "D", text: "Sudut pantul selalu 90°" }], answer: "A", explanation: "Hukum pemantulan menyatakan sudut datang sama dengan sudut pantul, keduanya diukur dari garis normal." },
    { id: "fis-05", prompt: "Perubahan kecepatan tiap satuan waktu disebut ...", options: [{ label: "A", text: "Jarak" }, { label: "B", text: "Kelajuan" }, { label: "C", text: "Percepatan" }, { label: "D", text: "Massa" }], answer: "C", explanation: "Percepatan adalah perubahan kecepatan dibagi selang waktu, dengan satuan SI m/s²." },
  ],
  Sosiologi: [
    { id: "sos-01", prompt: "Dua syarat utama terjadinya interaksi sosial adalah ...", options: [{ label: "A", text: "Kontak sosial dan komunikasi" }, { label: "B", text: "Persaingan dan konflik" }, { label: "C", text: "Status dan kekayaan" }, { label: "D", text: "Imitasi dan sugesti" }], answer: "A", explanation: "Interaksi sosial berlangsung ketika ada kontak sosial dan komunikasi antara pihak-pihak yang berinteraksi." },
    { id: "sos-02", prompt: "Aturan atau pedoman perilaku yang disepakati dalam kehidupan masyarakat disebut ...", options: [{ label: "A", text: "Norma sosial" }, { label: "B", text: "Mobilitas sosial" }, { label: "C", text: "Stratifikasi" }, { label: "D", text: "Populasi" }], answer: "A", explanation: "Norma sosial menjadi pedoman mengenai perilaku yang diharapkan atau tidak diharapkan dalam masyarakat." },
    { id: "sos-03", prompt: "Hak dan kewajiban yang melekat pada kedudukan seseorang disebut ...", options: [{ label: "A", text: "Peran sosial" }, { label: "B", text: "Kelompok primer" }, { label: "C", text: "Nilai material" }, { label: "D", text: "Konflik sosial" }], answer: "A", explanation: "Status menunjukkan kedudukan, sedangkan peran adalah perilaku serta kewajiban yang diharapkan dari kedudukan tersebut." },
    { id: "sos-04", prompt: "Perpindahan seseorang atau kelompok dari satu lapisan sosial ke lapisan lain disebut ...", options: [{ label: "A", text: "Sosialisasi" }, { label: "B", text: "Mobilitas sosial" }, { label: "C", text: "Integrasi" }, { label: "D", text: "Akomodasi" }], answer: "B", explanation: "Mobilitas sosial adalah perpindahan posisi sosial, baik secara vertikal maupun horizontal." },
    { id: "sos-05", prompt: "Keluarga, sekolah, dan lembaga agama merupakan contoh ...", options: [{ label: "A", text: "Lembaga sosial" }, { label: "B", text: "Gejala alam" }, { label: "C", text: "Kelompok sementara" }, { label: "D", text: "Penyimpangan sosial" }], answer: "A", explanation: "Lembaga sosial mengatur pemenuhan kebutuhan penting masyarakat; keluarga, pendidikan, dan agama termasuk di dalamnya." },
  ],
};

type AdvancedQuizLevels = Record<2 | 3, QuizQuestion[]>;

function question(
  id: string,
  prompt: string,
  options: [string, string, string, string],
  answer: QuizOptionLabel,
  explanation: string,
): QuizQuestion {
  return {
    id,
    prompt,
    options: options.map((text, index) => ({ label: ["A", "B", "C", "D"][index] as QuizOptionLabel, text })),
    answer,
    explanation,
  };
}

export const advancedQuizData: Record<QuizSubject, AdvancedQuizLevels> = {
  Matematika: {
    2: [
      question("mat-l2-01", "Jika 2x + 5 = 17, nilai x adalah ...", ["5", "6", "7", "11"], "B", "Kurangi kedua ruas dengan 5 sehingga 2x = 12, lalu bagi 2. Jadi x = 6."),
      question("mat-l2-02", "Segitiga memiliki alas 10 cm dan tinggi 6 cm. Luasnya adalah ...", ["16 cm²", "25 cm²", "30 cm²", "60 cm²"], "C", "Luas segitiga = 1/2 × alas × tinggi = 1/2 × 10 × 6 = 30 cm²."),
      question("mat-l2-03", "Perbandingan kelereng merah dan biru 3:5. Jika totalnya 32, jumlah kelereng merah adalah ...", ["12", "15", "18", "20"], "A", "Jumlah bagian adalah 3 + 5 = 8. Satu bagian bernilai 32 ÷ 8 = 4, sehingga merah = 3 × 4 = 12."),
      question("mat-l2-04", "Hasil 0,4 × 150 adalah ...", ["45", "50", "55", "60"], "D", "0,4 = 4/10, sehingga 0,4 × 150 = 60."),
      question("mat-l2-05", "Nilai dari 5² − 3² adalah ...", ["4", "8", "16", "34"], "C", "Hitung pangkat terlebih dahulu: 5² − 3² = 25 − 9 = 16."),
    ],
    3: [
      question("mat-l3-01", "Jika 3(x − 2) = 2x + 7, nilai x adalah ...", ["7", "11", "13", "17"], "C", "Uraikan menjadi 3x − 6 = 2x + 7. Kurangi 2x dan tambahkan 6, diperoleh x = 13."),
      question("mat-l3-02", "Sebuah dadu bersisi enam dilempar sekali. Peluang muncul bilangan genap adalah ...", ["1/6", "1/3", "1/2", "2/3"], "C", "Bilangan genap yang mungkin adalah 2, 4, dan 6. Peluangnya 3 dari 6 hasil, yaitu 1/2."),
      question("mat-l3-03", "Pola 4, 7, 10, 13, ... memiliki suku ke-10 sebesar ...", ["28", "31", "34", "37"], "B", "Pola bertambah 3. Suku ke-n = 4 + (n − 1) × 3, jadi suku ke-10 = 31."),
      question("mat-l3-04", "Segitiga siku-siku memiliki sisi siku-siku 9 cm dan 12 cm. Panjang hipotenusanya ...", ["13 cm", "14 cm", "15 cm", "21 cm"], "C", "Teorema Pythagoras: c = √(9² + 12²) = √225 = 15 cm."),
      question("mat-l3-05", "Modal Rp100.000 mendapat bunga tunggal 10% per tahun selama 2 tahun. Jumlah akhirnya ...", ["Rp110.000", "Rp115.000", "Rp120.000", "Rp121.000"], "C", "Bunga tunggal = 100.000 × 10% × 2 = Rp20.000. Jumlah akhir Rp120.000."),
    ],
  },
  "Bahasa Indonesia": {
    2: [
      question("ind-l2-01", "'Rani tetap berangkat meskipun hujan turun deras.' Kata meskipun menyatakan hubungan ...", ["Sebab", "Pertentangan", "Tujuan", "Penambahan"], "B", "Meskipun menghubungkan dua keadaan yang berlawanan: hujan deras dan Rani tetap berangkat."),
      question("ind-l2-02", "Kalimat pasif yang tepat dari 'Petugas memeriksa dokumen itu' adalah ...", ["Dokumen itu diperiksa petugas.", "Petugas diperiksa dokumen itu.", "Dokumen itu memeriksa petugas.", "Memeriksa dokumen itu petugas."], "A", "Objek 'dokumen itu' menjadi subjek kalimat pasif dan predikatnya memakai imbuhan di-: diperiksa."),
      question("ind-l2-03", `Kalimat langsung 'Ibu berkata, "Belajarlah dengan tekun."' menjadi kalimat tidak langsung ...`, ["Ibu berkata bahwa belajarlah dengan tekun.", "Ibu berpesan agar saya belajar dengan tekun.", "Ibu berkata, agar belajar dengan tekun.", "Ibu berkata saya tekun belajar."], "B", "Kalimat tidak langsung mengubah kutipan menjadi tuturan tak langsung dan menyesuaikan kata ganti serta bentuk perintah."),
      question("ind-l2-04", "Ungkapan 'angin malam berbisik di jendela' menggunakan majas ...", ["Hiperbola", "Personifikasi", "Metonimia", "Litotes"], "B", "Personifikasi memberi sifat atau tindakan manusia, yaitu berbisik, kepada benda atau gejala alam."),
      question("ind-l2-05", "Ringkasan yang baik seharusnya ...", ["Memuat semua kalimat asli", "Menambahkan pendapat baru", "Memuat pokok informasi secara singkat", "Mengubah inti bacaan"], "C", "Ringkasan menyajikan ide pokok dan informasi penting secara padat tanpa mengubah makna."),
    ],
    3: [
      question("ind-l3-01", "Dalam teks argumentasi, tesis berfungsi untuk ...", ["Menyatakan pendapat utama penulis", "Mencantumkan daftar pustaka", "Menghibur melalui tokoh", "Mengurutkan langkah kerja"], "A", "Tesis memperkenalkan isu dan posisi atau pendapat utama yang akan didukung oleh argumen."),
      question("ind-l3-02", "Kalimat yang paling kuat sebagai fakta adalah ...", ["Pantai itu paling indah di dunia.", "Menurut saya, buku itu membosankan.", "Air mendidih pada suhu sekitar 100°C pada tekanan 1 atm.", "Sepertinya semua orang menyukai musik."], "C", "Pernyataan C dapat diuji dengan kondisi yang jelas. Pilihan lain berupa penilaian atau generalisasi subjektif."),
      question("ind-l3-03", "Kalimat 'Buku itu dibaca oleh Sinta karena ia menarik' ambigu karena ...", ["Kata dibaca salah bentuk", "Kata ia dapat merujuk pada buku atau Sinta", "Tidak memiliki predikat", "Tidak memiliki konjungsi"], "B", "Kata ganti ia memiliki dua kemungkinan acuan. Kalimat perlu diperjelas dengan menyebut benda yang menarik."),
      question("ind-l3-04", "Kata 'oleh karena itu' paling tepat digunakan untuk menandai ...", ["Kesimpulan atau akibat", "Perbandingan", "Pilihan", "Urutan waktu"], "A", "Oleh karena itu merupakan konjungsi yang menandai konsekuensi atau simpulan dari alasan sebelumnya."),
      question("ind-l3-05", "Ciri utama teks laporan hasil observasi adalah ...", ["Berisi khayalan tokoh", "Menyajikan informasi umum berdasarkan pengamatan", "Berisi langkah membuat sesuatu", "Menyampaikan konflik dan resolusi"], "B", "Teks laporan hasil observasi menguraikan objek secara faktual, umum, dan sistematis berdasarkan pengamatan."),
    ],
  },
  "Bahasa Inggris": {
    2: [
      question("eng-l2-01", "Choose the correct form: 'They ___ their homework already.'", ["have finished", "has finished", "finishes", "finishing"], "A", "Use present perfect 'have + past participle' with the plural subject 'they'."),
      question("eng-l2-02", "Complete the comparison: 'This road is ___ than the old one.'", ["wide", "widest", "wider", "more wide"], "C", "The comparative form of the one-syllable adjective wide is wider."),
      question("eng-l2-03", "Choose the correct passive sentence for 'The class cleaned the room.'", ["The room cleaned the class.", "The room was cleaned by the class.", "The class was cleaned by the room.", "The room is cleaning the class."], "B", "Simple past passive uses was/were + past participle: was cleaned."),
      question("eng-l2-04", "Complete the first conditional: 'If it rains, we ___ at home.'", ["stayed", "would stay", "will stay", "have stayed"], "C", "First conditional uses if + simple present and will + base verb for a likely future result."),
      question("eng-l2-05", "Choose the correct word: 'The student ___ won the contest is my friend.'", ["which", "who", "where", "when"], "B", "Who is a relative pronoun used for people and introduces the clause describing the student."),
    ],
    3: [
      question("eng-l3-01", "Choose the correct second conditional: 'If I ___ more time, I would learn Arabic.'", ["have", "had", "will have", "am having"], "B", "Second conditional uses simple past in the if-clause and would + base verb in the result clause."),
      question("eng-l3-02", "Complete the sentence: 'She has lived here ___ 2020.'", ["for", "since", "during", "by"], "B", "Since is used with a starting point in time; for is used with a duration."),
      question("eng-l3-03", "Choose the correct passive form: 'The report must ___ today.'", ["submit", "be submitted", "submitted", "be submitting"], "B", "After the modal must, passive voice uses be + past participle: must be submitted."),
      question("eng-l3-04", "Which sentence uses present perfect continuous correctly?", ["They have been studying for two hours.", "They are study for two hours.", "They has been studied for two hours.", "They were studying since two hours."], "A", "Present perfect continuous is have/has + been + verb-ing and can describe an activity continuing over a duration."),
      question("eng-l3-05", "Choose the correct reported speech: Mira said, 'I am tired.'", ["Mira said that I am tired.", "Mira said that she was tired.", "Mira says she tired.", "Mira said she is tiring."], "B", "In reported speech with a past reporting verb, pronouns and tense commonly shift: I am becomes she was."),
    ],
  },
  Fiqih: {
    2: [
      question("fiq-l2-01", "Tayamum dapat dilakukan sebagai pengganti wudu ketika ...", ["Tidak ada air atau penggunaan air membahayakan", "Air terasa dingin saja", "Sedang terburu-buru tanpa alasan", "Waktu salat masih panjang"], "A", "Tayamum memiliki sebab dan tata cara tertentu, antara lain ketika air tidak tersedia atau penggunaannya membahayakan."),
      question("fiq-l2-02", "Dalam jual beli, kerelaan kedua pihak penting untuk menghindari ...", ["Akad yang jelas", "Kerelaan", "Perselisihan dan pemaksaan", "Serah terima"], "C", "Kerelaan merupakan prinsip muamalah agar transaksi tidak mengandung paksaan atau sengketa."),
      question("fiq-l2-03", "Orang yang berhak menerima zakat disebut ...", ["Muzakki", "Mustahik", "Mudharib", "Musafir"], "B", "Mustahik adalah pihak yang memenuhi kriteria penerima zakat, sedangkan muzakki adalah pihak yang menunaikannya."),
      question("fiq-l2-04", "Salat yang dijamak adalah salat yang ...", ["Diringkas jumlah rakaatnya", "Dikerjakan dengan menggabungkan dua waktu salat", "Dikerjakan tanpa bersuci", "Diganti dengan doa"], "B", "Jamak berarti menggabungkan pelaksanaan dua salat tertentu pada satu waktu sesuai syarat fikih."),
      question("fiq-l2-05", "Dalam akad mudharabah, pembagian keuntungan sebaiknya ditentukan ...", ["Sebagai nisbah yang disepakati", "Sebagai jumlah tetap untuk pengelola", "Setelah usaha merugi", "Tanpa diketahui kedua pihak"], "A", "Keuntungan mudharabah dibagi menurut nisbah yang disepakati, bukan nominal tetap yang mengabaikan hasil usaha."),
    ],
    3: [
      question("fiq-l3-01", "Dalam mudharabah, usaha memperoleh keuntungan. Prinsip pembagian yang tepat adalah ...", ["Seluruh keuntungan selalu untuk pemilik modal", "Dibagi sesuai nisbah yang disepakati dalam akad", "Pengelola menerima jumlah tetap tanpa melihat hasil", "Keuntungan tidak boleh dibagi"], "B", "Keuntungan dibagi menurut nisbah yang disepakati. Ketentuan rinci mengikuti akad dan panduan fikih yang digunakan."),
      question("fiq-l3-02", "Seseorang tidak menemukan air setelah berusaha mencarinya dan waktu salat hampir habis. Tindakan bersuci yang dibahas dalam fikih adalah ...", ["Tayamum sesuai syaratnya", "Meninggalkan salat", "Mengulang wudu tanpa air", "Mengganti salat dengan sedekah"], "A", "Tayamum disyariatkan pada kondisi tertentu ketika air tidak tersedia atau tidak dapat digunakan; ikuti tata cara yang diajarkan."),
      question("fiq-l3-03", "Jika jumlah zakat yang wajib ditunaikan bergantung pada jenis harta dan syaratnya, langkah paling tepat adalah ...", ["Memakai satu angka untuk semua harta", "Memeriksa jenis harta, nisab, haul, dan ketentuan yang berlaku", "Menunda tanpa mencari informasi", "Menghitung dari perkiraan teman"], "B", "Perhitungan zakat dapat berbeda menurut jenis harta dan terpenuhinya syarat seperti nisab serta haul; rujuk panduan tepercaya."),
      question("fiq-l3-04", "Dalam transaksi, informasi barang dan harga yang jelas terutama membantu mencegah ...", ["Akad menjadi sukarela", "Ketidakjelasan yang memicu sengketa", "Barang berpindah kepemilikan", "Kesepakatan kedua pihak"], "B", "Kejelasan objek dan harga membantu menghindari gharar atau ketidakjelasan yang dapat menimbulkan perselisihan."),
      question("fiq-l3-05", "Musafir hendak menggunakan keringanan salat. Sikap yang paling tepat adalah ...", ["Mengikuti syarat dan ketentuan jamak/qasar yang dipelajari", "Mengurangi semua salat menjadi satu rakaat", "Menggabungkan semua salat dalam satu waktu", "Tidak perlu memperhatikan keadaan perjalanan"], "A", "Jamak dan qasar merupakan rukhsah dengan ketentuan tertentu; penerapannya mengikuti tuntunan fikih yang dianut."),
    ],
  },
  "Bahasa Arab": {
    2: [
      question("ara-l2-01", "Pada frasa كِتَابُ الطَّالِبِ, hubungan kata-katanya adalah ...", ["Na'at dan man'ut", "Idhafah", "Fi'il dan fa'il", "Mubtada dan khabar"], "B", "Frasa tersebut adalah idhafah: كِتَابُ sebagai mudhaf dan الطَّالِبِ sebagai mudhaf ilaih."),
      question("ara-l2-02", "Bentuk mutsanna dari مُعَلِّمٌ dalam keadaan rafa' adalah ...", ["مُعَلِّمَانِ", "مُعَلِّمُونَ", "مُعَلِّمَةٌ", "مُعَلِّمَيْنِ"], "A", "Mutsanna rafa' umumnya berakhiran alif dan nun, sehingga مُعَلِّمٌ menjadi مُعَلِّمَانِ."),
      question("ara-l2-03", "Kata kerja كَتَبَ menunjukkan waktu ...", ["Lampau", "Sedang berlangsung", "Perintah", "Akan datang"], "A", "كَتَبَ adalah fi'il madhi yang menunjukkan perbuatan telah terjadi."),
      question("ara-l2-04", "Pada kalimat الطَّالِبُ مُجْتَهِدٌ, kata مُجْتَهِدٌ berfungsi sebagai ...", ["Fi'il", "Mubtada", "Khabar", "Harf jar"], "C", "Kalimat nominal dimulai dengan mubtada الطَّالِبُ dan dilengkapi khabar مُجْتَهِدٌ."),
      question("ara-l2-05", "Arti kata فِي pada frasa فِي الْفَصْلِ adalah ...", ["Dari", "Di dalam", "Ke arah", "Bersama"], "B", "فِي adalah harf jar yang umumnya berarti di dalam atau di."),
    ],
    3: [
      question("ara-l3-01", "Pada kalimat يَقْرَأُ عَلِيٌّ الْكِتَابَ, kata الْكِتَابَ berkedudukan sebagai ...", ["Fa'il marfu'", "Maf'ul bih manshub", "Mubtada marfu'", "Mudhaf ilaih majrur"], "B", "Kata الْكِتَابَ menjadi objek yang dibaca, yaitu maf'ul bih manshub."),
      question("ara-l3-02", "Kalimat yang memiliki susunan fi'il lalu fa'il adalah ...", ["الْكِتَابُ جَدِيدٌ", "الطَّالِبُ فِي الْفَصْلِ", "ذَهَبَتْ فَاطِمَةُ", "هَذَا قَلَمٌ"], "C", "ذَهَبَتْ adalah fi'il dan فَاطِمَةُ adalah fa'il, sehingga susunannya jumlah fi'liyah."),
      question("ara-l3-03", "Kata الَّذِي dalam الَّذِي يَجْتَهِدُ يَنْجَحُ adalah ...", ["Isim isyarah", "Isim maushul", "Harf nasab", "Fi'il amr"], "B", "الَّذِي adalah isim maushul maskulin tunggal yang bermakna 'yang'."),
      question("ara-l3-04", "Bentuk fi'il mudhari orang ketiga tunggal perempuan dari يَكْتُبُ adalah ...", ["أَكْتُبُ", "تَكْتُبُ", "نَكْتُبُ", "يَكْتُبُونَ"], "B", "Untuk subjek perempuan tunggal, fi'il mudhari memakai تَـ: هِيَ تَكْتُبُ."),
      question("ara-l3-05", "Pada frasa الطُّلَّابُ فِي الْمَكْتَبَةِ, الْمَكْتَبَةِ berharakat kasrah karena ...", ["Menjadi fa'il", "Didahului harf jar فِي", "Menjadi mubtada", "Berbentuk fi'il madhi"], "B", "Isim setelah harf jar menjadi majrur, sehingga الْمَكْتَبَةِ berakhiran kasrah."),
    ],
  },
  Ekonomi: {
    2: [
      question("eko-l2-01", "Harga naik 10% dan jumlah yang diminta turun 20%. Nilai absolut elastisitas permintaan adalah ...", ["0,5", "1", "2", "10"], "C", "Elastisitas = persentase perubahan jumlah diminta ÷ persentase perubahan harga = 20% ÷ 10% = 2."),
      question("eko-l2-02", "Nilai barang dan jasa akhir yang dihasilkan di wilayah suatu negara selama periode tertentu disebut ...", ["Produk Domestik Bruto", "Pendapatan disposabel", "Neraca perdagangan", "Biaya peluang"], "A", "PDB mengukur nilai pasar barang dan jasa akhir yang diproduksi di dalam wilayah ekonomi selama periode tertentu."),
      question("eko-l2-03", "Biaya peluang dari memilih satu alternatif adalah ...", ["Seluruh biaya uang yang telah dikeluarkan", "Nilai alternatif terbaik yang dikorbankan", "Keuntungan semua alternatif", "Harga barang setelah diskon"], "B", "Biaya peluang mengukur manfaat dari alternatif terbaik yang tidak dipilih."),
      question("eko-l2-04", "Kenaikan tingkat harga umum secara terus-menerus disebut ...", ["Deflasi", "Inflasi", "Devaluasi", "Subsidi"], "B", "Inflasi adalah kenaikan tingkat harga umum yang berlangsung berkelanjutan, bukan kenaikan satu barang saja."),
      question("eko-l2-05", "RAPBN yang disusun pemerintah menunjukkan rencana ...", ["Pendapatan dan belanja negara", "Produksi satu perusahaan", "Konsumsi rumah tangga", "Harga seluruh komoditas"], "A", "Anggaran pendapatan dan belanja negara merangkum rencana penerimaan dan pengeluaran pemerintah."),
    ],
    3: [
      question("eko-l3-01", "Jika Qd = 100 − 2P dan Qs = 20 + 2P, harga keseimbangan P adalah ...", ["10", "20", "30", "40"], "B", "Keseimbangan saat Qd = Qs: 100 − 2P = 20 + 2P, sehingga 80 = 4P dan P = 20."),
      question("eko-l3-02", "Bank sentral menaikkan suku bunga acuan. Dampak yang umumnya diharapkan untuk menekan inflasi adalah ...", ["Kredit dan permintaan agregat meningkat tajam", "Biaya pinjaman naik sehingga permintaan agregat melambat", "Jumlah uang beredar langsung menjadi tak terbatas", "Pajak penghasilan otomatis dihapus"], "B", "Suku bunga lebih tinggi cenderung menekan pinjaman dan belanja, sehingga membantu meredam tekanan permintaan dan inflasi."),
      question("eko-l3-03", "Jika biaya marginal berada di bawah biaya total rata-rata, biaya total rata-rata cenderung ...", ["Naik", "Turun", "Tetap selalu", "Menjadi nol"], "B", "Biaya marginal di bawah biaya rata-rata menarik nilai rata-rata turun ketika unit tambahan diproduksi."),
      question("eko-l3-04", "Kebijakan fiskal ekspansif biasanya dilakukan dengan ...", ["Mengurangi belanja pemerintah", "Menaikkan pajak dan menurunkan belanja", "Menaikkan belanja atau menurunkan pajak", "Mengubah nilai tukar secara langsung"], "C", "Kebijakan fiskal ekspansif menambah permintaan agregat melalui belanja lebih besar atau pajak lebih rendah."),
      question("eko-l3-05", "Suatu negara dapat memperoleh keuntungan perdagangan ketika memiliki ...", ["Biaya peluang relatif lebih rendah untuk suatu barang", "Harga semua barang selalu lebih tinggi", "Tidak ada spesialisasi", "Jumlah penduduk lebih besar"], "A", "Keunggulan komparatif ditentukan oleh biaya peluang relatif yang lebih rendah, bukan semata-mata produktivitas absolut."),
    ],
  },
  Geografi: {
    2: [
      question("geo-l2-01", "Perbedaan utama cuaca dan iklim terletak pada ...", ["Cuaca bersifat jangka pendek, iklim merupakan pola jangka panjang", "Cuaca hanya terjadi di laut", "Iklim berubah setiap jam", "Cuaca tidak dipengaruhi atmosfer"], "A", "Cuaca menggambarkan kondisi atmosfer pada waktu dan tempat tertentu; iklim adalah pola rata-rata dalam jangka panjang."),
      question("geo-l2-02", "Garis kontur yang rapat pada peta topografi menunjukkan lereng yang ...", ["Landai", "Curam", "Datar", "Selalu cekung"], "B", "Jarak kontur yang rapat menunjukkan perubahan ketinggian besar dalam jarak mendatar pendek, yaitu lereng curam."),
      question("geo-l2-03", "Angin muson barat di Indonesia umumnya membawa ...", ["Musim hujan", "Musim salju", "Musim kemarau panjang sepanjang tahun", "Angin tanpa uap air"], "A", "Muson barat umumnya membawa banyak uap air dari wilayah samudra sehingga berkaitan dengan musim hujan di Indonesia."),
      question("geo-l2-04", "Bentang alam berbentuk endapan di muara sungai disebut ...", ["Delta", "Dataran tinggi", "Fjord", "Gumuk pasir"], "A", "Delta terbentuk dari pengendapan material yang dibawa sungai ketika alirannya memasuki perairan lebih tenang."),
      question("geo-l2-05", "Jika wilayah berpenduduk 12.000 jiwa memiliki luas 60 km², kepadatan penduduknya adalah ...", ["20 jiwa/km²", "200 jiwa/km²", "720 jiwa/km²", "2.000 jiwa/km²"], "B", "Kepadatan = jumlah penduduk ÷ luas wilayah = 12.000 ÷ 60 = 200 jiwa/km²."),
    ],
    3: [
      question("geo-l3-01", "Setiap selisih 15° bujur menyebabkan perbedaan waktu sekitar ...", ["15 menit", "30 menit", "1 jam", "2 jam"], "C", "Bumi berotasi 360° dalam 24 jam, atau 15° setiap satu jam."),
      question("geo-l3-02", "Pada batas konvergen antarlempeng, proses yang umum terjadi adalah ...", ["Lempeng saling menjauh", "Lempeng saling mendekat dan dapat terjadi subduksi", "Tidak ada gerakan kerak", "Semua kerak berubah menjadi atmosfer"], "B", "Di batas konvergen lempeng mendekat; lempeng yang lebih rapat dapat menunjam ke bawah lempeng lain."),
      question("geo-l3-03", "Perpindahan penduduk dari desa ke kota yang berlangsung terus-menerus dapat menyebabkan ...", ["Urbanisasi dan tekanan layanan kota", "Berkurangnya seluruh kegiatan ekonomi kota", "Hilangnya kebutuhan perumahan", "Perubahan rotasi Bumi"], "A", "Urbanisasi meningkatkan konsentrasi penduduk kota dan dapat menambah kebutuhan hunian, transportasi, serta layanan publik."),
      question("geo-l3-04", "Dalam SIG, proses menumpangtindihkan beberapa layer untuk mencari hubungan spasial disebut ...", ["Overlay", "Generalisasi bahasa", "Aklimatisasi", "Evaporasi"], "A", "Overlay menggabungkan layer spasial, misalnya peta penggunaan lahan dan risiko banjir, untuk analisis bersama."),
      question("geo-l3-05", "Penggundulan hutan di hulu dapat memperbesar risiko banjir di hilir karena ...", ["Infiltrasi menurun dan limpasan permukaan meningkat", "Air hujan berhenti mengalir", "Kapasitas sungai otomatis bertambah", "Kelembapan tanah menjadi nol"], "A", "Berkurangnya vegetasi mengurangi penahanan dan peresapan air sehingga limpasan menuju sungai dapat meningkat."),
    ],
  },
  Kimia: {
    2: [
      question("kim-l2-01", "Atom netral dengan nomor atom 12 memiliki jumlah elektron ...", ["6", "10", "12", "24"], "C", "Pada atom netral, jumlah elektron sama dengan jumlah proton yang ditunjukkan oleh nomor atom."),
      question("kim-l2-02", "Ikatan yang terbentuk antara ion Na⁺ dan Cl⁻ terutama merupakan ikatan ...", ["Ion", "Logam", "Hidrogen", "Kovalen nonpolar"], "A", "Tarik-menarik elektrostatik antara ion bermuatan berlawanan membentuk ikatan ion pada NaCl."),
      question("kim-l2-03", "Sebanyak 0,5 mol zat dilarutkan hingga volume 2 L. Molaritas larutan adalah ...", ["0,25 M", "1 M", "2,5 M", "4 M"], "A", "Molaritas = jumlah mol ÷ volume dalam liter = 0,5 ÷ 2 = 0,25 M."),
      question("kim-l2-04", "Reaksi yang melepaskan kalor ke lingkungan disebut ...", ["Endoterm", "Eksoterm", "Isotop", "Netralisasi"], "B", "Reaksi eksoterm melepaskan energi kalor dari sistem ke lingkungan."),
      question("kim-l2-05", "Isotop-isotop dari unsur yang sama memiliki jumlah proton yang sama, tetapi jumlah ...", ["Neutron berbeda", "Proton berbeda", "Nomor atom berbeda", "Unsur berbeda"], "A", "Isotop memiliki nomor atom sama tetapi nomor massa berbeda karena jumlah neutronnya berbeda."),
    ],
    3: [
      question("kim-l3-01", "Pada reaksi 2H₂ + O₂ → 2H₂O, jika tersedia 2 mol H₂ dan O₂ berlebih, jumlah H₂O yang terbentuk adalah ...", ["1 mol", "2 mol", "3 mol", "4 mol"], "B", "Perbandingan koefisien H₂:H₂O adalah 2:2, sehingga 2 mol H₂ menghasilkan 2 mol H₂O."),
      question("kim-l3-02", "Bilangan oksidasi sulfur dalam ion SO₄²⁻ adalah ...", ["+2", "+4", "+6", "+8"], "C", "Empat O masing-masing −2 berjumlah −8. Agar muatan total −2, sulfur harus bernilai +6."),
      question("kim-l3-03", "Dalam satu periode tabel periodik dari kiri ke kanan, jari-jari atom umumnya ...", ["Meningkat", "Menurun", "Tetap persis", "Tidak memiliki pola"], "B", "Muatan inti efektif meningkat dalam satu periode sehingga elektron tertarik lebih kuat dan jari-jari cenderung menurun."),
      question("kim-l3-04", "Jika 25 mL HCl 0,2 M dinetralkan oleh NaOH 0,1 M, volume NaOH yang diperlukan adalah ...", ["25 mL", "50 mL", "75 mL", "100 mL"], "B", "Reaksi HCl dan NaOH berbanding 1:1. Mol HCl = 0,025 × 0,2 = 0,005 mol, sehingga volume NaOH = 0,005 ÷ 0,1 = 0,05 L."),
      question("kim-l3-05", "Zat yang bertindak sebagai oksidator dalam suatu reaksi redoks adalah zat yang ...", ["Mengalami reduksi", "Mengalami oksidasi", "Selalu kehilangan proton", "Tidak berubah"], "A", "Oksidator menerima elektron dan mengalami reduksi, sementara zat lain teroksidasi."),
    ],
  },
  Biologi: {
    2: [
      question("bio-l2-01", "Pembelahan mitosis menghasilkan ...", ["Dua sel anak dengan jumlah kromosom sama", "Empat sel anak dengan jumlah kromosom setengah", "Satu sel tanpa inti", "Dua sel dengan gen selalu berbeda"], "A", "Mitosis menghasilkan dua sel anak yang umumnya memiliki jumlah kromosom sama dengan sel induk."),
      question("bio-l2-02", "Perpindahan air melalui membran selektif dari larutan lebih encer ke lebih pekat disebut ...", ["Difusi", "Osmosis", "Translasi", "Fermentasi"], "B", "Osmosis adalah perpindahan molekul air melewati membran selektif menuju larutan dengan konsentrasi zat terlarut lebih tinggi."),
      question("bio-l2-03", "Hubungan lebah memperoleh nektar dan bunga terbantu penyerbukannya disebut ...", ["Parasitisme", "Komensalisme", "Mutualisme", "Predasi"], "C", "Kedua organisme memperoleh manfaat: lebah mendapatkan nektar dan bunga terbantu proses penyerbukannya."),
      question("bio-l2-04", "Organ yang menyaring darah dan membentuk urine adalah ...", ["Hati", "Ginjal", "Pankreas", "Usus halus"], "B", "Ginjal menyaring darah dan mengatur pembentukan urine melalui unit fungsional bernama nefron."),
      question("bio-l2-05", "Pada aliran informasi genetik, proses pembentukan RNA dari cetakan DNA disebut ...", ["Replikasi", "Transkripsi", "Translasi", "Difusi"], "B", "Transkripsi menyalin informasi dari DNA menjadi RNA; translasi menggunakan mRNA untuk menyusun protein."),
    ],
    3: [
      question("bio-l3-01", "Persilangan Aa × Aa dengan dominansi penuh menghasilkan peluang keturunan berfenotipe resesif sebesar ...", ["0%", "25%", "50%", "75%"], "B", "Rasio genotipe adalah 1 AA : 2 Aa : 1 aa. Fenotipe resesif hanya muncul pada aa, yaitu 1/4 atau 25%."),
      question("bio-l3-02", "Dalam seleksi alam, individu dengan variasi yang meningkatkan keberhasilan reproduksi cenderung ...", ["Mewariskan variasi itu lebih sering", "Berhenti bereproduksi", "Mengubah gen karena kebutuhan secara langsung", "Selalu menjadi spesies baru dalam satu generasi"], "A", "Variasi yang meningkatkan keberhasilan bertahan dan bereproduksi dapat diwariskan lebih sering sehingga frekuensinya meningkat antargenerasi."),
      question("bio-l3-03", "Hasil utama respirasi aerob dari pemecahan glukosa adalah ...", ["Energi ATP, karbon dioksida, dan air", "Oksigen dan glukosa", "Protein dan nitrogen", "Klorofil dan cahaya"], "A", "Respirasi aerob menggunakan oksigen untuk menguraikan glukosa dan menghasilkan ATP, karbon dioksida, serta air."),
      question("bio-l3-04", "Ketika suhu tubuh meningkat, berkeringat membantu menjaga homeostasis melalui ...", ["Penguapan yang melepaskan panas", "Peningkatan produksi panas", "Penghentian sirkulasi", "Pengurangan penguapan"], "A", "Penguapan keringat menyerap energi panas dari permukaan tubuh sehingga membantu menurunkan suhu."),
      question("bio-l3-05", "Jika populasi predator menurun drastis, perubahan awal yang mungkin terjadi pada populasi mangsa adalah ...", ["Meningkat karena tekanan predasi berkurang", "Menjadi produsen", "Langsung punah", "Tidak mungkin berubah"], "A", "Berkurangnya predator dapat menurunkan tekanan predasi sehingga jumlah mangsa berpotensi meningkat, tergantung faktor lain dalam ekosistem."),
    ],
  },
  Fisika: {
    2: [
      question("fis-l2-01", "Benda bermassa 4 kg mengalami percepatan 3 m/s². Gaya resultannya adalah ...", ["7 N", "12 N", "16 N", "24 N"], "B", "Hukum II Newton: F = m × a = 4 × 3 = 12 N."),
      question("fis-l2-02", "Gaya 20 N memindahkan benda sejauh 5 m searah gaya. Usaha yang dilakukan adalah ...", ["4 J", "25 J", "100 J", "200 J"], "C", "Usaha = gaya × perpindahan searah = 20 × 5 = 100 joule."),
      question("fis-l2-03", "Dua hambatan 2 Ω dan 4 Ω disusun seri. Hambatan totalnya ...", ["2 Ω", "3 Ω", "6 Ω", "8 Ω"], "C", "Hambatan seri dijumlahkan: Rtotal = 2 + 4 = 6 Ω."),
      question("fis-l2-04", "Energi potensial gravitasi benda 2 kg pada ketinggian 5 m (g = 10 m/s²) adalah ...", ["10 J", "25 J", "50 J", "100 J"], "D", "Energi potensial = mgh = 2 × 10 × 5 = 100 J."),
      question("fis-l2-05", "Tekanan yang diberikan gaya 100 N pada bidang seluas 2 m² adalah ...", ["20 Pa", "50 Pa", "100 Pa", "200 Pa"], "B", "Tekanan = gaya ÷ luas = 100 ÷ 2 = 50 pascal."),
    ],
    3: [
      question("fis-l3-01", "Hambatan 6 Ω dan 3 Ω dipasang paralel. Hambatan penggantinya adalah ...", ["1 Ω", "2 Ω", "3 Ω", "9 Ω"], "B", "1/R = 1/6 + 1/3 = 1/2, sehingga R = 2 Ω."),
      question("fis-l3-02", "Benda 2 kg bergerak dengan kecepatan 3 m/s. Momentumnya adalah ...", ["1,5 kg m/s", "5 kg m/s", "6 kg m/s", "9 kg m/s"], "C", "Momentum p = m × v = 2 × 3 = 6 kg m/s."),
      question("fis-l3-03", "Lensa cembung memiliki fokus 10 cm. Benda diletakkan 30 cm di depan lensa. Jarak bayangan adalah ...", ["7,5 cm", "10 cm", "15 cm", "30 cm"], "C", "Persamaan lensa 1/f = 1/s + 1/s'. Maka 1/s' = 1/10 − 1/30 = 1/15, sehingga s' = 15 cm."),
      question("fis-l3-04", "Benda jatuh bebas dari keadaan diam selama 2 s (g = 10 m/s²). Kelajuannya setelah 2 s adalah ...", ["5 m/s", "10 m/s", "20 m/s", "40 m/s"], "C", "Kecepatan akhir v = v₀ + gt = 0 + 10 × 2 = 20 m/s."),
      question("fis-l3-05", "Panas dari Matahari sampai ke Bumi terutama berpindah melalui ...", ["Konduksi", "Konveksi", "Radiasi", "Evaporasi"], "C", "Radiasi elektromagnetik dapat merambat melalui ruang hampa antara Matahari dan Bumi."),
    ],
  },
  Sosiologi: {
    2: [
      question("sos-l2-01", "Kelompok yang anggotanya memiliki hubungan dekat dan akrab, seperti keluarga, disebut kelompok ...", ["Primer", "Sekunder", "Formal sementara", "Referensi global"], "A", "Kelompok primer ditandai hubungan personal, dekat, dan relatif berlangsung lama."),
      question("sos-l2-02", "Proses seseorang mempelajari nilai dan norma masyarakat disebut ...", ["Sosialisasi", "Urbanisasi", "Diferensiasi", "Akomodasi"], "A", "Sosialisasi membantu individu mempelajari nilai, norma, dan pola perilaku dalam masyarakat."),
      question("sos-l2-03", "Penyebaran unsur budaya dari satu kelompok ke kelompok lain disebut ...", ["Difusi budaya", "Konflik kelas", "Mobilitas vertikal", "Segregasi"], "A", "Difusi budaya adalah penyebaran unsur budaya melalui kontak dan interaksi antarkelompok."),
      question("sos-l2-04", "Kerja bersama warga membersihkan lingkungan merupakan contoh ...", ["Kerja sama", "Kontravensi", "Kompetisi", "Konflik"], "A", "Kerja sama adalah usaha bersama untuk mencapai tujuan yang disepakati."),
      question("sos-l2-05", "Pertentangan terbuka antara dua pihak karena perbedaan kepentingan disebut ...", ["Konflik sosial", "Asimilasi", "Akomodasi", "Kooptasi"], "A", "Konflik sosial merupakan proses ketika pihak-pihak berhadapan karena perbedaan kepentingan atau tujuan."),
    ],
    3: [
      question("sos-l3-01", "Perubahan pola kehidupan masyarakat akibat teknologi digital merupakan contoh ...", ["Perubahan sosial", "Kontak primer", "Penyimpangan individual", "Status bawaan"], "A", "Perubahan sosial meliputi perubahan struktur, pola hubungan, atau lembaga dalam masyarakat."),
      question("sos-l3-02", "Seorang pegawai mendapat promosi dari staf menjadi kepala bagian. Ini adalah mobilitas ...", ["Horizontal", "Vertikal naik", "Vertikal turun", "Geografis saja"], "B", "Promosi meningkatkan kedudukan dalam hierarki pekerjaan sehingga termasuk mobilitas vertikal naik."),
      question("sos-l3-03", "Perilaku yang dianggap menyimpang perlu dipahami dengan memperhatikan ...", ["Norma dan konteks sosial yang berlaku", "Penilaian satu orang saja", "Usia pelaku saja", "Lokasi tanpa aturan"], "A", "Penyimpangan dinilai berdasarkan norma sosial dan konteks tempat serta waktu tertentu."),
      question("sos-l3-04", "Pelapisan masyarakat berdasarkan kekayaan, kekuasaan, atau prestise disebut ...", ["Stratifikasi sosial", "Sosialisasi primer", "Difusi", "Akomodasi"], "A", "Stratifikasi sosial adalah pengelompokan masyarakat ke dalam lapisan yang bertingkat berdasarkan ukuran tertentu."),
      question("sos-l3-05", "Setelah konflik, dua kelompok membuat kesepakatan untuk bekerja sama tanpa menghapus perbedaan mereka. Proses ini paling dekat dengan ...", ["Akomodasi", "Disorganisasi", "Kompetisi", "Segregasi"], "A", "Akomodasi adalah proses penyesuaian untuk meredakan pertentangan dan menjaga hubungan sosial."),
    ],
  },
};

export function getQuizQuestions(subject: QuizSubject, level: QuizLevel) {
  return level === 1 ? quizData[subject] : advancedQuizData[subject][level];
}