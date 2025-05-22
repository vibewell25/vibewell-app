const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const glob = promisify(require('glob'));

async function main() {
  console.log('Fixing Supabase client in files...');
  
  // Find all TypeScript files in the app directory
  const files = await glob('apps/web/app/**/*.tsx');
  
  let fixedFiles = 0;
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf8');
      
      // Check if the file contains a createServerClient call without await
      if (content.includes('const supabase = createServerClient()')) {
        console.log(`Fixing ${file}`);
        
        // Replace the pattern with the awaited version
        const updatedContent = content.replace(
          /const supabase = createServerClient\(\)/g,
          'const supabase = await createServerClient()'
        );
        
        // Write the updated content back to the file
        await writeFile(file, updatedContent, 'utf8');
        fixedFiles++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log(`Fixed ${fixedFiles} files.`);
}

main().catch(console.error); 