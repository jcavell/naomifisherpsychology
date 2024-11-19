// .eslintrc.js
module.exports = {
  extends: [
    'plugin:astro/recommended',  // Add this line
    'plugin:preact/recommended',
  ],
  settings: {
    'astro': {
      'rootDir': ['src/astro'],   // Adjust according to your Astro root directory
    },
  },
};