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
  { id: "baltic-view", name: "Baltic View Hotel", city: "Gdansk", country: "Poland", price: 429, rating: 4.8, reviews: 312, category: "Seaside", accent: "ocean", description: "A modern hotel five minutes from the beach and the Old Town.", amenities: ["Breakfast", "Spa", "Parking"] },
  { id: "wawel-house", name: "Wawel House", city: "Krakow", country: "Poland", price: 379, rating: 4.7, reviews: 228, category: "City break", accent: "sunset", description: "A boutique hotel in the heart of Kazimierz, close to the main attractions.", amenities: ["Breakfast", "Wi-Fi", "Transfer"] },
  { id: "tatra-lodge", name: "Tatra Lodge & Spa", city: "Zakopane", country: "Poland", price: 519, rating: 4.9, reviews: 407, category: "Mountains", accent: "forest", description: "Tatra views, regional cuisine, and a relaxing wellness area.", amenities: ["Spa", "Pool", "Parking"] },
  { id: "odra-loft", name: "Odra Loft", city: "Wroclaw", country: "Poland", price: 329, rating: 4.6, reviews: 185, category: "Design", accent: "brick", description: "Loft style in Nadodrze and a perfect base for exploring the city.", amenities: ["Wi-Fi", "Gym", "Bar"] },
  { id: "mazury-retreat", name: "Mazury Retreat", city: "Mikolajki", country: "Poland", price: 469, rating: 4.8, reviews: 264, category: "Lakeside", accent: "lake", description: "A peaceful waterfront retreat with a private marina.", amenities: ["Breakfast", "Marina", "Sauna"] },
  { id: "capital-stay", name: "Capital Stay", city: "Warsaw", country: "Poland", price: 399, rating: 4.5, reviews: 521, category: "Business", accent: "city", description: "Comfortable rooms in the city centre, ideal for business travel.", amenities: ["Wi-Fi", "Workspace", "Gym"] },
];
