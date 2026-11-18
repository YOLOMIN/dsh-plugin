# Web 开发调试扩展（dsh-web-devtools-extension）

面向 DeepSeek Harness（DSH）桌面端的右侧栏独立浏览器调试插件。它在默认“开始”页之外新增一个“Web 开发调试”标签，保留内置浏览器与开始页不变，并允许 Agent 通过工具直接操作该内嵌网页。

English: an independent Desktop webview debug tab for DSH. It adds a separate right-sidebar tab, leaves the built-in browser and start page untouched, and lets the Agent drive the embedded page through tools.

## 功能

- 在 DSH 桌面内部创建独立网页，不启动外部 Chrome，也不占用内置浏览器。
- 地址栏导航、后退／前进、刷新；支持网页内 `window.open` 与 `target="_blank"` 链接跳转（`allowpopups`）。
- 原生坐标鼠标：移动、左／中／右键单击、双击、拖拽、滚轮，并显示指针、渐淡轨迹与点击／拖拽圆环。
- 通过 CSS 选择器读取元素尺寸与计算样式、触发点击、填写输入框（密码不在插件中落盘）。
- Agent 工具：`desktop_web_debug`（快照／打开／检查／点击／填写）与 `desktop_web_mouse`（原生鼠标）。
- 按当前 DSH 会话隔离连接，断线自动退避重连，不重放已发出的操作。

## 目录结构

| 文件 | 作用 |
|---|---|
| `package.json` | 插件清单与 `dsh` 声明（bundle patch、client 注入） |
| `cordis.patch.yml` | 插件行补丁 |
| `index.js` | Host 半部：Fetch 桥接 + Agent 工具注册 |
| `broker.js` | 会话隔离、参数校验与请求/应答 |
| `client.js` | 右侧栏界面、内嵌网页与原生鼠标 |
| `locale/zh.json`、`locale/en.json` | 显示标题与描述 |
| `icon.svg` | 插件图标 |
| `*.test.mjs` | 回归测试（`node <name>` 运行） |
| `mouse-test-server.mjs` | 开发用本机鼠标事件测试页（限时自关闭） |

## 安装

本插件按本地目录安装（DSH 以链接方式挂载，改动即时生效）：

1. 在 DSH 桌面端打开 **插件（Plugins）→ 添加插件（Add plugin）→ 本地目录**。
2. 选择本目录 `web-devtools-extension`。
3. 在右侧栏“开始”页点击 **Web 开发调试**。

也可用 DSH 的 `plugin_manager install_bundle` 传入本目录的绝对路径。

## 使用

- 顶部地址栏输入 `http(s)://…` 后回车，在桌面内部打开网页；直接用鼠标在网页上操作。
- 右上角“开发者工具”收纳选择器填写、点击、样式检查、坐标鼠标和调试结果，默认收起，不挤压网页。
- 坐标鼠标以**网页内容区左上角为原点，单位 CSS 像素**（非屏幕坐标），操作时需保持本标签可见。
- Agent 通过 `desktop_web_debug` / `desktop_web_mouse` 调用同一通道，需先在当前会话打开本标签建立连接。

## 开发与测试

```powershell
node --check client.js          # 语法
node tool-schema.test.mjs       # 工具定义严格 JSON
node broker.test.mjs            # 会话隔离与请求应答
node registration.test.mjs      # 非替换式注册
node mouse-test-server.mjs      # 启动本机测试页（打印 MOUSE_TEST_URL，20 分钟自关闭）
```

## 限制

- 仅支持 DSH 桌面端（Electron 内嵌网页）；不使用普通 iframe 作为替代。
- 目标网页若禁止被内嵌、或依赖跨站 DOM 读取，需在系统浏览器或开发者工具中处理。
- 原生鼠标需要扩展标签可见；隐藏状态会被安全校验拒绝，避免后台误点击。

## License

[MIT](../LICENSE)
