const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const mfConfig = withModuleFederationPlugin({
  name: 'mfeTaxes',
  exposes: {
    './Module': './src/app/taxes.module.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

// Set publicPath so all lazy chunks are loaded from /mfe/taxes/ in production
module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    publicPath: '/mfe/taxes/',
  },
};
