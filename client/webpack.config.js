const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  mode: "production",
  stats: {
    children: true,
  },
  entry: {
    main: "./src/js/index/index.ts",
    admin: "./src/js/admin/admin.ts",
  },
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: ["**/dist", "**/node_modules","**/build"],
  },
  output: {
    filename: "[name].bundle.js",
    // publicPath: "/build/",
    path: path.join(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Uploader",
      template: "./src/index.html",
      inject: "head",
      filename: "index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      title: "admin",
      template: "./src/admin.html",
      inject: "head",
      filename: "admin.html",
      chunks: ["admin"],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
