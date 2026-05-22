const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  name: 'mfeRegistrations',
  exposes: {
    './Module': './src/app/registrations.module.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

// Set publicPath so all lazy chunks are loaded from /mfe/registrations/ in production
module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    publicPath: '/mfe/registrations/',
  },
};
