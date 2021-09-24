import autoprefixer from 'autoprefixer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

import getCustomTransformers from './webpack.ts-transformers';

interface IConfiguration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: IConfiguration = {
  devServer: {
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: '/'
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 4000,
    proxy: {
      '/api': 'http://localhost:5000'
    },
    static: {
      watch: {
        ignored: /node_modules/
      }
    }
  },
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
            getCustomTransformers
          }
        }
      },
      {
        exclude: /node_modules/,
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                includePaths: ['./src/scss'],
                indentWidth: 2
              },
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist/public'),
    publicPath: '/'
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebPackPlugin({ template: path.resolve('public/index.html') }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/icons', to: 'public/icons' },
        { from: 'public/site.webmanifest', to: 'site.webmanifest' },
        { from: 'public/browserconfig.xml', to: 'browserconfig.xml' }
      ]
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'tests', 'node_modules']
  },
  target: 'web'
};

export default config;
