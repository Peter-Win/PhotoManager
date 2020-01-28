const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js'
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
		})
	]
};