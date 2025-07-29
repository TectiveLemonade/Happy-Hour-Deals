const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional configuration if needed
config.resolver.alias = {
  '@components': './src/components',
  '@screens': './src/screens',
  '@navigation': './src/navigation',
  '@services': './src/services',
  '@utils': './src/utils',
  '@assets': './src/assets',
  '@store': './src/store',
  '@constants': './src/utils/constants',
  '@hooks': './src/utils/hooks',
  '@types': './src/utils/types',
};

module.exports = config;