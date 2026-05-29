/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum EthnographyCategory {
  RITUAL_BELIEF = "Ritual & Kepercayaan",
  LANGUAGE_DIALECT = "Bahasa & Dialek (Sastra Lisan)",
  PERFORMING_ARTS = "Seni Pertunjukan",
  ORAL_TRADITION = "Tradisi Lisan & Cerita Rakyat",
  MATERIAL_CULTURE = "Kriya, Arsitektur & Budaya Kebendaan",
  SOCIAL_SYSTEM = "Sistem Sosial & Pengetahuan Lokal",
}

export interface GeminiAnalysis {
  tags: string[];
  summary: string;
  historicalContext: string;
  comparativeStudies: string; // comparative culture notes inside or outside East Java
  recommendedRegencies: string[]; // related regencies with similar traits
  conservationStatus: "Lestari" | "Rentan" | "Terancam Punah";
  conservationAdvice: string;
}

export interface EthnographicRecord {
  id: string;
  title: string;
  category: EthnographyCategory;
  regency: string; // Kabupaten/Kota di Jatim
  description: string;
  researcherName: string;
  dateReported: string;
  latitude: number; // Relative X on custom SVG (0 to 100) or geographic representation
  longitude: number; // Relative Y on custom SVG (0 to 100) or geographic representation
  localTerms?: string[]; // Glosarium kata lokal (Osing, Madura, Tengger, Jawa Jaturan, dsb)
  culturalSignificance?: string;
  geminiAnalysis?: GeminiAnalysis;
  isVerified: boolean;
  imageGenerated?: string; // Store optional visualization
}

export interface RegencyInfo {
  id: string;
  name: string;
  capital: string;
  coordinates: { x: number; y: number }; // For SVG map pinning
  dominantEthnicGroup: string; // Osing, Madura, Jawa (Arekan, Mataraman, Tenggerese)
  description: string;
  famousTraditions: string[];
}
