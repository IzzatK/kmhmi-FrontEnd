module.exports = {
    "stories": ["../src/**/*.tests.mdx", "../src/**/*.tests.@(js|jsx|ts|tsx)", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/preset-create-react-app"] // webpackFinal: async (config) => {
    //   // Ensure shared component tests are transpiled.
    //   config.module.rules[0].include.push(
    //       path.resolve('../../packages/react-components/src')
    //   );
    //
    //   return config;
    // }
    ,
    core: {
        builder: "webpack5"
    }
};
