import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the correct content for critical files
const files = {
  // 1. Fix package.json (Use * for genai to avoid version errors)
  'package.json': JSON.stringify({
    "name": "belimbing-visitor-system",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview"
    },
    "dependencies": {
      "@google/genai": "*",
      "jsqr": "^1.4.0",
      "lucide-react": "^0.344.0",
      "qrcode.react": "^3.1.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1"
    },
    "devDependencies": {
      "@types/react": "^18.3.3",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.1",
      "autoprefixer": "^10.4.19",
      "postcss": "^8.4.38",
      "tailwindcss": "^3.4.4",
      "typescript": "^5.5.3",
      "vite": "^5.3.1"
    }
  }, null, 2),

  // 2. Fix index.html (Remove CDNs, link to local src)
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <title>Belimbing</title>
  </head>
  <body class="bg-slate-900 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`,

  // 3. Fix vite.config.ts (Env handling)
  'vite.config.ts': `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env': {}
    }
  };
});`,

  // 4. Fix PostCSS (Syntax error source)
  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  // 5. Fix Tailwind Config
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}`,

  // 6. Ensure CSS exists
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0f172a;
  color: #f1f5f9;
}`
};

console.log("Starting repair...");

// Helper function to write file ensuring no BOM
const writeFile = (filePath, content) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write file with standard UTF-8 encoding (no BOM)
  fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
  console.log(`✓ Replaced: ${filePath}`);
};

// Write all config files
Object.entries(files).forEach(([name, content]) => writeFile(name, content));

// Sanitize other source files just in case
const sourceFiles = [
  'src/index.tsx',
  'src/App.tsx',
  'src/types.ts',
  'src/components/VisitorForm.tsx',
  'src/components/GuardDashboard.tsx',
  'src/components/VisitorLogs.tsx',
  'src/services/gemini.ts',
  'src/services/storage.ts'
];

sourceFiles.forEach(file => {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    // Remove BOM character (\uFEFF) if present
    if (content.charCodeAt(0) === 0xFEFF) {
      fs.writeFileSync(p, content.slice(1), 'utf8');
      console.log(`✓ Removed hidden BOM from: ${file}`);
    }
  }
});

console.log("\nRepair complete!");