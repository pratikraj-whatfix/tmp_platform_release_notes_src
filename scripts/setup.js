#!/usr/bin/env node

/**
 * Whatfix Dashboard Boilerplate - Project Setup Script
 * 
 * Run this after creating a new project from the template:
 * node scripts/setup.js
 * 
 * Or with arguments:
 * node scripts/setup.js --name "My Project" --description "My awesome dashboard"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(`--${name}`);
  return index !== -1 ? args[index + 1] : null;
};

// Create readline interface for interactive mode
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

// Convert project name to different formats
const toKebabCase = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const toTitleCase = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

async function main() {
  console.log('\n🎨 Whatfix Dashboard Boilerplate - Project Setup\n');
  console.log('This script will help you customize the project for your needs.\n');

  // Get project details
  let projectName = getArg('name');
  let description = getArg('description');
  let authorName = getArg('author');

  if (!projectName) {
    projectName = await question('📦 Project name (e.g., "Mirror Admin Dashboard"): ');
  }

  if (!description) {
    description = await question('📝 Project description: ') || `${projectName} - Built with Whatfix Dashboard Boilerplate`;
  }

  if (!authorName) {
    authorName = await question('👤 Author name (press Enter to skip): ') || '';
  }

  const packageName = toKebabCase(projectName);
  const displayName = toTitleCase(projectName);

  console.log('\n📋 Project configuration:');
  console.log(`   Name: ${displayName}`);
  console.log(`   Package: ${packageName}`);
  console.log(`   Description: ${description}`);
  if (authorName) console.log(`   Author: ${authorName}`);

  const confirm = await question('\n✅ Proceed with setup? (Y/n): ');
  if (confirm.toLowerCase() === 'n') {
    console.log('\n❌ Setup cancelled.\n');
    rl.close();
    process.exit(0);
  }

  // Update package.json
  console.log('\n🔧 Updating package.json...');
  const packageJsonPath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  
  packageJson.name = packageName;
  packageJson.description = description;
  packageJson.version = '0.1.0';
  if (authorName) packageJson.author = authorName;
  
  // Remove template-specific scripts
  delete packageJson.scripts.setup;
  
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  // Update index.html title
  console.log('🔧 Updating index.html...');
  const indexHtmlPath = join(rootDir, 'index.html');
  let indexHtml = readFileSync(indexHtmlPath, 'utf-8');
  indexHtml = indexHtml.replace(
    /<title>.*<\/title>/,
    `<title>${displayName}</title>`
  );
  writeFileSync(indexHtmlPath, indexHtml);

  // Create a project-specific README
  console.log('🔧 Creating project README...');
  const readmePath = join(rootDir, 'README.md');
  const newReadme = `# ${displayName}

${description}

## Getting started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Project structure

\`\`\`
src/
├── components/
│   ├── ui/           # Button, Modal, Input, Card, Badge, TabGroup
│   ├── layout/       # Sidebar, Header, PageLayout, ContentPanel
│   └── charts/       # LineChart, BarChart, PieChart
├── views/            # Page views
├── styles/
│   └── tokens/       # Design tokens (colors, typography, spacing)
├── lib/              # Utilities
└── types/            # TypeScript definitions
\`\`\`

## Built with

- React + TypeScript
- Tailwind CSS v4
- Whatfix Navi Design System
- Tabler Icons
- ECharts

---

*Created from [Whatfix Dashboard Boilerplate](https://github.com/whatfix/whatfix-boilerplate)*
`;

  writeFileSync(readmePath, newReadme);

  // Clean up setup files
  console.log('🧹 Cleaning up...');
  
  // Remove the TEMPLATE_README if it exists
  const templateReadmePath = join(rootDir, 'TEMPLATE_README.md');
  if (existsSync(templateReadmePath)) {
    const { unlinkSync } = await import('fs');
    unlinkSync(templateReadmePath);
  }

  console.log('\n✨ Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run: npm install');
  console.log('  2. Run: npm run dev');
  console.log('  3. Start building your dashboard!\n');
  console.log('Happy coding! 🚀\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error during setup:', error);
  rl.close();
  process.exit(1);
});
