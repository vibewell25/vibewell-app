#!/usr/bin/env node

/**
 * This script searches for files that convert profileData to Profile type
 * and updates them to use the safeProfileData utility function.
 * 
 * Run with: node scripts/fix-profile-usage.js
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Pattern to find files that convert profileData to Profile type
const filePattern = 'apps/web/app/**/*.tsx';

// Pattern to detect conversion of profileData to Profile type
const conversionPattern = /const\s+profile\s*:\s*Profile\s*=\s*{[\s\S]*?\.\.\.profileData[\s\S]*?};/;

// Pattern to detect access of optional fields directly
const optionalFieldsPattern = /profileData\.(displayName|bio|avatarUrl|phone|address|city|state|zipCode|country)/g;

// Import statement to add
const importStatement = `import { safeProfileData } from "@/lib/utils";`;

// Replacement for profileData conversion
const replacementCode = `// Convert profileData to Profile type using our utility function
  const profile: Profile = safeProfileData(profileData);`;

// Main function to process files
async function fixProfileUsage() {
  try {
    console.log('🔎 Searching for files that convert profileData to Profile type...');
    
    // Find all files matching the pattern
    const files = await glob(filePattern);
    
    let totalFixed = 0;
    
    for (const file of files) {
      // Read file content
      let content = fs.readFileSync(file, 'utf8');
      
      // Check if file contains profileData conversion
      if (conversionPattern.test(content) || optionalFieldsPattern.test(content)) {
        console.log(`✅ Processing ${file}`);
        
        // Check if the import statement is already present
        if (!content.includes('safeProfileData')) {
          // Add import statement if not present
          const importLines = content.split('\n').filter(line => line.startsWith('import '));
          const lastImportLine = importLines[importLines.length - 1];
          const lastImportIndex = content.indexOf(lastImportLine) + lastImportLine.length;
          
          content = content.substring(0, lastImportIndex) + 
                   '\n' + importStatement + 
                   content.substring(lastImportIndex);
        }
        
        // Replace profile conversion with utility function
        content = content.replace(conversionPattern, replacementCode);
        
        // Write updated content back to file
        fs.writeFileSync(file, content, 'utf8');
        
        totalFixed++;
        console.log(`✅ Updated ${file}`);
      }
    }
    
    console.log(`\n🎉 Fixed ${totalFixed} files.`);
    
    if (totalFixed === 0) {
      console.log('No files needed fixing or no matching files found.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the function
fixProfileUsage(); 