# 裕语言 WASM 运行时（iyu-runtime）

在浏览器中直接运行《裕语言》（iApp）源码的 WebAssembly 运行时。
核心解释器由 C++ 编译为 WASM（`iyu-runtime.wasm`），`iyu-runtime.js` 是单文件 ESM 胶水层：负责加载 WASM、把控件渲染为 DOM、桥接事件，并暴露 `IYU` API。**零第三方库、零配置、无需 Java/Android。**

## 交付文件（共 3 个）

| 文件 | 说明 |
|---|---|
| `iyu-runtime.wasm` | C++ 编译的裕语言解释器 + 控件/事件系统 + JS 桥 |
| `iyu-runtime.js` | 单文件 ESM 胶水层（自动加载同目录的 wasm） |
| `IYU.md` | 本文档 |

## 快速开始

> 由于浏览器无法从 `file://` 加载 ES 模块与 WASM，请通过任意静态 HTTP 服务器使用（如 `python3 -m http.server`、VSCode Live Server 等）。

```html
<script type="module">
import { IYU } from './iyu-runtime.js';

await IYU.init({ host: '#app', width: 480, height: 800 });
IYU.run(`
  nvw(1, 0, "按钮", "width=-2\nheight=-2\ntext=点我")
  ssj(1, "clicki") {
    tw("你点了我")
  }
`);
</script>
<div id="app"></div>
```

多界面源码用 `#iyu` 分节指令（等同于 iApp 的多个 .iyu 文件）：

```java
syso("这是主界面（mian.iyu）")
uigo("two.iyu")

//#iyu page two.iyu
syso("第二页")
end()
```

也支持 `//#iyu layout` 分节或界面节内以 `<` 开头的布局 XML 前置块（见下文「布局 XML」）。

## IYU API

### `await IYU.init(options)`
创建运行容器（无任何默认装饰样式）并加载 WASM 引擎。

| 选项 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `host` | string\|Element | `"body"` | 容器挂载位置（选择器或元素） |
| `width` / `height` | number | 480 / 800 | 屏幕尺寸（像素） |
| `debug` | boolean | false | 显示内置日志面板（syso 输出） |
| `onLog` | fn(text) | — | syso/日志回调 |
| `onError` | fn(text) | — | 错误回调 |

### 其余 API
- `await IYU.run(source)` —— 运行裕语言源码（重复调用会先重置）
- `await IYU.runUrl(url)` —— 拉取远程 .iyu 文本并运行
- `IYU.stop()` —— 停止执行并清空界面（尽力终止：循环与挂起中的任务在下一个调度点退出）
- `IYU.on(event, fn)` —— 订阅 `"log"` / `"error"` / `"event"`（每次事件触发时收到名称与数据）
- `IYU.version` —— 当前版本号

## 语法支持（与裕语言 3.0 一致）

### 变量
```java
s a = 1          // 事件局部变量（默认 null）
ss b = "界面变量"  // 界面变量（同一界面所有事件共享，表达式里用 ss.b）
sss c = true     // 全局变量（整个应用共享，表达式里用 sss.c）
```
自动类型转换；未声明变量读取返回 `null`。变量名支持中文。

### 判断 / 循环
```java
f(a == 1) { } else f(a == 2) { } else { }
w(a > 0) { s-(1, a) }
for(1; 20) { }                    // 计数循环（含两端）
for(d; arr) { }                   // 遍历数组/列表
for(s i = 0; i < 10; i++) { }     // 三参数
```
运算符：`== != >= <= > < ?* *? ? && || !`（`?*` 开头匹配、`*?` 结尾匹配、`?` 包含）。
`break` 跳出当前块；`endcode` 结束当前事件/函数；`stop(毫秒)` 暂停（线程内不阻塞界面）。

### 线程 / 函数 / 注释
```java
t() { /* 后台线程：hs/hd/stop 等异步操作在此使用 */ }
fn mokuai.hanshu(a, b)   // 也支持不带模块名：fn add(a, b)
  sss.r = a + b
end fn
// 行注释      /. 块注释 ./      行首 . 注释
```
> 函数不返回值（与原版一致），通过 sss 传递结果；函数不共享调用者局部变量。
> 线程在启动时快照父事件局部变量（可读），跨线程共享请使用 `sss`。

### 事件局部代码 / 动态绑定
```java
ssj(控件id, "clicki") { [true] ... }   // [true] 为事件返回值（touchmonitor/press 等支持）
ssj("载入完毕事件") { ... }              // 界面级事件也用 ssj + 字符串注册
```

## 系统赋值变量（st_*）

| 事件 | 可用变量 |
|---|---|
| clicki / press / pressmenu | `st_vId` `st_vW` |
| touchmonitor | + `st_eA`(0按下/2移动/1抬起) `st_eX` `st_eY` `st_rX` `st_rY` |
| keyboard | + `st_kC` `st_eA`(0按下/1释放) |
| editormonitor | + `st_aI`(回车=1) `st_eK` |
| ontextchanged / beforetextchanged / aftertextchanged | + `st_sS`(文本) |
| focuschange | + `st_hF`(1获得/0失去) |
| clickitem | + `st_pN`(序号) `st_iD`(项目数据) |
| onpageselected / onpagescrolled | + `st_pN`（onpagescrolled 另有 `st_eX` 偏移） |
| onscroll | + `st_sE`(滚动位置) `st_fM`(1到底) |
| onscrollstatechanged / onpagescrollstatechanged | + `st_sS`("1"滚动中/"0"停止) |
| onprogresschanged | + `st_pN`(进度) |
| shouldoverrideurlloading / ondownloadstart | + `st_sS`(网址) |
| ondrawerclosed / ondraweropened | `st_vId` |
| onitemselected / onoptionsitemselected | + `st_pN`(选中序号) |
| 载入事件 | 即界面代码主体 |
| 载入完毕事件 | 界面可交互后触发（addv 的界面建议在此设置属性） |
| 菜单事件 | 用 `case 标题: ... break` / `default:` 编写，`ssj("菜单事件"){...}` 注册 |
| 按键按下/释放事件 | `st_kC` |
| 销毁界面事件 / 停止事件 / 重新开始事件 | — |
| 回调结果事件 | `st_sC` `st_lC` `st_iT`（保留） |
| 重力感应事件 | `st_x` `st_y` `st_z`（保留，浏览器暂不触发） |
| hdfl 下载器回调 | `st_drD`(序号) `st_drI`(状态) `st_drJ`(总数) |

## 控件系统

### 管理函数
- `nvw(id, 父id)` / `nvw(id, 父id, 序号)` —— 移动已有控件（父 id 为 0 表示当前界面根）
- `nvw(id, 父id, "类型", "属性串", 赋值变量)` —— 创建控件（属性串 `k=v\nk=v`）
- `uall(id, false|true, 列表)` —— 获取子控件 id 列表 / 对象列表
- `urvw(id)` —— 移除控件
- `us(id, "属性", 值, 赋值变量?)` / `ug(id, "属性", 赋值变量)` —— 写 / 读属性
- `gvs(id, 对象)` / `gvs(0, 根对象)` / `gvs(对象, id, 子对象)` / `gvs(对象, 0, 父对象)`
- `uigo("界面.iyu")` —— 跳转界面（旧界面压栈保留）；`lan(n)` 跳转动画（0/6/7/10 有效果）
- `addv(id, "a.iyu")` 或 `addv(id, "a.iyu|b.iyu", 根列表)` —— 加载界面到控件（侧滑窗体用 `|` 分左右）
- `end()` 返回上一界面；`ends()` 无操作；`endcode` 结束代码
- `utw(图标, 标题, 内容, 按钮1..3, 可否取消, 赋值变量) { } else { }` 弹窗（内容可为界面文件名）
- `endutw()` 关闭弹窗；`tws(对象, 文本, 时长, 按钮?) { }` 底部提醒条
- `ula / uls / ulag / ulas / uht` 列表与滑动窗体（见下文）

### 支持的控件类型
文本、按钮、图像、图像按钮、编辑框、线性布局、相对布局、帧布局、约束性布局、协调性布局、
卡片、滚动、水平滚动、嵌套滚动、滑动窗体、垂直滑动窗体、侧滑窗体、下拉刷新、
列表、V7列表、网格视图、单选布局、单选项、多选、下拉菜单、开关、
拖动条、进度条、日期选择、时间选择、视频、动态图、圆形图、浏览器（WebView）、
工具栏、应用栏、折叠工具栏、标签（标签布局）、文本输入布局、浮动按钮、面控件。
（英文别名 textview/button/edittext/linearlayout/… 亦可）

### 常用属性
`text`（支持 `(html)<b>..</b>` 前缀）、`hint`、`textsize`、`textcolor`、`textstyle`、`src`、
`background`（颜色 / 图片路径 / `ngde`、`nuibs` 结果）、`width`、`height`（-1 填满、-2 自适应、数值 px）、
`x`、`y`、`padding*`、`layout_margin*`、`gravity`、`layout_gravity`、`orientation`(h/v)、
`visibility`(0/4/8)、`clickable`、`enabled`、`checked`、`progress`、`max`、`url`、`currentitem`、
`refreshing`、`selection`、`gobackorforward`、`opendrawer`/`closedrawer`(start)、`singleline`、
`alpha`、`rotation`、`elevation`、`shadow`、`textcursordrawable`、`typeface` 等。

### 布局 XML
界面代码最前方可放置布局 XML（可视化编辑器格式），标签为控件类型名，支持 `id` 与全部属性，事件用属性值 `{ 代码 }`：

```xml
<线性布局 id=1 width=-1 height=-1>
  <文本 id=2 text=标题/>
  <按钮 id=3 text=确定 width=-2 height=-2 clicki={us(2,"text","已点击")}/>
</线性布局>
```

### 列表（ula / uls）
```java
ula(a, 1="标题", 2="内容", -1="隐藏数据")   // 添加一条（键=列表项模板中控件id，负数为标识）
ula(a)                                     // 刷新显示
ula(a, null)                               // 清空
uls(列表控件id, a, "item.iyu", -1, -2)      // 绑定：模板界面 + 宽高
uls(下拉菜单id, 数组)                        // 简单列表/下拉数据
ulag(控件对象, "1", b)                      // 事件中读取列表项数据（键）
ulas(控件对象, "1", 新值)                    // 更新列表项数据
```
模板界面（item.iyu）的载入事件可用 `st_vW`（项根对象）、`st_pN`（序号）做个性化；
点击列表项触发 `clickitem`（`st_pN` / `st_iD`）。

## 函数清单

### 基础
`syso(文本…)` 打印（页面日志+console）· `tw(文本, 时长?)` 提示 · `s(a+b, c)` 取整计算 · `s2` 保留2位 · `sn` 保留小数 · `ss(串…, 输出)` 拼接 · `s+ s- s* s/ s%` 自运算 · `sran(最小, 最大, 输出)` 随机 · `time(类型, 输出)`（0-5 或含 `Y m d H M S a/A` 的格式串）· `stop(毫秒)` · `endcode` · `break`

### 字符串
`sr(s, 查找, 替换, 输出)`（第4参 `true` 用正则）· `sj(s, 起, 止, 输出)`（null=到头/尾）· `ssg(s, 位, 长?, 输出)` · `slg(s, 输出)` · `strim` · `slower` · `supper` · `siof` / `slof`（可带起始位）· `sl(s, 分隔, 输出)` / `sl(s, 分隔, true, 输出)` 正则分割

### 数组与列表
`nsz(大小, 输出)` · `sgsz(数组, 序号, 输出)` · `sssz(数组, 序号, 值)` · `sgszl(数组, 输出)` ·
`aslist(列表, 数据, 序号?)` · `sslist` · `gslist` · `gslistl` · `dslist(列表, 序号|-1)` · `gslistsz` · `gslistis` · `gslistiof` · `gslistlof`

### 文件（虚拟内存 FS，会话级）
路径前缀 `%`（用户区 `/sd/`）与 `@`（资源区 `/res/`）。
`fw(路径, 内容)` · `fr(路径, 输出)` · `fd` · `fe` · `fs(大小)` · `fc` · `ft` · `fl` · `fdir` · `fi` · `fo`（触发下载）
> 文件保存在内存中，刷新页面即清空。

### 网络
- `hs(网址, 输出)` GET；`hs(网址, post数据, 编码, 输出)`（数据以 `{` 开头按 JSON 提交，否则表单）
- 扩展形式：`hs(网址, post, 编码, cookie, 自动cookie, headers("k=v||k=v"), 输出)`；超时/代理参数被忽略
- `hs("cookie", 输出)` / `hs("del cookie")` / `hs("cookie:网址", 输出)` —— 内存 Cookie 管理
- `hd(网址, 文件名, 输出)` / `hd(网址, 文件名, 是否覆盖, 输出)` → 0成功/1已存在/-1失败
- `huf(网址, 表单, 文件, 编码, 输出)` multipart 上传（文件为 FS 路径，`名字\n路径` 可指定字段名）
- `hw(网址)` 内置浏览器层打开 · `hws(网址)` 新标签页

### 数据库（IndexedDB 模拟，支持常用 SQL 子集）
```java
sqlite(sss.db, "test.db")            // 连接/创建
sqlite("test.db", "ip", b)           // 是否存在
sqlite("test.db", "del", b)          // 删除
sqlite(sss.db, "re")                 // 释放
sql(sss.db, "user", "add", "name text, age integer", b)   // 建表
sql(sss.db, "user", "ip", b) / ("del", b)                  // 表存在 / 删表
sql(sss.db, "user", "add", "name,age", "'张三',25", b)     // 插入
sql(sss.db, "user", "up", "age=26", "name='张三'", b)      // 更新（条件 null=全部）
sql(sss.db, "user", "del", "name='张三'", b)               // 删除
sql(sss.db, "user", "sele", "name,age", "age>20 order by age desc LIMIT 0,10", 游标)
sqlsele(游标, "next"/"previous"/"first"/"last"/"position", n, "getposition"/"columncount"/"count"/列号, 输出)
sql(sss.db, "select * from user where age>20", 游标)       // 原生 SQL
```
条件支持 `= != > < >= <= like` 与 `and`；支持 `order by` 与 `LIMIT 跳过,数量`。

### JSON
`json(文本, 对象)` 解析 · `json(对象, "get"/"set"/"del", 键, 值?)` · `json(对象, "json", 输出)` 序列化 ·
`json(对象, "list", 键, 列表)` · `json(列表, "size", 输出)` · `json(列表, "data", 序号, 项)`

### 正则 se
`se(文本, 正则, 标志, 输出→匹配器)` · `se(m, "find", 输出)` / `se(m, "find", 位, 输出)` · `"ms"` 整串匹配 ·
`"gl"` 组数 · `"start"/"end"/"group", n, 输出` · `"sral"/"srft", 模板("1:$1"), 输出`

### 编码
`stobm(文本, 编码, 输出)`（`true` 第4参=URL 模式）· `sutf8to(文本, 输出)` 百分号解码 ·
`otob(路径, 输出)` / `otob("utf-8", 文本, 输出)` / `otob("file"/"str", …, 输出)` 字节组（以 base64 表示）· `btoo(字节组, 路径)` / `btoo("utf-8", 字节组, 输出)`

### 动画
视图动画（配合 `us(控件, "dh", 动画)` 播放）：
`dha(输出, 开始透明?, 结束透明?)` · `dhs(输出, x1, x2, y1, y2)` · `dht(输出, x1, x2, y1, y2)` · `dhr(输出, 起, 止)` ·
`dhset(集合, 用插值器, 动画…)` · `dh(动画, "duration"/"delay"/"repeat"/"after"/"before"/"start"/"cancel"/"reset"/"add"/"running", …)` ·
`dhon(动画) { 结束 } else { 重复 } else { 开始 }` 监听
属性动画：`dhas(输出, 控件, "rotation"/"scaleX"/"translationX"/"alpha"…, 值…)` · `dhast(集合, "sequen"/"together", 动画…)`
帧动画背景：`dhb(输出, 是否循环)` · `dhb(输出, "图", 毫秒)` · `us(控件, "background", 输出)` · `dhb(输出, "start"/"stop"/"running", b?)`

### 背景
`ngde(圆角, 颜色, 输出)` · `ngde(边框宽, 颜色, 边框色, 输出)` · `ngde(边框宽, 圆角, 颜色, 边框色, 输出)` ·
`ngde(边框宽, 圆角, "色1|色2", 边框色, 方向, 输出)` 渐变（方向 topbottom/bottomtop/leftright/rightleft/trbl/brtl/bltr/TL_BR）·
`nuibs(按下, 选中, 正常, 输出)`（浏览器取“正常”态作背景，按压效果简化）

### 媒体与设备
- `bfm(路径)` 播放音频 / `bfm(路径, 播放器)` + `bfms(p, "st"/"pe"/"sp"/"re"/"ip"/"dn"/"cn"/"seekto"/"volume"/"sl", …)`
- `bfv(路径, 横屏?)` 全屏播放视频 · `bfvs(视频控件, 路径)` · `bfvss(控件, "st"/"pe"/"sp"/"seekto"/"ip"/"dn"/"cn", …)`
- `bly(对象, 路径)` 开始录音 / `bly(对象, "sp")` 停止（MediaRecorder）
- `blp(路径, 宽, 高, 码率, 帧率)` 配置录屏 / `blp("st"/"sp"/"re"/"ip", b)`（getDisplayMedia）
- `tts(对象)` / `tts(对象, 语言, 文本, 语速, 音调)` / `tts(对象, "st"/"lg"/"se"/"ph"/"sp"/"ip"/"zt"/"is"/"re", …)`（speechSynthesis）
- `uzd(对象, 毫秒|规则|"sp"|"ip")` 震动（navigator.vibrate）
- `usxq/usxh(相机对象, 面控件, 角度, 宽?, 高?, 品质?)` 开前置/后置摄像头预览
- `usx(相机对象, "shot", 路径, 角度, 是否停止)` 拍照 · `"st"/"sp"/"re"/"rotaing"/"getrotaing"` 控制
- `uqr(文本, 尺寸, 输出)` 生成二维码 → 图像对象（自实现编码器，Byte 模式 M 级）
- `ujp(路径, 品质)` 截取当前界面（SVG 序列化方案，跨域图片无法截取）
- `sbp(路径, 输出)` / `sbp(路径, x, y, w, h, 输出)` / `sbp(路径, x, y, w, h, 旋转, 输出)` 载入图像 → 图像对象
- `bfs(图像, 路径)` / `bfs(图像, 品质, 路径)` 保存 · `tzz(图像, 角度, 输出)` 旋转 · `tsf(图像, 倍数|宽, 高?, 输出)` 缩放 ·
  `tfz(图像, "x"/"y", 输出)` 反转 · `tcc(图像, "w"/"h", 输出)` 尺寸 · `tot(图像控件, 输出)` 取控件图像
- `sxb(文本)` 写剪贴板 · `shb(输出)` 读剪贴板（需浏览器授权，可能为空）
- `swh("w"/"h"/"hh"/"pxw"/"pxh"/"pxhh"/"pxztl"/"pxbvk", 输出)` 屏幕尺寸（相对运行容器）
- `sjxx(输出)` 设备信息数组（9 项：CPU 型号/频率、屏宽高/分辨率、机型/品牌/SDK）
- `zdp/zpd/zps/zsp(值, 输出)` 单位换算（1dp=1px）
- 运行时**无内置状态栏/手机框装饰**，容器即控件根节点（`uycl` 状态栏控制未实现）
- `ushsp(true/false)` 横屏/竖屏（旋转框架）· `usjxm(false)` 保持屏幕常亮（Wake Lock）
- `ftz(标题, 标签, 内容, 图标) { 点击 }` 系统通知（Notification API）
- `endkeyboard()` 收起软键盘（blur 模拟） · `simsi/simei` 返回空串
- `sit/uit/git` Intent 简化：`action=SEND` 时 `uit(a,"start")` 调用系统分享
- `cast("String"/"int"/"boolean"…, 变量, 输出?)` 类型转换 · `call(输出, "myu", "模块.函数", 参数…)` 调用模块函数
- `hsas(浏览器控件, true)` 开启交互 · `has(控件, "js代码")` 在浏览器控件中执行 JS
  （浏览器内 JS 可用 `iapp.fn('m.f("x")')`、`iapp.fn2(code, "sss.v")`、`iapp.s("sss.v", val)`、`iapp.g("sss.v")` 反向调用裕语言）
- `hdfl(目录, 输出) { 每项 } else { 全部完成 }` + `hdfla(下载器, 网址, 标识, 数据, 路径?)` 下载器 ·
  `hdda(网址, 文件名, 数据, 输出)` + `hddg/hdds` 下载项属性（状态: 2完成 -1失败）

## JS 桥（替代 java{} / cls / javax 等）

```java
s w = null
js.global("window", w)               // 获取全局对象 → 对象句柄
js.get(w, "location.href", href)     // 读属性（支持 "a.b" 路径）
js.set(w, "document.title", "新标题") // 写属性
js.global("Math", m)
js.call(m, "max", 3, 7, r)           // 调用方法 → 7
js.new("Date", d)                    // new Date()
js.call(d, "getFullYear", y)
js.eval("1+2", v)                    // 执行 JS 表达式 → 3
js.callback("onMsg", "yufn")         // 注册 window.onMsg，被调用时执行裕语言函数 yufn(参数…)
js.log("调试", 123)
js { /* 原生 JS 代码块（语句位置） */ console.log("hi"); }
```
对象以句柄传递；数字/字符串/布尔/null 自动互转。所有 Java 相关指令
（`java{} javax javanew javags javass cls clssm loadjar loadso cast`）请改用上述 js 桥。

## 与原版的差异 / 不支持清单

**已删除（Android 专属）**：`uapp` `uapplist` `uapplistgo` `uninapp` `usms`（仅日志模拟）`ucall`（仅日志模拟）、
无障碍服务（ays_service）、`res` 安装包资源、`zj` 广告组件、`loadso/loadjar`、`fuz/fuzs/fj` zip 压缩解压、
`yul` Android XML 布局、`hdduigo/hddgl`（返回空）。

**模拟实现（行为可能简化）**：
- 线程为**协作式模拟**（非真并行）：`stop`/`hs`/`hd`/`sql` 等异步点让出调度；死循环会占满调度
- 状态栏/导航条不模拟（运行时无内置状态栏），`uycl` 未实现
- TTS 依赖浏览器 speechSynthesis（音色与 Android 不同）；`tts "ft"` 转文件不支持
- Socket（`sot/sota`）仅支持**客户端 WebSocket** 语义：`sot("ws地址或host", 端口, 超时, false, b){ 收到消息 }`，
  服务端监听模式不支持；`sota` 对单连接的 `"str"/"re"/"ip"/"ht"` 可用
- 悬浮窗 `uxf` 用 DOM 绝对定位层模拟（可在框架内拖动位置由 x/y 控制）
- `uqr()` 摄像头扫码与 `uqr(图像, 输出)` 识别不支持；二维码**生成**完整支持
- `ujp` 截屏基于 SVG foreignObject，跨域图片资源会导致截取失败
- 虚拟文件系统保存在内存（会话级）；数据库存 IndexedDB（持久）
- `w`/`for` 循环无休眠空转会阻塞该任务调度（引擎每 4000 步让出，界面仍可响应其他事件）
- 事件返回值仅识别代码块首行 `[true]`/`[false]`
- 部分冷门控件属性（如 collapsecolumns、rating 高级项）为占位

**已知行为差异**：`s` 变量作用域为“当前事件/任务”（与原版事件级一致）；界面跳转后旧界面保留在返回栈（隐藏不销毁），
`end()` 逐层返回；`endcode` 在函数内仅结束函数。

## 浏览器兼容

需要支持 ES2020 与 WebAssembly 的现代浏览器（Chrome 90+ / Edge / Firefox 90+ / Safari 14.1+）。
摄像头、麦克风、通知、剪贴板、震动、传感器等能力依赖浏览器权限与 HTTPS（localhost 除外），
被拒绝时对应函数会记录日志并继续运行。
