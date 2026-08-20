# DrainTwin AI

**Predict. Prioritize. Prevent.**

An AI-assisted digital twin platform for urban stormwater drainage networks — a hackathon / SIH internal
evaluation prototype. It turns drainage topology, silt/capacity data, historical flooding, and rainfall
forecasts into a prioritized municipal action list, and closes the loop with a field-worker app that
updates the digital twin when work is done.

> **Prototype Mode**: There is no backend and no real authentication. All data is realistic mock data
> generated for demonstration. Every simulated/estimated figure in the UI is labeled
> `SIMULATED PROTOTYPE DATA` or similar — nothing here is real Pune government data.

---

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview   # optional local check of the production build
```

> **Note on this build**: this project was authored in a sandboxed environment without npm registry
> access, so `npm install` / `npm run build` could not be executed here to verify a clean compile.
> The code has been manually reviewed for import/export correctness and structural (bracket/JSX)
> balance, but please run `npm install && npm run build` as your first step and fix any straggling
> TypeScript nits (there shouldn't be many, if any).

---

## Deploying to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo (or drag-and-drop the folder into Vercel).
2. In Vercel: **New Project → Import** your repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output directory `dist`
   (Vercel detects these automatically for a Vite app — no changes needed).
4. No environment variables are required for this prototype.
5. Deploy. The app is a pure static SPA — no server/backend needed.

Because this is a client-side single-page app using React Router, if you add a custom `vercel.json`
later for other purposes, make sure it includes a rewrite so deep links (e.g. `/worker/task/D-104`)
resolve correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

(Vercel's Vite preset typically handles SPA fallback automatically, but this is the fix if you ever see
404s on a hard refresh of a nested route.)

---

## Demo script (2–3 minutes)

1. Open the app → select **Municipal Administrator**.
2. Overview shows "Heavy Rainfall Expected" and city-wide KPIs.
3. Go to **Risk Analysis** → point out **D-104** is CRITICAL (risk 87, 52% silt, 6 historical floods).
4. Click **D-104** on the Overview or Drainage Network map → open its detail panel → **Create Work Order**
   (assigns it to worker Rajesh Kumar).
5. Click **Switch to Worker View** (bottom of the admin sidebar).
6. As Rajesh: open the new critical task → **Start Task** → fill the inspection form (e.g. "Heavy Silt") →
   **Submit Inspection** → fill the completion form → **Complete Task**.
7. **Switch to Admin View** → D-104 now shows **Completed**, risk score updated from **87 → 49**.
8. Open **Digital Twin** → show the same Before/After risk comparison and the rainfall→outfall flow model.

This demonstrates the full loop: **Predict → Prioritize → Act → Verify.**

---

## Where the mock data lives

| File | Contents |
|---|---|
| `src/data/drains.ts` | 10 synthetic drain segments (geometry, capacity, silt, risk score, ward, etc.) around a Pune-like layout, plus derived junctions/hotspots/risk distribution |
| `src/data/sensors.ts` | 52 generated sensor records (type, status, battery, water level) |
| `src/data/rainfall.ts` | 24-hour rainfall forecast curves for NORMAL / HEAVY / EXTREME scenarios |
| `src/data/workers.ts` | Field worker roster and seed notifications |
| `src/services/riskService.ts` | Prototype 0–100 risk classification model (documented as unvalidated) |
| `src/services/simulationService.ts` | Mock scenario runner and digital-twin "before/after" simulation |
| `src/context/AppStore.ts` | Zustand store — **this is the shared state** connecting the Admin and Worker apps (work order creation, inspection, completion, notifications) |

No file claims to be real municipal, IMD, or GIS data — everything is clearly synthetic and labeled as such
in the UI per the product's transparency requirements.

---

## Architecture: what a production backend would look like

The frontend is intentionally structured so a real backend can be dropped in later without a rewrite:

```
Data Sources        OpenStreetMap, QGIS/GeoJSON, Municipal GIS, Rainfall, Historical
                     flooding, Desilting records, Sensors
        ↓
Data Layer           PostgreSQL + PostGIS
        ↓
Digital Twin         NetworkX, SWMM / PySWMM  (hydraulic simulation engine)
        ↓
AI / Analytics       Python, Pandas, NumPy, Scikit-learn
        ↓
Risk Engine          Waterlogging Risk Score (0–100)
        ↓
Frontend             This app — React, Leaflet, Recharts  (unchanged)
        ↓
Users                Municipal Administrator, Municipal Worker
```

This diagram is also rendered in-app under **Admin → Settings**.

### Concretely, where to plug things in

- **`src/services/riskService.ts` / `simulationService.ts`** — replace the mock functions with `fetch`
  calls to a FastAPI backend that runs the real risk model / PySWMM simulation. Function signatures are
  already designed to be swapped 1:1 (same input/output shapes).
- **`src/data/*.ts`** — replace static arrays with API calls (e.g. React Query) hitting endpoints backed
  by PostgreSQL/PostGIS. Types in `src/types/index.ts` already mirror the expected API response shapes.
- **`src/context/AppStore.ts`** — swap in-memory Zustand mutations for API mutations (`createWorkOrder`,
  `submitInspection`, `completeWork` become POST/PATCH calls); keep the store as the client-side cache.
- **Rainfall** — swap `src/data/rainfall.ts` for a live **Open-Meteo** or **IMD Open Data** fetch.
- **Sensors** — `src/data/sensors.ts` becomes a live feed once physical IoT sensors are deployed (see the
  phased rollout shown on the Admin → Sensors page: Prototype → Pilot → Production).
- **Auth** — the role-selection landing page has no real authentication; add real login (e.g. against a
  municipal SSO/AD) before production use.

---

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Leaflet + React Leaflet (OpenStreetMap tiles,
no API key required) · Recharts · Lucide React icons · Zustand (shared Admin↔Worker state)

## Project structure

```
src/
  components/
    layout/     AdminLayout, WorkerLayout, NotificationDropdown
    maps/       DrainMap (Leaflet), DrainDetailsPanel
    risk/       RiskBadge
    sensors/    SensorCard
    tasks/      TaskCard
    ui/         Button, Panel, StatCard, SimBadge
  pages/
    Landing.tsx
    admin/      Dashboard, Network, RiskAnalysis, DigitalTwin, Interventions,
                Sensors, Rainfall, Reports, Settings
    worker/     Dashboard, Map, Tasks, TaskDetails, Reports, Profile
  data/         drains.ts, sensors.ts, rainfall.ts, workers.ts
  services/     riskService.ts, simulationService.ts
  context/      AppStore.ts  (shared Admin ↔ Worker state)
  types/        index.ts
```

## What's intentionally simplified for the hackathon build

- No backend, no database, no real auth — by design, per the prototype scope.
- Cost figures, population exposure, and sensor readings are illustrative estimates, clearly badged as
  simulated/prototype data throughout the UI.
- The risk-scoring formula is a transparent, documented placeholder, not a calibrated hydraulic model.

## Vercel deployment

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- The included `vercel.json` provides the SPA rewrite needed for React Router routes.
