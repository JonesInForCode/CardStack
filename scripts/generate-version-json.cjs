// scripts/generate-version-json.cjs
const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

// Create version.json file
function generateVersionJson() {
  const versionData = {
    version,
    buildDate: new Date().toISOString(),
    requiredUpdate: true, // Change to false for non-critical updates
    updateMessage: `Version ${version} is now available with new features. Please refresh to update!`
  };

  const outputPath = path.join(__dirname, '../public/version.json');
  
  fs.writeFileSync(
    outputPath,
    JSON.stringify(versionData, null, 2),
    'utf8'
  );
  
  console.log(`Generated version.json with version ${version}`);
}

generateVersionJson();