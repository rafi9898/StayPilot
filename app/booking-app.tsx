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
const money = (value: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value);
const date = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const statusText = { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled" };

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
    return hotels.filter((hotel) => !needle || `${hotel.name} ${hotel.city} ${hotel.category}`.toLocaleLowerCase("en").includes(needle));
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
    if (!response.ok) { setNotice(data.error ?? "Could not create the booking"); return; }
    setNotice(`Done! Booking reference: ${data.booking?.reference}`);
    setBooking({ guestName: "", email: "" });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} data-testid="home-link" aria-label="Home">
          <span className="brand-mark"><BedDouble size={22} /></span><span>Stay<span>Pilot</span></span>
        </button>
        <nav aria-label="Main navigation">
          <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Hotels</button>
          <button className={view === "bookings" ? "active" : ""} onClick={() => setView("bookings")} data-testid="my-bookings-link">My bookings</button>
          <button className="admin-link" onClick={() => setView("admin")} data-testid="admin-link"><LayoutDashboard size={16} /> Admin dashboard</button>
        </nav>
      </header>

      {view === "home" && <>
        <section className="hero">
          <div className="hero-glow one" /><div className="hero-glow two" />
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14} /> Your journey starts here</span>
            <h1>Find a place<br />worth <em>returning to.</em></h1>
            <p>Hand-picked hotels in Poland&apos;s most beautiful destinations. No hidden fees and a simple booking experience.</p>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="sun" /><div className="hill back" /><div className="hill front" /><div className="hotel-shape"><span /><span /><span /><span /><span /><span /></div></div>
          <div className="search-box" data-testid="search-form">
            <label><span><MapPin size={16} /> Where are you going?</span><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City or region" data-testid="destination-input" /></label>
            <label><span><CalendarDays size={16} /> Check-in</span><input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} data-testid="checkin-input" /></label>
            <label><span><CalendarDays size={16} /> Check-out</span><input type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} data-testid="checkout-input" /></label>
            <label><span><Users size={16} /> Guests</span><select value={guests} onChange={(e) => setGuests(Number(e.target.value))} data-testid="guests-select">{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
            <button className="search-button" onClick={runSearch} data-testid="search-button"><Search size={20} /><span>Search</span></button>
          </div>
        </section>

        <section className="benefits" aria-label="Benefits">
          <div><ShieldCheck /><span><b>Secure booking</b><small>Your data is protected</small></span></div>
          <div><Check /><span><b>No hidden fees</b><small>See the full price upfront</small></span></div>
          <div><Clock3 /><span><b>Fast confirmation</b><small>Your status is always available</small></span></div>
        </section>

        <main className="content" id="hotels">
          <div className="section-heading"><div><span className="kicker">Selected for you</span><h2>Popular hotels</h2></div><div className="filter"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter hotels" aria-label="Filter hotels" data-testid="hotel-filter" /></div></div>
          <div className="hotel-grid" data-testid="hotel-list">
            {filtered.map((hotel, index) => <article className="hotel-card" key={hotel.id} data-testid={`hotel-card-${hotel.id}`}>
              <div className={`hotel-image ${hotel.accent}`}><span className="category">{hotel.category}</span><div className="image-building"><i /><i /><i /></div><span className="image-index">0{index + 1}</span></div>
              <div className="hotel-body">
                <div className="hotel-location"><MapPin size={14} /> {hotel.city}, {hotel.country}</div>
                <h3>{hotel.name}</h3><p>{hotel.description}</p>
                <div className="amenities">{hotel.amenities.map((item) => <span key={item}>{item}</span>)}</div>
                <div className="hotel-footer"><div><span className="rating"><Star size={14} fill="currentColor" /> {hotel.rating}</span><small>{hotel.reviews} reviews</small></div><div className="price"><small>from</small><b>{money(hotel.price)}</b><small>/ night</small></div></div>
                <button className="book-button" onClick={() => { setSelected(hotel); setNotice(""); }} data-testid={`book-${hotel.id}`}>Book now <ArrowRight size={17} /></button>
              </div>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="empty" data-testid="no-hotels"><HotelIcon /><h3>No hotels found for “{query}”</h3><p>Try searching for another city.</p></div>}
        </main>
      </>}

      {view === "bookings" && <MyBookings />}
      {view === "admin" && <AdminPanel />}
      <footer><div className="brand"><span className="brand-mark"><BedDouble size={20} /></span><span>Stay<span>Pilot</span></span></div><p>A demo application for learning test automation • React + API + D1</p></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" data-testid="booking-modal">
          <button className="close" onClick={() => setSelected(null)} aria-label="Close"><X /></button>
          <span className="kicker">Complete your booking</span><h2 id="booking-title">{selected.name}</h2>
          <div className="trip-summary"><div><CalendarDays /><span><small>Dates</small><b>{date(checkIn)} – {date(checkOut)}</b></span></div><div><Users /><span><small>Guests</small><b>{guests}</b></span></div></div>
          <form onSubmit={submitBooking}>
            <label>Full name<input required minLength={3} value={booking.guestName} onChange={(e) => setBooking({ ...booking, guestName: e.target.value })} placeholder="Alex Smith" data-testid="guest-name-input" /></label>
            <label>Email address<input required type="email" value={booking.email} onChange={(e) => setBooking({ ...booking, email: e.target.value })} placeholder="alex@example.com" data-testid="email-input" /></label>
            {notice && <div className={notice.startsWith("Done") ? "form-notice success" : "form-notice error"} role="status" data-testid="booking-notice">{notice}</div>}
            <div className="modal-total"><span>Total price</span><b>{money(selected.price * Math.max(1, Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86400000)))}</b></div>
            <button className="primary" disabled={submitting} data-testid="confirm-booking-button">{submitting ? "Booking…" : "Confirm booking"}<ChevronRight size={18} /></button>
          </form>
        </section>
      </div>}
    </div>
  );
}

function MyBookings() {
  const [email, setEmail] = useState(""); const [items, setItems] = useState<Booking[]>([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [searched, setSearched] = useState(false);
  async function search(event: React.FormEvent) { event.preventDefault(); setLoading(true); setError(""); const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`); const data = await response.json() as { bookings?: Booking[]; error?: string }; setLoading(false); setSearched(true); if (!response.ok) setError(data.error ?? "Error"); else setItems(data.bookings ?? []); }
  return <main className="subpage" data-testid="my-bookings-page"><div className="page-intro"><span className="eyebrow"><CircleUserRound size={14} /> Guest area</span><h1>My bookings</h1><p>Enter the email address used for your booking to view its details and current status.</p></div>
    <form className="lookup" onSubmit={search}><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" data-testid="booking-email-search"/><button className="primary" data-testid="find-bookings-button">{loading ? "Searching…" : "Find bookings"}<Search size={17}/></button></form>
    {error && <div className="form-notice error">{error}</div>}
    <div className="booking-list">{items.map((item) => <BookingRow key={item.id} item={item} />)}{searched && !items.length && <div className="empty" data-testid="no-bookings"><CalendarDays/><h3>No bookings found</h3><p>Check the email address and try again.</p></div>}</div>
  </main>;
}

function BookingRow({ item, admin = false, onChange }: { item: Booking; admin?: boolean; onChange?: (id: number, status: Booking["status"]) => void }) {
  return <article className="booking-row" data-testid={`booking-${item.id}`}><div className="booking-icon"><HotelIcon /></div><div className="booking-main"><div><span className="reference">{item.reference}</span><span className={`status ${item.status}`}>{statusText[item.status]}</span></div><h3>{item.hotelName}</h3><p>{date(item.checkIn)} – {date(item.checkOut)} • {item.guests} guests • {item.nights} nights</p>{admin && <small>{item.guestName} • {item.email}</small>}</div><div className="booking-price"><b>{money(item.totalPrice)}</b>{admin && <select value={item.status} onChange={(e) => onChange?.(item.id, e.target.value as Booking["status"])} aria-label={`Status ${item.reference}`} data-testid={`status-${item.id}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select>}</div></article>;
}

function AdminPanel() {
  const [password, setPassword] = useState(""); const [authenticated, setAuthenticated] = useState(false); const [items, setItems] = useState<Booking[]>([]); const [error, setError] = useState(""); const [filter, setFilter] = useState("all");
  async function load(pass = password) { const response = await fetch("/api/bookings", { headers: { "x-admin-password": pass } }); const data = await response.json() as { bookings?: Booking[]; error?: string }; if (!response.ok) { setError("Incorrect administrator password"); setAuthenticated(false); return; } setItems(data.bookings ?? []); setError(""); setAuthenticated(true); }
  async function change(id: number, status: Booking["status"]) { const response = await fetch("/api/bookings", { method: "PATCH", headers: { "content-type": "application/json", "x-admin-password": password }, body: JSON.stringify({ id, status }) }); if (response.ok) setItems(items.map((item) => item.id === id ? { ...item, status } : item)); }
  async function reset() { if (!confirm("Delete all test bookings?")) return; const response = await fetch("/api/bookings", { method: "DELETE", headers: { "x-admin-password": password } }); if (response.ok) setItems([]); }
  if (!authenticated) return <main className="admin-login" data-testid="admin-login"><div className="login-card"><span className="login-icon"><ShieldCheck /></span><span className="kicker">Administrator dashboard</span><h1>Sign in</h1><p>Manage bookings and stay statuses.</p><form onSubmit={(e) => { e.preventDefault(); load(); }}><label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" data-testid="admin-password" /></label>{error && <div className="form-notice error" data-testid="admin-error">{error}</div>}<button className="primary" data-testid="admin-login-button">Open dashboard <ArrowRight size={17}/></button></form><small className="demo-hint">Demo credentials: <code>admin123</code></small></div></main>;
  const shown = filter === "all" ? items : items.filter((item) => item.status === filter);
  const revenue = items.filter((item) => item.status !== "cancelled").reduce((sum, item) => sum + item.totalPrice, 0);
  return <main className="admin-page" data-testid="admin-dashboard"><div className="admin-heading"><div><span className="kicker">Property management</span><h1>Administrator dashboard</h1></div><button className="danger-outline" onClick={reset} data-testid="reset-data-button">Reset test data</button></div>
    <div className="stats"><div><span>All</span><b>{items.length}</b><small>bookings</small></div><div><span>Pending</span><b>{items.filter(i => i.status === "pending").length}</b><small>to review</small></div><div><span>Confirmed</span><b>{items.filter(i => i.status === "confirmed").length}</b><small>bookings</small></div><div><span>Value</span><b>{money(revenue)}</b><small>active stays</small></div></div>
    <div className="admin-toolbar"><h2>Bookings</h2><select value={filter} onChange={(e) => setFilter(e.target.value)} data-testid="admin-status-filter"><option value="all">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></div>
    <div className="booking-list">{shown.map((item) => <BookingRow key={item.id} item={item} admin onChange={change} />)}{!shown.length && <div className="empty"><CalendarDays/><h3>No bookings</h3><p>New bookings will appear here.</p></div>}</div>
  </main>;
}
