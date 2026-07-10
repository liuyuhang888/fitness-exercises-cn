# 练动库

面向中文用户的现代化健身动作数据库，基于 [Exercises Dataset](https://github.com/hasaneyldrm/exercises-dataset) 封装。包含响应式网站、GitHub Pages 静态版和原生微信小程序，收录 1,324 个动作、10 大身体部位、28 种器械及完整中文分步说明。

## 在线体验

- 正式网站：https://coding-exercises-cn.sleek-lion-5558.chatgpt.site
- GitHub Pages：仓库首次推送后由 `.github/workflows/pages.yml` 自动发布

## 功能

- 中文/英文动作名、部位、器械、目标肌群联合搜索
- 身体部位与器械组合筛选
- 中文分步动作说明和 GIF 动态示范
- 本地收藏、随机动作、渐进加载
- 桌面端、移动端和微信小程序统一视觉语言
- 1,324 条精简中文数据离线打包，小程序无需自建数据 API

## 网站开发

```bash
npm install
npm run dev
```

完整数据位于 `public/data/exercises-cn.json`。如需从上游数据重新生成：

```bash
node scripts/build-cn-data.mjs /path/to/exercises.json
```

## GitHub Pages

`docs/` 是零构建静态版本。推送到 `main` 或 `master` 后，工作流会自动发布该目录。

如首次运行提示 Pages 尚未启用，请在仓库 Settings → Pages → Build and deployment 中将 Source 设为 **GitHub Actions**。

## 微信小程序

1. 使用微信开发者工具导入仓库根目录。
2. 将 `project.config.json` 中的 `touristappid` 替换为你的小程序 AppID。
3. 在微信公众平台配置合法域名；动作图片与 GIF 当前来自 `raw.githubusercontent.com`。
4. 在开发者工具中预览、真机调试并上传审核。

小程序源码位于 `miniprogram/`，入口已在 `project.config.json` 配置。

## 数据与媒体许可

- 页面代码和数据结构采用 MIT License。
- 动作元数据及中文说明来自 Exercises Dataset，其文本与结构采用 MIT License。
- 动作图片和 GIF **不属于 MIT License**，版权归 Gym visual 所有，必须保留 `© Gym visual — https://gymvisual.com/` 署名，并遵守上游仓库 `NOTICE.md` 和 Gym visual 的独立许可条款。
- 本项目仅提供动作检索与学习参考，不构成医疗建议。

## 技术结构

```text
app/                 正式网站（React / Vinext）
docs/                GitHub Pages 静态网站
public/data/         精简中文动作数据
miniprogram/         原生微信小程序
scripts/             中文数据构建脚本
project.config.json  微信开发者工具配置
```
