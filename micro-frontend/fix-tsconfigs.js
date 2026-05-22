#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/services/micro-frontend';
const mfes = ['mfe-taxes', 'mfe-permits', 'mfe-lands', 'mfe-grants', 'mfe-cases', 'mfe-registrations'];

const newTsconfig = `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
`;

for (const mfe of mfes) {
  const tsconfigPath = path.join(BASE, mfe, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    fs.writeFileSync(tsconfigPath, newTsconfig);
    console.log(`Updated tsconfig.json for ${mfe}`);
  }

  // Update tsconfig.app.json to include bootstrap.ts
  const tsconfigAppPath = path.join(BASE, mfe, 'tsconfig.app.json');
  if (fs.existsSync(tsconfigAppPath)) {
    const content = fs.readFileSync(tsconfigAppPath, 'utf8');
    // Use a simple regex to check if bootstrap.ts is already included
    if (!content.includes('bootstrap.ts')) {
      const updated = content.replace(
        '"src/main.ts"',
        '"src/main.ts",\n    "src/bootstrap.ts"'
      );
      fs.writeFileSync(tsconfigAppPath, updated);
      console.log(`Updated tsconfig.app.json for ${mfe}`);
    }
  }
}

console.log('\nAll tsconfigs updated!');
