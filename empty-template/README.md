# 智能合约测试模板

## 项目介绍

用于创建一个测试智能合约的空白项目，提供了两种方式：

- 1. 使用 Next.js 框架
- 2. 只使用 html 和 js

其中，只使用 html 和 js 的模板位于文件 html/index.html。

## 编译运行

如果使用 Next.js 框架编写，那么下载项目后，需要首先安装依赖包：

### 安装

```bash
npm install
```

### 运行

```bash
npm run start
```

运行后，可以在浏览器中查看效果，默认链接为：[http://localhost:3000](http://localhost:3000)

### 编译

```bash
npm run build
```

### 部署

编译后的文件位于 dist 目录中。

- 将 dist/server/pages/ 的文件，放置在 nginx root 目录下。

- 将 dist/static/ 下的文件，放置在 nginx root 目录下的 /_next/static/ 目录下。

- 将 public/images/ 下的文件，放置在 nginx root 目录下的 /images/ 目录下。


## 联系方式
微信：bkra50  Twitter: [BinSchoolApp](https://twitter.com/BinSchoolApp)