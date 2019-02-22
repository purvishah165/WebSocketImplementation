const path = require('path')
const webpack = require('webpack')
const chunksSortOption = {
  orderByList: function (list) {
    return function (chunk1, chunk2) {
      console.log(list)
      var index1 = list.indexOf(chunk1.names[0])
      var index2 = list.indexOf(chunk2.names[0])
      if (index2 == -1 || index1 < index2) {
        return -1
      }
      if (index1 == -1 || index1 > index2) {
        return 1
      }
      return 0
    }
  }
}

module.exports = {
  runtimeCompiler: true,
  lintOnSave: true,
  devServer: {
    hot: true,
    public: 'localhost:8080',
    watchOptions: {
      poll: true
    }
  },
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/' // mess up assetsDir if this is blank
    : '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(pdf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name: 'file/[name].[hash:8].[ext]'
                  }
                }
              }
            }
          ]
        }
      ]
    }
  }
}
