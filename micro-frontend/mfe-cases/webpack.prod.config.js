const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  name: 'mfeCases',
  exposes: {
    './Module': './src/app/cases.module.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

// Set publicPath so all lazy chunks are loaded from /mfe/cases/ in production
module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    publicPath: '/mfe/cases/',
  },
};
