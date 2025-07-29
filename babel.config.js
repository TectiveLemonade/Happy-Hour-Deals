module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
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
          },
        },
      ],
    ],
  };
};