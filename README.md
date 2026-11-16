# StayPilot

Demonstracyjna aplikacja do rezerwacji hoteli przygotowana na potrzeby kursu **AI for QA**. Projekt służy do nauki automatyzacji testów z użyciem Codexa i Playwrighta.

## Stack

- React 19 + TypeScript
- Vinext / Vite
- API routes
- Cloudflare D1 + Drizzle ORM
- Cloudflare Workers

## Funkcje

- wyszukiwanie i filtrowanie hoteli,
- formularz rezerwacji z walidacją po stronie API,
- wyszukiwanie rezerwacji po adresie e-mail,
- panel administratora,
- zmiana statusu rezerwacji,
- reset danych testowych,
- stabilne selektory `data-testid` przygotowane pod Playwright.

## Uruchomienie

Wymagany jest Node.js `>=22.13.0`.

```bash
npm ci
npm run db:generate
npm run build
```

Migrację lokalnej bazy D1 można zastosować poleceniem:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_woozy_leader.sql
```

Następnie uruchom aplikację:

```bash
npm start
```

## Panel administratora

- hasło demonstracyjne: `admin123`
- endpoint API: `/api/bookings`

Hasło jest celowo jawne, ponieważ projekt jest środowiskiem szkoleniowym, a nie aplikacją produkcyjną.

## Przykładowe scenariusze Playwright

1. Wyszukanie hotelu po mieście.
2. Utworzenie poprawnej rezerwacji.
3. Walidacja błędnego adresu e-mail lub dat.
4. Odczyt rezerwacji po adresie e-mail.
5. Logowanie do panelu administratora.
6. Zmiana statusu rezerwacji.
7. Filtrowanie rezerwacji według statusu.
8. Reset danych testowych.
