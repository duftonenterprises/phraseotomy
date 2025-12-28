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

## Troubleshooting

- If `npm` command not found: Install Node.js first
- If SVG images don't load: Make sure you've copied the SVG files to `public/themes/`
- If port 5173 is in use: Vite will automatically try the next available port

