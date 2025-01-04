// .eslintrc.js
module.exports = {
  extends: [
    "plugin:astro/recommended", // Add this line
  ],
  settings: {
    astro: {
      rootDir: ["src/astro"], // Adjust according to your Astro root directory
    },
  },
};
