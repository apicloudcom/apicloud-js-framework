#APICloud Frontend Framework

APICloud(http://www.apicloud.com) 轻量级前端框架，包括 api.js 和 api.css。

我们提供了最基础的 api.css 和 api.js 前端框架，可与第三方前端框架混用，也可不用我们的框架；api.css 处理不同平台浏览器的默认样式，api.js 提供最基础的 JavaScript 方法，所有方法在 `window.$api` 对象下。

api.js 借鉴了 Zepto.js，去掉了开发 APICloud 应用不必要的方法，做到尽可能的轻量简洁。

（更详细的文档参见[前端框架开发指南](http://docs.apicloud.com/APICloud/%E6%8A%80%E6%9C%AF%E4%B8%93%E9%A2%98/framework-dev-guide)）

#目录介绍

`/dev/` 目录是未压缩版本，`/release/` 目录为压缩版本。

#压缩代码

安装了 [Gulp](http://gulpjs.com/) 的同学，也可以自行压缩代码，运行

`
npm install
`

然后，

`
gulp
`


