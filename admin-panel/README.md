# MechRelief Admin Panel (frontend, static data)

React + Vite web panel for the admin. All data is sample data kept in memory (refresh resets it).
The backend (Spring Boot + MySQL + JWT) will replace `src/data.js` and the functions in `src/store.jsx`.

## Run (Windows / any OS)
```
cd admin-panel
npm install
npm run dev
```
Open the address shown in the terminal (usually http://localhost:5173).

Demo login: `admin@mechrelief.pk` / `admin123`

Forgot password: Login -> "Forgot password?" -> enter the admin email -> 6-digit code (demo code `123456`, no email is sent yet) -> new password -> back to login.

## Pages
- Dashboard: today's numbers and live requests
- Bookings: list with search and filters, booking detail, cancel
- Workers: add worker (admin-created accounts), deactivate / activate
- Customers: read-only details and trusted contact
- Services & Pricing: enable/disable each of the 12 services, edit service charge, distance rate and option prices
- Alerts: SOS alerts and cash disputes, resolve with one click
- Settings: advance %, emergency charge, distance rates, admin password

## Backend integration notes
- Login: `POST /auth/admin/login` -> JWT with role ADMIN (see `src/pages/Login.jsx`)
- Every `patch*` / `add*` / `save*` in `src/store.jsx` becomes a REST call
- Pricing edited in Services & Pricing is stored in `service_category.booking_config` and read by the customer app
