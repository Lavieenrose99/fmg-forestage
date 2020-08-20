# Phoenix-Mount-Management
a management system for an online market


#目录结构
├── config                   # umi 配置，包含路由，构建等配置
├── mock                   
├── public
│   └── favicon.png         
├── src
│   ├── assets               # 本地静态资源
│   ├── components         
│   ├── e2e                  # 集成测试用例
│   ├── layouts              # 通用布局
│   ├── models               # 全局 dva model
│   ├── pages                # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 项目工具库如富文本编辑解析
│   ├── locales              # 国际化资源 暂时不用管
│   ├── global.less          # 全局样式
│   └── global.ts            # 全局 JS
├── tests                    # 测试工具
├── README.md
├──eslintrc.js             #代码规范化设置
└── package.json

#使用方法
git clone this project to the local environmental then you can start
npm i -g
npm run start ｜｜ 或者使用yarn 目前默认启动mock数据

#项目依赖
react 
脚手架 umi  antd pro 