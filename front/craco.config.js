const path = require("path");
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  reactScriptsVersion: 'react-scripts',
  plugins: [{ plugin: CracoAntDesignPlugin }],
  webpack: {
    alias: {
      '@sb-ui': path.resolve(__dirname, 'src/'),
    },
  },
};
