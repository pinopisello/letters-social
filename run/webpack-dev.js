import config from '../build/webpack.config.js'
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';

config.entry.unshift("webpack-dev-server/client?http://localhost:3000/");

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  hot: false,
  historyApiFallback: true,
  publicPath: config.output.publicPath,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }
});
server.listen(3000);