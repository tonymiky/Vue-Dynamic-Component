# YxCode系统前端

``` bash
# 项目初始化（安装项目依赖）
npm install

# 启动服务，服务URL：localhost:8080
npm run dev

# 打包生产代码
npm run build

# 打包生产代码并输出报告
npm run build --report
```

### 目录结构

```
.
├── README.md
├── dist                     // 项目build目录（打包后生产代码）
├── src                      // 生产目录
│   ├── api                  // API
│   │   ├── connector        // API请求，根据菜单把接口分类
│   │   ├── config.js        // axios/api请求配置文件，拦截器
│   │   └── index.js         // API 入口文件
│   ├── assets               // css、图片等静态资源
│   │   └── less             // less文件
│   │       ├── defined.less        // less变量的定义
│   │       └── public.less         // 全局CSS
│   ├── components              // 组件
│   │    ├── directives        // 自定义指令
│   │    ├── mixin             //全局注入
│   │    └── pages            // 业务页面
│   │
│   │
│   ├── utils                // 工具函数
│   ├── views                // 视图
│   ├── routes               // 路由配置
│   │   └── menu             // 各个菜单下的路由
│   ├── main.js              // 入口文件
│   └── App.vue             // 主页
├── .babelrc                 // babel配置
├── .eslintrc.json           // eslint配置
├── build                     // 开发环境配置目录
│   ├── webpack.base.config.js    // Webpack基础配置
│   ├── webpack.dev.config.js    // 开发环境Webpack配置文件
│   └── webpack.prod.config.js   // 生产环境Webpack 配置文件
├── config                          // 开发环境参数配置
```
