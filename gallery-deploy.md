# gallery.html 部署说明

## 1. 配置项

请在 gallery.html 的配置区修改以下内容：

- GLOBAL_ALBUM_JSON_URL：改为你自己的 GitHub Pages / jsDelivr 地址，例如：
  https://cdn.jsdelivr.net/gh/your-name/your-repo/global-album.json
- UPLOAD_API_URL：改为你自己部署的国内上传中转接口地址

## 2. 上传流程

1. 选择图片文件（jpg/png/webp，2MB 以内）
2. 点击上传
3. 上传接口返回图片地址后，页面会把当前条目加入前端相册列表
4. 你需要把新增条目同步到 global-album.json，并提交仓库，才会全设备同步

## 3. 说明

- 不再使用 ImgBB、Cloudflare Worker、D1、R2、workers.dev
- 不再依赖 localStorage 存储相册
- 通过 global-album.json 作为全局相册数据源
