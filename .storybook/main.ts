import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    // Add SCSS support to Webpack
    config?.module?.rules?.push({
      test: /\.scss$/,
      use: [
        'style-loader',  // Injects styles into the DOM
        'css-loader',    // Resolves CSS imports and bundling
        'sass-loader',   // Compiles SCSS to CSS
      ],
    });

    return config;
  },
};

export default config;
