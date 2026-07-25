import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const resumeExists = existsSync(
  fileURLToPath(new URL('../public/resume.pdf', import.meta.url))
);

const outDir = fileURLToPath(new URL('../src/generated/', import.meta.url));
mkdirSync(outDir, { recursive: true });

writeFileSync(
  fileURLToPath(new URL('../src/generated/resume-status.ts', import.meta.url)),
  `// Auto-generado por scripts/check-resume.mjs — no editar a mano.\nexport const resumeExists = ${resumeExists};\n`
);

console.log(`resume.pdf exists: ${resumeExists}`);
