
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
  console.log(execSync('git branch | grep \\* | cut -d \' \' -f2').toString());
  config.branchName = execSync('git branch | grep \\* | cut -d \' \' -f2').toString();
  // github pages urls are postfixed
  result.publicPath = `/c2c_ui/${config.branchName}/`;
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