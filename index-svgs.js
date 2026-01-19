import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Theme folders mapping
const THEME_FOLDERS = {
  'at-home': 'at home',
  'at-work': 'at work',
  'lifestyle': 'lifestyle',
  'travel': 'travel',
  'horror': 'horror',
  'adult': 'adult',
  'fantasy': 'fantasy',
  'sci-fi': 'sci-fi',
  'feeling': 'feeling',
  'event': 'event',
};

function getSVGFiles(themeFolder) {
  const themeDir = path.join(__dirname, 'public', 'themes', themeFolder);
  
  if (!fs.existsSync(themeDir)) {
    console.log(`Directory not found: ${themeDir}`);
    return [];
  }
  
  const files = fs.readdirSync(themeDir);
  const svgFiles = files
    .filter(file => file.endsWith('.svg'))
    .sort(); // Sort alphabetically for consistent output
  
  return svgFiles;
}

function formatArray(arr, indent = 2) {
  const indentStr = ' '.repeat(indent);
  return arr.map((item, index) => {
    const isLast = index === arr.length - 1;
    return `${indentStr}'${item}'${isLast ? '' : ','}`;
  }).join('\n');
}

// Read existing themes.js to preserve other parts
const themesJsPath = path.join(__dirname, 'src', 'data', 'themes.js');
const existingContent = fs.readFileSync(themesJsPath, 'utf8');

// Extract the parts we want to keep (THEMES array, THEME_STRINGS, helper functions)
// THEMES array should always be preserved
const themesMatch = existingContent.match(/export const THEMES = \[[\s\S]*?\];/);
// Match THEME_STRINGS - need to be more careful with multiline matching
const themeStringsMatch = existingContent.match(/export const THEME_STRINGS = \{[\s\S]*?\};/);
const helpersMatch = existingContent.match(/(\/\/ Helper function[\s\S]*?$)/);

// Default THEME_STRINGS to preserve if missing
const defaultThemeStrings = `export const THEME_STRINGS = {
  'at-home': [
    'Making the bed',
    'Doing the dishes',
    'Taking out the trash',
    'Vacuuming the carpet',
    'Watering the plants',
    'Cooking dinner',
    'Watching TV',
    'Doing laundry',
    'Cleaning the bathroom',
    'Reading a book',
    'Playing a game',
    'Watching a movie',
  ],
  'at-work': [
    'Attending a meeting',
    'Sending an email',
    'Making a presentation',
    'Taking a coffee break',
    'Completing a project',
    'Answering the phone',
    'Filing documents',
    'Having lunch',
    'Reviewing reports',
    'Planning the schedule',
  ],
  'lifestyle': [
    'Going to the gym',
    'Playing sports',
    'Cooking a meal',
    'Reading a book',
    'Watching a movie',
    'Going for a walk',
    'Playing music',
    'Gardening',
    'Painting',
    'Dancing',
  ],
  'travel': [
    'Packing a suitcase',
    'Booking a hotel',
    'Boarding a plane',
    'Exploring a city',
    'Taking photos',
    'Trying local food',
    'Visiting museums',
    'Going to the beach',
    'Hiking a trail',
    'Shopping for souvenirs',
  ],
  'horror': [
    'Hearing strange noises',
    'Finding a hidden room',
    'Discovering a secret',
    'Being followed',
    'Losing power',
    'Finding a clue',
    'Escaping danger',
    'Solving a mystery',
    'Confronting fear',
    'Surviving the night',
  ],
  'adult': [
    'Having a date night',
    'Going to a party',
    'Enjoying a drink',
    'Playing a game',
    'Having fun',
    'Relaxing together',
    'Celebrating',
    'Socializing',
    'Entertaining guests',
    'Having a good time',
  ],
  'fantasy': [
    'Casting a spell',
    'Finding a treasure',
    'Battling a dragon',
    'Exploring a dungeon',
    'Meeting a wizard',
    'Using magic',
    'Going on a quest',
    'Discovering a kingdom',
    'Finding a potion',
    'Saving the realm',
  ],
  'sci-fi': [
    'Traveling through space',
    'Meeting an alien',
    'Using advanced technology',
    'Exploring a planet',
    'Flying a spaceship',
    'Discovering new worlds',
    'Using a teleporter',
    'Encountering robots',
    'Visiting the future',
    'Exploring the galaxy',
  ],
};`;

// If THEMES array is missing or empty, use the default
const defaultThemes = `export const THEMES = [
  { id: 'at-home', name: 'At Home', folder: 'at home' },
  { id: 'at-work', name: 'At Work', folder: 'at work' },
  { id: 'lifestyle', name: 'Lifestyle', folder: 'lifestyle' },
  { id: 'travel', name: 'Travel', folder: 'travel' },
  { id: 'horror', name: 'Horror', folder: 'horror' },
  { id: 'adult', name: 'Adult', folder: 'adult' },
  { id: 'fantasy', name: 'Fantasy', folder: 'fantasy' },
  { id: 'sci-fi', name: 'Sci-fi', folder: 'sci-fi' },
]`;

// Get SVG files for each theme
const themeIcons = {};
const feelingIcons = [];
const eventIcons = [];

Object.entries(THEME_FOLDERS).forEach(([themeId, folder]) => {
  const svgFiles = getSVGFiles(folder);
  
  if (themeId === 'feeling') {
    feelingIcons.push(...svgFiles);
  } else if (themeId === 'event') {
    eventIcons.push(...svgFiles);
  } else {
    themeIcons[themeId] = svgFiles;
  }
  
  console.log(`Found ${svgFiles.length} SVGs in ${folder}`);
});

// Generate new themes.js content
let newContent = `// Theme data structure
// SVG paths are relative to the public folder or absolute URLs
// Strings/phrases for each theme

${themesMatch && themesMatch[0].includes('at-home') ? themesMatch[0] : defaultThemes}

// SVG icons for each theme
// These are automatically indexed from the theme folders
// Feeling icons from the feeling folder (formerly core)
export const FEELING_ICONS = [
${formatArray(feelingIcons)}
]

// Event icons from the event folder
export const EVENT_ICONS = [
${formatArray(eventIcons)}
]

export const THEME_ICONS = {
${Object.entries(themeIcons).map(([themeId, icons]) => {
  const indentStr = '  ';
  const arrayContent = formatArray(icons, 4);
  return `${indentStr}'${themeId}': [\n${arrayContent}\n${indentStr}],`;
}).join('\n')}
}

${themeStringsMatch && themeStringsMatch[0].includes('at-home') ? themeStringsMatch[0] : defaultThemeStrings}

${helpersMatch ? helpersMatch[1] : ''}
`;

// Write the updated file
fs.writeFileSync(themesJsPath, newContent, 'utf8');
console.log('\n✅ Successfully reindexed SVGs!');
console.log(`📝 Updated ${themesJsPath}`);
