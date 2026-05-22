const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  name: 'mfePermits',
  exposes: {
    './Module': './src/app/permits.module.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

// Set publicPath so all lazy chunks are loaded from /mfe/permits/ in production
module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    publicPath: '/mfe/permits/',
  },
};
