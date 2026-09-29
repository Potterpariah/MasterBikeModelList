import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const [texasDataPath, routeDataPath, outputPath] = process.argv.slice(2);
if (!texasDataPath || !routeDataPath || !outputPath) {
  throw new Error('Usage: node scripts/import-texas-cycling-data.mjs <texas-data.ts> <route-data.ts> <output.js>');
}

// Resolve the compiler from the source checkout so this portable Worker does
// not gain a build dependency solely for this one-time, reviewed import.
const ts = createRequire(texasDataPath)('typescript');

async function exportsFrom(path) {
  const source = await readFile(path, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { exports: module.exports, module });
  return module.exports;
}

const texas = await exportsFrom(texasDataPath);
const routes = await exportsFrom(routeDataPath);
const snapshot = {
  source: 'Texas Cycling Hub local public catalog',
  imported_at: new Date().toISOString().slice(0, 10),
  records: {
    events: texas.texasEvents.length,
    cities: texas.texasCities.length,
    trails: texas.texasTrails.length,
    routes: routes.cyclingRoutes.length,
    highlights: routes.routeHighlights.length,
  },
};
const content = `// Generated from the Texas Cycling Hub public catalog. Do not add private user data here.\nexport const texasCatalogSnapshot=${JSON.stringify(snapshot)};\nexport const texasEvents=${JSON.stringify(texas.texasEvents)};\nexport const texasCities=${JSON.stringify(texas.texasCities)};\nexport const texasTrails=${JSON.stringify(texas.texasTrails)};\nexport const cyclingRoutes=${JSON.stringify(routes.cyclingRoutes)};\nexport const routeHighlights=${JSON.stringify(routes.routeHighlights)};\n`;
await writeFile(outputPath, content);
