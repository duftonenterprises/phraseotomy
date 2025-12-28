import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Theme colors
const THEME_COLORS = {
  'at-work': '#b65acc',    // PURPLE
  'core': '#7a7978',        // GREY
  'at-home': '#2eb81b',    // GREEN
  'travel': '#fe9b01',      // ORANGE
  'lifestyle': '#ff342d',   // RED
  'horror': '#800a00',      // rgb(128, 10, 0)
  'adult': '#ff368a',       // rgb(255, 54, 138)
  'fantasy': '#460d08',     // rgb(70, 13, 8)
  'sci-fi': '#00a6bd',      // rgb(0, 166, 189)
};

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
  'core': 'core',
};

function processSVG(svgContent, themeColor) {
  let processed = svgContent;
  
  // Step 1: Replace white colors with transparent (carve out white from black)
  // Handle various white formats in fill attributes
  processed = processed.replace(/fill="#ffffff"/gi, 'fill="none"');
  processed = processed.replace(/fill="#fff"/gi, 'fill="none"');
  processed = processed.replace(/fill="white"/gi, 'fill="none"');
  processed = processed.replace(/fill='#ffffff'/gi, "fill='none'");
  processed = processed.replace(/fill='#fff'/gi, "fill='none'");
  processed = processed.replace(/fill='white'/gi, "fill='none'");
  
  // Handle white in style attributes (with and without space)
  processed = processed.replace(/fill:\s*#ffffff/gi, 'fill:none');
  processed = processed.replace(/fill:\s*#fff/gi, 'fill:none');
  processed = processed.replace(/fill:\s*white/gi, 'fill:none');
  processed = processed.replace(/fill:#ffffff/gi, 'fill:none');
  processed = processed.replace(/fill:#fff/gi, 'fill:none');
  processed = processed.replace(/fill:white/gi, 'fill:none');
  processed = processed.replace(/fill:\s*rgb\(255,\s*255,\s*255\)/gi, 'fill:none');
  processed = processed.replace(/fill:\s*rgb\(255,255,255\)/gi, 'fill:none');
  
  // Step 2: Replace black/dark colors with theme color
  // Handle fill attributes
  processed = processed.replace(/fill="#000000"/gi, `fill="${themeColor}"`);
  processed = processed.replace(/fill="#000"/gi, `fill="${themeColor}"`);
  processed = processed.replace(/fill="black"/gi, `fill="${themeColor}"`);
  processed = processed.replace(/fill='#000000'/gi, `fill='${themeColor}'`);
  processed = processed.replace(/fill='#000'/gi, `fill='${themeColor}'`);
  processed = processed.replace(/fill='black'/gi, `fill='${themeColor}'`);
  
  // Handle style attributes with fill colors - match common dark hex codes
  // Match patterns like fill:#080703 or fill: #080703 in style attributes
  const darkColorPatterns = [
    /fill:#000000/gi, /fill:#000/gi, /fill:black/gi,
    /fill:#080703/gi, /fill:#333333/gi, /fill:#333/gi,
    /fill:#111111/gi, /fill:#222222/gi, /fill:#444444/gi,
  ];
  
  darkColorPatterns.forEach(pattern => {
    processed = processed.replace(pattern, `fill:${themeColor}`);
  });
  
  // Also handle with optional space
  processed = processed.replace(/fill:\s*#000000/gi, `fill:${themeColor}`);
  processed = processed.replace(/fill:\s*#000/gi, `fill:${themeColor}`);
  processed = processed.replace(/fill:\s*black/gi, `fill:${themeColor}`);
  
  // Handle any dark hex colors (#0xxx, #1xxx, #2xxx, #3xxx) - 6 digit hex
  processed = processed.replace(/fill:#0[0-9a-fA-F]{5}/g, `fill:${themeColor}`);
  processed = processed.replace(/fill:#1[0-9a-fA-F]{5}/g, `fill:${themeColor}`);
  processed = processed.replace(/fill:#2[0-9a-fA-F]{5}/g, `fill:${themeColor}`);
  processed = processed.replace(/fill:#3[0-9a-fA-F]{5}/g, `fill:${themeColor}`);
  
  // Handle stroke colors
  processed = processed.replace(/stroke="#000000"/gi, `stroke="${themeColor}"`);
  processed = processed.replace(/stroke="#000"/gi, `stroke="${themeColor}"`);
  processed = processed.replace(/stroke="black"/gi, `stroke="${themeColor}"`);
  processed = processed.replace(/stroke:\s*#000000/gi, `stroke:${themeColor}`);
  processed = processed.replace(/stroke:\s*#000/gi, `stroke:${themeColor}`);
  processed = processed.replace(/stroke:\s*black/gi, `stroke:${themeColor}`);
  processed = processed.replace(/stroke:#000000/gi, `stroke:${themeColor}`);
  processed = processed.replace(/stroke:#000/gi, `stroke:${themeColor}`);
  processed = processed.replace(/stroke:black/gi, `stroke:${themeColor}`);
  
  return processed;
}

function processThemeFolder(themeId, themeFolder) {
  // Process files in public/themes (they're already copied there)
  const targetDir = path.join(__dirname, 'public', 'themes', themeFolder);
  const themeColor = THEME_COLORS[themeId] || '#000000';
  
  if (!fs.existsSync(targetDir)) {
    console.log(`Target directory not found: ${targetDir}`);
    return;
  }
  
  const files = fs.readdirSync(targetDir);
  let processedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.svg')) {
      const filePath = path.join(targetDir, file);
      
      try {
        const svgContent = fs.readFileSync(filePath, 'utf8');
        const processed = processSVG(svgContent, themeColor);
        fs.writeFileSync(filePath, processed, 'utf8');
        processedCount++;
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }
  });
  
  console.log(`Processed ${processedCount} SVGs for ${themeId} (${themeFolder})`);
}

// Process all themes
console.log('Processing SVGs...\n');

Object.entries(THEME_FOLDERS).forEach(([themeId, folder]) => {
  processThemeFolder(themeId, folder);
});

console.log('\nDone! All SVGs have been processed.');

