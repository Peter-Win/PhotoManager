const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/',
		filename: 'res/bundle.js'
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx']
	},
	module: {
		rules: [
			{test: /\.(ts|tsx)$/, use: 'ts-loader' },
			{test: /\.css$/, use: ['style-loader', 'css-loader']},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'src/template.ejs')
		}),
		new CopyPlugin([
			{from: 'src/resources/favicon.ico', to: '', toType: 'dir'},
		]),
	],
	devServer: {
		port: 3001,
		contentBase: path.join(__dirname, 'dist'),
		// proxy: {
		// 	'/rest': 'http://localhost:3000'
		// }
	}
};