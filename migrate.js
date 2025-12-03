import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moveFile = (oldPath, newPath) => {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${oldPath} -> ${newPath}`);
  }
};

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 1. Create src directories
const dirs = ['src', 'src/components', 'src/services'];
dirs.forEach(createDir);

// 2. Move root files to src
moveFile('App.tsx', 'src/App.tsx');
moveFile('index.tsx', 'src/index.tsx');
moveFile('types.ts', 'src/types.ts');

// 3. Move folders content to src
const moveFolderContent = (srcDir, destDir) => {
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
      const oldPath = path.join(srcDir, file);
      const newPath = path.join(destDir, file);
      if (fs.lstatSync(oldPath).isFile()) {
        moveFile(oldPath, newPath);
      }
    });
  }
};

moveFolderContent('components', 'src/components');
moveFolderContent('services', 'src/services');

// 4. Create src/index.css with Tailwind directives
const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
fs.writeFileSync('src/index.css', cssContent);
console.log('Created src/index.css');

// 5. Update src/index.tsx to import CSS
const indexTsxPath = 'src/index.tsx';
if (fs.existsSync(indexTsxPath)) {
  let content = fs.readFileSync(indexTsxPath, 'utf8');
  if (!content.includes("import './index.css'")) {
    content = "import './index.css';\n" + content;
    fs.writeFileSync(indexTsxPath, content);
    console.log('Updated src/index.tsx with CSS import');
  }
}

// 6. Update index.html
const htmlPath = 'index.html';
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Remove Tailwind CDN
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, '');
  
  // Remove inline Tailwind config
  html = html.replace(/<script>\s*tailwind\.config[\s\S]*?<\/script>/g, '');
  
  // Remove importmap (using npm modules now)
  html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');

  // Update entry point path
  html = html.replace('src="/index.tsx"', 'src="/src/index.tsx"');
  html = html.replace('src="./index.tsx"', 'src="/src/index.tsx"');

  fs.writeFileSync(htmlPath, html);
  console.log('Cleaned and updated index.html');
}

// 7. Cleanup old empty folders
['components', 'services'].forEach(dir => {
  if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    console.log(`Removed empty directory ${dir}`);
  }
});

console.log('------------------------------------------------');
console.log('Migration complete! Project structure updated.');
console.log('Now run: npm install && npm run dev');
console.log('------------------------------------------------');