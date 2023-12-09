# BTC冷钱包生成器

DApp 截图：

 <img src="./public/images/cold-wallet-btc.png" align="center" style="width: 480px; height: auto;"/> 


## 项目介绍

【BTC冷钱包】用于离线保存大额比特币资产，私钥从不触网，防止资产被窃取。

【热钱包】与【冷钱包】相对应，用于日常支付，或者与外界进行频繁互动，一般会存放小额资产。当需要充钱的时候，由冷钱包进行转账。

## 编译运行

本项目只有前端，无需后端和链端。

前端使用 vscode 编写，下载项目后，需要首先安装依赖包。

### 安装：

```bash
npm install
```

### 运行：

```bash
npm run start
```

运行后，可以在浏览器中查看效果，默认链接为：[http://localhost:3000](http://localhost:3000)

### 编译：

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