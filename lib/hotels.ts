export type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  accent: string;
  description: string;
  amenities: string[];
};

export const hotels: Hotel[] = [
  { id: "baltic-view", name: "Baltic View Hotel", city: "Gdańsk", country: "Polska", price: 429, rating: 4.8, reviews: 312, category: "Nad morzem", accent: "ocean", description: "Nowoczesny hotel pięć minut od plaży i starego miasta.", amenities: ["Śniadanie", "SPA", "Parking"] },
  { id: "wawel-house", name: "Wawel House", city: "Kraków", country: "Polska", price: 379, rating: 4.7, reviews: 228, category: "City break", accent: "sunset", description: "Kameralny hotel w sercu Kazimierza, blisko najważniejszych atrakcji.", amenities: ["Śniadanie", "Wi‑Fi", "Transfer"] },
  { id: "tatra-lodge", name: "Tatra Lodge & Spa", city: "Zakopane", country: "Polska", price: 519, rating: 4.9, reviews: 407, category: "W górach", accent: "forest", description: "Widok na Tatry, regionalna kuchnia i strefa wellness.", amenities: ["SPA", "Basen", "Parking"] },
  { id: "odra-loft", name: "Odra Loft", city: "Wrocław", country: "Polska", price: 329, rating: 4.6, reviews: 185, category: "Design", accent: "brick", description: "Loftowy klimat na Nadodrzu i doskonała baza do zwiedzania miasta.", amenities: ["Wi‑Fi", "Siłownia", "Bar"] },
  { id: "mazury-retreat", name: "Mazury Retreat", city: "Mikołajki", country: "Polska", price: 469, rating: 4.8, reviews: 264, category: "Nad jeziorem", accent: "lake", description: "Spokojny wypoczynek nad wodą z prywatną mariną.", amenities: ["Śniadanie", "Marina", "Sauna"] },
  { id: "capital-stay", name: "Capital Stay", city: "Warszawa", country: "Polska", price: 399, rating: 4.5, reviews: 521, category: "Biznes", accent: "city", description: "Komfortowe pokoje w centrum, idealne na podróż służbową.", amenities: ["Wi‑Fi", "Biuro", "Siłownia"] },
];
