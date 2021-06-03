/* eslint-disable */
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        modifyLessRule: (rule) => {
          rule.use.push({
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: require('./src/theme/variables.js'),
                javascriptEnabled: true,
              },
            },
          });
          return rule;
        },
      },
    },
  ],
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
};
