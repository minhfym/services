const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    "mfeTaxes": "http://localhost:4201/remoteEntry.js",
    "mfePermits": "http://localhost:4202/remoteEntry.js",
    "mfeLands": "http://localhost:4203/remoteEntry.js",
    "mfeGrants": "http://localhost:4204/remoteEntry.js",
    "mfeCases": "http://localhost:4205/remoteEntry.js",
    "mfeRegistrations": "http://localhost:4206/remoteEntry.js",
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
