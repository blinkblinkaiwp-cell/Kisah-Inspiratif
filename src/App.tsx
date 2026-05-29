/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  User, 
  BookOpen, 
  Info, 
  X, 
  Compass, 
  SlidersHorizontal,
  BookmarkCheck,
  Building,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  Award
} from "lucide-react";
import { EthnographicRecord, RegencyInfo, EthnographyCategory } from "./types";
import { EAST_JAVA_REGENCIES } from "./data";

export default function App() {
  const [records, setRecords] = useState<EthnographicRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<EthnographicRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRegencyFilter, setSelectedRegencyFilter] = useState<string>("All");
  
  // Interactive form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EthnographyCategory>(EthnographyCategory.RITUAL_BELIEF);
  const [regency, setRegency] = useState("Kabupaten Banyuwangi");
  const [description, setDescription] = useState("");
  const [researcherName, setResearcherName] = useState("");
  const [localTermsInput, setLocalTermsInput] = useState("");
  const [culturalSignificance, setCulturalSignificance] = useState("");
  
  // Map interaction coordinate state
  const [coordinateX, setCoordinateX] = useState<number>(50);
  const [coordinateY, setCoordinateY] = useState<number>(50);
  const [mapHoverHub, setMapHoverHub] = useState<RegencyInfo | null>(null);
  
  // Custom AI Ingestion / raw processing states
  const [rawNotesInput, setRawNotesInput] = useState("");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiStep, setAiStep] = useState<string>("");
  const [aiProgressPercentage, setAiProgressPercentage] = useState(0);
  const [apiNotification, setApiNotification] = useState<{message: string, isError: boolean} | null>(null);

  // Load initial data
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/records");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        // By default, open the first record in details if none is chosen
        if (data.length > 0 && !selectedRecord) {
          setSelectedRecord(data[0]);
        }
      } else {
        showNotification("Gagal mengambil data dari server database.", true);
      }
    } catch (err) {
      console.error(err);
      showNotification("Terjadi kesalahan jaringan rute API.", true);
    }
  };

  const showNotification = (msg: string, isErr = false) => {
    setApiNotification({ message: msg, isError: isErr });
    setTimeout(() => {
      setApiNotification(null);
    }, 5000);
  };

  // Quick reset database seed records
  const resetDatabaseSeed = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menyetel ulang seluruh basis data ke setelan awal pustaka riset?")) {
      return;
    }
    try {
      const response = await fetch("/api/records/reset", { method: "POST" });
      if (response.ok) {
        const resJson = await response.json();
        setRecords(resJson.data);
        if (resJson.data.length > 0) {
          setSelectedRecord(resJson.data[0]);
        }
        showNotification("Basis data digital telah dipulihkan ke versi rintisan awal.");
      }
    } catch {
      showNotification("Sistem gagal me-reset database.", true);
    }
  };

  // Quick manual or custom submission
  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !researcherName) {
      showNotification("Harap lengkapi Judul, Catatan Pengamatan, dan Nama Peneliti.", true);
      return;
    }

    try {
      const termsArray = localTermsInput
        ? localTermsInput.split(",").map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title,
        category,
        regency,
        description,
        researcherName,
        latitude: coordinateX,
        longitude: coordinateY,
        localTerms: termsArray,
        culturalSignificance,
        isVerified: false,
        geminiAnalysis: null // Manual input doesn't run rich analysis unless analyzed explicitly or through instant AI Ingest
      };

      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newlyCreated = await response.json();
        setRecords(prev => [...prev, newlyCreated]);
        setSelectedRecord(newlyCreated);
        
        // Reset form inputs
        setTitle("");
        setDescription("");
        setResearcherName("");
        setLocalTermsInput("");
        setCulturalSignificance("");
        setIsFormOpen(false);
        showNotification(`Laporan "${newlyCreated.title}" telah didaftarkan ke jaringan kerja partisipatif!`);
      }
    } catch {
      showNotification("Kesalahan saat mengunggah rekapitulasi data.", true);
    }
  };

  // Perform AI ingestion on raw notebook notes via Gemini
  const handleGeminiIngest = async () => {
    if (!rawNotesInput.trim()) {
      showNotification("Mohon masukkan teks coretan lapangan mentah telebih dahulu.", true);
      return;
    }

    setIsAIProcessing(true);
    setAiProgressPercentage(15);
    setAiStep("Menginisialisasi model sosiologis-antropologis Jatim...");

    // Elegant simulation progress sequence
    const timers = [
      setTimeout(() => {
        setAiProgressPercentage(38);
        setAiStep("Menganalisis aksen regional, dialek kebahasaan & kosakata glosarium adat (Madura/Osing/Tengger)...");
      }, 950),
      setTimeout(() => {
        setAiProgressPercentage(65);
        setAiStep("Mencari keterkaitan sejarah silsilah budaya dengan babad nusantara terdahulu...");
      }, 2300),
      setTimeout(() => {
        setAiProgressPercentage(85);
        setAiStep("Menaksir kepunahan adat, merancang saran revitalisasi taktis & memetakan titik koordinat...");
      }, 3800)
    ];

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: rawNotesInput,
          researcherName: researcherName || "Peneliti Partisipatif Jatim",
          x: coordinateX,
          y: coordinateY
        })
      });

      timers.forEach(clearTimeout);

      if (response.ok) {
        setAiProgressPercentage(100);
        setAiStep("Berhasil merumuskan entri etnografi akademis!");
        
        const resJson = await response.json();
        const finalObj = resJson.data;

        // Add to state
        setRecords(prev => [...prev, finalObj]);
        setSelectedRecord(finalObj);
        
        // Clean form states
        setRawNotesInput("");
        setLocalTermsInput("");
        setCulturalSignificance("");
        setTitle("");
        setDescription("");
        setIsFormOpen(false);
        
        if (resJson.simulated) {
          showNotification("Berhasil memproses via sistem pakar antropologi. (Umpan simulasi aktif)", false);
        } else {
          showNotification("Gemini AI berhasil menyusun laporan etnografi UNESCO ilmiah secara instan!", false);
        }
      } else {
        const errData = await response.json();
        showNotification(errData.error || "Gagal memperoleh analisis AI.", true);
      }
    } catch (e) {
      timers.forEach(clearTimeout);
      showNotification("Masalah koneksi server saat berkonsultasi dengan Gemini AI.", true);
    } finally {
      setIsAIProcessing(false);
      setAiProgressPercentage(0);
    }
  };

  // Verify record entry (only allowed for authenticated or lead researchers in field)
  const verifyRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/records/${id}/verify`, { method: "POST" });
      if (response.ok) {
        const updated = await response.json();
        setRecords(prev => prev.map(r => r.id === id ? updated : r));
        setSelectedRecord(updated);
        showNotification(`Data etnografi "${updated.title}" kini telah terverifikasi secara resmi.`);
      }
    } catch {
      showNotification("Gagal memverifikasi catatan.", true);
    }
  };

  // Permanently delete a record
  const deleteRecord = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus permanen dokumentasi etnografi ini dari arsip digital nasional?")) {
      return;
    }
    try {
      const response = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (response.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        setSelectedRecord(null);
        showNotification("Dokumentasi telah dihapus secara aman dari pusat server.");
      }
    } catch {
      showNotification("Gagal menghapus entri dari jaringan.", true);
    }
  };

  // Click handler directly on the East Java Vector map to pinpoint positions
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    
    setCoordinateX(roundedX);
    setCoordinateY(roundedY);
    
    // Auto find closest default regency hubs to improve user convenience
    let closestHub = EAST_JAVA_REGENCIES[0];
    let minDistance = Infinity;
    
    EAST_JAVA_REGENCIES.forEach(reg => {
      const dist = Math.sqrt(Math.pow(reg.coordinates.x - roundedX, 2) + Math.pow(reg.coordinates.y - roundedY, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closestHub = reg;
      }
    });

    if (minDistance < 22) {
      setRegency(closestHub.name);
      showNotification(`Koordinat diarahkan di sekitar wilayah kebudayaan ${closestHub.name}`);
    } else {
      showNotification(`Menunjuk titik koordinat bebas partisipatif: X:${roundedX}%, Y:${roundedY}%`);
    }
  };

  // Filter and search computation logic
  const filteredRecords = records.filter(record => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      record.title.toLowerCase().includes(query) ||
      record.description.toLowerCase().includes(query) ||
      record.regency.toLowerCase().includes(query) ||
      record.researcherName.toLowerCase().includes(query) ||
      (record.localTerms && record.localTerms.some(t => t.toLowerCase().includes(query)));
      
    const matchesCategory = selectedCategory === "All" || record.category === selectedCategory;
    const matchesRegency = selectedRegencyFilter === "All" || record.regency === selectedRegencyFilter;
    
    return matchesSearch && matchesCategory && matchesRegency;
  });

  // Quick helper to categorize colors for regional risk index
  const getConservationBadgeStyles = (status: "Lestari" | "Rentan" | "Terancam Punah" | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-300";
    switch (status) {
      case "Lestari": 
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "Rentan": 
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "Terancam Punah": 
        return "bg-rose-50 text-rose-800 border-rose-300";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#5A5A40]/20 antialiased">
      
      {/* ----------------- EDITORIAL HEADER / NAVIGATION ----------------- */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 px-4 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-[#5A5A40] font-mono">
              Jaringan Etnografi
            </span>
            <span className="text-xl md:text-2xl font-serif font-black italic tracking-tight text-[#1A1A1A] mt-0.5">
              Jawa Timur
            </span>
          </div>
          <nav className="hidden lg:flex gap-6 text-[10px] uppercase tracking-widest font-semibold text-[#1A1A1A]/60">
            <a href="#arsip" className="hover:text-[#1A1A1A] transition-colors pb-1 border-b border-transparent hover:border-[#1A1A1A]">Posisis & Arsip</a>
            <a href="#peta" className="hover:text-[#1A1A1A] transition-colors pb-1 border-b border-transparent hover:border-[#5A5A40]">Kartografi Partisipatif</a>
            <a href="#metodologi" className="hover:text-[#1A1A1A] transition-colors pb-1 border-b border-transparent hover:border-[#1A1A1A]">Pustaka Deskriptif</a>
            <a href="#manifesto" className="hover:text-[#1A1A1A] transition-colors pb-1 border-b border-transparent hover:border-[#1A1A1A]">Manifesto</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Diagnostic status tag */}
          <div className="hidden sm:flex flex-col text-right mr-3 font-mono">
            <span className="text-[9px] uppercase tracking-tighter opacity-50">SISTEM INTEGRASI DIGITAL</span>
            <span className="text-[10px] text-[#5A5A40] font-semibold uppercase tracking-wider">ONLINE STATE (GMT+7)</span>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            id="btn-headline-sumbang-riset" 
            className="bg-[#5A5A40] hover:bg-[#4A4A30] text-[#FAF9F6] text-[10px] md:text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Sumbang Riset</span>
          </button>
        </div>
      </header>

      {/* ----------------- FLOATING NOTIFICATION BANNER ----------------- */}
      {apiNotification && (
        <div className={`fixed bottom-14 right-4 md:right-10 z-50 p-4 rounded-sm border max-w-md shadow-lg transition-all animate-fade-in ${
          apiNotification.isError 
            ? "bg-rose-50 border-rose-300 text-rose-900" 
            : "bg-[#FAF9F6] border-[#5A5A40] text-[#1A1A1A]"
        }`}>
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 shrink-0 mt-0.5 ${apiNotification.isError ? "text-rose-600" : "text-[#5A5A40]"}`} />
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider mb-1">
                {apiNotification.isError ? "SISTEM RUTE ERROR" : "INKORPORASI DATA"}
              </p>
              <p className="text-xs leading-relaxed">{apiNotification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MAIN WORKSPACE LAYOUT ----------------- */}
      <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#1A1A1A]/10">
        
        {/* LEFT COLUMN: Vertical branding & Manifesto Side */}
        <aside className="w-full lg:w-20 shrink-0 bg-[#FAF9F6] border-b lg:border-b-0 border-[#1A1A1A]/10 flex lg:flex-col justify-between items-center py-4 lg:py-10 px-4">
          <span className="hidden lg:block rotate-180 [writing-mode:vertical-lr] text-[10px] uppercase font-mono tracking-[0.5em] text-[#1A1A1A]/30 font-medium whitespace-nowrap">
            PROVINSI JAWA TIMUR • REPUBLIK INDONESIA
          </span>
          <div className="flex lg:flex-col gap-4 items-center w-full justify-between lg:justify-normal">
            <div className="text-[10px] font-mono text-[#5A5A40] font-bold tracking-wider lg:rotate-90 lg:my-6">
              KULTURAL
            </div>
            <div className="w-8 h-8 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center text-[11px] font-mono font-black select-none">
              35
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: Central Interactive Explorer (Maps + Catalog) */}
        <main className="flex-1 p-4 md:p-8 flex flex-col gap-8 min-w-0" id="arsip">
          
          {/* Welcome Masthead */}
          <section className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-[#1A1A1A]/10">
            <div className="max-w-2xl">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#5A5A40] font-bold bg-[#5A5A40]/10 px-2.5 py-1 rounded">
                DOKUMENTASI KOLEKTIF & PARTISIPATIF
              </span>
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight font-bold italic mt-3 mb-2">
                Kartografi Kebudayaan Jatim
              </h1>
              <p className="text-sm md:text-base text-[#1A1A1A]/80 leading-relaxed font-light">
                Selamat datang di platform digital terpadu untuk pendokumentasian warisan ekspresi, sastra lisan, ritual sakral, dan kearifan ekologi lokal. <strong>Klik titik peta apa pun</strong> atau masukkan naskah mentah untuk diasimilasi oleh asisten AI antropologis berbasis model <strong>Gemini</strong>.
              </p>
            </div>

            <div className="flex md:flex-col items-end shrink-0 gap-3 text-right">
              <div className="bg-[#E9E6DF]/80 border border-[#1A1A1A]/10 p-3 rounded-sm">
                <span className="block text-3xl font-serif italic text-dark font-black tracking-tighter">
                  {records.length} <span className="text-lg text-[#5A5A40]/80">Budaya</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/60 font-mono block mt-1">
                  TERINTEGRASI DI BASIS DATA
                </span>
              </div>
              <button 
                onClick={resetDatabaseSeed}
                className="text-[10px] font-mono font-semibold tracking-wider text-[#1A1A1A]/60 hover:text-rose-700/90 underline flex items-center gap-1 cursor-pointer transition-colors"
                title="Pulihkan data sampel awal"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Contoh</span>
              </button>
            </div>
          </section>

          {/* ----------------- INTERACTIVE PARTRICIPATIVE MAP (PETA PARTISIPATIF) ----------------- */}
          <section id="peta" className="bg-[#F0EEE9] border border-[#1A1A1A]/15 rounded-sm p-4 md:p-6 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-3 border-b border-[#1A1A1A]/10 gap-3">
              <div>
                <h3 className="text-lg font-serif font-semibold flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#5A5A40]" />
                  <span>Gerbang Peta Partisipatif Jawa Timur</span>
                </h3>
                <p className="text-xs text-[#1A1A1A]/70">
                  Arahkan kursor ke titik simpul adat untuk membaca keunikan tradisi luhur, atau <strong>klik bebas langsung pada peta</strong> untuk memplot penemuan lapangan baru.
                </p>
              </div>

              {/* Coordinates state monitor box */}
              <div className="shrink-0 font-mono bg-[#E9E6DF] px-3 py-1.5 rounded-sm text-[11px] border border-[#1A1A1A]/10 flex items-center justify-between md:justify-end gap-3">
                <span className="opacity-60">KOORDINAT TERPILIH:</span>
                <span className="bg-[#FAF9F6] px-1.5 py-0.5 rounded text-[#5A5A40] font-bold">
                  X {coordinateX}% • Y {coordinateY}%
                </span>
              </div>
            </div>

            {/* MAP STYLING & SVG VECTOR BOARD */}
            <div className="relative w-full aspect-[22/10] bg-[#E9E6DF]/50 border border-[#1A1A1A]/5 rounded-sm overflow-hidden select-none">
              
              {/* Background texture, contour water lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] opacity-40 bg-white/40 p-2 rounded border border-black/5">
                <p className="font-bold">METODE PEMETAAN:</p>
                <p>Proyeksi Regional Lokasi Kebudayaan</p>
                <p className="text-[8px] mt-1 text-[#5A5A40]">Akurasi Koordinat: Presisi Partisipatif</p>
              </div>

              {/* Dynamic Coordinate pin-pointer (User click indicator) */}
              <div 
                className="absolute transition-all duration-300 pointer-events-none z-20 flex flex-col items-center"
                style={{ left: `${coordinateX}%`, top: `${coordinateY}%`, transform: 'translate(-50%, -100%)' }}
              >
                <div className="absolute -top-11 bg-[#1A1A1A] text-[#FAF9F6] text-[10px] font-mono px-2 py-1 rounded shadow-md whitespace-nowrap border border-[#FAF9F6]/20 flex items-center gap-1.5 animate-bounce">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Riset Baru Di Sini</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-amber-500/30 border-2 border-amber-500 animate-ping absolute -top-3.5"></div>
                <MapPin className="w-7 h-7 text-[#1A1A1A] drop-shadow-md" fill="#FBBF24" />
              </div>

              {/* Main SVG Contour Drawing represents East Java & Madura */}
              <svg 
                className="w-full h-full cursor-crosshair" 
                viewBox="0 0 1000 450" 
                preserveAspectRatio="xMidYMid slice"
                onClick={handleMapClick}
              >
                {/* East Java mainland & Islands representational Paths */}
                {/* Pacitan, Ponorogo, Trenggalek West flank */}
                <path 
                  d="M 50,220 L 150,230 L 220,240 L 250,280 L 260,340 L 200,350 L 150,330 L 110,320 L 50,300 Z" 
                  fill="#CDD3C5" 
                  stroke="#FAF9F6" 
                  strokeWidth="2" 
                  opacity="0.85"
                />
                
                {/* Central Plains: Surabaya, Malang, Kediri */}
                <path 
                  d="M 220,240 L 320,180 L 450,150 L 560,160 L 590,260 L 520,380 L 410,380 L 330,360 L 250,280 Z" 
                  fill="#DFE3D8" 
                  stroke="#FAF9F6" 
                  strokeWidth="2" 
                  opacity="0.9"
                />

                {/* East Peninsula (Banyuwangi, Jember, Bondowoso, Situbondo) */}
                <path 
                  d="M 560,160 L 640,180 L 740,210 L 820,210 L 920,220 L 950,250 L 940,310 L 850,340 L 710,340 L 590,260 Z" 
                  fill="#C0C8B7" 
                  stroke="#FAF9F6" 
                  strokeWidth="2" 
                  opacity="0.9"
                />

                {/* Madura Island Vector representational Contour */}
                <path 
                  d="M 480,110 L 580,70 L 710,60 L 850,80 L 880,120 L 810,135 L 680,140 L 520,135 Z" 
                  fill="#E5DEC9" 
                  stroke="#FAF9F6" 
                  strokeWidth="2" 
                  opacity="0.9"
                />

                {/* Bawean Island tiny representation */}
                <circle cx="490" cy="40" r="12" fill="#E5DEC9" stroke="#FAF9F6" strokeWidth="1" />
                
                {/* Sempu land */}
                <circle cx="480" cy="390" r="6" fill="#C0C8B7" stroke="#FAF9F6" />

                {/* Bali Strait boundary line label */}
                <text x="960" y="275" fill="#1A1A1A" opacity="0.3" fontSize="10" fontFamily="monospace" textAnchor="middle">SELAT BALI</text>
                <text x="500" y="11" fill="#1A1A1A" opacity="0.2" fontSize="10" fontFamily="monospace" textAnchor="middle">LAUT JAWA</text>
                <text x="300" y="430" fill="#1A1A1A" opacity="0.2" fontSize="10" fontFamily="monospace" textAnchor="middle">SAMUDERA HINDIA</text>

                {/* Grid guidelines for visual decoration */}
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#1A1A1A" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="300" x2="1000" y2="300" stroke="#1A1A1A" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="333" y1="0" x2="333" y2="450" stroke="#1A1A1A" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="666" y1="0" x2="666" y2="450" stroke="#1A1A1A" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />

                {/* Default Core Regency Anchor Nodes */}
                {EAST_JAVA_REGENCIES.map((reg) => {
                  const xCoord = reg.coordinates.x * 10;
                  const yCoord = reg.coordinates.y * 4.5;
                  
                  // Count total actual records belonging to this kabupaten
                  const localRecCount = records.filter(r => r.regency === reg.name || r.regency.includes(reg.name.split(" ").slice(-1)[0])).length;
                  
                  return (
                    <g 
                      key={reg.id} 
                      className="group cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setMapHoverHub(reg)}
                      onMouseLeave={() => setMapHoverHub(null)}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop general map click
                        setCoordinateX(reg.coordinates.x);
                        setCoordinateY(reg.coordinates.y);
                        setRegency(reg.name);
                        setSelectedRegencyFilter(reg.name);
                        showNotification(`Menyaring database khusus wilayah: ${reg.name}`);
                      }}
                    >
                      {/* Interactive hover circle boundary */}
                      <circle 
                        cx={xCoord} 
                        cy={yCoord} 
                        r="18" 
                        fill="transparent" 
                        className="group-hover:fill-[#5A5A40]/10" 
                      />

                      {/* Halo ring for nodes containing active records */}
                      {localRecCount > 0 && (
                        <circle 
                          cx={xCoord} 
                          cy={yCoord} 
                          r="10" 
                          fill="none" 
                          stroke="#5A5A40" 
                          strokeWidth="1.5" 
                          className="animate-pulse" 
                        />
                      )}

                      {/* Point indicator */}
                      <circle 
                        cx={xCoord} 
                        cy={yCoord} 
                        r={localRecCount > 0 ? "5.5" : "4"} 
                        fill={localRecCount > 0 ? "#5A5A40" : "#1A1A1A"} 
                        stroke="#FAF9F6" 
                        strokeWidth="1.5" 
                      />

                      {/* Short name indicator shadow */}
                      <text 
                        x={xCoord} 
                        y={yCoord - 10} 
                        textAnchor="middle" 
                        className="text-[10px] font-mono tracking-tight font-black fill-white"
                        style={{ paintOrder: 'stroke', stroke: '#1A1A1A', strokeWidth: '2.5px', textRendering: 'optimizeLegibility' }}
                      >
                        {reg.name.replace("Kabupaten ", "").replace("Kota ", "")}
                      </text>
                    </g>
                  );
                })}

                {/* Participative Custom Pins plotted from user-submitted records */}
                {records.filter(r => !EAST_JAVA_REGENCIES.some(b => b.name === r.regency)).map((rec, index) => {
                  const xVal = rec.latitude * 10;
                  const yVal = rec.longitude * 4.5;
                  
                  return (
                    <g key={rec.id || index} className="cursor-pointer">
                      <circle cx={xVal} cy={yVal} r="14" fill="transparent" />
                      <path 
                        d={`M ${xVal},${yVal - 5} L ${xVal - 4},${yVal + 3} L ${xVal + 4},${yVal + 3} Z`} 
                        fill="#D97706" 
                        stroke="#FAF9F6" 
                        strokeWidth="1"
                      />
                      <circle cx={xVal} cy={yVal + 3} r="1.5" fill="#FAF9F6" />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic tooltip popup embedded directly inside the container */}
              {mapHoverHub && (
                <div className="absolute top-3 right-3 z-30 max-w-xs bg-[#FAF9F6] border-2 border-[#5A5A40] p-4 rounded-sm shadow-xl pointer-events-none animate-fade-in font-sans">
                  <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold font-mono">
                    SENTRA ADAT JAWA TIMUR
                  </span>
                  <h4 className="text-base font-serif font-bold uppercase mt-1 mb-1 text-[#1A1A1A]">
                    {mapHoverHub.name}
                  </h4>
                  <p className="text-[11px] text-[#1A1A1A]/70 mb-2 leading-relaxed">
                    Dominasi Sub-budaya: <strong className="text-[#1A1A1A] font-medium">{mapHoverHub.dominantEthnicGroup}</strong>. {mapHoverHub.description}
                  </p>
                  
                  <div className="border-t border-[#1A1A1A]/10 pt-2">
                    <span className="text-[9px] uppercase tracking-wider font-bold opacity-65 block mb-1">
                      TRADISI UTAMA LAPANGAN:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {mapHoverHub.famousTraditions.map((trad, idx) => (
                        <span key={idx} className="bg-[#FAF9F6] border border-[#1A1A1A]/20 text-[9px] font-mono px-1.5 py-0.5 rounded text-[#1A1A1A]">
                          {trad}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map action notes footer */}
            <div className="flex justify-between items-center mt-3 text-[10px] md:text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#5A5A40]"></span>
                  <span>Sentra Budaya Utama</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded bg-amber-500"></span>
                  <span>Temuan Lapangan Baru</span>
                </span>
              </div>
              <span className="italic block text-[#1A1A1A]/60 text-right">
                Klik titik sentra untuk memfilter basis data di bawah secara cepat.
              </span>
            </div>
          </section>


          {/* ----------------- SEARCH & DYNAMIC REPOSITORY TABLE (BASIS DATA DIGITAL) ----------------- */}
          <section id="arsip" className="flex flex-col gap-5 mt-4">
            
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
              <div>
                <h2 className="text-2xl font-serif italic tracking-tight font-bold">
                  Arsip & Registri Digital Kebudayaan
                </h2>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed max-w-lg">
                  Kumpulan data primer yang siap untuk dievaluasi oleh akademisi dan pegiat kebudayaan di seluruh penjuru instansi.
                </p>
              </div>

              {/* Filtering Controls Row */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Reset filters shortcut button */}
                {(selectedCategory !== "All" || selectedRegencyFilter !== "All" || searchQuery.trim() !== "") && (
                  <button 
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedRegencyFilter("All");
                      setSearchQuery("");
                    }}
                    className="bg-transparent hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/30 text-xs px-3 py-1.5 rounded-sm flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                  >
                    <span>Hapus Semua Filter</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Dropdown Regency Selector */}
                <select 
                  value={selectedRegencyFilter}
                  onChange={(e) => setSelectedRegencyFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#1A1A1A]/20 text-xs px-3 py-1.5 rounded-sm focus:outline-none focus:border-[#5A5A40] text-[#1A1A1A] font-semibold cursor-pointer"
                >
                  <option value="All">Semua Kabupaten/Kota ({EAST_JAVA_REGENCIES.length}+)</option>
                  {EAST_JAVA_REGENCIES.map((reg) => (
                    <option key={reg.id} value={reg.name}>{reg.name}</option>
                  ))}
                </select>

                {/* Standardized CSV Export simulation */}
                <button 
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "Judul,Kategori,Wilayah,Peneliti,Tanggal,Status\n"
                      + records.map(r => `"${r.title}","${r.category}","${r.regency}","${r.researcherName}","${r.dateReported}","${r.isVerified ? 'Terverifikasi' : 'Draf'}"`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `etnografi_jawa_timur_arsip.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showNotification("Berhasil mengekspor seluruh basis data ke format spreadsheet (.CSV)!");
                  }}
                  className="bg-[#E9E6DF] hover:bg-[#DED9CE] text-[#1A1A1A] text-xs px-3 py-1.5 rounded-sm flex items-center gap-1.5 font-mono cursor-pointer transition-colors border border-[#1A1A1A]/10"
                  title="Unduh draf metadata untuk kebutuhan SPSS/R-Studio"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Unduh CSV</span>
                </button>
              </div>
            </div>

            {/* Keyword Search & Category Quick Filter row */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Ketik kata kunci (misal: 'seblang', 'warok', 'asing', 'tengger', 'pecut')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#1A1A1A]/10 rounded-sm py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-[#5A5A40] tracking-wide placeholder-[#1A1A1A]/40"
                />
              </div>

              {/* Categorization tabs inside the Editorial Frame */}
              <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-thin">
                {["All", ...Object.values(EthnographyCategory)].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[10px] uppercase tracking-wider px-3.5 py-2.5 rounded-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                        isActive 
                          ? "bg-[#5A5A40] text-[#FAF9F6] border-b-2 border-[#1A1A1A]" 
                          : "bg-[#E9E6DF]/50 hover:bg-[#E9E6DF] text-[#1A1A1A]/70"
                      }`}
                    >
                      {cat === "All" ? "SEMUA KATEGORI" : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty view state */}
            {filteredRecords.length === 0 && (
              <div className="bg-[#FAF9F6] py-14 text-center border border-dashed border-[#1A1A1A]/20 rounded-sm">
                <HelpCircle className="w-10 h-10 text-[#5A5A40] mx-auto opacity-30 mb-3" />
                <h4 className="text-base font-serif font-semibold italic">Arsip Digital Kosong</h4>
                <p className="text-xs text-[#1A1A1A]/60 max-w-md mx-auto mt-1">
                  Kami tidak menemukan entri budaya apa pun yang cocok dengan pencarian "{searchQuery}" atau filter wilayah yang dipilih. Silakan ubah filter Anda atau tambah data primer partisipatif Anda.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedRegencyFilter("All");
                  }}
                  className="mt-4 px-3 py-1.5 bg-[#5A5A40] text-[#FAF9F6] text-xs font-bold rounded-sm uppercase tracking-wider"
                >
                  Setel Ulang Filter
                </button>
              </div>
            )}

            {/* Grid List of Research Records matching print aesthetics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="registry-grid">
              {filteredRecords.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                
                return (
                  <div 
                    key={record.id}
                    id={`record-card-${record.id}`}
                    onClick={() => setSelectedRecord(record)}
                    className={`border transition-all duration-300 p-5 rounded-sm flex flex-col justify-between cursor-pointer group ${
                      isSelected 
                        ? "bg-[#E9E6DF] border-[#5A5A40] shadow-sm transform translate-y-[-2px]" 
                        : "bg-[#FAF9F6] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/35"
                    }`}
                  >
                    <div>
                      {/* Top metadata line of the registry card */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[9px] font-mono font-bold tracking-widest text-[#5A5A40] uppercase">
                          {record.category}
                        </span>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          {record.isVerified ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5" title="Telah diverifikasi instansi">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>VERIFIED</span>
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded shrink-0">
                              DRAFT LAPANGAN
                            </span>
                          )}

                          {record.geminiAnalysis && (
                            <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 text-[8px] font-mono px-1 py-0.5 rounded flex items-center gap-0.5">
                              <Sparkles className="w-2 h-2 text-indigo-700" />
                              <span>AI</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Title heading of record */}
                      <h3 className="text-xl font-serif font-semibold text-[#1A1A1A] group-hover:text-[#5A5A40] transition-colors mb-2">
                        {record.title}
                      </h3>

                      {/* Regency tag with small map pin */}
                      <div className="flex items-center gap-1 text-[11px] text-[#1A1A1A]/80 font-semibold mb-3">
                        <MapPin className="w-3 h-3 text-[#5A5A40] shrink-0" />
                        <span>{record.regency}</span>
                        <span className="text-[10px] opacity-40 font-mono ml-1">
                          (X:{record.latitude}% Y:{record.longitude}%)
                        </span>
                      </div>

                      {/* Snippet text */}
                      <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light mb-4 line-clamp-3">
                        {record.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & actions */}
                    <div className="border-t border-[#1A1A1A]/10 pt-3 mt-auto flex items-center justify-between text-[10px] font-mono text-[#1A1A1A]/60">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[110px] italic">{record.researcherName}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{record.dateReported}</span>
                        </span>
                      </div>

                      {/* Read More dynamic label */}
                      <span className="font-bold uppercase tracking-wider text-[#5A5A40] group-hover:underline text-[9px] shrink-0">
                        {isSelected ? "Sedang Dibaca • Lihat Detail" : "Baca Hasil Sintesis →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>

          {/* ----------------- INTRODUCTORY KNOWLEDGE BASE / METHODOLOGY ----------------- */}
          <section id="metodologi" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 mt-4 border-t border-[#1A1A1A]/10">
            
            <div className="border-t border-[#1A1A1A]/20 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#5A5A40] block mb-2">
                01 — SISTEM KHAS ARSIP
              </span>
              <h4 className="text-lg font-serif font-medium mb-2">Penyimpanan Terpadu Jatim</h4>
              <p className="text-xs leading-relaxed text-[#1A1A1A]/70">
                Pencatatan data primer didistribusikan secara transparan. Setiap entri mencakup naskah wawancara langsung, representasi geolokasi koordinat fisik, glosarium dialek lokal, serta korespondensi dengan asisten kecerdasan buatan Gemini.
              </p>
            </div>

            <div className="border-t border-[#1A1A1A]/20 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#5A5A40] block mb-2">
                02 — GLOSARIUM TERINTEGRASI
              </span>
              <h4 className="text-lg font-serif font-medium mb-2">Kosakata Dialek Daerah</h4>
              <p className="text-xs leading-relaxed text-[#1A1A1A]/70">
                Mencegah punahnya istilah vernakular. Menampung istilah magis-kuno seperti *Omprok* (mahkota Seblang), *Dhadhak Merak* (topeng Reog), serta istilah agraris sosial *Ongkek* yang merupakan sumbu utama budaya Madura dan Tenggerese.
              </p>
            </div>

            <div className="border-t border-[#1A1A1A]/20 pt-4 bg-[#5A5A40] text-[#FAF9F6] p-5 rounded-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#FAF9F6]/75 block mb-2">
                03 — REVITALISASI ADAT
              </span>
              <h4 className="text-lg font-serif italic mb-2">Kebajikan Model Gemini</h4>
              <p className="text-xs leading-relaxed text-[#FAF9F6]/90">
                AI bukan menggantikan peran adat, melainkan menyokong akademisi menyusun dokumen sosiologis bertaraf UNESCO dengan melakukan komparasi ilmiah, merumuskan latar historis kerajaan kuno (Singhasari, Majapahit, Blambangan), serta menyarankan perlindungan kekayaan intelektual (WIPO).
              </p>
            </div>

          </section>

        </main>

        {/* RIGHT COLUMN: Field Detail Display Panel & Active Ingest Sidebar */}
        <aside className="w-full lg:w-[420px] bg-[#F0EEE9] shrink-0 p-5 md:p-8 flex flex-col gap-6" id="koleksi">
          
          {/* ----------------- SUBMISSION TOOLBOX BUTTONS ----------------- */}
          <div className="bg-[#FAF9F6] border border-[#1A1A1A]/10 p-5 rounded-sm shadow-sm">
            <h3 className="text-base font-serif font-bold italic mb-3 flex items-center justify-between text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                <span>Unggah Riset Instan (Gemini)</span>
              </span>
              <span className="text-[10px] font-mono bg-[#5A5A40]/10 px-1.5 py-0.5 rounded text-[#5A5A40]">PARTISIPATIF</span>
            </h3>
            
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-4">
              Cukup ketik coretan jurnal lapangan mentah Anda seadanya. Gemini akan menerjemahkan, memetakan, mendiagnosis risiko, serta menyajikan dokumen akademis siap cetak secara seketika!
            </p>

            <div className="space-y-4">
              
              {/* Raw textual observation notes input area */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1.5">
                  1. MASUKKAN CATATAN LAPANGAN MENTAH (BAHASA BEBAS)
                </label>
                <textarea 
                  rows={4}
                  placeholder="Misal: Saya kaji upacara adat di lereng kelud tadi sore, ada tarian jaranan mistis memakai topeng singa tua dari bahan kayu nangka bernama Singo Barong. Pengikut makan bunga kantil dan beras kuning dibacakan mantra dukun purba oleh sesepuh muntuk..."
                  value={rawNotesInput}
                  onChange={(e) => setRawNotesInput(e.target.value)}
                  disabled={isAIProcessing}
                  className="w-full bg-[#FAF9F6]/80 text-xs p-2.5 rounded border border-[#1A1A1A]/20 focus:outline-none focus:border-[#5A5A40] text-[#1A1A1A] leading-relaxed placeholder:opacity-50 resize-none font-sans"
                />
              </div>

              {/* Contributor / Researcher Name metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                    NAMA PENELITI
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.g., Dr. Hariyono"
                    value={researcherName}
                    onChange={(e) => setResearcherName(e.target.value)}
                    disabled={isAIProcessing}
                    className="w-full text-xs bg-[#FAF9F6]/80 p-2 rounded border border-[#1A1A1A]/20 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                    TARGET WILAYAH
                  </label>
                  <select 
                    value={regency}
                    onChange={(e) => setRegency(e.target.value)}
                    disabled={isAIProcessing}
                    className="w-full text-xs bg-[#FAF9F6]/80 p-2 rounded border border-[#1A1A1A]/20 focus:outline-none focus:border-[#5A5A40] cursor-pointer"
                  >
                    {EAST_JAVA_REGENCIES.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordination adjustment instructions */}
              <p className="text-[10px] text-[#1A1A1A]/60 italic">
                *Klik posisi strategis pada peta di sebelah kiri terlebih dahulu untuk meletakkan titik geolokasi riset Anda ({coordinateX}%, {coordinateY}%) secara partisipatif sebelum mengklik Proses dengan AI.
              </p>

              {/* Ingestion triggers and live animations status bar */}
              {isAIProcessing ? (
                <div className="bg-[#E9E6DF] border border-[#5A5A40]/30 p-3 rounded-sm animate-pulse">
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                    <span className="font-bold text-[#5A5A40] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>SINTESIS ARTIFICIAL GEMINI...</span>
                    </span>
                    <span>{aiProgressPercentage}%</span>
                  </div>
                  {/* Styled minimalist progress bar matching print editorial aesthetic */}
                  <div className="w-full h-1 bg-[#1A1A1A]/10 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-[#5A5A40] transition-all duration-500 ease-out" 
                      style={{ width: `${aiProgressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] leading-relaxed italic text-gray-700">
                    "{aiStep}"
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleGeminiIngest}
                    disabled={isAIProcessing}
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-mono text-[11px] font-bold tracking-widest uppercase p-3 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>PROSES DENGAN GEMINI AI</span>
                  </button>
                  
                  {/* Manual form option toggler */}
                  <button
                    onClick={() => {
                      setIsFormOpen(true);
                      // Pre-fill fields with existing simple states
                      setTitle("Draf Pengamatan Baru");
                    }}
                    className="bg-transparent hover:bg-[#1A1A1A]/5 text-[#1A1A1A] border border-[#1A1A1A]/30 font-mono text-[11px] font-bold p-3 rounded-sm cursor-pointer"
                    title="Isi formulir secara manual terperinci tanpa analisis AI"
                  >
                    Formulir Manual
                  </button>
                </div>
              )}

            </div>
          </div>


          {/* ----------------- SELECTION REPORT CARDS / THE SCHOLARLY PAPER ----------------- */}
          <div className="flex-1 flex flex-col justify-between">
            
            {selectedRecord ? (
              <div className="bg-[#FAF9F6] border border-[#1A1A1A]/15 p-5 md:p-6 rounded-sm shadow-sm flex flex-col justify-between h-full">
                
                <div>
                  
                  {/* Card Editorial Framing Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-[#1A1A1A]/15 pb-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-[#5A5A40] font-bold uppercase tracking-wider">
                        KOMUNIKASI PENELITIAN JATIM • ID: {selectedRecord.id.substring(0, 10)}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                        Ditayangkan {selectedRecord.dateReported}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete command button */}
                      <button 
                        onClick={() => deleteRecord(selectedRecord.id)}
                        className="text-gray-400 hover:text-rose-700 transition-colors cursor-pointer p-1"
                        title="Hapus naskah ini dari server"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scientific Title */}
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold italic text-[#1A1A1A] tracking-tight leading-tight mb-3">
                    {selectedRecord.title}
                  </h2>

                  {/* Core Attributes Labels */}
                  <div className="grid grid-cols-2 gap-3 mb-4 bg-[#F0EEE9]/50 p-2.5 rounded border border-[#1A1A1A]/5">
                    <div>
                      <span className="text-[9px] font-mono uppercase opacity-55 block">LOKASI PENELITIAN:</span>
                      <span className="text-xs font-semibold flex items-center gap-1 mt-0.5 text-[#1A1A1A]">
                        <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                        <span>{selectedRecord.regency}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase opacity-55 block">PENGAMAT LAPANGAN:</span>
                      <span className="text-xs font-semibold flex items-center gap-1 mt-0.5 text-[#1A1A1A]">
                        <User className="w-3.5 h-3.5 text-[#5A5A40]" />
                        <span className="truncate italic">{selectedRecord.researcherName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="flex flex-wrap gap-2 items-center mb-4">
                    <span className="bg-[#5A5A40] text-[#FAF9F6] text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-sm">
                      {selectedRecord.category}
                    </span>

                    {/* Verification operations trigger */}
                    {!selectedRecord.isVerified ? (
                      <button 
                        onClick={() => verifyRecord(selectedRecord.id)}
                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-sm flex items-center gap-1 cursor-pointer transition-colors"
                        title="Klik untuk memverifikasi keakuratan tulisan lapangan"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Verifikasi Sekarang</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono uppercase px-2 py-1 rounded-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Resmi Terverifikasi</span>
                      </span>
                    )}
                  </div>

                  {/* Deep descriptive section */}
                  <div className="prose prose-sm max-w-none text-[#1A1A1A]/90">
                    <h4 className="text-[10px] font-mono tracking-wider font-bold opacity-60 uppercase mb-1">
                      CATATAN OBSERVASI PRIMER
                    </h4>
                    <p className="text-xs md:text-sm leading-relaxed font-light mb-4 text-justify whitespace-pre-wrap">
                      {selectedRecord.description}
                    </p>

                    {/* Local Glossary Terms (Kamusan & Glosarium) */}
                    {selectedRecord.localTerms && selectedRecord.localTerms.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-[10px] font-mono text-[#5A5A40] font-bold tracking-wider uppercase mb-1.5">
                          GLOSARIUM DIALEK & ISTILAH ADAT:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedRecord.localTerms.map((term, i) => (
                            <span key={i} className="bg-[#FAF9F6] border border-[#1A1A1A]/20 text-[10px] font-mono px-2 py-0.5 rounded italic">
                              • {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cultural Significance paragraph */}
                    {selectedRecord.culturalSignificance && (
                      <div className="border-l-4 border-[#5A5A40] pl-3 py-1 mb-5">
                        <h5 className="text-[10px] font-mono text-[#1A1A1A]/70 font-bold uppercase tracking-wider mb-0.5">
                          SIGNIFIKANSI KOSMOLOGI SOSIAL:
                        </h5>
                        <p className="text-xs italic leading-relaxed text-[#1A1A1A]/85">
                          "{selectedRecord.culturalSignificance}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* GEMINI SPECIALIST INTELLIGENCE OUTPUT PANEL */}
                  <div className="border-t-2 border-dashed border-[#1A1A1A]/10 pt-4 mt-4 bg-[#FAF9F6] rounded-sm">
                    {selectedRecord.geminiAnalysis ? (
                      <div className="space-y-4">
                        
                        <div className="flex items-center justify-between gap-2 bg-[#5A5A40]/10 p-2.5 rounded-sm border border-[#5A5A40]/25">
                          <div className="flex items-center gap-1.5 font-serif font-black text-xs text-[#5A5A40]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>SINTESIS SISTEM PAKAR GEMINI AI</span>
                          </div>
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded ${getConservationBadgeStyles(selectedRecord.geminiAnalysis.conservationStatus)}`}>
                            INDEKS: {selectedRecord.geminiAnalysis.conservationStatus}
                          </span>
                        </div>

                        {/* Executive Summary block */}
                        <div>
                          <span className="text-[9px] font-mono opacity-55 block">RINGKASAN AKADEMIK:</span>
                          <p className="text-xs leading-relaxed text-[#1A1A1A]/90 font-sans mt-0.5">
                            {selectedRecord.geminiAnalysis.summary}
                          </p>
                        </div>

                        {/* Royal/Historical records link */}
                        <div>
                          <span className="text-[9px] font-mono opacity-55 block">BABAD LELUHUR & SEJARAH MAJAPAHIT:</span>
                          <p className="text-xs leading-relaxed text-[#1A1A1A]/90 font-light mt-0.5">
                            {selectedRecord.geminiAnalysis.historicalContext}
                          </p>
                        </div>

                        {/* Cross Comparative studies */}
                        <div>
                          <span className="text-[9px] font-mono opacity-55 block">KOMPARASI AKULTURASI ANTAR WILAYAH:</span>
                          <p className="text-xs leading-relaxed text-[#1A1A1A]/90 italic mt-0.5">
                            {selectedRecord.geminiAnalysis.comparativeStudies}
                          </p>
                        </div>

                        {/* Tactics suggestion and revitalization */}
                        <div className="bg-[#FAF9F6] border border-[#5A5A40]/20 p-3 rounded">
                          <span className="text-[9px] font-mono text-[#5A5A40] font-bold block uppercase mb-1">
                            Saran Revitalisasi Komunal (UNESCO Standard):
                          </span>
                          <p className="text-xs leading-relaxed text-[#1A1A1A]/85 italic">
                            {selectedRecord.geminiAnalysis.conservationAdvice}
                          </p>
                        </div>

                        {/* Recommended neighborhood entities for researchers to visit */}
                        {selectedRecord.geminiAnalysis.recommendedRegencies && selectedRecord.geminiAnalysis.recommendedRegencies.length > 0 && (
                          <div className="text-[10px] font-mono border-t border-[#1A1A1A]/5 pt-2">
                            <span className="opacity-55 block">SIMPUL ADAT TETANGGA REKOMENDASI:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedRecord.geminiAnalysis.recommendedRegencies.map((kab, idx) => (
                                <span key={idx} className="bg-[#E9E6DF] px-2 py-0.5 rounded text-[#1A1A1A]/80 font-semibold" onClick={() => {
                                  setSelectedRegencyFilter(kab);
                                  showNotification(`Mengkaji simpul riset terkait di ${kab}`);
                                }}>
                                  {kab}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ) : (
                      // Waiting Gemini synthesis state
                      <div className="bg-[#F0EEE9] p-4 rounded text-center border border-[#1A1A1A]/10">
                        <Sparkles className="w-5 h-5 text-[#5A5A40] mx-auto mb-2 opacity-50 animate-pulse" />
                        <span className="text-xs font-serif italic text-[#1A1A1A]/80 font-bold block">Sintesis AI Belum Tersedia</span>
                        <p className="text-[10.5px] text-[#1A1A1A]/60 max-w-xs mx-auto mt-1 leading-relaxed">
                          Laporan ini dimasukkan secara manual tanpa asisten digital. Klik tombol di bawah untuk meminta model Gemini melakukan pendalaman riset secara instan.
                        </p>
                        
                        <button
                          onClick={async () => {
                            try {
                              setIsAIProcessing(true);
                              setAiProgressPercentage(30);
                              setAiStep("Mengunduh metadata riset manual...");
                              
                              const response = await fetch("/api/gemini/analyze", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  rawText: selectedRecord.description,
                                  researcherName: selectedRecord.researcherName,
                                  x: selectedRecord.latitude,
                                  y: selectedRecord.longitude
                                })
                              });

                              if (response.ok) {
                                // Delete manually inserted duplicate draft to keep workspace pristine!
                                await fetch(`/api/records/${selectedRecord.id}`, { method: "DELETE" });
                                
                                const resJson = await response.json();
                                setRecords(prev => prev.filter(r => r.id !== selectedRecord.id).concat(resJson.data));
                                setSelectedRecord(resJson.data);
                                showNotification("Gemini AI berhasil menyusun laporan komparatif akademis untuk draf ini!");
                              }
                            } catch {
                              showNotification("Gagal melengkapi ulasan dengan AI.", true);
                            } finally {
                              setIsAIProcessing(false);
                            }
                          }}
                          className="mt-3 inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white text-[10px] font-mono font-bold tracking-wider uppercase rounded-sm cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Minta Analisis Gemini</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                <div className="border-t border-[#1A1A1A]/15 pt-3 mt-6 text-center text-[10px] font-mono opacity-40">
                  JEJAK ETNOGRAFI JAWA TIMUR — ARSIP DIGITAL NASIONAL
                </div>

              </div>
            ) : (
              // Empty selection fallback state
              <div className="bg-[#FAF9F6]/50 border border-dashed border-[#1A1A1A]/20 p-8 rounded-sm text-center h-full flex flex-col justify-center items-center">
                <BookOpen className="w-8 h-8 text-[#5A5A40]/40 mb-2" />
                <h4 className="text-base font-serif font-bold italic text-[#1A1A1A]/70">Pilih Lembaran Riset</h4>
                <p className="text-xs text-[#1A1A1A]/60 max-w-xs mx-auto mt-1 leading-relaxed">
                  Silakan pilih salah satu entri budaya dari daftar registri atau klik titik sentra budaya di dalam peta untuk memulai membaca telaah antropologi dari pakar kami.
                </p>
              </div>
            )}

            {/* Cultural Manifesto Quotes Box */}
            <div className="mt-5 p-4 border border-[#1A1A1A]/20 bg-[#FAF9F6]">
              <p className="text-[10px] leading-relaxed italic text-[#1A1A1A]/75 mb-3 font-serif">
                "Bahasa adalah rumah bagi kedewasaan kebudayaan, tari adalah getaran jiwa-jiwa prajurit luhur, dan ritual adalah jembatan sakral manusia agraris menatap kemurahan alam raya."
              </p>
              <div className="flex items-center justify-between text-[9px] font-mono text-[#1A1A1A]/60 uppercase">
                <span className="font-bold">— DUKUMEN MANIFESTO PENELITI</span>
                <span>DESB-2026</span>
              </div>
            </div>

          </div>

        </aside>

      </div>

      {/* ----------------- SEPARATED COMPLEX SUBMISSION MODAL / DETAILED FORM ----------------- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border-2 border-[#5A5A40] w-full max-w-xl p-6 rounded-sm shadow-2xl relative font-sans">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-[#1A1A1A] hover:text-[#5A5A40] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono text-[#5A5A40] font-bold tracking-widest uppercase">
              METODOLOGI KONTRIBUSI MANUAL
            </span>
            <h3 className="text-2xl font-serif italic tracking-tight font-bold mb-4 border-b border-[#1A1A1A]/10 pb-2">
              Sumbang Riset Etnografi Manual
            </h3>

            <form onSubmit={handleSubmitRecord} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                    JUDUL ENTRILAN / TRADISI
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g., Wayang Kulit Gagrag Wetanan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                    KATEGORI UTAMA KOLEKTIF
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EthnographyCategory)}
                    className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40] cursor-pointer"
                  >
                    {Object.values(EthnographyCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                    NAMA PENELITI LAPANGAN
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g., Dr. Siti Aminah"
                    value={researcherName}
                    onChange={(e) => setResearcherName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                    KABUPATEN / REGENCY JATIM
                  </label>
                  <select 
                    value={regency}
                    onChange={(e) => setRegency(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40] cursor-pointer"
                  >
                    {EAST_JAVA_REGENCIES.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#F0EEE9] p-3 rounded border border-[#1A1A1A]/10">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 font-bold uppercase mb-1">
                    KOORDINAT X (%)
                  </label>
                  <input 
                    type="number" 
                    min={0} 
                    max={100}
                    value={coordinateX}
                    onChange={(e) => setCoordinateX(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded bg-white border border-[#1A1A1A]/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 font-bold uppercase mb-1">
                    KOORDINAT Y (%)
                  </label>
                  <input 
                    type="number" 
                    min={0} 
                    max={100}
                    value={coordinateY}
                    onChange={(e) => setCoordinateY(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded bg-white border border-[#1A1A1A]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                  NASKAH RIWAYAT / CATATAN PENGAMATAN PRIMER
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Deskripsikan pengamatan lapangan secara lengkap dan detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                    GLOSARIUM ISTILAH REGIONAL (PISAHKAN DENGAN KOMA)
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.g., Gagrag, Tembang, Suro"
                    value={localTermsInput}
                    onChange={(e) => setLocalTermsInput(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 mb-1">
                    NILAI SOSIAL / SIGNIFIKANSI BUDAYA
                  </label>
                  <input 
                    type="text" 
                    placeholder="Fungsi perekat harmoni warga, penanda ekologis..."
                    value={culturalSignificance}
                    onChange={(e) => setCulturalSignificance(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-[#1A1A1A]/20 bg-[#FAF9F6] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#E9E6DF] hover:bg-[#DED9CE] rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-[#FAF9F6] rounded-sm text-xs font-mono font-[#FAF9F6] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Simpan Catatan Lapangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- BOTTOM STATUS BAR / EDITORIAL FOOTER ----------------- */}
      <footer className="bg-[#1A1A1A] text-[#FAF9F6]/90 border-t border-[#1A1A1A]/20 py-6 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono tracking-wider uppercase gap-4 mt-auto">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-8 text-center md:text-left">
          <span>Sistem Aktif Jaringan Kerja</span>
          <span className="opacity-60">•</span>
          <span>Daftar Node Transmisi: Surabaya S1, Malang M3, Jember J2, Banyuwangi B5</span>
          <span className="opacity-60">•</span>
          <span>Sandi Dialek Terpasang: Arekan, Osing, Madura, Tengger, Mataraman</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>SINKRONISASI BASIS DATA NASIONAL SELESAI</span>
        </div>
      </footer>

    </div>
  );
}
