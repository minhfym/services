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
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
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
  fs.writeFileSync(tsconfigPath, newTsconfig);
  console.log(`Updated ${mfe}/tsconfig.json`);
}
console.log('Done!');
