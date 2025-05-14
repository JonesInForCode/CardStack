// scripts/generate-icons.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_ICON = path.join(__dirname, '../public/cardstack-favicon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/pwa-icons');

// Create the output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define the sizes we need for PWA icons
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    // Read the source SVG
    const svgBuffer = fs.readFileSync(SOURCE_ICON);
    
    // Generate each icon size
    for (const size of ICON_SIZES) {
      const outputFile = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
        
      console.log(`Generated ${outputFile}`);
    }
    
    console.log('All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();