#!/usr/bin/env node
/**
 * Configures Module Federation for all MFE projects
 * Replicates what @angular-architects/module-federation schematic does
 */
const fs = require('fs');
const path = require('path');

const BASE = '/home/user/services/micro-frontend';

const projects = [
  { name: 'shell',             port: 4200, type: 'host' },
  { name: 'mfe-taxes',         port: 4201, type: 'remote', mfeName: 'mfeTaxes' },
  { name: 'mfe-permits',       port: 4202, type: 'remote', mfeName: 'mfePermits' },
  { name: 'mfe-lands',         port: 4203, type: 'remote', mfeName: 'mfeLands' },
  { name: 'mfe-grants',        port: 4204, type: 'remote', mfeName: 'mfeGrants' },
  { name: 'mfe-cases',         port: 4205, type: 'remote', mfeName: 'mfeCases' },
  { name: 'mfe-registrations', port: 4206, type: 'remote', mfeName: 'mfeRegistrations' },
];

const remotes = projects.filter(p => p.type === 'remote');

function getWebpackConfig(project) {
  if (project.type === 'host') {
    const remotesConfig = remotes.map(r => `    "${r.mfeName}": "http://localhost:${r.port}/remoteEntry.js",`).join('\n');
    return `const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
${remotesConfig}
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
`;
  } else {
    return `const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: '${project.mfeName}',

  exposes: {
    './Module': './src/app/${project.name.replace('mfe-', '')}.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
`;
  }
}

function getWebpackProdConfig() {
  return `const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
`;
}

for (const project of projects) {
  const projectDir = path.join(BASE, project.name);
  const angularJsonPath = path.join(projectDir, 'angular.json');

  if (!fs.existsSync(angularJsonPath)) {
    console.error(`angular.json not found for ${project.name}`);
    continue;
  }

  const angularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));
  const projectConfig = angularJson.projects[project.name];

  if (!projectConfig) {
    console.error(`Project ${project.name} not found in angular.json`);
    continue;
  }

  // Write webpack configs
  const webpackConfigPath = path.join(projectDir, 'webpack.config.js');
  const webpackProdConfigPath = path.join(projectDir, 'webpack.prod.config.js');

  fs.writeFileSync(webpackConfigPath, getWebpackConfig(project));
  fs.writeFileSync(webpackProdConfigPath, getWebpackProdConfig());
  console.log(`Created webpack configs for ${project.name}`);

  // Update build config to use ngx-build-plus
  const buildConfig = projectConfig.architect.build;
  const serveConfig = projectConfig.architect.serve;

  // Switch from application builder to browser (webpack)
  buildConfig.builder = 'ngx-build-plus:browser';

  // Rename browser to main
  if (buildConfig.options.browser) {
    buildConfig.options.main = buildConfig.options.browser;
    delete buildConfig.options.browser;
    delete buildConfig.options.server;
    delete buildConfig.options.prerender;
    delete buildConfig.options.ssr;
  }

  // Set outputPath if not present
  buildConfig.options.outputPath = buildConfig.options.outputPath || `dist/${project.name}`;

  // Add webpack config paths
  buildConfig.options.extraWebpackConfig = 'webpack.config.js';
  buildConfig.options.commonChunk = false;

  // Remove aot if present (causes issues with webpack builder sometimes)
  // Update production config
  if (buildConfig.configurations && buildConfig.configurations.production) {
    buildConfig.configurations.production.extraWebpackConfig = 'webpack.prod.config.js';
  }

  // Update serve config
  serveConfig.builder = 'ngx-build-plus:dev-server';
  if (!serveConfig.options) serveConfig.options = {};
  serveConfig.options.port = project.port;
  serveConfig.options.publicHost = `http://localhost:${project.port}`;
  serveConfig.options.extraWebpackConfig = 'webpack.config.js';

  if (serveConfig.configurations && serveConfig.configurations.production) {
    serveConfig.configurations.production.extraWebpackConfig = 'webpack.prod.config.js';
  }

  fs.writeFileSync(angularJsonPath, JSON.stringify(angularJson, null, 2));
  console.log(`Updated angular.json for ${project.name}`);

  // Update main.ts to use async bootstrap (required for MF)
  const mainTsPath = path.join(projectDir, 'src/main.ts');
  const bootstrapTsPath = path.join(projectDir, 'src/bootstrap.ts');

  if (fs.existsSync(mainTsPath)) {
    const mainContent = fs.readFileSync(mainTsPath, 'utf8');
    if (!mainContent.includes('bootstrap')) {
      // Already bootstrapping, just wrap
      fs.writeFileSync(bootstrapTsPath, mainContent);
      fs.writeFileSync(mainTsPath, "import('./bootstrap')\n  .catch(err => console.error(err));\n");
      console.log(`Updated main.ts for ${project.name} (async bootstrap)`);
    } else if (!mainContent.includes("import('./bootstrap')")) {
      fs.writeFileSync(bootstrapTsPath, mainContent);
      fs.writeFileSync(mainTsPath, "import('./bootstrap')\n  .catch(err => console.error(err));\n");
      console.log(`Updated main.ts for ${project.name} (async bootstrap)`);
    }
  }
}

console.log('\nConfiguration complete!');
