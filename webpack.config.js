'use strict';

const { resolve, join } = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtraneousFileCleanupPlugin = require('webpack-extraneous-file-cleanup-plugin');

const pluginConfigs = {
  stylelint: {
    context: './src',
    failOnError: true
  },

  copyfiles: [
    {
      from: resolve(`src/scss/library/*.scss`),
      to: join(__dirname, 'dist/scss'),
      flatten: true
    }
  ],

  minicss: "[name].css",

  htmlplugin: {
    template: 'src/demo/index.html'
  },

  filecleanup: {
    extensions: ['.js'],
    paths: ['/']
  }
};

const commonConfig = merge([
  {
    entry: {
     'kemet.layout': './src/scss/kemet.layout.scss',
     'kemet.components': './src/scss/kemet.components.scss',
     'kemet.utilities': './src/scss/kemet.utilities.scss'
    },

    output: {
      path: join(__dirname, 'dist'),
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {sourceMap: true}
            },
            {
              loader: "postcss-loader",
              options: {sourceMap: true}
            },
            {
              loader: "sass-loader",
              options: {sourceMap: true}
            }
          ]

        }
      ]
    }
  }
]);

const developmentConfig = merge([
  {
    devtool: 'cheap-module-source-map',
    plugins: [
      new CopyWebpackPlugin(pluginConfigs.copyfiles),
      new StyleLintPlugin(pluginConfigs.stylelint),
      new MiniCssExtractPlugin(pluginConfigs.minicss),
      new HtmlWebpackPlugin(pluginConfigs.htmlplugin),
      new ExtraneousFileCleanupPlugin(pluginConfigs.filecleanup)
    ],
    devServer: {
      contentBase: join(__dirname, 'dist'),
      port: 9000,
      hot: true
    }
  }
]);

module.exports = mode => {
  return merge(commonConfig, developmentConfig, { mode });
};
