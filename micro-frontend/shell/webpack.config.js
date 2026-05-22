const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

// In dev mode, MFEs are proxied through the shell dev server via proxy.conf.json.
// All remotes resolve from the same origin (localhost:4200/mfe/<name>/).
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
