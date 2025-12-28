# Phraseotomy Local Play App

A web app for local multiplayer gameplay of Phraseotomy, designed to be hosted on Supabase and iframed into phraseotomy.com.

## Features

- 4-player local gameplay
- 4 rounds with randomized player order
- 8 themes: At Home, At Work, Lifestyle, Travel, Horror, Adult, Fantasy, Sci-fi
- Interactive gameplay with SVG icons and phrases
- Points management and scoreboard

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up SVG Assets

The SVG icons need to be copied to the `public/themes` folder. The folder structure should match:

```
public/
  themes/
    at home/
      basket.svg
      bath.svg
      ...
    at work/
      ...
    lifestyle/
      ...
    travel/
      ...
    horror/
      ...
    adult/
      ...
    fantasy/
      ...
    sci-fi/
      ...
```

You can copy the SVG files from the parent directory:

```bash
# From the project root
mkdir -p public/themes
cp -r "../at home" "public/themes/at home"
cp -r "../at work" "public/themes/at work"
cp -r "../lifestyle" "public/themes/lifestyle"
cp -r "../travel" "public/themes/travel"
cp -r "../horror" "public/themes/horror"
cp -r "../adult" "public/themes/adult"
cp -r "../fantasy" "public/themes/fantasy"
cp -r "../sci-fi" "public/themes/sci-fi"
```

### 3. Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to Supabase.

## Deployment to Supabase

1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your Supabase project's static hosting
3. Configure the app to be iframe-friendly (CSP headers may need adjustment)

## Game Flow

1. **Player Entry**: Enter 4 player names
2. **Theme Selection**: Current storyteller selects a theme
3. **Game Display**: Shows 5 random SVG icons + 1 random string from the selected theme
4. **Points Adjustment**: Add/remove points for each player's round subtotal
5. **Scoreboard**: Display current scores
6. **Next Turn**: Continue to next player's turn (4 rounds total)

## Customization

- Theme strings can be edited in `src/data/themes.js` in the `THEME_STRINGS` object
- SVG icon lists can be updated in `src/data/themes.js` in the `THEME_ICONS` object
- Styling can be customized via Tailwind CSS classes in the components

