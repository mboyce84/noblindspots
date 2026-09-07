import { build } from 'esbuild';
import { mkdirSync,copyFileSync,cpSync,readFileSync } from 'node:fs';
await build({entryPoints:['server/worker.ts'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',define:{__SITE_INDEX_HTML__:JSON.stringify(readFileSync('dist/client/index.html','utf8'))}});
mkdirSync('dist/.openai',{recursive:true});copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');cpSync('drizzle','dist/.openai/drizzle',{recursive:true});
