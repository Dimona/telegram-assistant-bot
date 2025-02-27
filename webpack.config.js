const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');
// const copyPlugin = require('copy-webpack-plugin');
const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions;

const entries = slsw.lib.entries;
const isLocal = Object.keys(entries).length === 0;
const localEntry = {
  main: './src/main.ts',
};

module.exports = {
  entry: {
    ...(isLocal ? localEntry : entries),
  },
  mode: isLocal ? 'none' : 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [
      // {
      //   test: /\.ts?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      // },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.build.json' })],
    symlinks: false,
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^cloudflare:sockets$/,
    }),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/platform-express',
          'cache-manager',
          'class-validator',
          'class-transformer/storage',
          '@nestjs/websockets/socket-module',
          '@nestjs/microservices/microservices-module',
          'fastify-swagger',
          'swagger-ui-express',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()],
          });
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
    // new copyPlugin({
    //   patterns: [
    //     { from: path.resolve(__dirname, 'src/app/i18n/locales'), to: path.resolve(__dirname, 'dist/src/i18n/locales') },
    //   ],
    // }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
};
