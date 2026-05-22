#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/services/micro-frontend';
const mfes = ['mfe-taxes', 'mfe-permits', 'mfe-lands', 'mfe-grants', 'mfe-cases', 'mfe-registrations'];

const newTsconfigApp = `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/bootstrap.ts"
  ],
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}
`;

for (const mfe of mfes) {
  const tsconfigAppPath = path.join(BASE, mfe, 'tsconfig.app.json');
  fs.writeFileSync(tsconfigAppPath, newTsconfigApp);
  console.log(`Updated ${mfe}/tsconfig.app.json`);
}

// Also update shell
const shellTsconfigAppPath = path.join(BASE, 'shell', 'tsconfig.app.json');
const shellTsconfigApp = `/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/bootstrap.ts"
  ],
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}
`;
fs.writeFileSync(shellTsconfigAppPath, shellTsconfigApp);
console.log('Updated shell/tsconfig.app.json');

console.log('Done!');
