const withTM = require('next-transpile-modules')(['@cross/cookies', '@cross/hooks', '@cross/context', '@cross/ui']);
const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');
const { i18n } = require('./next-i18next.config');

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

const plugins = [[withTM], [withLess, { lessLoaderOptions: { lessOptions: { javascriptEnabled: true } } }]];

/** @type {import('next').NextConfig} */
module.exports = withPlugins(plugins, {
  webpack: (config) => {
    const oneOf = config.module.rules.find((rule) => typeof rule.oneOf === 'object');

    // Overrides pure mode of nextjs
    if (oneOf) {
      const moduleCssRule = oneOf.oneOf.find((rule) => regexEqual(rule.test, /\.module\.css$/));
      if (moduleCssRule) {
        const cssLoader = moduleCssRule.use.find(({ loader }) => loader.includes('css-loader'));
        if (cssLoader) {
          cssLoader.options.modules.mode = 'local';
        }
      }
    }

    return config;
  },
  images: {},
  api: {
    bodyParser: false,
  },
  i18n,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});
