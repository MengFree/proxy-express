# proxy-express
| 一个静态代理 Express 服务

# 文件

- `/dist` 静态页面放置位置（比如 `vue` 项目打包出的资源）
- `/dist/index.html` 默认首页入口
- `config` 项目配置 `gZip` 开关，以及 `api` 代理
- 默认开启 `/api` 代理，指向 `http://localhost:8100` 可到 `config` 修改

## 启动

```
# 开发
npm run dev
# 生产
npm run start
# 页面入口 http:// localhost:8000/index.html
```