let path = require("path");
module.exports = {
	publicPath:'./',
	//代理
	devServer: {
    host: '192.168.0.105',
	  proxy: {
	    '/api': {
	      target: "http://192.168.0.105:3000",
	      changeOrigin: true,
	      pathRewrite: {
	        '^/api': '/api'
	      }
	    }
	  },
	},
  transpileDependencies: [
    	/[/\\]node_modules[/\\]fun-tab[/\\]/,
        // /[/\\]node_modules[/\\]test[/\\]/, // 配置方式
        // /[/\\]node_modules[/\\][@\\]test2[/\\]test3[/\\]/,
  ],
  lintOnSave: false,
}