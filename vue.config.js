const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	lintOnSave: false,
	chainWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			console.log('production')
      return {
        plugins: [
          new BundleAnalyzerPlugin()
        ]
      }
		}
		
		config.resolve.alias
			.set('@$', resolve('src'))
			.set('common', resolve('src/common'))
			.set('components', resolve('src/components'))


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

	},

}