const config = {
  plugins: [
    "@tailwindcss/postcss",
    ...(process.env.NODE_ENV === "production"
      ? [
          [
            "cssnano",
            {
              preset: [
                "advanced",
                {
                  discardComments: {
                    removeAll: true,
                  },
                  normalizeWhitespace: true,
                  colormin: true,
                  convertValues: true,
                  discardDuplicates: true,
                  discardEmpty: true,
                  mergeRules: true,
                  minifyFontValues: true,
                  minifyParams: true,
                  minifySelectors: true,
                },
              ],
            },
          ],
        ]
      : []),
  ],
};

export default config;
