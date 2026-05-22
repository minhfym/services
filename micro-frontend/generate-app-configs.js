#!/usr/bin/env node
/**
 * Updates app.config.ts for all MFEs to include HttpClient and Animations
 */
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/services/micro-frontend';

const mfes = ['mfe-taxes', 'mfe-permits', 'mfe-lands', 'mfe-grants', 'mfe-cases', 'mfe-registrations'];

const newConfig = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
  ]
};
`;

for (const mfe of mfes) {
  const configPath = path.join(BASE, mfe, 'src/app/app.config.ts');
  if (fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, newConfig);
    console.log(`Updated app.config.ts for ${mfe}`);
  } else {
    console.warn(`No app.config.ts found for ${mfe} at ${configPath}`);
  }
}

console.log('\nAll app configs updated!');
