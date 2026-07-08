# Understory frontend

A Vite + React project, split into folders instead of one file:

```
understory-frontend/
  index.html
  vite.config.js
  package.json
  .env.example
  src/
    main.jsx              # React entry point
    App.jsx                # top-level state (auth, cart, likes, profile) + page layout
    api/
      client.js            # every fetch() call to the backend lives here
    constants/
      colors.js            # design tokens
      config.js             # admin passcode display text
      products.js            # product catalog, category metadata, tag labels
    utils/
      productUtils.js         # scoring/recommendation math, image URLs
    components/
      GlobalStyle.jsx           # fonts + CSS animations
      AuthScreen.jsx              # login / signup / guest screen
      Header.jsx                   # sticky top nav
      TasteProfilePanel.jsx         # hero + "your taste so far" chips
      RecommendationsSection.jsx      # personalized horizontal row
      CatalogSection.jsx               # full grid + category filter
      ProductCard.jsx                   # shared card used by both sections above
      CartDrawer.jsx                     # slide-out cart
      AdminPanel.jsx                      # passcode-gated shopper list
```

## Linking the frontend to the backend

1. **Start the MySQL-backed API** (from the `understory-backend` project):
   ```bash
   cd understory-backend
   mvn spring-boot:run
   ```
   Confirm it's up: `curl http://localhost:8080/api/admin/users -H "X-Admin-Passcode: understory-admin"`
   should return `[]` (or your existing users) rather than a connection error.

2. **Point the frontend at it.** All requests go through the one file
   `src/api/client.js`, which reads `API_BASE` from the `VITE_API_BASE`
   environment variable, defaulting to `http://localhost:8080/api`.

   - Running both locally on default ports? Nothing to do.
   - Backend on a different host/port, or deployed remotely? Copy the env file
     and edit it:
     ```bash
     cp .env.example .env
     # then edit .env:
     # VITE_API_BASE=https://your-backend-host/api
     ```

3. **CORS**: the backend's `CorsConfig.java` already allows all origins on
   `/api/**` for local development. If you lock it down for production,
   make sure the frontend's deployed origin (e.g. `https://shop.example.com`)
   is in the allow-list, or every `fetch` call will fail silently with a CORS
   error in the browser console.

4. **Install and run the frontend:**
   ```bash
   npm install
   npm run dev
   ```
   Vite will print a local URL (typically `http://localhost:5173`). Open it —
   signup/login now write to MySQL through the backend, and the admin panel
   (passcode `understory-admin` by default) pulls the shopper list live from
   `/api/admin/users`.

5. **Sanity check the full loop:** sign up a test account in the browser,
   then confirm the row landed in MySQL:
   ```sql
   SELECT username, created_at FROM users;
   SELECT * FROM user_profiles;
   ```

## Build for production

```bash
npm run build
```
Outputs static files to `dist/`, which you can serve from any static host —
just make sure `VITE_API_BASE` was set correctly at build time (Vite bakes
env vars in at build, not runtime).
