import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import historyApiFallback from 'connect-history-api-fallback';
import browserSync from 'browser-sync';
import config from '../build/webpack.config.js';

//Genero un webpack compiler : https://webpack.js.org/api/node/#compiler-instance
//https://webpack.js.org/configuration/
const bundler = webpack(config);

// Run Browsersync and use middleware for Hot Module Replacement
browserSync({
  open: false,
  server: {  //https://browsersync.io/docs/options#option-server
    baseDir: 'src',
    middleware: [  //https://browsersync.io/docs/options#option-middleware
      historyApiFallback(),
      webpackDevMiddleware(bundler, {//https://github.com/webpack/webpack-dev-middleware#what-is-it
        hot: true,
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
        },
      }),
      // same bundler for both
      webpackHotMiddleware(bundler),
    ],
  },

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'src/*.ejs',
  ],
});
