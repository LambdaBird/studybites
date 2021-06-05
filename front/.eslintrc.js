const path = require('path');

module.exports = {
  extends: ['react-app', 'airbnb', 'plugin:jsx-a11y/recommended', 'prettier'],
  plugins: ['react', 'jsx-a11y'],
  rules: {
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@sb-ui', path.resolve(__dirname, 'src')]],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
};