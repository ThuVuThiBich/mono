const withTM = require("next-transpile-modules")(["@cross/ui"]);

module.exports = withTM({
  reactStrictMode: true,
});
