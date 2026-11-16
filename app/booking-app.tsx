"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BedDouble, CalendarDays, Check, ChevronRight, CircleUserRound, Clock3, Hotel as HotelIcon, LayoutDashboard, MapPin, Search, ShieldCheck, Sparkles, Star, Users, X } from "lucide-react";
import { hotels, type Hotel } from "../lib/hotels";

type Booking = {
  id: number; reference: string; hotelName: string; guestName: string; email: string;
  checkIn: string; checkOut: string; guests: number; nights: number; totalPrice: number;
  status: "pending" | "confirmed" | "cancelled"; createdAt: string;
};
type View = "home" | "bookings" | "admin";

const today = new Date().toISOString().slice(0, 10);
const inDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const money = (value: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value);
const date = (value: string) => new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const statusText = { pending: "Oczekująca", confirmed: "Potwierdzona", cancelled: "Anulowana" };

export default function BookingApp() {
  const [view, setView] = useState<View>("home");
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState(inDays(7));
  const [checkOut, setCheckOut] = useState(inDays(9));
  const [guests, setGuests] = useState(2);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Hotel | null>(null);
  const [notice, setNotice] = useState("");
  const [booking, setBooking] = useState({ guestName: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pl");
    return hotels.filter((hotel) => !needle || `${hotel.name} ${hotel.city} ${hotel.category}`.toLocaleLowerCase("pl").includes(needle));
  }, [query]);

  function runSearch() {
    setQuery(city);
    document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitBooking(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setSubmitting(true); setNotice("");
    const response = await fetch("/api/bookings", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ hotelId: selected.id, ...booking, checkIn, checkOut, guests }),
    });
    const data = await response.json() as { booking?: Booking; error?: string };
    setSubmitting(false);
    if (!response.ok) { setNotice(data.error ?? "Nie udało się utworzyć rezerwacji"); return; }
    setNotice(`Gotowe! Numer rezerwacji: ${data.booking?.reference}`);
    setBooking({ guestName: "", email: "" });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} data-testid="home-link" aria-label="Strona główna">
          <span className="brand-mark"><BedDouble size={22} /></span><span>Stay<span>Pilot</span></span>
        </button>
        <nav aria-label="Główna nawigacja">
          <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Hotele</button>
          <button className={view === "bookings" ? "active" : ""} onClick={() => setView("bookings")} data-testid="my-bookings-link">Moje rezerwacje</button>
          <button className="admin-link" onClick={() => setView("admin")} data-testid="admin-link"><LayoutDashboard size={16} /> Panel admina</button>
        </nav>
      </header>

      {view === "home" && <>
        <section className="hero">
          <div className="hero-glow one" /><div className="hero-glow two" />
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14} /> Podróż zaczyna się tutaj</span>
            <h1>Znajdź miejsce,<br />do którego <em>wrócisz.</em></h1>
            <p>Wyselekcjonowane hotele w najpiękniejszych miejscach w Polsce. Bez ukrytych opłat i z prostą rezerwacją.</p>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="sun" /><div className="hill back" /><div className="hill front" /><div className="hotel-shape"><span /><span /><span /><span /><span /><span /></div></div>
          <div className="search-box" data-testid="search-form">
            <label><span><MapPin size={16} /> Dokąd jedziesz?</span><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Miasto lub region" data-testid="destination-input" /></label>
            <label><span><CalendarDays size={16} /> Przyjazd</span><input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} data-testid="checkin-input" /></label>
            <label><span><CalendarDays size={16} /> Wyjazd</span><input type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} data-testid="checkout-input" /></label>
            <label><span><Users size={16} /> Goście</span><select value={guests} onChange={(e) => setGuests(Number(e.target.value))} data-testid="guests-select">{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "osoba" : "osoby"}</option>)}</select></label>
            <button className="search-button" onClick={runSearch} data-testid="search-button"><Search size={20} /><span>Szukaj</span></button>
          </div>
        </section>

        <section className="benefits" aria-label="Korzyści">
          <div><ShieldCheck /><span><b>Bezpieczna rezerwacja</b><small>Twoje dane są chronione</small></span></div>
          <div><Check /><span><b>Bez ukrytych opłat</b><small>Widzisz pełną cenę</small></span></div>
          <div><Clock3 /><span><b>Szybkie potwierdzenie</b><small>Status zawsze pod ręką</small></span></div>
        </section>

        <main className="content" id="hotels">
          <div className="section-heading"><div><span className="kicker">Wybrane dla Ciebie</span><h2>Popularne hotele</h2></div><div className="filter"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtruj hotele" aria-label="Filtruj hotele" data-testid="hotel-filter" /></div></div>
          <div className="hotel-grid" data-testid="hotel-list">
            {filtered.map((hotel, index) => <article className="hotel-card" key={hotel.id} data-testid={`hotel-card-${hotel.id}`}>
              <div className={`hotel-image ${hotel.accent}`}><span className="category">{hotel.category}</span><div className="image-building"><i /><i /><i /></div><span className="image-index">0{index + 1}</span></div>
              <div className="hotel-body">
                <div className="hotel-location"><MapPin size={14} /> {hotel.city}, {hotel.country}</div>
                <h3>{hotel.name}</h3><p>{hotel.description}</p>
                <div className="amenities">{hotel.amenities.map((item) => <span key={item}>{item}</span>)}</div>
                <div className="hotel-footer"><div><span className="rating"><Star size={14} fill="currentColor" /> {hotel.rating}</span><small>{hotel.reviews} opinii</small></div><div className="price"><small>od</small><b>{money(hotel.price)}</b><small>/ noc</small></div></div>
                <button className="book-button" onClick={() => { setSelected(hotel); setNotice(""); }} data-testid={`book-${hotel.id}`}>Zarezerwuj <ArrowRight size={17} /></button>
              </div>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="empty" data-testid="no-hotels"><HotelIcon /><h3>Brak hoteli dla „{query}”</h3><p>Spróbuj wyszukać inne miasto.</p></div>}
        </main>
      </>}

      {view === "bookings" && <MyBookings />}
      {view === "admin" && <AdminPanel />}
      <footer><div className="brand"><span className="brand-mark"><BedDouble size={20} /></span><span>Stay<span>Pilot</span></span></div><p>Aplikacja demonstracyjna do nauki automatyzacji testów • React + API + D1</p></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" data-testid="booking-modal">
          <button className="close" onClick={() => setSelected(null)} aria-label="Zamknij"><X /></button>
          <span className="kicker">Finalizacja rezerwacji</span><h2 id="booking-title">{selected.name}</h2>
          <div className="trip-summary"><div><CalendarDays /><span><small>Termin</small><b>{date(checkIn)} – {date(checkOut)}</b></span></div><div><Users /><span><small>Goście</small><b>{guests}</b></span></div></div>
          <form onSubmit={submitBooking}>
            <label>Imię i nazwisko<input required minLength={3} value={booking.guestName} onChange={(e) => setBooking({ ...booking, guestName: e.target.value })} placeholder="Jan Kowalski" data-testid="guest-name-input" /></label>
            <label>Adres e-mail<input required type="email" value={booking.email} onChange={(e) => setBooking({ ...booking, email: e.target.value })} placeholder="jan@example.com" data-testid="email-input" /></label>
            {notice && <div className={notice.startsWith("Gotowe") ? "form-notice success" : "form-notice error"} role="status" data-testid="booking-notice">{notice}</div>}
            <div className="modal-total"><span>Cena za pobyt</span><b>{money(selected.price * Math.max(1, Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000)))}</b></div>
            <button className="primary" disabled={submitting} data-testid="confirm-booking-button">{submitting ? "Rezerwuję…" : "Potwierdź rezerwację"}<ChevronRight size={18} /></button>
          </form>
        </section>
      </div>}
    </div>
  );
}

function MyBookings() {
  const [email, setEmail] = useState(""); const [items, setItems] = useState<Booking[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [searched, setSearched] = useState(false);
  async function search(event: React.FormEvent) { event.preventDefault(); setLoading(true); setError(""); const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`); const data = await response.json() as { bookings?: Booking[]; error?: string }; setLoading(false); setSearched(true); if (!response.ok) setError(data.error ?? "Błąd"); else setItems(data.bookings ?? []); }
  return <main className="subpage" data-testid="my-bookings-page"><div className="page-intro"><span className="eyebrow"><CircleUserRound size={14} /> Strefa gościa</span><h1>Moje rezerwacje</h1><p>Podaj e-mail użyty podczas rezerwacji, aby sprawdzić szczegóły i aktualny status.</p></div>
    <form className="lookup" onSubmit={search}><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="twoj@email.pl" data-testid="booking-email-search"/><button className="primary" data-testid="find-bookings-button">{loading ? "Szukam…" : "Znajdź rezerwacje"}<Search size={17}/></button></form>
    {error && <div className="form-notice error">{error}</div>}
    <div className="booking-list">{items.map((item) => <BookingRow key={item.id} item={item} />)}{searched && !items.length && <div className="empty" data-testid="no-bookings"><CalendarDays/><h3>Nie znaleźliśmy rezerwacji</h3><p>Sprawdź adres e-mail i spróbuj ponownie.</p></div>}</div>
  </main>;
}

function BookingRow({ item, admin = false, onChange }: { item: Booking; admin?: boolean; onChange?: (id: number, status: Booking["status"]) => void }) {
  return <article className="booking-row" data-testid={`booking-${item.id}`}><div className="booking-icon"><HotelIcon /></div><div className="booking-main"><div><span className="reference">{item.reference}</span><span className={`status ${item.status}`}>{statusText[item.status]}</span></div><h3>{item.hotelName}</h3><p>{date(item.checkIn)} – {date(item.checkOut)} • {item.guests} os. • {item.nights} noce</p>{admin && <small>{item.guestName} • {item.email}</small>}</div><div className="booking-price"><b>{money(item.totalPrice)}</b>{admin && <select value={item.status} onChange={(e) => onChange?.(item.id, e.target.value as Booking["status"])} aria-label={`Status ${item.reference}`} data-testid={`status-${item.id}`}><option value="pending">Oczekująca</option><option value="confirmed">Potwierdzona</option><option value="cancelled">Anulowana</option></select>}</div></article>;
}

function AdminPanel() {
  const [password, setPassword] = useState(""); const [authenticated, setAuthenticated] = useState(false); const [items, setItems] = useState<Booking[]>([]); const [error, setError] = useState(""); const [filter, setFilter] = useState("all");
  async function load(pass = password) { const response = await fetch("/api/bookings", { headers: { "x-admin-password": pass } }); const data = await response.json() as { bookings?: Booking[]; error?: string }; if (!response.ok) { setError("Niepoprawne hasło administratora"); setAuthenticated(false); return; } setItems(data.bookings ?? []); setError(""); setAuthenticated(true); }
  async function change(id: number, status: Booking["status"]) { const response = await fetch("/api/bookings", { method: "PATCH", headers: { "content-type": "application/json", "x-admin-password": password }, body: JSON.stringify({ id, status }) }); if (response.ok) setItems(items.map((item) => item.id === id ? { ...item, status } : item)); }
  async function reset() { if (!confirm("Usunąć wszystkie rezerwacje testowe?")) return; const response = await fetch("/api/bookings", { method: "DELETE", headers: { "x-admin-password": password } }); if (response.ok) setItems([]); }
  if (!authenticated) return <main className="admin-login" data-testid="admin-login"><div className="login-card"><span className="login-icon"><ShieldCheck /></span><span className="kicker">Panel administratora</span><h1>Zaloguj się</h1><p>Zarządzaj rezerwacjami i statusami pobytów.</p><form onSubmit={(e) => { e.preventDefault(); load(); }}><label>Hasło<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" data-testid="admin-password" /></label>{error && <div className="form-notice error" data-testid="admin-error">{error}</div>}<button className="primary" data-testid="admin-login-button">Wejdź do panelu <ArrowRight size={17}/></button></form><small className="demo-hint">Dane demo: <code>admin123</code></small></div></main>;
  const shown = filter === "all" ? items : items.filter((item) => item.status === filter);
  const revenue = items.filter((item) => item.status !== "cancelled").reduce((sum, item) => sum + item.totalPrice, 0);
  return <main className="admin-page" data-testid="admin-dashboard"><div className="admin-heading"><div><span className="kicker">Zarządzanie obiektem</span><h1>Panel administratora</h1></div><button className="danger-outline" onClick={reset} data-testid="reset-data-button">Wyczyść dane testowe</button></div>
    <div className="stats"><div><span>Wszystkie</span><b>{items.length}</b><small>rezerwacje</small></div><div><span>Oczekujące</span><b>{items.filter(i => i.status === "pending").length}</b><small>do obsłużenia</small></div><div><span>Potwierdzone</span><b>{items.filter(i => i.status === "confirmed").length}</b><small>rezerwacje</small></div><div><span>Wartość</span><b>{money(revenue)}</b><small>aktywnych pobytów</small></div></div>
    <div className="admin-toolbar"><h2>Rezerwacje</h2><select value={filter} onChange={(e) => setFilter(e.target.value)} data-testid="admin-status-filter"><option value="all">Wszystkie statusy</option><option value="pending">Oczekujące</option><option value="confirmed">Potwierdzone</option><option value="cancelled">Anulowane</option></select></div>
    <div className="booking-list">{shown.map((item) => <BookingRow key={item.id} item={item} admin onChange={change} />)}{!shown.length && <div className="empty"><CalendarDays/><h3>Brak rezerwacji</h3><p>Nowe rezerwacje pojawią się tutaj.</p></div>}</div>
  </main>;
}
