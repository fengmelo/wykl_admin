const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')

var path = require('path')

// const HappyPack = require('happypack');
// const os = require('os');
// const happyThreadPool = HappyPack.ThreadPool({
// 	size: os.cpus().length
// });



function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	lintOnSave: false,
	publicPath: '/',
	outputDir: 'dist',
	assetsDir: 'static',
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			return {
				plugins: [
					new webpack.DllReferencePlugin({
						context: process.cwd(),
						manifest: require('./public/vendor/vendor-manifest.json')
					}),
					// 将 dll 注入到 生成的 html 模板中
					new AddAssetHtmlPlugin({
						// dll文件位置
						filepath: path.resolve(__dirname, './public/vendor/*.js'),
						// dll 引用路径
						publicPath: './vendor',
						// dll最终输出的目录
						outputPath: './vendor'
					}),


					//new BundleAnalyzerPlugin(),
					// new HappyPack({
					// 	//用id来标识 happypack处理那里类文件
					// 	id: 'happyBabel',
					// 	//如何处理  用法和loader 的配置一样
					// 	loaders: [{
					// 		loader: 'babel-loader?cacheDirectory=true',
					// 	}],
					// 	//共享进程池
					// 	threadPool: happyThreadPool,
					// 	//允许 HappyPack 输出日志
					// 	verbose: true
					// })



				]
			}
			// return {
			// 	plugins: [
			// 		new BundleAnalyzerPlugin()
			// 	]
			// }
		}
	},
	chainWebpack: config => {
		config.plugins.delete('preload') // TODO: need test
		config.plugins.delete('prefetch') // TODO: need test

		config.resolve.alias
			.set('@$', resolve('src'))
			.set('common', resolve('src/common'))
			.set('components', resolve('src/components'))

		// config.module
		// .rule('js')
		// .test(/\.js$/)
		// .exclude.add(/node_modules/)
		// .use('happypack/loader?id=happyBabel')
		// .loader('happypack/loader?id=happyBabel')
		// .end()
		// set svg-sprite-loader
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()

		config
			.when(process.env.NODE_ENV === 'development',
				config => config.devtool('cheap-source-map')
			)
	}

}