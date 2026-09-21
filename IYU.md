# IYU — 裕语言 WASM 运行时

**裕语言（iyu）浏览器运行时**：把《裕语言》速成开发手册 3.0 的语法、控件系统、事件系统搬进浏览器。解释器核心由 C++ 编译为 WebAssembly（Emscripten），配合一个 ESM 胶水层把控件挂载到 DOM、把裕语言函数映射到浏览器原生能力（fetch / IndexedDB / getUserMedia / Canvas / SpeechSynthesis…）。

三个文件，零配置，无任何第三方库：

| 文件 | 说明 |
|---|---|
| `iyu-runtime.wasm` | C++ 解释器（词法/语法/变量/流程/函数库/事件系统/桥协议） |
| `iyu-runtime.js` | ESM 胶水层：加载 wasm、控件→DOM、事件→DOM 事件、暴露 `IYU` API |
| `IYU.md` | 本文档 |

```html
<script type="module">
import { IYU } from './iyu-runtime.js';

await IYU.init({ host: '#app', width: 480, height: 720 });

IYU.run(`
  nvw(1, 0, "按钮", "width=-2\\nheight=-2\\ntext=点我")
  ssj(1, "clicki")
  {
  tw("你点了我")
  }
`);
</script>
```

> ⚠️ 裕语言源码放在 JS 模板字符串里时，`\n` 要写成 `\\n`；也可以把源码放 `.iyu` 文件里用 `IYU.runUrl()` 加载，就没有转义问题。

---

## 一、快速上手

### 1. 网页接入

```js
import { IYU } from './iyu-runtime.js';

// 1) 初始化（必须 await）
await IYU.init({
  host: '#app',          // 容器选择器或 DOM 元素
  width: 480,            // 画布宽（px，可省略）
  height: 720,           // 画布高（px，可省略）
  debug: 1,              // 日志级别
  onLog: (msg, isErr) => console.log(msg),
  onError: (msg) => console.error(msg),
  onEvent: (name, data) => {},
});

// 2) 运行裕语言
IYU.run('tw("你好，世界")');

// 3) 或从 URL 加载 .iyu 文件
IYU.runUrl('./main.iyu');

// 4) 停止并清空界面
IYU.stop();
```

### 2. 事件监听

```js
IYU.on('log',   (msg, isErr) => {});   // syso / 运行日志
IYU.on('error', (msg) => {});          // 编译错误 / 运行错误
IYU.on('event', (name, data) => {});   // 预留
IYU.on('state', (state) => {});        // 0=程序全部执行完毕
```

### 3. 运行环境要求

- **必须通过 HTTP(S) 服务访问**（`http://localhost` 也行），`file://` 协议无法 fetch wasm。
- 摄像头 / 录音 / 录屏 / 剪贴板 / 通知 / 屏幕常亮等能力需要浏览器授权，部分仅在 HTTPS 下可用。
- 现代浏览器：Chrome / Edge / Firefox / Safari 最新两个大版本。

---

## 二、支持什么

### 1. 语言核心（与手册一致）

| 语法 | 说明 |
|---|---|
| `s a` / `s a = 1` | 局部变量，不声明类型，自动转换；未赋值默认 null |
| `ss a = "x"` / `ss.a` | 界面变量（同一界面文件内共享） |
| `sss a = "x"` / `sss.a` | 全局变量（整个应用共享） |
| `// 注释` / `/. 块注释 ./` | 注释必须独占一行 |
| `f(条件){} else f(){} else{}` | `== != >= <= > <` `?*`(开头) `*?`(结尾) `?`(包含) `&& \|\| !`，支持单变量真值 `f(a)` |
| `w(条件){}` | 条件循环 |
| `for(1; 20){}` / `for(d; 数组){}` / `for(s i=0; i<10; i++){}` | 数值循环（含端点）/ 数组迭代 / C 风格（`++ -- += -= =`） |
| `t(){ }` | 新线程（协作式模拟，见“不支持”） |
| `fn 模块.函数(a,b) ... end fn` | 函数定义；调用同为 `fn 模块.函数(参数)`；`call(null,"myu","模块.函数",参数)` 亦可 |
| `endcode` / `break` | 结束当前代码 / 跳出代码块 |
| `stop(毫秒)` | 暂停当前线程代码 |
| `js { ... }` | 直接执行 JavaScript（替换原 `java { }`） |
| `ssj(id, "事件名"){ }` | 动态绑定控件事件 |
| `ufnsui(){ }` | UI 更新块（本运行时直接同步执行） |
| 字符串转义 | `\n` 换行、`\t`、`\"`、`\\`；`\,` 等系统符号转义；未知转义如 `\d` 原样保留（正则可用） |
| `(html)<a>...</a>` | `us(id,"text",...)` 支持 HTML 标签 |
| 中文变量名 | 支持 |

### 2. 函数库（按手册全部实现）

- **变量运算**：`s()` 整数化赋值、`s2()` 两位小数、`sn()` 全小数、`ss()` 字符串拼接、`s+ s- s* s/ s%`（二参/三参/四参）
- **字符串**：`sr` 替换（含正则模式）、`sj` 界定符截取、`sl` 分割（含正则）、`ssg` 按位截取、`slg` 长度、`strim`、`slower`、`supper`、`siof`、`slof`、`se` 正则对象（`find/ms/gl/start/end/group/sral/srft`）
- **数组**：`nsz` `sgsz` `sssz` `sgszl`
- **列表对象**：`aslist` `sslist` `gslist` `gslistl` `dslist`(-1 清空) `gslistsz` `gslistis` `gslistiof` `gslistlof`
- **编码**：`stobm`（URL 编码）、`sutf8to`（解码）、`otob` / `btoo`（字节组，文件↔字符串）
- **时间**：`time(0~5, out)`、`time("Y-m-d H:M:S", out)`（支持 `Y m d H M S a A`）；`sran(最小,最大,out)`；`stop(ms)`
- **单位**：`zdp` `zpd` `zps` `zsp`（浏览器中 dp=sp=px，1:1 换算）；`swh("w/h/hh/pxw/pxh/pxhh/pxztl/pxbvk", out)`
- **JSON**：`json(text, out)` 解析；`json(jo,"get/set/del",key[,out])`；`json(jo,"json",out)` 序列化；`json(jo,"list",key,out)`；`json(list,"size"/"data",...)`
- **颜色背景**：`ngde`（圆角/边框/渐变 → CSS）、`nuibs`（状态选择器）
- **动画**：`dha dhs dht dhr dhset dhas dhast dh dhon dhb`（CSS/WAAPI 实现）
- **文件系统**：`fd fe fs fr fc fw fl ft fdir fo fi`（虚拟内存 FS）+ `fuz fuzs fj`（ZIP 解压/压缩，走 CompressionStream）
- **网络**：`hs`（fetch，支持 post/cookie/header 各形态）、`hd` 下载（1 存在/0 成功/-1 失败）、`hw hws` 打开网页、`huf` 上传（FormData）
- **下载管理器**：`hdfl`（带回调块 `{单文件完成}else{全部完成}`）、`hdfla`、`hdd`、`hdda`、`hddgl`、`hddg`（全部属性）、`hdds`、`hdduigo`（管理器界面）
- **剪贴板**：`sxb` 写、`shb` 读（Clipboard API + 降级方案）
- **图像**：`sbp`（载入/裁剪/旋转）、`bfs` 保存、`tot`、`tzz` 旋转、`tsf` 缩放、`tfz` 反转、`tcc`（全部 Canvas）
- **音视频**：`bfm bfms`（audio）、`bfv` 全屏播放、`bfvs bfvss`（video 控件）
- **摄像头/录音/录屏/截屏**：`usxq usxh usx`（getUserMedia 预览/拍照）、`bly` 录音（MediaRecorder）、`blp` 录屏（getDisplayMedia）、`ujp` 截屏（SVG foreignObject）
- **数据库**：`sqlite`（IndexedDB 建库/判断/删除）、`sql`（建表/插入/修改/删除/查询/自定义 SQL）、`sqlsele`（光标 next/previous/first/last/position/getposition/count/columncount/按列取值）
- **通知权限**：`ftz`（Notification，带点击回调块）、`rps`（Permissions）
- **Socket**：`sot` 客户端 + `sota`（WebSocket）
- **TTS**：`tts`（SpeechSynthesis：new/zt/st/lg/se/ph/ip/sp/is/re）
- **设备**：`uzd` 震动（navigator.vibrate）、`usjxm` 屏幕常亮（Wake Lock）、`sjxx` 设备信息
- **二维码**：`uqr()` 扫描（BarcodeDetector）、`uqr(文本,尺寸,out)` 生成（内置完整 QR 编码器：RS 纠错、掩码、静区）、`uqr(图,out)` 识别
- **多语言**：`call(out,"myu","模块.函数",参数...)` 调裕语言模块、`call(out,"mjs","名",参数...)` 调 JS 回调
- **调试**：`sdeg(0/1/2)`
- **其他**：`lan` 跳转动画、`endkeyboard`（blur）、`ends`（window.blur）、`syso`（页面+console 双输出）

### 3. js 桥（替换 java 桥）

| 裕语言调用 | 作用 |
|---|---|
| `s a = js.global("document")` | 取全局对象（返回 JS 对象句柄） |
| `js.call(对象, "方法", 参数...)` | 调方法 |
| `js.new("类名", 参数...)` | new 对象 |
| `js.get(对象, "属性")` / `js.set(对象, "属性", 值)` | 读写属性 |
| `s a = js.eval("1+2")` / `js { 任意JS }` | 执行 JS 并返回结果 |
| `js.callback("名") { 裕语言代码 }` | 注册回调，供 JS 调用：`window.iyu.jsCallback('名', fn)` 后 JS 直接调 `fn(...)`，或裕语言里直接 `名(参数)` |
| `js.log(...)` | console 输出 |

### 4. 浏览器交互（裕语言 ↔ JS）

```js
// 开启浏览器控件交互
hsas(1, true)
// 裕语言调 JS（浏览器控件内）
has(1, "go('呀！')")
```

JS 侧（页面全局自动注入 `window.iapp`）：

```js
iapp.fn('a.b("参数")');              // 调用裕语言模块方法（无返回）
await iapp.fn2('a.c("x")', 'sss.abc'); // 调用后读取变量（异步返回）
iapp.s('sss.abc', 值);               // 设置变量（支持 sss./ss./裸名→全局）
iapp.g('sss.abc');                   // 读取变量
```

### 5. 控件系统（DOM 实现）

创建：`nvw(id, 父id, "类型", "key=value\nkey2=value2")`；读写：`us(id, "属性", 值)` / `ug(id, "属性", out)`；增删查：`uall` `urvw` `gvs`；界面：`addv` `uigo` `end`；弹窗 `utw endutw tw tws`；悬浮窗 `uxf`；滑动窗体控制 `uht`；工具栏 `utb`；yul 布局 `yul`；列表 `ula uls ulag ulas`。

**控件类型**（`nvw` 第 3 参，中文名）：文本、按钮、图像、图像按钮、编辑框、单选布局、单选项、多选、多选布局、下拉菜单、开关、列表、V7列表、网格视图、线性布局、相对布局、帧布局、约束性布局、标签布局、协调性布局、应用栏布局、折叠工具栏布局、工具栏布局、文本输入布局、滚动、水平滚动、滑动窗体、垂直滑动窗体、侧滑窗体、嵌套滚动、卡片、拖动条、进度条、评分条、日期选择、时间选择、视频、动态图、圆形图、浏览器、下拉刷新控件、浮动动作按钮、面控件、Toolbar。未知类型自动降级为文本控件。

**属性表**（`us`/`ug` 通用标识，对齐手册）：

| 标识 | 说明 | 标识 | 说明 |
|---|---|---|---|
| text | 内容，`(html)` 前缀走 innerHTML | hint | 占位提示 |
| src | 图像/视频源（`%本地` `@本地` `http` 均可） | url | 浏览器控件网址 / HTML 内容 |
| background | 颜色 / 图像 / ngde·nuibs 对象 | backgroundcolor | 背景色 |
| width height | `-1`=自适应 `-2`=填满 / 数值px | x y | 相对坐标 |
| paddingleft/top/right/bottom | 内边距 | layout_marginleft/top/right/bottom | 外边距 |
| visibility | true/false 或 0 可见 4 隐藏 8 不占位 | checked | 选中状态 |
| title | 工具栏标题 | selecteditem | 下拉选中值 |
| rating progress | 评分/进度 | date time | 日期/时间值 |
| currentitem | 滑动窗体页码 | isdraweropen | 侧滑状态（可带 `"start"/"end"` 参数） |
| selectionstart / selectionend / selection | 光标/选区 | cangoback / cangoforward | 浏览器历史 |
| refreshing | 下拉刷新指示 | shadow | 阴影（radius,dx,dy,color 四参） |
| backgroundripple | 点击波纹（按下变暗模拟） | textcursordrawable | 光标颜色（caret-color） |
| typeface | 字体（`@xx.ttf` 从虚拟 FS 加载） | gobackorforward | 浏览器前进后退 |
| opendrawer / closedrawer | 展开关闭侧滑 | drawerlockmode | 侧滑手势锁（记录值） |
| textcolor / textsize / textstyle | 文字色/字号/粗斜下划线 | orientation gravity layout_gravity | 排列/对齐 |
| columncolumn | 网格列数 | app_tabadd | 标签布局增加项 |
| imeoptions | 键盘动作提示 | numeric / password / phonenumber / emails | 输入类型 |
| dh | 执行动画对象 | enabled | 禁用 |

### 6. 事件系统

`ssj(id, "事件名") { }` 支持（映射 DOM 事件）：`clicki`、`touchmonitor`（pointer，`st_eA` 0/2/1=按下/移动/抬起）、`press`（长按 600ms）、`keyboard`、`pressmenu`（右键菜单）、`editormonitor`、`ontextchanged`、`beforetextchanged`、`aftertextchanged`、`focuschange`、`onscroll`、`onscrollstatechanged`、`clickitem`、`onprogresschanged`、`shouldoverrideurlloading`、`ondownloadstart`（占位）、`onpageselected`、`onpagescrolled`、`onpagescrollstatechanged`、`ondrawerclosed`、`ondraweropened`、`onoptionsitemselected`、`onitemselected`。

**界面级事件**（对 id `-1` 调 `ssj`；`main.iyu` 顶层代码即载入事件）：

```iyu
ssj(-1, "载入完毕") { syso("界面可交互") }
ssj(-1, "菜单")     { case 选择A: tw("A") break  default: tw("默认") break }
ssj(-1, "按键按下") { syso(st_kC) }
ssj(-1, "销毁界面") { }
ssj(-1, "暂停")     { }      // 页面失焦
ssj(-1, "恢复")     { }      // 页面回焦
ssj(-1, "停止")  / ssj(-1, "重新开始")  / ssj(-1, "开始")
ssj(-1, "回调结果") { }      // st_sC / st_lC / st_iT（uqr 扫描结果 st_sC==1102, st_msG=内容）
ssj(-1, "重力感应") { }      // st_x / st_y / st_z
```

**系统赋值变量**（事件代码内直接可读）：`st_vId`、`st_vW`（控件对象）、`st_eA`、`st_eX`、`st_eY`、`st_rX`、`st_rY`、`st_kC`、`st_aI`、`st_eK`、`st_eR`、`st_sS`、`st_sT`、`st_bE`、`st_cT`、`st_aR`、`st_hF`、`st_pN`、`st_iD`、`st_x`、`st_y`、`st_z`、`st_sC`、`st_lC`、`st_iT`、`st_msG`、`st_drD`、`st_drI`、`st_drJ`、`st_ssR`。事件代码首行写 `[true]` 可声明返回值（兼容解析）。

### 7. 列表系统

```iyu
// 1) 构造数据列表对象
ula(a, 1="标题一", 2="副标题一")
ula(a, 1="标题二", 2="副标题二")
// 2) 用列表项界面渲染（列表项 .iyu 的载入事件每项触发一次，st_vW=项根控件, st_pN=序号）
uls(10, a, "item.iyu", -1, -2)
// 3) 事件中取数据
ssj(10, "clickitem") { ulag(st_iD, 1, b)  tw(b) }
// 4) 修改后刷新
ulas(st_iD, 1, "新标题")
ula(a)
// 下拉菜单（简单数组）
sl("a;b;c", ";", arr)
uls(11, arr)
```

---

## 三、不支持什么（明确清单）

| 原手册能力 | 本运行时状态 |
|---|---|
| `uapp / uapplist / uapplistgo / uninapp` | ❌ 调用输出日志并忽略 |
| `usms / ucall` | ❌ 仅输出日志（与手册“测试时仅日志”一致） |
| `uycl / ushsp` 状态栏与横竖屏 | ❌ 无状态栏概念；横屏可用 CSS 自行处理 |
| `simsi / simei` | ❌ 浏览器无此标识 |
| `sit / uit / git` Intent | ❌ 不支持（uqr 扫描结果改由 `st_msG` 传递） |
| `res` 安装包资源 / `zj` 组件(广告SDK) | ❌ |
| 无障碍服务 | ❌ |
| `loadso / loadjar / cls / clssm / java / javax / javanew / javags / javass / javacb / cast / usg` | ❌ 已按规格删除（java 桥由 `js.*` 取代）；闪光灯无 Web API |
| 悬浮窗 | ⚠️ `position:fixed` DOM 模拟，非系统级悬浮窗 |
| 文件系统 | ⚠️ 虚拟内存 FS（页面刷新即失；无真实 SD 卡） |
| 线程 | ⚠️ 协作式 async 模拟（`t(){}` 不阻塞界面；纯计算死循环会持续占片但页面不卡死） |
| TTS | ⚠️ 效果取决于浏览器 SpeechSynthesis 音源；`tts(a,"ft",...)` 转音频文件不支持 |
| Socket | ⚠️ 仅 WebSocket 客户端（`sot` 服务端监听形态不支持） |
| 摄像头/录音/录屏 | ⚠️ 需用户授权；录屏格式为 webm（非 mp4/amr） |
| 屏幕常亮 | ⚠️ 需浏览器支持 Screen Wake Lock |
| 二维码识别 | ⚠️ 需浏览器支持 BarcodeDetector（生成不受限） |
| `ujp` 截屏 | ⚠️ SVG foreignObject 实现，跨域图片/复杂样式可能缺失 |
| `hd` 下载 | ⚠️ 无法设置 User-Agent/Cookie 跨域头（浏览器安全策略），同域请求支持 |
| `utw` 弹界面文件 | ⚠️ 弹窗内容仅支持文本/HTML |
| 列表项界面 | ⚠️ 每项全量渲染（无虚拟滚动） |
| yul 布局 | ⚠️ 支持常用 android 属性子集（id/宽高/text/src/颜色/内边距/orientation/gravity 等） |
| `time(4)` | ⚠️ 返回毫秒时间戳（原版为专有格式） |
| `s-` / `s/` / `s%` 二参形式 | ⚠️ 严格按手册示例实现：`s-(5,a)`→`5-a`、`s/(8,a)`→`8/a`、`s%(5,a)`→`a%5` |
| 界面文件事件格式 | ℹ️ 手册未定义 .iyu 界面文件格式：本运行时约定 **顶层代码=载入事件**，界面级事件用 `ssj(-1,"事件名"){}` 注册；控件在载入事件里用 `nvw(id, 0, ...)` 创建（父 id 0=界面根） |

---

## 四、IYU API 文档（JS 侧）

```ts
export const IYU: {
  version: string;
  init(options?: {
    host?: string | Element;        // 容器，默认 #app，缺省挂到 body
    width?: number | string;        // 画布宽
    height?: number | string;       // 画布高
    debug?: number;                 // 0 静默 / 1 错误 / 2 全部
    onLog?: (msg: string, isErr: boolean) => void;
    onError?: (msg: string) => void;
    onEvent?: (name: string, data?: unknown) => void;
  }): Promise<void>;
  run(source: string): Promise<boolean>;   // 运行源码（编译失败抛错）
  runUrl(url: string): Promise<boolean>;   // 加载 .iyu 并运行
  stop(): void;                            // 停止 + 清空界面
  on(event: 'log' | 'error' | 'event' | 'state', fn: (a, b?) => void): IYU;
  fire(event: string, data?: unknown): void;
  jsCallback(name: string, fn: Function): void;  // 注册 JS 回调，裕语言直接 `名(参数)` 调用
};
export default IYU;
```

---

## 五、裕语言函数速查

**赋值/运算**：`s(表达式, 存入)` 取整赋值 · `s2(表达式, 存入)` 两位小数 · `sn` 全小数 · `ss(表达式, 存入)` 字符串拼接 · `s+(x, a)` a+x · `s-(x, a)` x-a · `s*(x, a)` a*x · `s/(x, a)` x÷a · `s%(x, a)` a%x · 三参 `s+(2,5,a)` a=2+5 · 四参带 true 保留小数

**字符串**：`sr(源, 旧, 新, 存入[, true=正则])` · `sj(源, 前界定, 后界定, 存入)` null=到端 · `sl(源, 分隔, 存入[, true=正则])` · `ssg(源, 起[, 长], 存入)` · `slg(源, 存入)` · `strim` · `slower` · `supper` · `siof(源, 找[, 起], 存入)` · `slof` · `se(源, 正则, 标志, 存入)` → `se(对象, "find/ms/gl/start/end/group", ...)` · `se(对象, "sral"/"srft", 替换串, 存入)`

**数组/列表**：`nsz(数量, 存入[, "类型"])` · `sgsz(数组, 序号, 存入)` · `sssz(数组, 序号, 值)` · `sgszl(数组, 存入)` · `aslist(列表, 值[, 序号])` · `sslist(列表, 序号, 值)` · `gslist(列表, 序号, 存入)` · `gslistl(列表, 存入)` · `dslist(列表, 序号|-1)` · `gslistsz(列表, 存入)` · `gslistis(列表, 值, 存入)` · `gslistiof / gslistlof`

**编码**：`stobm(文本, "utf-8"[, true=网址], 存入)` · `sutf8to(文本[, "utf-8", true], 存入)` · `otob("%文件", 存入)` · `otob("utf-8", 文本, 存入)` · `btoo(字节组, "%路径")` · `btoo("utf-8", 字节组, 存入)`

**时间/随机**：`time(0~5, 存入)` 或 `time("Y年m月d日 H:M:S", 存入)` · `sran(最小, 最大, 存入)` · `stop(毫秒)`

**文件**（`%` 前缀 = 根目录）：`fd` 删 · `fe` 存在 · `fs` 大小 · `fr(路径[, 编码], 存入)` · `fw(路径, 内容[, 编码])` · `fc(源, 目标[, 是否覆盖], 存入)` · `ft(源, 目标, 存入)` · `fl(目录[, true=仅目录/false=仅文件], 存入)` · `fdir(存入)` / `fdir("%目录", 存入绝对路径)` · `fo(路径)` 打开 · `fi(路径, 存入)` 是否目录 · `fuz(zip, 条目, 目标[, 覆盖], 存入数量)` · `fuzs(zip, 目标目录[, 覆盖], 存入)` · `fj(源, zip路径[, false=保留根], 存入)`

**网络**：`hs(网址, 存入)` · `hs(网址, post数据, 编码, 存入)` · `hs(网址, post, 编码, cookie, 自动cookie, 存入)` · `hs(网址, post, 编码, cookie, 自动, header, 存入)`（header 多条 `||` 隔开）· `hs("cookie", 存入)` / `hs("del cookie")` · `hd(网址, 路径[, 覆盖, post, 编码, cookie, 自动, header], 存入)` · `hw(网址)` / `hws(网址)` · `huf(接口, 表单, 文件, 编码[, header], 存入)`（文件 `"name\n%路径|..."` 多文件 `|` 隔开）

**下载**：`hdfl(保存目录, 对象){单文件完成块}else{全部完成块}` / `hdfl(临时目录, 保存目录, 对象){...}` · `hdfla(对象, 网址, 标识, 数据[, 保存路径])` · `hdd(临时目录, 保存目录, 并发, 线程, 重试, 超时, 通知)` · `hdda(网址, 文件名, 数据, 存入)` 等四种形态 · `hddgl(存入)` · `hddg(项, 属性, 存入)`（id/url/dirfilename/dir/filename/contentlength/equivalent/downloadspeed/downloadpercentage/status/notificationshow/text/title/icon）· `hdds(项, 属性, 值)` · `hdduigo()`

**图像**：`sbp("%图", 存入)` / `sbp("%图", x, y, 宽, 高, 存入)` / `sbp("%图", x, y, 宽, 高, 旋转, 存入)` · `bfs(图, "%路径"[, 质量])` · `tot(控件id, 存入)` · `tzz(图, 角度, 存入)` · `tsf(图, 倍数, 存入)` / `tsf(图, 宽, 高, 存入)` · `tfz(图, "x"|"y", 存入)` · `tcc(图, "w"|"h", 存入)`

**音视频**：`bfm("%音频"[, 对象])` · `bfms(对象, "st/pe/sp/re/seekto/sl/volume")` · `bfms(对象, "ip/dn/cn", 存入)` · `bfv("%视频"[, 横屏])` · `bfvs(控件, "%视频")` · `bfvss(控件, "st/pe/sp/seekto/media")` · `bfvss(控件, "ip/dn/cn", 存入)`

**摄像头/录音/录屏**：`usxq(对象, 面控件id, 角度[, 宽, 高, 质量])` 前置 · `usxh(...)` 后置 · `usx(对象, "shot", "%路径", 角度, 是否停预览)` · `usx(对象, "st/sp/re/rotaing/getrotaing", ...)` · `bly(对象, "%路径")` 开始 / `bly(对象, "sp")` 停止 · `blp("%路径", 宽, 高, 码率, 帧率)` + `blp("st/sp/re/ip", 存入)` · `ujp("%路径", 质量)`

**数据库**：`sqlite(对象, "库名.db")` · `sqlite("库名.db", "ip"/"del", 存入)` · `sqlite(对象, "re")` · `sql(对象, 表, "add", 列定义, 存入)` 建表 · `sql(对象, 表, "ip"/"del", 存入)` · `sql(对象, 表, "add", 列, 值, 存入)` 插入 · `sql(对象, 表, "up", "a=1,b=2", 条件, 存入)` · `sql(对象, 表, "del", 条件, 存入)` · `sql(对象, 表, "sele", 列, 条件, 存入光标)` · `sql(对象, 自定义sql[, 存入])` · `sqlsele(光标, "next/previous/first/last/position/getposition/count/columncount"[, 参数], 存入)` · `sqlsele(光标, 列序号, 存入)`（条件支持 `= != > < >= <= like` + `and/or` + `order by 列 [asc|desc]` + `LIMIT 跳过,数量`）

**其他**：`ftz(标题1, 标题2, 内容[, 图标]){点击块}` · `rps()` / `rps(权限)` / `rps(存入, 权限)` · `uqr()` 扫描（结果走回调结果事件 st_sC==1102, st_msG=内容）· `uqr(文本, 尺寸, 存入图)` · `uqr(图或路径, 存入文本)` · `uzd(对象, 毫秒)` / `uzd(对象, "100 500 100", false)` / `uzd(对象, "sp")` / `uzd(对象, "ip", 存入)` · `usjxm(false)` 不休眠 / `usjxm(true)` 恢复 · `sjxx(存入)` 7 元素数组 · `tts(对象)` / `tts(对象, 语言, 文本, 语速, 音高)` / `tts(对象, "zt/st/ft/lg/se/ph/ip/sp/is/re", ...)` · `sot("ws://主机", 端口, 超时, 覆盖, 存入){消息块 st_msG}` · `sot(对象, "str/file/bt/re/ip/id/list/size/new/sl", ...)` · `sota(连接, "ht/ip/re/socket/id/str/file/bt", ...)` · `call(存入, "myu"|"mjs", "模块.函数", 参数...)` · `sdeg(0/1/2)` · `endkeyboard()` · `ends()` · `lan(0~11)` · `swh(类型, 存入)` · `zdp/zpd/zps/zsp(值, 存入)` · `syso(...)`

**弹窗**：`tw(文本[, 1 长显])` · `tws(控件或null, 文本, 时长[, 按钮]){点击块}` · `utw(图标, 标题, 内容, 按钮1[, 按钮2[, 按钮3]], 可否取消, 存入){块1}else{块2}else{块3}`（按钮 0~3 个时省略对应参数）· `endutw()`

**动画**：`dha(dh, 起透明, 止透明)` · `dhs(dh, x起, x止, y起, y止[, 位置类型, x基准, 位置类型, y基准])` · `dht(dh, x起, x止, y起, y止)` · `dhr(dh, 起角, 止角[, ...基准])` · `dhset(集合, 是否共享插值, dh...)` · `dhas(dh, 控件id, "rotation/rotationX/rotationY/scaleX/scaleY/translationX/translationY/alpha", 值...)` · `dhast(集合, "sequen"/"together", dh...)` · `dh(dh, "duration/delay/repeat/enabled/after/before/add/target/clone/cancel/reset/running/start", ...)` · `dhon(dh){结束块}else{重复块}else{启动块}}` · `dhb(dh, 是否循环)` + `dhb(dh, 图像, 毫秒)` + `dhb(dh, "start/stop/running")`

**控件/界面**：`nvw(id, 父id[, 序号])` 移动 · `nvw(id, 父id, "类型", "属性串"[, 存入])` 创建（父 id 0=当前界面根）· `ug(id, "属性"[, 参数], 存入)` · `us(id, "属性", 值[, 存入])` · `urvw(id)` · `uall(id, false=ids/true=对象, 存入)` · `gvs(id, 存入)` / `gvs(0, 存入根)` / `gvs(对象, 子id, 存入)` / `gvs(对象, 0, 存入父)` · `addv(控件id, "a.iyu"|"a.iyu|b.iyu"[, 存入根列表])` · `uigo("a.iyu"[, 标志])` · `end()` · `uxf("a.iyu", 宽, 高, 对齐, 存入)` / `uxf(对象)` 刷新 / `uxf(对象, "del")` / `uxf(对象, "set", x, y, 宽, 高, 对齐)` · `uht(控件, "add",-1,"标题","a.iyu",1="x",...)` / `"del"/"title"/"size"/"close"/"bd"` · `utb(id)` / `utb(id, 侧滑id)` / `utb("set","title/subtitle/dshe/dste/leftck",值)` / `utb("left"/"right", id, 图)` / `utb("get", 属性, 存入)` · `yul(控件id, "a.yul")` / `yul("a.yul", 存入)` · `ula / uls / ulag / ulas` 见列表系统 · `hsas(浏览器id, true)` · `has(浏览器id, "js代码")`

---

## 六、实现说明（与原版 iApp 的差异）

1. **架构**：裕语言源码 → C++（wasm 内）词法/语法分析 → AST → 协作式 fiber 调度执行；控件/浏览器能力通过 JSON 桥协议调 JS 胶水层。同步操作（控件、虚拟 FS）立即返回；异步操作（fetch/摄像头/IndexedDB/ZIP）挂起当前 fiber，完成后恢复。
2. **界面文件**：`uigo`/`addv` 加载的 `.iyu` 是纯裕语言代码：顶层即载入事件，控件用 `nvw(..., 0, ...)` 挂到界面根；界面级事件用 `ssj(-1, "事件名"){}`。
3. **类型**：值只有 null/数字/字符串/布尔/对象。`+` 两侧均可解析为数字且至少一侧为数字时做加法，否则字符串拼接（与手册 `ss()` 用例一致）。
4. **`ug`/`us` 对象**：`gvs`/事件返回的控件对象可直接传给 `ug/us/urvw/uall/gvs/addv`；`st_vW` 即控件对象。
5. **性能**：语句分片调度（防卡死）；列表全量渲染；大 JSON/正则走浏览器原生。
6. **安全**：`js { }` 与 `js.eval` 在宿主页面执行任意 JS —— 请只运行可信的裕语言代码。浏览器控件为 sandbox iframe（srcdoc），`hsas` 开启后注入 `window.iapp`。

## 七、版本

- IYU 运行时 1.0.0 · 裕语言 3.0 语法子集 · 构建：Emscripten `-sMODULARIZE=1 -sEXPORT_ES6=1 -sFILESYSTEM=0 -sALLOW_MEMORY_GROWTH=1 -Oz`
