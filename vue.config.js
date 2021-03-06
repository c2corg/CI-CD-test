
const webpack = require('webpack');

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
  config.branchName = process.env.TRAVIS_BRANCH;
  // github pages urls are postfixed
  result.publicPath = `/CI-CD-test/${config.branchName}/`;
} else if (process.env.BUILD_ENV === 'production') {
  config.isProduction = true;
}

result.configureWebpack.plugins.push(
  new webpack.DefinePlugin({
    CAMPTOCAMP_CONFIG: JSON.stringify(config)
  })
);

module.exports = result;