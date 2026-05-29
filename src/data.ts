/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EthnographicRecord, RegencyInfo, EthnographyCategory } from "./types";

export const EAST_JAVA_REGENCIES: RegencyInfo[] = [
  {
    id: "banyuwangi",
    name: "Kabupaten Banyuwangi",
    capital: "Banyuwangi",
    coordinates: { x: 88, y: 70 },
    dominantEthnicGroup: "Suku Osing",
    description: "Kawasan tapal kuda timur dengan kebudayaan Osing yang kuat hasil asimilasi Jawa dan Bali.",
    famousTraditions: ["Tari Gandrung", "Sintren / Seblang Olehsari", "Kebo-Keboan Aliyan", "Barong Ider Bumi"]
  },
  {
    id: "ponorogo",
    name: "Kabupaten Ponorogo",
    capital: "Ponorogo",
    coordinates: { x: 18, y: 64 },
    dominantEthnicGroup: "Suku Jawa (Mataraman)",
    description: "Daerah barat Jawa Timur yang terkenal sebagai rahim kesenian adiluhung Reog Ponorogo dengan kosmologi tari prajurit murni.",
    famousTraditions: ["Grebeg Suro", "Reog Ponorogo", "Seni Reyog Reyog Sepuh", "Babad Ponorogo"]
  },
  {
    id: "malang",
    name: "Kabupaten Malang",
    capital: "Kepanjen",
    coordinates: { x: 48, y: 72 },
    dominantEthnicGroup: "Suku Jawa (Arekan) & Tengger",
    description: "Kawasan dataran tinggi bersejarah peninggalan Kerajaan Singhasari dengan budaya Arekan yang dipadukan dengan agraris pegunungan.",
    famousTraditions: ["Tari Topeng Malangan", "Wayang Krucil", "Bantengan", "Yadnya Kasada (Bromo)"]
  },
  {
    id: "sumenep",
    name: "Kabupaten Sumenep",
    capital: "Sumenep",
    coordinates: { x: 82, y: 25 },
    dominantEthnicGroup: "Suku Madura",
    description: "Ujung timur Pulau Madura dengan tradisi keraton yang anggun serta budaya maritim kepulauan yang khas.",
    famousTraditions: ["Karapan Sapi", "Seni Gending Madura", "Syi'ir Madura", "Rokat Tasek", "Topeng Dalang Madura"]
  },
  {
    id: "surabaya",
    name: "Kota Surabaya",
    capital: "Surabaya",
    coordinates: { x: 50, y: 44 },
    dominantEthnicGroup: "Suku Jawa (Arekan)",
    description: "Kota metropolitan pelabuhan dengan karakter Arekan yang lugas, kritis, egaliter, dan kaya akan kesenian Ludruk.",
    famousTraditions: ["Seni Pertunjukan Ludruk", "Kidungan Suroboyoan", "Tari Remo Suroboyo", "Rujak Uleg Festival"]
  },
  {
    id: "probolinggo",
    name: "Kabupaten Probolinggo",
    capital: "Kraksaan",
    coordinates: { x: 62, y: 58 },
    dominantEthnicGroup: "Suku Jawa & Tengger",
    description: "Kawasan lereng Gunung Bromo tempat bermukimnya masyarakat adat Tengger yang memegang teguh tradisi Hindu Jawa Kuno.",
    famousTraditions: ["Yadnya Kasada", "Tari Sodoran", "Leluhur Gunung Bromo", "Kuda Kencak"]
  },
  {
    id: "jember",
    name: "Kabupaten Jember",
    capital: "Jember",
    coordinates: { x: 74, y: 72 },
    dominantEthnicGroup: "Suku Jawa & Madura (Pandalungan)",
    description: "Representasi budaya Pendalungan (asimilasi harmonis Jawa dan Madura) yang didominasi perkebunan tembakau kolonial.",
    famousTraditions: ["Egrang Tanoker", "Musik Patrol Jember", "Can-macanan Kadaddak", "Batik Jemberan"]
  },
  {
    id: "tuban",
    name: "Kabupaten Tuban",
    capital: "Tuban",
    coordinates: { x: 30, y: 24 },
    dominantEthnicGroup: "Suku Jawa (Pesisiran)",
    description: "Gerbang pesisir utara sarat nilai spiritual Walisongo yang memadukan budaya bahari dengan tradisi agraria kering.",
    famousTraditions: ["Seni Sandur Tuban", "Sedekah Bumi Silugangga", "Batik Gedog", "Wayang Kulit Wetanan"]
  },
  {
    id: "kediri",
    name: "Kabupaten Kediri",
    capital: "Kediri",
    coordinates: { x: 36, y: 56 },
    dominantEthnicGroup: "Suku Jawa (Mataraman)",
    description: "Pusat peradaban kuno kerajaan Kediri yang kental dengan mitologi Panji serta seni jaranan lokal.",
    famousTraditions: ["Jaranan Kediri", "Cerita Panji", "Sesaji Suro Gunung Kelud", "Larung Sesaji Brantas"]
  },
  {
    id: "bangkalan",
    name: "Kabupaten Bangkalan",
    capital: "Bangkalan",
    coordinates: { x: 52, y: 35 },
    dominantEthnicGroup: "Suku Madura",
    description: "Gerbang barat Pulau Madura yang kental dengan budaya Islam pesantren dan tradisi bela diri pencak sakera.",
    famousTraditions: ["Pencak Silat Sakera", "Karapan Sapi Karesidenan", "Batik Tanjung Bumi", "Rokat Desa"]
  }
];

export const INITIAL_RECORDS: EthnographicRecord[] = [
  {
    id: "rec-seblang-olehsari",
    title: "Upacara Seblang Olehsari",
    category: EthnographyCategory.RITUAL_BELIEF,
    regency: "Kabupaten Banyuwangi",
    description: "Ritual kesuburan dan tolak bala penolak wabah kuno masyarakat Osing di Desa Olehsari Banyuwangi. Ritual ini ditarikan oleh seorang penari gadis perawan yang berada dalam kondisi kesurupan (trance) roh leluhur, menggunakan mahkota daun pisang dan bunga segar (omprok) selama 7 hari berturut-turut setelah hari raya Idul Fitri.",
    researcherName: "Dr. Wayan S. Wardhana",
    dateReported: "2026-04-12",
    latitude: 88,
    longitude: 70,
    localTerms: ["Trance", "Omprok", "Buyut Ketut", "Gending Seblang"],
    culturalSignificance: "Representasi magis-religius kesuburan agraris sisa-sisa animisme Majapahit yang disintesiskan dalam kosmologi masyarakat Osing paska pemusnahan massal perang Puputan Bayu.",
    isVerified: true,
    geminiAnalysis: {
      tags: ["Osing", "Ritual Kesuburan", "Trance Dance", "Tapal Kuda", "Majapahit Warisan"],
      summary: "Tarian bercorak ritual kuno komunitas Osing Banyuwangi yang berfungsi sebagai peneduh spiritual desa, dibimbing trance medium penari muda.",
      historicalContext: "Muncul paska keruntuhan kerajaan Blambangan abad ke-18 sebagai mekanisme penyembuh trauma perang hebat masyarakat setempat, sekaligus manifestasi kultus dewi kesuburan bumi.",
      comparativeStudies: "Memiliki paralel dengan tari Sanghyang Dedari di Bali, di mana penari belia dimasuki energi dewa pelindung dalam keadaan tidak sadar.",
      recommendedRegencies: ["Banyuwangi", "Jember", "Bondowoso"],
      conservationStatus: "Lestari",
      conservationAdvice: "Perlu perlindungan hak paten komunal kekayaan intelektual (WIPO) untuk menghindari komersialisasi profan industri wisata yang menghilangkan nilai sakralitas medium trance."
    }
  },
  {
    id: "rec-reog-ponorogo",
    title: "Seni Reyog Sepuh & Kosmologi Dhadhak Merak",
    category: EthnographyCategory.PERFORMING_ARTS,
    regency: "Kabupaten Ponorogo",
    description: "Analisis pertunjukan Reog di kalangan sesepuh (Warok) Ponorogo. Meneliti filosofi pembuatan topeng Barongan singa (Dhadhak Merak) yang beratnya mencapai 50-60 kg, yang ditopang sepenuhnya menggunakan kekuatan gigi penari (pembawa topeng). Fokus pada laku tirakat para peseni Reog sepuh di desa-desa lereng selatan Ponorogo dimalam satu Suro.",
    researcherName: "Prof. Sudarsono Kartodirdjo",
    dateReported: "2026-03-01",
    latitude: 18,
    longitude: 64,
    localTerms: ["Warok", "Gemblak", "Kucingan", "Dhadhak Merak", "Dadung"],
    culturalSignificance: "Merupakan manifestasi kejantanan serta sinkretisme ajaran kebatinan Jawa kuno yang dibungkus dalam tarian keprajuritan epik.",
    isVerified: true,
    geminiAnalysis: {
      tags: ["Reog", "Warok", "Mataraman", "Tirakat Suro", "Topeng Gigi"],
      summary: "Seni kekuatan tubuh legendaris asal Ponorogo yang merepresentasikan kisah penaklukan Singo Barong oleh prajurit Kerajaan Bantarangin.",
      historicalContext: "Erat dikaitkan sebagai bentuk sindiran politik dari Raden Patah/Ki Ageng Kutu terhadap Raja Brawijaya V (Singa) yang didominasi oleh permaisurinya (Merak).",
      comparativeStudies: "Dapat dibandingkan dengan Tarian Barongsai Tiongkok dan Tari Barong Bali dalam hal personifikasi makhluk singa mitologis raksasa penjaga moral.",
      recommendedRegencies: ["Ponorogo", "Madiun", "Pacitan", "Trenggalek"],
      conservationStatus: "Lestari",
      conservationAdvice: "Upayakan regenerasi pembuat dadak merak tradisional yang menggunakan kulit harimau asli (kini dialihkan ke kulit lembu/kulit sintesis ramah satwa) tanpa mengurangi kekuatan spiritual simbol singa."
    }
  },
  {
    id: "rec-yadnya-kasada",
    title: "Sistem Penanggalan & Sesaji Yadnya Kasada Tengger",
    category: EthnographyCategory.RITUAL_BELIEF,
    regency: "Kabupaten Probolinggo",
    description: "Studi etnografi atas penyerahan persembahan bumi (sesaji Ongkek) ke dalam kawah aktif Gunung Bromo oleh masyarakat adat Hindu Tengger. Dilaksanakan setiap hari ke-14 bulan Kasada sesuai penanggalan tradisional Tengger. Upacara ini merupakan bentuk pemenuhan janji leluhur Roro Anteng dan Joko Seger yang mengorbankan putra bungsu mereka ke kawah demi keselamatan klan.",
    researcherName: "Sri Wardhani, M.A.",
    dateReported: "2026-05-15",
    latitude: 62,
    longitude: 58,
    localTerms: ["Ongkek", "Dukun Pandita", "Sodoran", "Bhumi Bromo", "Rara Anteng"],
    culturalSignificance: "Solidaritas ekologis dan pengakuan atas relasi mitis-praktis manusia dengan kekuatan alam bawah sadar gunung api luhur.",
    isVerified: true,
    geminiAnalysis: {
      tags: ["Tengger", "Hindu Jawa", "Gunung Berapi", "Sesaji Ongkek", "Kearifan Ekologi"],
      summary: "Upacara persembahan agung hasil panen warga Tengger langsung ke rahim kawah Gunung Bromo sebagai simbol syukur spiritual terdalam.",
      historicalContext: "Sebagai pemenuhan janji suci kuno paska eksodus pelarian bangsawan Majapahit ke dataran tinggi yang terisolasi dari islamisasi dataran rendah.",
      comparativeStudies: "Mirip dengan upacara sesaji gunung berapi di berbagai belahan dunia seperti suku Aztec, namun bercampur kuat dengan konsep karma yoga filsafat Siwa-Buddha.",
      recommendedRegencies: ["Probolinggo", "Pasuruan", "Malang", "Lumajang"],
      conservationStatus: "Lestari",
      conservationAdvice: "Penting membatasi komersialisasi pariwisata jeep Bromo pada hari sakral upacara agar masyarakat adat lapang melakukan doa kidung hening tanpa terdistraksi hiruk pikuk wisatawan."
    }
  },
  {
    id: "rec-ludruk-surabaya",
    title: "Seni Kidungan Ludruk Kontemporer",
    category: EthnographyCategory.PERFORMING_ARTS,
    regency: "Kota Surabaya",
    description: "Penelitian transformatif mengenai kidungan (pemberian pantun bersajak kritis) dalam drama panggung Ludruk Arekan Surabaya. Ludruk dimainkan seluruhnya oleh aktor pria digayakan trans-gender (pemeran wanita disebut Travesi). Kidungan menyuarakan realisme sosial kalangan akar rumput di bantaran kali Surabaya dengan bahasa Jawa logat Suroboyo yang blak-blakan tanpa tedeng aling-aling.",
    researcherName: "Gatot Dewabroto",
    dateReported: "2026-02-20",
    latitude: 50,
    longitude: 44,
    localTerms: ["Travesi", "Kidungan", "Arekan Suroboyo", "Dagelan", "Pariwisata Rakyat"],
    culturalSignificance: "Alat agitasi sosial, perlawanan kelas tertindas paska kolonial, sekaligus media sosialisasi politik murni rakyat jelata.",
    isVerified: true,
    geminiAnalysis: {
      tags: ["Ludruk", "Arekan Suroboyo", "Travesi", "Teater Rakyat", "Kritik Sosial"],
      summary: "Teater drama rakyat proletar Jawa Timur yang menitikberatkan improvisasi humor verbal kritis dibumbui nyanyian rima satir.",
      historicalContext: "Mulai berkembang pesat sejak abad 19-20. Dahulu difungsikan oleh tokoh legendaris Sakera/Markeso untuk menyebarkan seruan anti-kolonialisme Belanda.",
      comparativeStudies: "Menunjukkan kemiripan sosiologis dengan teater Kabuki di Jepang awal mula kemunculannya yang memerankan gender silang, serta tradisi Pantun Melayu.",
      recommendedRegencies: ["Surabaya", "Sidoarjo", "Gresik", "Mojokerto"],
      conservationStatus: "Rentan",
      conservationAdvice: "Masyarakat Arekan membutuhkan sanggar teater terbuka di kampung-kampung agar generasi muda dapat meneruskan pelafalan kidung humor cerdas di tengah gempuran media sosial visual."
    }
  },
  {
    id: "rec-karapan-sapi",
    title: "Rokat Tasek & Dinamika Karapan Sapi Madura",
    category: EthnographyCategory.SOCIAL_SYSTEM,
    regency: "Kabupaten Sumenep",
    description: "Etnografi perlombaan Karapan Sapi bergengsi (Kerrap Agung). Menelaah relasi patron-klien antara 'Pemilik Sapi' (Tokoh Blater/Kiai) dan 'Joki'. Perlombaan ini menguji ketangkasan sepasang sapi lari kencang menarik rangka kayu di atas lumpur berair. Fokus spiritual pada jamu magis jampi-jampi yang diminumkan ke sapi sebelum berlaga, serta ritual Rokat Tasek (ruwat laut pelindung ternak).",
    researcherName: "Kholilul Rahman, M.Hum.",
    dateReported: "2026-05-02",
    latitude: 82,
    longitude: 25,
    localTerms: ["Blater", "Tokang Tonja", "Sapi Kerap", "Kerrap Agung", "Jampi-Jampi"],
    culturalSignificance: "Simbol prestise sosial kelas atas Madura, pembuktian ketegasan maskulinitas, serta sistem pembiakan sapi unggul ras lokal.",
    isVerified: true,
    geminiAnalysis: {
      tags: ["Madura", "Karapan Sapi", "Prestise Blater", "Identitas Maskulin", "Sumenep Keraton"],
      summary: "Perlombaan pacuan kecepatan sapi Madura legendaris yang memadukan status sosial pemilik dengan penguatan kekuatan mistis ternak.",
      historicalContext: "Ditelusuri kembali ke ide kreatif Syekh Ahmad Baidawi (Pangeran Katandur) abad ke-14 sebagai stimulasi bagi petani Madura mengolah tanah tandus kering berkapur.",
      comparativeStudies: "Sangat identik dengan Makepung di Jembrana, Bali, atau Karapan Kerbau di Sumbawa Nusa Tenggara, sebagai ekspresi kedekatan agraris ternak pekerja.",
      recommendedRegencies: ["Sumenep", "Pamekasan", "Sampang", "Bangkalan"],
      conservationStatus: "Lestari",
      conservationAdvice: "Aspek kekerasan fisik paku tajam pada pecut pantat sapi (sebagai perangsang rasa sakit pelesat lari) harus mulai direformasi ke arah pecut non-luka tanpa memudarkan gairah adat murni perlombaan kerrap."
    }
  }
];
