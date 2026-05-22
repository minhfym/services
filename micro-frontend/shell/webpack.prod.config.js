const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

// In production all MFEs are served from the same origin under /mfe/<name>/
module.exports = withModuleFederationPlugin({
  remotes: {
    "mfeTaxes":         "mfeTaxes@/mfe/taxes/remoteEntry.js",
    "mfePermits":       "mfePermits@/mfe/permits/remoteEntry.js",
    "mfeLands":         "mfeLands@/mfe/lands/remoteEntry.js",
    "mfeGrants":        "mfeGrants@/mfe/grants/remoteEntry.js",
    "mfeCases":         "mfeCases@/mfe/cases/remoteEntry.js",
    "mfeRegistrations": "mfeRegistrations@/mfe/registrations/remoteEntry.js",
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
