/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to store our records persistent file in the container
const DB_FILE = path.join(process.cwd(), "records_db.json");

// Default initial data to seed the database
const DEFAULT_RECORDS = [
  {
    id: "rec-seblang-olehsari",
    title: "Upacara Seblang Olehsari",
    category: "Ritual & Kepercayaan",
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
    category: "Seni Pertunjukan",
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
    category: "Ritual & Kepercayaan",
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
    category: "Seni Pertunjukan",
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
    category: "Sistem Sosial & Pengetahuan Lokal",
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

// Helper to initialize or retrieve records
function readRecords() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_RECORDS, null, 2));
      return DEFAULT_RECORDS;
    }
  } catch (error) {
    console.error("Gagal membaca database lokal, menggunakan memory fallback:", error);
    return DEFAULT_RECORDS;
  }
}

function writeRecords(records: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2));
  } catch (error) {
    console.error("Gagal menulis database lokal:", error);
  }
}

// Lazy Gemini Client initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY tidak dikonfigurasi. Menggunakan server-side simulation.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ---------------------- ENDPOINTS API ----------------------

// Fetch all records
app.get("/api/records", (req, res) => {
  const records = readRecords();
  res.json(records);
});

// Reset database to default seed records
app.post("/api/records/reset", (req, res) => {
  writeRecords(DEFAULT_RECORDS);
  res.json({ message: "Database telah disetel ulang ke koleksi awal.", data: DEFAULT_RECORDS });
});

// Update/Add dynamic participatory records manual or partial
app.post("/api/records", (req, res) => {
  const records = readRecords();
  const newRecord = {
    id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: req.body.title || "Laporan Pengamatan Baru",
    category: req.body.category || "Ritual & Kepercayaan",
    regency: req.body.regency || "Kabupaten Malang",
    description: req.body.description || "Deskripsi pengamatan lapangan belum diisi.",
    researcherName: req.body.researcherName || "Peneliti Partisipatif",
    dateReported: req.body.dateReported || new Date().toISOString().split("T")[0],
    latitude: typeof req.body.latitude === "number" ? req.body.latitude : 50,
    longitude: typeof req.body.longitude === "number" ? req.body.longitude : 50,
    localTerms: Array.isArray(req.body.localTerms) ? req.body.localTerms : [],
    culturalSignificance: req.body.culturalSignificance || "",
    isVerified: req.body.isVerified || false,
    geminiAnalysis: req.body.geminiAnalysis || null
  };

  records.push(newRecord);
  writeRecords(records);
  res.status(201).json(newRecord);
});

// Verify/Verify researcher-submitted record
app.post("/api/records/:id/verify", (req, res) => {
  const records = readRecords();
  const idx = records.findIndex((r: any) => r.id === req.params.id);
  if (idx !== -1) {
    records[idx].isVerified = true;
    writeRecords(records);
    return res.json(records[idx]);
  }
  res.status(404).json({ error: "Rekam etnografi tidak ditemukan." });
});

// Delete specific records
app.delete("/api/records/:id", (req, res) => {
  let records = readRecords();
  const originalLength = records.length;
  records = records.filter((r: any) => r.id !== req.params.id);
  if (records.length < originalLength) {
    writeRecords(records);
    return res.json({ message: "Rekam etnografi didelete secara permanen dari basis data." });
  }
  res.status(404).json({ error: "Rekam etnografi tidak ditemukan." });
});

// Ask Google Gemini to analyze raw field notes and output a complete structured JSON
app.post("/api/gemini/analyze", async (req, res) => {
  const { rawText, researcherName, x, y } = req.body;
  if (!rawText || rawText.trim() === "") {
    return res.status(400).json({ error: "Catatan lapangan kosong. Mohon sertakan deskripsi mentah." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback simulation when GEMINI_API_KEY is not defined
    console.log("Simulating expert anthropological analysis...");
    
    // Simple heuristic parser of text to yield an extremely impressive simulation
    const keywordsLower = rawText.toLowerCase();
    let detectedRegency = "Kabupaten Banyuwangi";
    let detectedCategory = "Ritual & Kepercayaan";
    let status: "Lestari" | "Rentan" | "Terancam Punah" = "Lestari";
    let terms: string[] = ["Nguri-uri", "Laku"];
    
    if (keywordsLower.includes("ponorogo") || keywordsLower.includes("reog") || keywordsLower.includes("warok")) {
      detectedRegency = "Kabupaten Ponorogo";
      detectedCategory = "Seni Pertunjukan";
      terms = ["Warok", "Dhadhak Merak", "Reyog Sepuh"];
    } else if (keywordsLower.includes("madura") || keywordsLower.includes("sapi") || keywordsLower.includes("sumenep") || keywordsLower.includes("bangkalan")) {
      detectedRegency = keywordsLower.includes("bangkalan") ? "Kabupaten Bangkalan" : "Kabupaten Sumenep";
      detectedCategory = "Sistem Sosial & Pengetahuan Lokal";
      terms = ["Blater", "Toron", "Sapi Kerap", "Pecut"];
    } else if (keywordsLower.includes("ludruk") || keywordsLower.includes("surabaya") || keywordsLower.includes("suroboyo")) {
      detectedRegency = "Kota Surabaya";
      detectedCategory = "Seni Pertunjukan";
      terms = ["Travesi", "Kidungan", "Suroboyoan"];
      status = "Rentan";
    } else if (keywordsLower.includes("bromo") || keywordsLower.includes("tengger") || keywordsLower.includes("kasada")) {
      detectedRegency = "Kabupaten Probolinggo";
      detectedCategory = "Ritual & Kepercayaan";
      terms = ["Sodoran", "Ongkek", "Dukun Pandita"];
    } else if (keywordsLower.includes("tuban") || keywordsLower.includes("sandur")) {
      detectedRegency = "Kabupaten Tuban";
      detectedCategory = "Tradisi Lisan & Cerita Rakyat";
      terms = ["Sandur", "Sedekah Bumi", "Gedog"];
      status = "Rentan";
    } else if (keywordsLower.includes("kediri") || keywordsLower.includes("jaranan") || keywordsLower.includes("panji")) {
      detectedRegency = "Kabupaten Kediri";
      detectedCategory = "Seni Pertunjukan";
      terms = ["Cerita Panji", "Singo Barong", "Kuda Lumping"];
    } else if (keywordsLower.includes("jember") || keywordsLower.includes("pandalungan") || keywordsLower.includes("egrang")) {
      detectedRegency = "Kabupaten Jember";
      detectedCategory = "Kriya, Arsitektur & Budaya Kebendaan";
      terms = ["Pandalungan", "Egrang", "Musik Patrol"];
    } else if (keywordsLower.includes("bahasa") || keywordsLower.includes("sastra") || keywordsLower.includes("dongeng") || keywordsLower.includes("cerita")) {
      detectedCategory = "Bahasa & Dialek (Sastra Lisan)";
    } else if (keywordsLower.includes("bangunan") || keywordsLower.includes("arsitektur") || keywordsLower.includes("batik") || keywordsLower.includes("kain") || keywordsLower.includes("kriya")) {
      detectedCategory = "Kriya, Arsitektur & Budaya Kebendaan";
    }

    // Deduce title based on text length
    const words = rawText.split(/\s+/).slice(0, 4).join(" ");
    const cleanedTitle = words.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"") + " (Hasil Analisis)";

    const mockResponse = {
      title: cleanedTitle,
      category: detectedCategory,
      regency: detectedRegency,
      description: rawText,
      researcherName: researcherName || "Peneliti Partisipatif",
      dateReported: new Date().toISOString().split("T")[0],
      latitude: typeof x === "number" ? x : 50,
      longitude: typeof y === "number" ? y : 50,
      localTerms: terms,
      culturalSignificance: "Analisis mensintesiskan makna agraris/maritim dari temuan etnografis ini dengan tradisi komunal Jawa Timur.",
      isVerified: false,
      geminiAnalysis: {
        tags: ["Etnografi Jatim", detectedRegency.split(" ")[1], detectedCategory.split(" ")[0]],
        summary: `Pendokumentasian dari pengamatan lapangan lapangan yang mendeskripsikan dinamika kebudayaan lokal di ${detectedRegency}.`,
        historicalContext: `Akar sejarah sub-kultur ini berkaitan erat dengan transisi agraris pesisiran Jawa Timur dan pemertahanan identitas komunal lokal paska abad ke-17.`,
        comparativeStudies: `Tradisi serupa ditemukan di beberapa sub-kultur pedalaman Mataraman lainnya dengan nama yang bervariasi bergantung pada kedekatan kultus setempat.`,
        recommendedRegencies: [detectedRegency, "Kabupaten Malang", "Kabupaten Banyuwangi"],
        conservationStatus: status,
        conservationAdvice: `Sangat disarankan bagi para pakar dan peneliti untuk terus mengunduh transkripsi lisan ini ke dalam arsip digital nasional demi melindungi punahnya penutur dan penari sepuh.`
      }
    };

    // Store simulated record directly to the database to preserve flow!
    const records = readRecords();
    records.push(mockResponse);
    writeRecords(records);

    return res.json({
      success: true,
      simulated: true,
      message: "Menggunakan model sosiologis-antropologis Jatim (karena API Key belum ditentukan). Anda dapat menambahkan API Key asli Anda di pojok kanan atas 'Secrets' panel.",
      data: mockResponse
    });
  }

  try {
    const prompt = `Analasi catatan etnografis mentah berikut dari Jawa Timur:
"${rawText}"

Tugas Anda adalah:
1. Ekstrak data mentah ini menjadi catatan lapangan formal terstruktur.
2. Klasifikasikan lokasinya ke salah satu Kabupaten/Kota di Jawa Timur Indonesia (yang paling masuk akal berdasarkan teks, misal: Kabupaten Banyuwangi, Kabupaten Ponorogo, Kabupaten Malang, Kabupaten Sumenep, Kota Surabaya, Kabupaten Probolinggo, Kabupaten Jember, Kabupaten Tuban, Kabupaten Kediri, Kabupaten Bangkalan atau nama kabupaten Jatim lainnya).
3. Klasifikasikan kategorinya ke salah satu kategori resmi berikut saja:
   - "Ritual & Kepercayaan"
   - "Bahasa & Dialek (Sastra Lisan)"
   - "Seni Pertunjukan"
   - "Tradisi Lisan & Cerita Rakyat"
   - "Kriya, Arsitektur & Budaya Kebendaan"
   - "Sistem Sosial & Pengetahuan Lokal"
4. Identifikasi istilah-istilah lokal (glosarium adat, rima sajak, nama sesaji, dll).
5. Buat sintesis teoritis mengenai signifikansi kulturalnya.
6. Buat analisis mendalam tentang latar belakang historis, studi komparatif dengan adat serumpun di daerah lain, dan rekomendasi daerah tetangga prapelestarian.
7. Tentukan status kelestarian apakah "Lestari", "Rentan", atau "Terancam Punah".
8. Berikan saran pelestariannya yang inovatif dan partisipatif bagi akademisi maupun masyarakat adat.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah koordinator riset senior di Jaringan Etnografi Jawa Timur. Anda mahir dalam mengolah catatan lapangan mentah menjadi dokumen penelitian etnografi berstandar UNESCO, menganalisis bahasa daerah (Jawa Timuran, Osing, Madura, Tengger), merekatkan silsilah sejarah budaya, dan memberikan saran revitalisasi adat.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Judul catatan penelitian yang padat, menarik dan akademis" },
            category: { type: Type.STRING, description: "Kategori etnografi. Harus dari salah satu: 'Ritual & Kepercayaan', 'Bahasa & Dialek (Sastra Lisan)', 'Seni Pertunjukan', 'Tradisi Lisan & Cerita Rakyat', 'Kriya, Arsitektur & Budaya Kebendaan', 'Sistem Sosial & Pengetahuan Lokal'" },
            regency: { type: Type.STRING, description: "Kabupaten atau Kota di Jawa Timur tempat rekaman budaya diamati" },
            description: { type: Type.STRING, description: "Deskripsi lengkap dan mendalam memformulasikan kembali catatan mentah tersebut secara ilmiah namun mudah dipahami" },
            localTerms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Istilah, konsep adat, mantra, dialek atau kata lokal penting" },
            culturalSignificance: { type: Type.STRING, description: "Signifikansi budaya, nilai kebersamaan, kosmologi, atau fungsi sosialnya di komunitas" },
            geminiAnalysis: {
              type: Type.OBJECT,
              properties: {
                tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kata kunci / label kebudayaan" },
                summary: { type: Type.STRING, description: "Ringkasan eksekutif satu paragraf singkat untuk basis data" },
                historicalContext: { type: Type.STRING, description: "Asal usul sejarah, mitos pendirian, keterpengaruhan kerajaan masa lalu (Majapahit, Kediri, Mataram Islam, dll)" },
                comparativeStudies: { type: Type.STRING, description: "Perbandingan akademis singkat dengan kebudayaan sejenis daerah lain di Nusantara maupun global" },
                recommendedRegencies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar kabupaten lain di Jawa Timur yang diduga memiliki inkarnasi budaya serupa" },
                conservationStatus: { type: Type.STRING, description: "Status kelestarian. Harus salah satu dari: 'Lestari', 'Rentan', atau 'Terancam Punah'" },
                conservationAdvice: { type: Type.STRING, description: "Saran tindakan taktis revitalisasi adat berbasis peran serta peneliti dan warga setempat" }
              },
              required: ["tags", "summary", "historicalContext", "comparativeStudies", "recommendedRegencies", "conservationStatus", "conservationAdvice"]
            }
          },
          required: ["title", "category", "regency", "description", "localTerms", "culturalSignificance", "geminiAnalysis"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    
    // Supplement optional fields
    parsedData.id = `rec-${Date.now()}`;
    parsedData.researcherName = researcherName || "Peneliti Partisipatif (AI Enriched)";
    parsedData.dateReported = new Date().toISOString().split("T")[0];
    parsedData.latitude = typeof x === "number" ? x : 50;
    parsedData.longitude = typeof y === "number" ? y : 50;
    parsedData.isVerified = false; // verified always starts false until leader confirms

    // Save record to local ledger file
    const records = readRecords();
    records.push(parsedData);
    writeRecords(records);

    res.json({
      success: true,
      simulated: false,
      data: parsedData
    });

  } catch (error: any) {
    console.error("Kesalahan saat memanggil Gemini API:", error);
    res.status(500).json({ error: "Gagal memproses catatan dengan AI: " + error.message });
  }
});

// ---------------------- VITE SETUP ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Etnografi Jawa Timur Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
