import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { bookings } from "../../../db/schema";
import { hotels } from "../../../lib/hotels";

const validStatuses = new Set(["pending", "confirmed", "cancelled"]);
const adminPassword = "admin123";

function message(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase();
    const admin = request.headers.get("x-admin-password") === adminPassword;
    if (!email && !admin) return Response.json({ error: "Provide an email address or administrator credentials" }, { status: 401 });
    const db = getDb();
    const rows = email
      ? await db.select().from(bookings).where(eq(bookings.email, email)).orderBy(desc(bookings.id))
      : await db.select().from(bookings).orderBy(desc(bookings.id));
    return Response.json({ bookings: rows });
  } catch (error) {
    return Response.json({ error: message(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const hotel = hotels.find((item) => item.id === body.hotelId);
    const guestName = String(body.guestName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const checkIn = String(body.checkIn ?? "");
    const checkOut = String(body.checkOut ?? "");
    const guests = Number(body.guests);
    const start = Date.parse(`${checkIn}T12:00:00Z`);
    const end = Date.parse(`${checkOut}T12:00:00Z`);
    const nights = Math.round((end - start) / 86400000);
    if (!hotel) return Response.json({ error: "Hotel not found" }, { status: 400 });
    if (guestName.length < 3) return Response.json({ error: "Guest name must contain at least 3 characters" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Provide a valid email address" }, { status: 400 });
    if (!Number.isFinite(start) || !Number.isFinite(end) || nights < 1) return Response.json({ error: "Check-out must be later than check-in" }, { status: 400 });
    if (!Number.isInteger(guests) || guests < 1 || guests > 6) return Response.json({ error: "The number of guests must be between 1 and 6" }, { status: 400 });
    const reference = `SP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const [booking] = await getDb().insert(bookings).values({
      reference, hotelId: hotel.id, hotelName: hotel.name, guestName, email,
      checkIn, checkOut, guests, nights, totalPrice: hotel.price * nights, status: "pending",
    }).returning();
    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    return Response.json({ error: message(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (request.headers.get("x-admin-password") !== adminPassword) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json() as { id?: number; status?: string };
    if (!body.id || !body.status || !validStatuses.has(body.status)) return Response.json({ error: "Invalid data" }, { status: 400 });
    const [booking] = await getDb().update(bookings).set({ status: body.status }).where(eq(bookings.id, body.id)).returning();
    if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 });
    return Response.json({ booking });
  } catch (error) {
    return Response.json({ error: message(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (request.headers.get("x-admin-password") !== adminPassword) return Response.json({ error: "Unauthorized" }, { status: 401 });
    await getDb().delete(bookings);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: message(error) }, { status: 500 });
  }
}
