# Pamalo Hostel Booking System — Agent Guide

## Overview

Pure front-end (HTML/CSS/JS) hostel booking app. All data lives in `localStorage` under key `pamalo_data`. No build step, no server, no package manager.

## Run the app

- Open any `.html` file in a browser directly, or use **VS Code Live Server** (configured on port 5502 in `.vscode/settings.json`).
- No `npm install`, no build command.

## Project structure

| Path | Purpose |
|---|---|
| `index.html` | Public landing page with hero slider |
| `Login.html`, `Signup.html`, `reset-password.html` | Auth pages |
| `dashboard.html`, `my-bookings.html`, `booking-details.html`, `notifications.html`, `edit-profile.html` | Guest dashboard pages (share admin-style sidebar layout, body flex) |
| `hostels.html` | Public room search & browse |
| `admin.html` | Admin panel (same sidebar layout as dashboard) |
| `contact.html`, `about.html`, `services.html` | Static info pages |
| `payment.html` | Payment page |
| `assets/js/data.js` | **Single data layer** — `AppData` object with all CRUD, auth, persistence |
| `assets/js/script.js` | Hero slider only |
| `assets/style/css.css` | All styles (public, login, dashboard, admin) |

## Critical facts

- **No `dashboard.js` or `dashboard.css`.** References to these files have been removed from all HTML pages. Only `data.js` and `script.js` are used.
- **No framework** — vanilla JS using `var`, function expressions, no modules.
- **Script load order matters:** `data.js` must always load before any JS that uses `AppData`.
- **Auth:** Sessions stored in `localStorage` key `pamalo_session`. `AppData.getSession()` reads it. `AppData.requireRole(['admin','staff','guest'])` redirects on failure.
- **Passwords:** stored as `btoa()` (base64), not hashed.
- **Seed data** includes default accounts (see `data.js:22-28`):
  - `admin@pamalo.com` / `Admin123!` (role: admin)
  - `staff@pamalo.com` / `Staff123!` (role: staff)
  - `john@email.com` / `Guest123!` (role: guest)
- **Admin panel** (`admin.html`) uses the same stylesheet (`css.css`) as the dashboard. It contains hardcoded example data and does NOT use `data.js` or `AppData`.
- **Currency:** MK (Malawian Kwacha). Use the global `mk()` helper (e.g., `mk(35000)` → `MK 35,000`).
- **ID pattern:** Prefix + `String(Date.now()).slice(-4)` (e.g., `'USR-' + String(Date.now()).slice(-4)`).
- **Utility functions** in `data.js` (global scope): `today()`, `formatDate()`, `formatDateTime()`, `timeAgo()`, `badge()`, `mk()`.
- **Clearing localStorage** (`pamalo_data`) resets all data to defaults — the app re-seeds from `AppData.defaults()` on next load.

## Conventions

- Dashboard pages use the same sidebar layout as `admin.html` (khaki sidebar + `.main-content` flex layout).
- Dashboard and admin page share the same sidebar layout styles in `css.css`.
- Minimal inline CSS in dashboard pages — most styles are class-based in `css.css`.
- HTML pages use `../` path prefix for assets in some places, `assets/` in others — both relative to page location work.
- The admin page (`admin.html`) loads `assets/style/css.css` like all other pages.
