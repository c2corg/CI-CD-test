
const webpack = require('webpack');
const { execSync } = require('child_process');
const path = require("path");

const result = {
  publicPath: '/',
  configureWebpack: {
    plugins: []
  }
};

const config = {
  isProduction: false
};

if (process.env.BUILD_ENV === 'github') {
  console.log(process.env.TRAVIS_BRANCH);
  config.branchName = process.env.TRAVIS_BRANCH;
  // github pages urls are postfixed
  result.publicPath = `/CI-CD-test/${config.branchName}/`;
  result.outputDir = path.resolve(__dirname, `./dist/${config.branchName}`);
} else if (process.env.BUILD_ENV === 'production') {
  config.isProduction = true;
}

result.configureWebpack.plugins.push(
  new webpack.DefinePlugin({
    CAMPTOCAMP_CONFIG: JSON.stringify(config)
  })
);

module.exports = result;