module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": { // This plugin is now correctly configured
      features: {
        "nesting-rules": true,
      },
    },
  },
};