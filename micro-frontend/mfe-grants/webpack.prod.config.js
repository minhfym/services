const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  name: 'mfeGrants',
  exposes: {
    './Module': './src/app/grants.module.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

// Set publicPath so all lazy chunks are loaded from /mfe/grants/ in production
module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    publicPath: '/mfe/grants/',
  },
};
