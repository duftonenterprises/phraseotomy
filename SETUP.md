# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher) and npm installed
- If not installed, download from https://nodejs.org/ or use `brew install node`

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy SVG files to public folder:**
   ```bash
   ./copy-svgs.sh
   ```
   Or manually copy the theme folders from the parent directory to `public/themes/`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   The terminal will show a URL (usually `http://localhost:5173`)
   Open that URL in your browser to view the app!

## Testing localStorage (Resume Game)

The app saves game state to localStorage so you can test "Resume Game" and "New Game":

1. **Run the app** at `http://localhost:5173` (same as in Cursor’s Simple Browser or your system browser).
2. **Create a saved game:** Click **New Game** → enter player names → **Start Game** → play until you’re past the first screen (e.g. theme select or story screen). State is saved automatically.
3. **Resume:** Refresh the page or reopen the tab. You should see **Resume Game** (enabled) and **New Game**. Click **Resume Game** to continue.
4. **Inspect or clear storage** (in the same origin as the app):
   - **Chrome/Edge:** DevTools (F12) → **Application** → **Local Storage** → `http://localhost:5173` → key `phraseotomy-game-state`.
   - **Firefox:** DevTools (F12) → **Storage** → **Local Storage** → `http://localhost:5173`.
   - **Safari:** DevTools → **Storage** → **Local Storage**.
   - Delete the key to simulate no saved game (Resume will be disabled). Edit the value to test invalid/corrupt data (Resume stays disabled if version or shape is wrong).

The app only enables **Resume Game** when `localStorage` contains a valid game state (correct key and version).

## Troubleshooting

- If `npm` command not found: Install Node.js first
- If SVG images don't load: Make sure you've copied the SVG files to `public/themes/`
- If port 5173 is in use: Vite will automatically try the next available port

