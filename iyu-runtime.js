// ============================================================================
// iyu-runtime.js —— 裕语言 3.0 浏览器 WASM 运行时（单文件 ESM 胶水层）
// 自动加载同目录下的 iyu-runtime.wasm。用法：
//   import { IYU } from './iyu-runtime.js';
//   await IYU.init({ host: '#app', width: 480, height: 800 });
//   IYU.run(`...裕语言源码...`);
// ============================================================================
async function YuruCreateModule(moduleArg={}){var Module=moduleArg;var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var programArgs=[];var thisProgram="./this.program";var _scriptName=import.meta.url;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href}catch{}{readAsync=async url=>{var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=console.log.bind(console);var err=console.error.bind(console);var wasmBinary;var ABORT=false;class EmscriptenEH{}class EmscriptenSjLj extends EmscriptenEH{}var runtimeInitialized=false;function getMemoryBuffer(){return wasmMemory.buffer}function updateMemoryViews(){if(HEAP8?.buffer?.resizable)return;var b=getMemoryBuffer();HEAP8=new Int8Array(b);HEAPU8=new Uint8Array(b);HEAPU32=new Uint32Array(b)}function preRun(){var preRun=Module["preRun"];if(preRun){if(typeof preRun=="function")preRun=[preRun];onPreRuns.push(...preRun)}callRuntimeCallbacks(onPreRuns)}function initRuntime(){runtimeInitialized=true;wasmExports["u"]()}function postRun(){var postRun=Module["postRun"];if(postRun){if(typeof postRun=="function")postRun=[postRun];onPostRuns.push(...postRun)}callRuntimeCallbacks(onPostRuns)}function abort(what){Module["onAbort"]?.(what);what=`Aborted(${what})`;err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var wasmBinaryFile;function findWasmBinary(){if(Module["locateFile"]){return locateFile("iyu-runtime.wasm")}return new URL("iyu-runtime.wasm",import.meta.url).href}function getBinarySync(file){if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){var imports={a:wasmImports};return imports}async function createWasm(){function receiveInstance(instance){wasmExports=instance.exports;assignWasmExports(wasmExports);updateMemoryViews();return wasmExports}function receiveInstantiationResult(result){return receiveInstance(result["instance"])}var info=getWasmImports();var instantiateWasm=Module["instantiateWasm"];if(instantiateWasm){return new Promise(resolve=>{instantiateWasm(info,inst=>resolve(receiveInstance(inst)))})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var HEAP8;var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var onPostRuns=[];var onPreRuns=[];var noExitRuntime=true;var HEAPU32;class ExceptionInfo{constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[this.ptr+4>>2]=type}get_type(){return HEAPU32[this.ptr+4>>2]}set_destructor(destructor){HEAPU32[this.ptr+8>>2]=destructor}get_destructor(){return HEAPU32[this.ptr+8>>2]}set_caught(caught){caught=caught?1:0;HEAP8[this.ptr+12]=caught}get_caught(){return HEAP8[this.ptr+12]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13]=rethrown}get_rethrown(){return HEAP8[this.ptr+13]!=0}init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[this.ptr+16>>2]}}var uncaughtExceptionCount=0;var __Unwind_RaiseException=ex=>{abort()};var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);info.init(type,destructor);uncaughtExceptionCount++;__Unwind_RaiseException(ptr)};var __abort_js=()=>abort("");var getHeapMax=()=>2147483648;var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var growMemory=size=>{var oldHeapSize=wasmMemory.buffer.byteLength;var pages=(size-oldHeapSize+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var HEAPU8;var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};var UTF8Decoder=new TextDecoder;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;if(ignoreNul)return maxIdx;while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>{if(!ptr)return"";var end=findStringEnd(HEAPU8,ptr,maxBytesToRead,ignoreNul);return UTF8Decoder.decode(HEAPU8.subarray(ptr,end))};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;i++}}heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};{if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["arguments"])programArgs=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];var preInit=Module["preInit"];if(preInit){if(typeof preInit=="function")Module["preInit"]=preInit=[preInit];while(preInit.length>0){preInit.shift()()}}}Module["UTF8ToString"]=UTF8ToString;Module["stringToUTF8"]=stringToUTF8;Module["lengthBytesUTF8"]=lengthBytesUTF8;function js_log(level,msg){const s=UTF8ToString(msg);if(level===0)console.log("%c[iyu] "+s,"color:#0a7d32");else console.error("[iyu错误] "+s);if(Module["_iyuOnLog"])Module["_iyuOnLog"](level,s)}function js_widget_create(id,parent,type,props,index){return Module["_iyuHost"].widgetCreate(id,parent,UTF8ToString(type),UTF8ToString(props),index)}function js_widget_remove(id){Module["_iyuHost"].widgetRemove(id)}function js_widget_set(id,k,v){return Module["_iyuHost"].widgetSet(id,UTF8ToString(k),UTF8ToString(v))?1:0}function js_widget_bind(id,ev,snip,retDefault){Module["_iyuHost"].widgetBind(id,UTF8ToString(ev),snip,retDefault!==0)}function js_toast(msg,dur){Module["_iyuHost"].toast(UTF8ToString(msg),dur)}function js_dialog(json){return Module["_iyuHost"].dialog(JSON.parse(UTF8ToString(json)))}function js_close_dialog(){Module["_iyuHost"].closeDialog()}function js_open_url(url,external){Module["_iyuHost"].openUrl(UTF8ToString(url),external!==0)}function js_async_op(taskId,op,args){Module["_iyuHost"].asyncOp(taskId,UTF8ToString(op),UTF8ToString(args))}function js_bridge_sync_raw(op,args){const r=Module["_iyuHost"].bridgeSync(UTF8ToString(op),UTF8ToString(args));const s=r===undefined||r===null?"{}":JSON.stringify(r);const len=lengthBytesUTF8(s)+1;const p=_malloc(len);stringToUTF8(s,p,len);return p}function js_now_ms(){return Date.now()}function js_iface_loaded(inst){Module["_iyuHost"].ifaceLoaded(inst)}function js_iface_destroyed(inst,keepHost){Module["_iyuHost"].ifaceDestroyed(inst,keepHost!==0)}function js_clear_all(){Module["_iyuHost"].clearAll()}function js_event_result(taskId,v){Module["_iyuHost"].eventResult(taskId,UTF8ToString(v))}var _free,_iyu_load,_iyu_pump,_iyu_last_error,_iyu_async_done,_iyu_fire_ctrl,_iyu_fire_ctrl_ret,_iyu_fire_iface,_iyu_utw_btn,_iyu_anim_event,_iyu_list_item,_iyu_ifn,_iyu_ifn2,_iyu_iset,_iyu_js_cb,_iyu_dl_done,_iyu_sock_msg,_iyu_reset,_iyu_version,_malloc,memory,__indirect_function_table,wasmMemory;function assignWasmExports(wasmExports){_free=Module["_free"]=wasmExports["v"];_iyu_load=Module["_iyu_load"]=wasmExports["w"];_iyu_pump=Module["_iyu_pump"]=wasmExports["x"];_iyu_last_error=Module["_iyu_last_error"]=wasmExports["y"];_iyu_async_done=Module["_iyu_async_done"]=wasmExports["z"];_iyu_fire_ctrl=Module["_iyu_fire_ctrl"]=wasmExports["A"];_iyu_fire_ctrl_ret=Module["_iyu_fire_ctrl_ret"]=wasmExports["B"];_iyu_fire_iface=Module["_iyu_fire_iface"]=wasmExports["C"];_iyu_utw_btn=Module["_iyu_utw_btn"]=wasmExports["D"];_iyu_anim_event=Module["_iyu_anim_event"]=wasmExports["E"];_iyu_list_item=Module["_iyu_list_item"]=wasmExports["F"];_iyu_ifn=Module["_iyu_ifn"]=wasmExports["G"];_iyu_ifn2=Module["_iyu_ifn2"]=wasmExports["H"];_iyu_iset=Module["_iyu_iset"]=wasmExports["I"];_iyu_js_cb=Module["_iyu_js_cb"]=wasmExports["J"];_iyu_dl_done=Module["_iyu_dl_done"]=wasmExports["K"];_iyu_sock_msg=Module["_iyu_sock_msg"]=wasmExports["L"];_iyu_reset=Module["_iyu_reset"]=wasmExports["M"];_iyu_version=Module["_iyu_version"]=wasmExports["N"];_malloc=Module["_malloc"]=wasmExports["O"];memory=wasmMemory=wasmExports["t"];__indirect_function_table=wasmExports["__indirect_function_table"]}var wasmImports={d:___cxa_throw,n:__abort_js,m:_emscripten_resize_heap,q:js_async_op,i:js_bridge_sync_raw,p:js_clear_all,e:js_close_dialog,f:js_dialog,o:js_event_result,b:js_iface_destroyed,c:js_iface_loaded,s:js_log,a:js_now_ms,r:js_open_url,g:js_toast,h:js_widget_bind,l:js_widget_create,k:js_widget_remove,j:js_widget_set};async function run(){preRun();var setStatus=Module["setStatus"];if(setStatus){setStatus("Running...");await new Promise(resolve=>setTimeout(resolve,1));setTimeout(setStatus,1,"")}if(ABORT)return;initRuntime();Module["onRuntimeInitialized"]?.();postRun()}var wasmExports;wasmExports=await createWasm();await run();
;return Module}

const YuruCreateModuleRef = YuruCreateModule;
// ============================================================================
// 裕语言 WASM 运行时 —— JS 宿主层（DOM 控件系统 / 事件桥接 / Web 能力实现）
// ============================================================================

const IYU_VERSION = "3.0.0-wasm";
const IYUHost = {
    log: null, widgetCreate: null, widgetRemove: null, widgetSet: null,
    widgetGet: null, widgetBind: null, toast: null, dialog: null,
    closeDialog: null, openUrl: null, asyncOp: null, bridgeSync: null,
    ifaceLoaded: null, ifaceDestroyed: null, setAnim: null, clearAll: null,
    eventResult: null
};

// ---------------- 全局状态 ----------------
let __M = null;                       // emscripten Module
let __opts = {
    host: "body", width: 480, height: 800, debug: false,
    onLog: null, onError: null, onEvent: null
};
let __frame = null;                   // 手机框架
let __screen = null;                  // 屏幕区域
let __statusBar = null;
let __ctrlSeq = 500000;
const __ctrls = new Map();            // ctrlId -> {el, type, props, parent, kids, inst, obj}
const __instEls = new Map();          // inst -> 容器元素
const __imgs = new Map();             // 图像句柄 -> {url,b64,w,h}
const __jsObjs = new Map();           // JS 对象句柄
const __matchers = new Map();         // se 正则匹配器
const __audio = new Map();            // 播放器
const __listeners = { log: [], error: [], event: [] };
let __dialogLayer = null, __toastLayer = null, __menuLayer = null, __uxfLayer = null;
let __consoleEl = null;
let __camStreams = new Map();         // camId -> stream
const __recs = new Map();             // 录音机
let __scrRec = null;
const __fs = new Map();               // 虚拟内存文件系统 path -> {data, b64, dir}
const __animListen = new Set();       // 监听动画结束的 animId
const __pagerTitles = new Map();

function __uid() { return ++__ctrlSeq; }

function __emit(ev, ...args) {
    for (const fn of (__listeners[ev] || [])) { try { fn(...args); } catch (e) { console.error(e); } }
}

function __log(level, s) {
    if (level === 0) console.log("%c[iyu] " + s, "color:#0a7d32");
    else console.error("[iyu] " + s);
    __emit("log", level, s);
    if (__opts.debug && __consoleEl) {
        const d = document.createElement("div");
        d.className = "iyu-log-" + (level === 0 ? "info" : "err");
        d.textContent = s;
        __consoleEl.appendChild(d);
        __consoleEl.scrollTop = __consoleEl.scrollHeight;
    }
}

function __err(s) {
    console.error("[iyu] " + s);
    __emit("error", s);
    if (__opts.onError) { try { __opts.onError(s); } catch (e) {} }
    if (__opts.debug && __consoleEl) {
        const d = document.createElement("div");
        d.className = "iyu-log-err";
        d.textContent = s;
        __consoleEl.appendChild(d);
    }
}

// ---------------- 调度泵 ----------------
let __pumpTimer = null;
function pumpLoop() {
    __pumpTimer = null;
    if (!__M) return;
    let r = -1;
    try { r = __M._iyu_pump(); } catch (e) { __err("引擎异常: " + e.message); return; }
    if (r === -2) {
        const err = __M.UTF8ToString(__M._iyu_last_error());
        __err(err);
        return;
    }
    if (r === 0) { __pumpTimer = setTimeout(pumpLoop, 0); }
    else if (r > 0) { __pumpTimer = setTimeout(pumpLoop, Math.min(r, 500)); }
}
function ensurePump() { if (__M && !__pumpTimer) __pumpTimer = setTimeout(pumpLoop, 0); }

// ---------------- 手机框架 ----------------
function buildFrame() {
    const hostEl = typeof __opts.host === "string" ? document.querySelector(__opts.host) : __opts.host;
    if (!hostEl) throw new Error("IYU.init: 找不到宿主元素 " + __opts.host);
    __frame = document.createElement("div");
    __frame.className = "iyu-frame";
    __frame.style.cssText = `width:${__opts.width}px;height:${__opts.height}px;position:relative;overflow:hidden;
        background:#ffffff;border-radius:18px;box-shadow:0 8px 40px rgba(0,0,0,.25);
        font-family:system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;
        font-size:14px;color:#333;user-select:none;box-sizing:border-box;margin:0 auto;`;
    __statusBar = document.createElement("div");
    __statusBar.className = "iyu-statusbar";
    __statusBar.style.cssText = `height:22px;background:#387bd6;color:#fff;font-size:11px;display:flex;
        align-items:center;justify-content:space-between;padding:0 10px;box-sizing:border-box;flex:0 0 auto;`;
    const now = new Date();
    __statusBar.innerHTML = `<span>●▲●</span><span>${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}</span>`;
    __screen = document.createElement("div");
    __screen.className = "iyu-screen";
    __screen.style.cssText = `position:absolute;top:22px;left:0;right:0;bottom:0;overflow:hidden;display:flex;flex-direction:column;`;
    __frame.appendChild(__statusBar);
    __frame.appendChild(__screen);
    __dialogLayer = document.createElement("div");
    __dialogLayer.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:800;`;
    __menuLayer = document.createElement("div");
    __menuLayer.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:900;`;
    __toastLayer = document.createElement("div");
    __toastLayer.style.cssText = `position:absolute;left:0;right:0;bottom:60px;display:flex;flex-direction:column;
        align-items:center;gap:8px;pointer-events:none;z-index:950;`;
    __uxfLayer = document.createElement("div");
    __uxfLayer.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:700;`;
    __frame.appendChild(__dialogLayer);
    __frame.appendChild(__menuLayer);
    __frame.appendChild(__toastLayer);
    __frame.appendChild(__uxfLayer);
    const style = document.createElement("style");
    style.textContent = `
.iyu-inst{position:relative;flex:0 0 auto;box-sizing:border-box;display:flex;flex-direction:column;}
.iyu-full{width:100%;height:100%;}
.iyu-toast{background:rgba(30,30,30,.88);color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;
    max-width:82%;white-space:pre-wrap;pointer-events:auto;animation:iyu-fadein .18s;}
@keyframes iyu-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.iyu-btn-active:active{filter:brightness(.85);}
.iyu-log-info{color:#0a7d32;font-size:11px;}
.iyu-log-err{color:#d33;font-size:11px;}
.iyu-lan-0{animation:iyu-lan0 .3s;}@keyframes iyu-lan0{from{opacity:0}to{opacity:1}}
.iyu-lan-6{animation:iyu-lan6 .3s;}@keyframes iyu-lan6{from{transform:translateX(100%)}to{transform:none}}
.iyu-lan-7{animation:iyu-lan7 .3s;}@keyframes iyu-lan7{from{transform:translateY(100%)}to{transform:none}}
.iyu-lan-10{animation:iyu-lan10 .3s;}@keyframes iyu-lan10{from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}}
`;
    __frame.appendChild(style);
    hostEl.appendChild(__frame);
    if (__opts.debug) {
        __consoleEl = document.createElement("div");
        __consoleEl.style.cssText = `width:${__opts.width}px;height:150px;overflow-y:auto;background:#111;color:#ddd;
            font:11px/1.5 monospace;padding:6px 8px;box-sizing:border-box;margin:8px auto 0;border-radius:8px;`;
        hostEl.appendChild(__consoleEl);
    }
}

// ---------------- 路径解析 ----------------
function resolveSrc(p) {
    if (!p) return "";
    p = String(p);
    if (/^(https?:|data:|blob:)/.test(p)) return p;
    let fspath = null;
    if (p[0] === "%") fspath = "/sd/" + p.slice(1);
    else if (p[0] === "@") fspath = "/res/" + p.slice(1);
    if (fspath) {
        const f = __fs.get(fspath);
        if (f) {
            if (f.b64) {
                const ext = fspath.split(".").pop().toLowerCase();
                const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
                    webp: "image/webp", svg: "image/svg+xml", mp3: "audio/mpeg", mp4: "video/mp4",
                    wav: "audio/wav", webm: "video/webm", ogg: "audio/ogg", amr: "audio/amr" }[ext] || "application/octet-stream";
                return "data:" + mime + ";base64," + f.data;
            }
            return p;
        }
    }
    return p;
}

// ---------------- 控件类型映射 ----------------
function makeTypeEl(type, c) {
    const t = type.toLowerCase();
    const div = () => document.createElement("div");
    if (t === "iyu_root" || t === "iyu_dialoghost") { const el = div(); el.className = "iyu-inst"; return el; }
    if (t === "文本" || t === "textview" || t === "label") { const el = div(); el.style.whiteSpace = "pre-wrap"; el.style.wordBreak = "break-all"; return el; }
    if (t === "按钮" || t === "button") { const el = document.createElement("button"); el.className = "iyu-btn-active"; el.style.cssText = "border:none;cursor:pointer;font-size:inherit;min-height:34px;padding:6px 14px;"; return el; }
    if (t === "图像" || t === "imageview") { const el = document.createElement("img"); el.style.cssText = "object-fit:cover;"; return el; }
    if (t === "图像按钮" || t === "imagebutton") { const el = document.createElement("img"); el.style.cssText = "object-fit:cover;cursor:pointer;"; el.className = "iyu-btn-active"; return el; }
    if (t === "编辑框" || t === "edittext") {
        const el = document.createElement("textarea");
        el.style.cssText = "resize:none;outline:none;font:inherit;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;min-height:40px;white-space:pre-wrap;";
        el.addEventListener("focus", () => el._iyuFocused = true);
        return el;
    }
    if (t === "线性布局" || t === "linearlayout") { const el = div(); el.style.display = "flex"; el.style.flexDirection = "column"; return el; }
    if (t === "相对布局" || t === "relativelayout" || t === "帧布局" || t === "framelayout" ||
        t === "约束性布局" || t === "constraintlayout" || t === "协调性布局" || t === "coordinatorlayout" ||
        t === "面控件" || t === "surfaceview" || t === "单选布局" || t === "radiogroup") {
        const el = div(); el.style.position = "relative"; return el;
    }
    if (t === "卡片" || t === "cardview") { const el = div(); el.style.cssText = "background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);overflow:hidden;"; return el; }
    if (t === "滚动" || t === "scrollview" || t === "垂直滑动窗体" || t === "嵌套滚动" || t === "nestedscrollview") {
        const el = div(); el.style.cssText = "overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;"; return el;
    }
    if (t === "水平滚动" || t === "horizontalscrollview") { const el = div(); el.style.cssText = "overflow-x:auto;overflow-y:hidden;"; return el; }
    if (t === "滑动窗体" || t === "viewpager") {
        const el = div(); el.style.cssText = "display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;";
        el._iyuPager = true; return el;
    }
    if (t === "侧滑窗体" || t === "drawerlayout") {
        const el = div(); el.style.cssText = "position:relative;overflow:hidden;";
        const content = div(); content.style.cssText = "position:absolute;inset:0;transition:transform .25s;";
        const drawer = div(); drawer.style.cssText = "position:absolute;top:0;bottom:0;left:0;width:70%;background:#fff;box-shadow:2px 0 12px rgba(0,0,0,.3);transform:translateX(-100%);transition:transform .25s;z-index:5;";
        const mask = div(); mask.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .25s;z-index:4;";
        el.appendChild(content); el.appendChild(mask); el.appendChild(drawer);
        el._iyuDrawer = { content, drawer, mask, open: false };
        return el;
    }
    if (t === "下拉刷新" || t === "swiperefreshlayout") { const el = div(); el.style.cssText = "overflow-y:auto;display:flex;flex-direction:column;position:relative;"; return el; }
    if (t === "列表" || t === "listview" || t === "v7列表" || t === "recyclerview") { const el = div(); el.style.cssText = "display:flex;flex-direction:column;overflow-y:auto;"; return el; }
    if (t === "网格视图" || t === "gridview") { const el = div(); el.style.cssText = "display:grid;grid-template-columns:repeat(3,1fr);gap:4px;overflow-y:auto;"; return el; }
    if (t === "单选项" || t === "radiobutton") {
        const label = document.createElement("label"); label.style.cssText = "display:flex;align-items:center;gap:6px;cursor:pointer;";
        const input = document.createElement("input"); input.type = "radio";
        label.appendChild(input); label._iyuInput = input; return label;
    }
    if (t === "多选" || t === "checkbox") {
        const label = document.createElement("label"); label.style.cssText = "display:flex;align-items:center;gap:6px;cursor:pointer;";
        const input = document.createElement("input"); input.type = "checkbox";
        label.appendChild(input); label._iyuInput = input; return label;
    }
    if (t === "开关" || t === "switch" || t === "switchbutton") {
        const label = document.createElement("label"); label.style.cssText = "display:inline-flex;align-items:center;gap:8px;cursor:pointer;";
        const input = document.createElement("input"); input.type = "checkbox"; input.style.cssText = "appearance:none;width:44px;height:24px;border-radius:12px;background:#ccc;position:relative;transition:.2s;cursor:pointer;";
        input.addEventListener("change", () => input.style.background = input.checked ? "#4caf50" : "#ccc");
        const knob = document.createElement("span"); knob.style.cssText = "position:absolute;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,.3);";
        input.addEventListener("change", () => knob.style.left = input.checked ? "22px" : "2px");
        label.appendChild(input); label.appendChild(knob); label._iyuInput = input; return label;
    }
    if (t === "下拉菜单" || t === "spinner") { const el = document.createElement("select"); el.style.cssText = "padding:6px;border:1px solid #ccc;border-radius:4px;font:inherit;"; return el; }
    if (t === "拖动条" || t === "seekbar") { const el = document.createElement("input"); el.type = "range"; el.style.width = "100%"; return el; }
    if (t === "进度条" || t === "progressbar") {
        const el = div(); el.style.cssText = "background:#e0e0e0;border-radius:6px;overflow:hidden;height:8px;position:relative;";
        const bar = div(); bar.style.cssText = "height:100%;width:0%;background:#387bd6;transition:width .2s;";
        el.appendChild(bar); el._iyuBar = bar; return el;
    }
    if (t === "日期选择" || t === "datepicker") { const el = document.createElement("input"); el.type = "date"; return el; }
    if (t === "时间选择" || t === "timepicker") { const el = document.createElement("input"); el.type = "time"; return el; }
    if (t === "视频" || t === "videoview") { const el = document.createElement("video"); el.style.cssText = "background:#000;width:100%;"; return el; }
    if (t === "动态图" || t === "gifview") { const el = document.createElement("img"); return el; }
    if (t === "圆形图" || t === "circleimageview") { const el = document.createElement("img"); el.style.cssText = "border-radius:50%;object-fit:cover;"; return el; }
    if (t === "浏览器" || t === "webview") { const el = document.createElement("iframe"); el.style.cssText = "border:none;width:100%;height:100%;"; el.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups"); return el; }
    if (t === "浮动按钮" || t === "floatingactionbutton") {
        const el = document.createElement("button"); el.className = "iyu-btn-active";
        el.style.cssText = "width:56px;height:56px;border-radius:50%;border:none;background:#387bd6;color:#fff;font-size:24px;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.3);";
        return el;
    }
    if (t === "工具栏" || t === "toolbar") { const el = div(); el.style.cssText = "background:#387bd6;color:#fff;display:flex;align-items:center;padding:0 14px;min-height:52px;flex:0 0 auto;gap:10px;"; return el; }
    if (t === "应用栏" || t === "appbarlayout" || t === "折叠工具栏" || t === "collapsingtoolbarlayout") { const el = div(); el.style.cssText = "flex:0 0 auto;"; return el; }
    if (t === "标签" || t === "tablayout" || t === "标签布局") { const el = div(); el.style.cssText = "display:flex;background:#fff;border-bottom:1px solid #eee;flex:0 0 auto;overflow-x:auto;"; return el; }
    if (t === "文本输入布局" || t === "textinputlayout") { const el = div(); el.style.cssText = "display:flex;flex-direction:column;gap:2px;"; return el; }
    // 默认
    return div();
}

// ---------------- 控件创建 ----------------
IYUHost.widgetCreate = function (id, parentId, type, propsJson, index) {
    try {
        // 移动已有控件
        if (type === "@move") {
            const c = __ctrls.get(id);
            const p = parentId === 0 ? __screen : (__ctrls.get(parentId)?.el || __screen);
            if (c && p) {
                (index >= 0 ? p.insertBefore(c.el, p.children[index]) : p.appendChild(c.el));
                c.parent = parentId;
            }
            return id;
        }
        const props = propsJson && propsJson !== "{}" ? JSON.parse(propsJson) : {};
        let c = __ctrls.get(id);
        if (!c) {
            if (id > 0 && __ctrls.has(id)) id = __uid();
            if (id <= 0) id = __uid();
            const el = makeTypeEl(type, c);
            c = { id, el, type, props: {}, parent: parentId, kids: [], inst: 0, obj: el };
            __ctrls.set(id, c);
        }
        const pEl = parentId === 0 ? __screen : (__ctrls.get(parentId)?.el);
        const host = pEl || __screen;
        if (index >= 0 && host.children[index]) host.insertBefore(c.el, host.children[index]);
        else host.appendChild(c.el);
        if (parentId > 0 && __ctrls.has(parentId)) {
            const pc = __ctrls.get(parentId);
            if (!pc.kids.includes(id)) pc.kids.push(id);
        }
        // 记录实例归属（根容器）
        if (props._inst !== undefined) {
            c.inst = props._inst;
            c.el.dataset.inst = c.inst;
        }
        for (const k in props) applyProp(c, k, props[k]);
        return id;
    } catch (e) { __err("widgetCreate: " + e.message); return 0; }
};

IYUHost.widgetRemove = function (id) {
    const c = __ctrls.get(id);
    if (!c) return;
    const removeRec = (cid) => {
        const cc = __ctrls.get(cid);
        if (!cc) return;
        for (const k of cc.kids) removeRec(k);
        cc.el.remove();
        __ctrls.delete(cid);
    };
    if (c.parent > 0) {
        const pc = __ctrls.get(c.parent);
        if (pc) pc.kids = pc.kids.filter(k => k !== id);
    }
    removeRec(id);
};

IYUHost.widgetSet = function (id, k, v) {
    const c = __ctrls.get(id);
    if (!c) return false;
    try { applyProp(c, k, v); return true; }
    catch (e) { __err("widgetSet " + k + ": " + e.message); return false; }
};

// ---------------- 属性应用 ----------------
function dimToCss(v, base) {
    if (v === null || v === undefined || v === "") return null;
    const s = String(v).trim();
    if (s === "-1" || s === "-1.0") return base === "w" ? "100%" : "100%";
    if (s === "-2") return "auto";
    const n = parseFloat(s);
    if (isNaN(n)) return null;
    return n + "px";
}

function applyDecl(el, decl) {
    // 应用 CSS 声明串 "a:b;c:d"
    for (const part of decl.split(";")) {
        const i = part.indexOf(":");
        if (i < 0) continue;
        const k = part.slice(0, i).trim();
        const v = part.slice(i + 1).trim();
        if (k && v) { try { el.style.setProperty(k, v); } catch (e) {} }
    }
}

function applyProp(c, k, rawV) {
    const el = c.el;
    const v = rawV === null || rawV === undefined ? "" : String(rawV);
    c.props[k] = rawV;
    const isInput = el.tagName === "TEXTAREA" || el.tagName === "INPUT" && !["range", "checkbox", "radio", "date", "time"].includes(el.type);
    switch (k) {
        case "width": { const css = dimToCss(v); if (css) el.style.width = css; if (css === "100%" && c.type.includes("布局")) {} break; }
        case "height": { const css = dimToCss(v); if (css) el.style.height = css; break; }
        case "x": el.style.position = "absolute"; el.style.left = (parseFloat(v) || 0) + "px"; break;
        case "y": el.style.position = "absolute"; el.style.top = (parseFloat(v) || 0) + "px"; break;
        case "text":
            if (v.startsWith("(html)")) { el.innerHTML = v.slice(6); }
            else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") el.value = v;
            else el.textContent = v;
            break;
        case "textsize": el.style.fontSize = (parseFloat(v) || 14) + "px"; break;
        case "textcolor": el.style.color = v; break;
        case "textstyle": {
            if (/bold/.test(v)) el.style.fontWeight = "bold";
            if (/italic/.test(v)) el.style.fontStyle = "italic";
            break;
        }
        case "hint":
            if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") el.placeholder = v;
            break;
        case "src": {
            const url = resolveSrc(v);
            if (el.tagName === "IMG") el.src = url;
            else if (el.tagName === "VIDEO") { el.src = url; el.play?.().catch(() => {}); }
            else el.style.backgroundImage = `url("${url}")`;
            break;
        }
        case "srchtml": el.srcdoc = v; break;
        case "url": {
            if (el.tagName === "IFRAME") el.src = v;
            else el.textContent = v;
            break;
        }
        case "background": {
            if (!v) break;
            if (v.includes(":") && !/^(#|@|%|http)/.test(v)) { applyDecl(el, v); break; }
            if (v.startsWith("#") || /^rgba?\(/.test(v)) el.style.backgroundColor = v;
            else if (/^(https?:|data:|blob:|%|@)/.test(v)) el.style.backgroundImage = `url("${resolveSrc(v)}")`;
            else el.style.backgroundColor = v;
            break;
        }
        case "css": applyDecl(el, v); break;
        case "dhjson": playViewAnim(c, JSON.parse(v)); break;
        case "dhbgjson": startFrameAnim(c, JSON.parse(v)); break;
        case "padding": el.style.padding = (parseFloat(v) || 0) + "px"; break;
        case "paddingleft": el.style.paddingLeft = (parseFloat(v) || 0) + "px"; break;
        case "paddingtop": el.style.paddingTop = (parseFloat(v) || 0) + "px"; break;
        case "paddingright": el.style.paddingRight = (parseFloat(v) || 0) + "px"; break;
        case "paddingbottom": el.style.paddingBottom = (parseFloat(v) || 0) + "px"; break;
        case "layout_marginleft": el.style.marginLeft = (parseFloat(v) || 0) + "px"; break;
        case "layout_margintop": el.style.marginTop = (parseFloat(v) || 0) + "px"; break;
        case "layout_marginright": el.style.marginRight = (parseFloat(v) || 0) + "px"; break;
        case "layout_marginbottom": el.style.marginBottom = (parseFloat(v) || 0) + "px"; break;
        case "layout_gravity": {
            const map = { "center": "center", "center_vertical": "center", "center_horizontal": "center", "top": "flex-start", "bottom": "flex-end", "left": "flex-start", "right": "flex-end" };
            el.style.alignSelf = map[v] || v;
            break;
        }
        case "gravity": {
            if (el.tagName === "BUTTON" || el.tagName === "DIV" || el.tagName === "LABEL") {
                const hv = v.split("|");
                for (const g of hv) {
                    if (g === "left") { el.style.textAlign = "left"; }
                    else if (g === "right") { el.style.textAlign = "right"; }
                    else if (g === "center" || g === "center_horizontal") { el.style.textAlign = "center"; }
                    else if (g === "center_vertical") { el.style.justifyContent = "center"; el.style.display = el.style.display || "flex"; el.style.flexDirection = el.style.flexDirection === "row" ? "row" : el.style.flexDirection; el.style.alignItems = el.style.alignItems || "center"; }
                    else if (g === "top") el.style.justifyContent = "flex-start";
                    else if (g === "bottom") el.style.justifyContent = "flex-end";
                }
                if (hv.includes("center")) { el.style.display = el.style.display === "" ? "flex" : el.style.display; el.style.alignItems = el.style.alignItems || "center"; el.style.justifyContent = "center"; }
            } else if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
                el.style.textAlign = v.includes("center") ? "center" : v;
            }
            break;
        }
        case "orientation": {
            const o = v.toLowerCase();
            if (o === "h" || o === "横向" || o === "horizontal") el.style.flexDirection = "row";
            else el.style.flexDirection = "column";
            break;
        }
        case "visibility": {
            const n = parseInt(v);
            if (n === 8) { el.style.display = "none"; }
            else if (n === 4) { el.style.visibility = "hidden"; }
            else { el.style.visibility = "visible"; el.style.display = ""; }
            break;
        }
        case "clickable": el.style.pointerEvents = String(v) === "false" ? "none" : "auto"; el.style.cursor = "pointer"; break;
        case "enabled": el.disabled = String(v) === "false"; break;
        case "checked": if (c.obj._iyuInput) c.obj._iyuInput.checked = String(v) === "true" || v === "1"; break;
        case "progress": {
            const n = parseFloat(v) || 0;
            if (el.tagName === "INPUT") el.value = n;
            else if (c.obj._iyuBar) c.obj._iyuBar.style.width = Math.min(100, n) + "%";
            break;
        }
        case "max": if (el.tagName === "INPUT") el.max = parseFloat(v) || 100; break;
        case "rating": break;
        case "singleline": el.style.whiteSpace = "nowrap"; el.style.overflow = "hidden"; el.style.textOverflow = "ellipsis"; break;
        case "lines": if (parseInt(v) === 1) el.style.whiteSpace = "nowrap"; break;
        case "alpha": el.style.opacity = v; break;
        case "rotation": el.style.transform = `rotate(${parseFloat(v) || 0}deg)`; break;
        case "scalex": el.style.scale = `${parseFloat(v) || 1} ${el.style.scale || 1}`; break;
        case "scaley": el.style.scale = `${(el.style.scale || 1).toString().split(" ")[0]} ${parseFloat(v) || 1}`; break;
        case "elevation": el.style.boxShadow = `0 ${Math.max(2, parseFloat(v) / 2)}px ${parseFloat(v) * 2}px rgba(0,0,0,.3)`; break;
        case "shadow": {
            const [radius, dx, dy, color] = v.split("|");
            el.style.boxShadow = `${dx || 0}px ${dy || 0}px ${radius || 0}px ${color || "#000"}`;
            break;
        }
        case "selection": {
            const [a, b] = v.split("|");
            if (el.setSelectionRange) { el.focus(); el.setSelectionRange(parseInt(a) || 0, b !== undefined ? parseInt(b) : (parseInt(a) || 0)); }
            break;
        }
        case "gobackorforward": {
            try { el.contentWindow?.history.go(parseInt(v) || 0); } catch (e) {}
            break;
        }
        case "backgroundripple": el.className = "iyu-btn-active"; break;
        case "refreshing": {
            if (String(v) === "false") { const sp = el.querySelector(".iyu-spinner"); if (sp) sp.remove(); }
            else {
                const sp = document.createElement("div");
                sp.className = "iyu-spinner";
                sp.style.cssText = "width:28px;height:28px;border:3px solid #ddd;border-top-color:#387bd6;border-radius:50%;animation:iyu-spin 0.8s linear infinite;margin:10px auto;flex:0 0 auto;";
                el.prepend(sp);
            }
            break;
        }
        case "currentitem": {
            if (c.obj._iyuPager) {
                const target = el.children[parseInt(v)] || el.children[parseInt(v) * 2];
                if (target) target.scrollIntoView({ behavior: "smooth", inline: "start" });
            }
            break;
        }
        case "opendrawer": case "closedrawer": {
            const d = c.obj._iyuDrawer;
            if (d) setDrawer(c, k === "opendrawer");
            break;
        }
        case "drawerlockmode": break;
        case "data": {
            renderSimpleData(c, v);
            break;
        }
        case "typeface": el.style.fontFamily = "serif"; break;
        case "divider": break;
        case "scaletype": break;
        case "imeoptions": break;
        case "numstars": break;
        case "expand": break;
        case "title": if (c.type.includes("工具栏")) el.textContent = v; break;
        default: break;
    }
}

function setDrawer(c, open) {
    const d = c.obj._iyuDrawer;
    if (!d) return;
    d.open = open;
    d.drawer.style.transform = open ? "translateX(0)" : "translateX(-100%)";
    d.mask.style.opacity = open ? "1" : "0";
    d.mask.style.pointerEvents = open ? "auto" : "none";
    fireCtrl(c, open ? "ondraweropened" : "ondrawerclosed");
}
IYUHost.setDrawer = setDrawer;

function renderSimpleData(c, v) {
    const el = c.el;
    if (el.tagName === "SELECT") {
        el.innerHTML = "";
        let items = [];
        try { items = JSON.parse(v); } catch (e) { items = String(v).split(","); }
        c.items = items;
        for (const it of items) {
            const opt = document.createElement("option");
            opt.textContent = typeof it === "object" ? JSON.stringify(it) : it;
            el.appendChild(opt);
        }
    } else {
        el.innerHTML = "";
        let items = [];
        try { items = JSON.parse(v); } catch (e) { items = [v]; }
        c.items = items;
        items.forEach((it, i) => {
            const d = document.createElement("div");
            d.style.cssText = "padding:12px;border-bottom:1px solid #eee;cursor:pointer;";
            d.textContent = typeof it === "object" ? JSON.stringify(it) : String(it);
            d.dataset.idx = i;
            d.className = "iyu-btn-active";
            el.appendChild(d);
        });
    }
}

// ---------------- 控件属性读取 ----------------
IYUHost.widgetGet = function (id, k, extra) {
    const c = __ctrls.get(id);
    if (!c) return null;
    const el = c.el;
    const input = c.obj._iyuInput;
    switch (k) {
        case "text": case "内容": return el.tagName === "TEXTAREA" || el.tagName === "INPUT" ? el.value : el.textContent;
        case "checked": return input ? input.checked : false;
        case "progress": return el.tagName === "INPUT" ? parseFloat(el.value) : parseFloat(el.firstElementChild?.style.width) || 0;
        case "date": case "time": return el.value || "";
        case "url": return el.tagName === "IFRAME" ? el.src : "";
        case "title": try { return el.contentDocument?.title || ""; } catch (e) { return ""; }
        case "selecteditem": return el.tagName === "SELECT" ? el.value : "";
        case "currentitem": {
            if (c.obj._iyuPager) return Math.round(el.scrollLeft / (el.clientWidth || 1));
            return 0;
        }
        case "isdraweropen": return c.obj._iyuDrawer ? c.obj._iyuDrawer.open : false;
        case "selectionstart": return el.selectionStart ?? 0;
        case "selectionend": return el.selectionEnd ?? 0;
        case "cangoback": try { return el.contentWindow?.history.length > 1; } catch (e) { return false; }
        case "cangoforward": return false;
        case "count": return el.children.length;
        case "lastvisibleposition": return Math.max(0, el.children.length - 1);
        case "rating": return 0;
        case "visibility": return el.style.display === "none" ? 8 : (el.style.visibility === "hidden" ? 4 : 0);
        case "width": return el.offsetWidth;
        case "height": return el.offsetHeight;
        case "x": return el.offsetLeft;
        case "y": return el.offsetTop;
        case "background": return c.props.background ?? "";
        case "src": return c.props.src ?? "";
        case "hint": return el.placeholder || "";
        case "paddingleft": return parseFloat(el.style.paddingLeft) || 0;
        case "paddingtop": return parseFloat(el.style.paddingTop) || 0;
        case "paddingright": return parseFloat(el.style.paddingRight) || 0;
        case "paddingbottom": return parseFloat(el.style.paddingBottom) || 0;
        case "layout_marginleft": return parseFloat(el.style.marginLeft) || 0;
        case "layout_margintop": return parseFloat(el.style.marginTop) || 0;
        case "layout_marginright": return parseFloat(el.style.marginRight) || 0;
        case "layout_marginbottom": return parseFloat(el.style.marginBottom) || 0;
        default: return c.props[k] !== undefined ? c.props[k] : null;
    }
};
// ---------------- 事件桥接 ----------------
function cstr(s) {
    const len = __M.lengthBytesUTF8(s) + 1;
    const p = __M._malloc(len);
    __M.stringToUTF8(s, p, len);
    return p;
}
function cstrFree(p) { __M._free(p); }

function fireCtrl(c, ev, extra) {
    const st = Object.assign({ st_vId: 0 }, extra || {});
    st.st_vId = c.id;
    const pe = cstr(ev), ps = cstr(JSON.stringify(st));
    try {
        __M._iyu_fire_ctrl(c.id, pe, ps);
        ensurePump();
    } catch (e) { __err("事件触发失败: " + ev + " " + e.message); }
    cstrFree(pe); cstrFree(ps);
}

function frameRect() { return __screen.getBoundingClientRect(); }

function bindDomEvents(c, ev) {
    const el = c.el;
    const on = (target, type, fn, opt) => { target.addEventListener(type, fn, opt || false); };
    const once = { once: true };
    switch (ev) {
        case "clicki":
            on(el, "click", (e) => {
                e.stopPropagation();
                fireCtrl(c, "clicki");
            });
            break;
        case "touchmonitor": {
            let down = false;
            on(el, "pointerdown", (e) => {
                down = true;
                fireCtrl(c, "touchmonitor", touchSt(e, 0));
                if (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.tagName === "IFRAME") return;
                e.preventDefault();
            });
            on(el, "pointermove", (e) => { if (down) fireCtrl(c, "touchmonitor", touchSt(e, 2)); });
            on(el, "pointerup", (e) => { if (down) { down = false; fireCtrl(c, "touchmonitor", touchSt(e, 1)); } });
            on(el, "pointercancel", () => { down = false; });
            break;
        }
        case "press": {
            let timer = null;
            on(el, "pointerdown", (e) => {
                timer = setTimeout(() => { timer = null; fireCtrl(c, "press"); }, 500);
            });
            on(el, "pointerup", () => { if (timer) { clearTimeout(timer); timer = null; } });
            on(el, "pointermove", () => { if (timer) { clearTimeout(timer); timer = null; } });
            on(el, "contextmenu", (e) => e.preventDefault());
            break;
        }
        case "pressmenu":
            on(el, "contextmenu", (e) => {
                e.preventDefault();
                e.stopPropagation();
                fireCtrl(c, "pressmenu");
            });
            break;
        case "keyboard":
            on(el, "keydown", (e) => fireCtrl(c, "keyboard", { st_kC: e.keyCode, st_eA: 0 }));
            on(el, "keyup", (e) => fireCtrl(c, "keyboard", { st_kC: e.keyCode, st_eA: 1 }));
            break;
        case "editormonitor":
            on(el, "keydown", (e) => {
                fireCtrl(c, "editormonitor", { st_aI: e.keyCode === 13 ? 1 : 0, st_eA: 0, st_eK: e.keyCode });
            });
            break;
        case "ontextchanged":
        case "aftertextchanged":
            on(el, "input", () => fireCtrl(c, ev, { st_sS: el.value ?? el.textContent }));
            break;
        case "beforetextchanged":
            on(el, "input", () => fireCtrl(c, ev, { st_sS: el.value ?? el.textContent }));
            break;
        case "focuschange":
            on(el, "focus", () => fireCtrl(c, "focuschange", { st_hF: 1 }));
            on(el, "blur", () => fireCtrl(c, "focuschange", { st_hF: 0 }));
            break;
        case "onscroll": {
            let t = null;
            on(el, "scroll", () => {
                const y = el.scrollTop;
                fireCtrl(c, "onscroll", { st_sE: y, st_fM: y + el.clientHeight >= el.scrollHeight - 2 ? 1 : 0 });
                clearTimeout(t);
                t = setTimeout(() => fireCtrl(c, "onscrollstatechanged", { st_sS: "0" }), 160);
                if (!t._fired) { fireCtrl(c, "onscrollstatechanged", { st_sS: "1" }); }
            });
            break;
        }
        case "onscrollstatechanged":
            on(el, "scroll", () => {
                clearTimeout(el._st);
                el._st = setTimeout(() => fireCtrl(c, "onscrollstatechanged", { st_sS: "0" }), 160);
            });
            break;
        case "clickitem":
            on(el, "click", (e) => {
                const item = e.target.closest("[data-idx]");
                if (!item) return;
                const idx = parseInt(item.dataset.idx);
                fireCtrl(c, "clickitem", {
                    st_pN: idx,
                    st_iD: c.items ? (typeof c.items[idx] === "object" ? JSON.stringify(c.items[idx]) : String(c.items[idx] ?? "")) : ""
                });
            });
            break;
        case "onpageselected": case "onpagescrolled": case "onpagescrollstatechanged": {
            let last = -1;
            on(el, "scroll", () => {
                const page = Math.round(el.scrollLeft / (el.clientWidth || 1));
                if (ev === "onpagescrolled") fireCtrl(c, ev, { st_pN: page, st_eX: el.scrollLeft % (el.clientWidth || 1) });
                if (page !== last) {
                    if (last >= 0 && ev === "onpageselected") fireCtrl(c, ev, { st_pN: page });
                    last = page;
                }
            });
            on(el, "scrollend", () => { if (ev === "onpagescrollstatechanged") fireCtrl(c, ev, { st_sS: "0" }); });
            break;
        }
        case "onprogresschanged":
            on(el, "load", () => fireCtrl(c, "onprogresschanged", { st_pN: 100 }));
            break;
        case "shouldoverrideurlloading":
            on(el, "load", () => {
                try {
                    const a = el.contentDocument?.querySelectorAll("a[href]");
                    a?.forEach(x => x.addEventListener("click", () => {
                        fireCtrl(c, "shouldoverrideurlloading", { st_sS: x.href });
                    }));
                } catch (e) {}
            });
            break;
        case "ondownloadstart": break;
        case "onitemselected": case "onoptionsitemselected":
            on(el, "change", () => fireCtrl(c, ev, { st_pN: el.selectedIndex }));
            break;
        default:
            // 未知事件名：点击兜底
            on(el, "click", (e) => { e.stopPropagation(); fireCtrl(c, ev); });
            break;
    }
}

function touchSt(e, action) {
    const r = frameRect();
    const elR = e.currentTarget.getBoundingClientRect();
    return {
        st_eA: action,
        st_eX: Math.round(e.clientX - r.left),
        st_eY: Math.round(e.clientY - r.top),
        st_rX: Math.round(e.clientX - elR.left),
        st_rY: Math.round(e.clientY - elR.top)
    };
}

IYUHost.widgetBind = function (id, ev, snip, retDefault) {
    const c = __ctrls.get(id);
    if (!c) return;
    c.retDefault = retDefault;
    bindDomEvents(c, ev);
};

// ---------------- 提示 / 弹窗 / 菜单 ----------------
IYUHost.toast = function (msg, dur) {
    const d = document.createElement("div");
    d.className = "iyu-toast";
    d.textContent = msg;
    __toastLayer.appendChild(d);
    setTimeout(() => d.remove(), dur === 1 ? 3500 : 2000);
};

IYUHost.dialog = function (json) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;
        align-items:center;justify-content:center;pointer-events:auto;z-index:10;`;
    const box = document.createElement("div");
    box.style.cssText = `background:#fff;border-radius:10px;min-width:72%;max-width:86%;max-height:76%;
        display:flex;flex-direction:column;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.3);
        animation:iyu-fadein .15s;`;
    if (json.title) {
        const t = document.createElement("div");
        t.style.cssText = "padding:14px 16px 4px;font-weight:600;font-size:15px;";
        t.textContent = json.title;
        box.appendChild(t);
    }
    const body = document.createElement("div");
    body.style.cssText = "padding:10px 16px;overflow-y:auto;font-size:14px;line-height:1.5;white-space:pre-wrap;flex:0 1 auto;";
    const container = document.createElement("div");
    container.className = "iyu-inst";
    const containerId = __uid();
    __ctrls.set(containerId, { id: containerId, el: container, type: "iyu_dialoghost", props: {}, parent: 0, kids: [], inst: 0, obj: container });
    if (json.page) {
        body.appendChild(container);
        body.style.padding = "0";
        body.style.whiteSpace = "normal";
    } else {
        body.textContent = json.content || "";
    }
    box.appendChild(body);
    if (json.btns && json.btns.length) {
        const btns = document.createElement("div");
        btns.style.cssText = "display:flex;border-top:1px solid #eee;flex:0 0 auto;";
        json.btns.forEach((label, i) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.style.cssText = `flex:1;border:none;background:none;padding:12px;font-size:14px;cursor:pointer;color:#387bd6;${i ? "border-left:1px solid #eee;" : ""}`;
            b.addEventListener("click", () => {
                overlay.remove();
                __M._iyu_utw_btn(json.handle, i + 1);
                ensurePump();
            });
            btns.appendChild(b);
        });
        box.appendChild(btns);
    }
    overlay.appendChild(box);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay && json.cancelable) { overlay.remove(); __M._iyu_utw_btn(json.handle, 0); ensurePump(); }
    });
    __dialogLayer.appendChild(overlay);
    return containerId;
};

IYUHost.closeDialog = function () {
    const overlays = __dialogLayer.children;
    if (overlays.length) overlays[overlays.length - 1].remove();
};

IYUHost.openUrl = function (url, external) {
    if (external) { window.open(url, "_blank"); return; }
    // 内置浏览器（覆盖层）
    const ov = document.createElement("div");
    ov.style.cssText = `position:absolute;inset:0;background:#fff;z-index:600;display:flex;flex-direction:column;`;
    const bar = document.createElement("div");
    bar.style.cssText = "background:#387bd6;color:#fff;display:flex;align-items:center;padding:8px 12px;gap:10px;flex:0 0 auto;";
    const back = document.createElement("span");
    back.textContent = "‹ 返回";
    back.style.cssText = "cursor:pointer;font-size:14px;";
    back.addEventListener("click", () => ov.remove());
    const title = document.createElement("span");
    title.style.cssText = "flex:1;text-align:center;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
    title.textContent = url;
    bar.appendChild(back);
    bar.appendChild(title);
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "flex:1;border:none;width:100%;";
    iframe.src = url;
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
    ov.appendChild(bar);
    ov.appendChild(iframe);
    __frame.appendChild(ov);
};

function showMenu(items) {
    return new Promise((resolve) => {
        const ov = document.createElement("div");
        ov.style.cssText = "position:absolute;inset:0;pointer-events:auto;z-index:20;";
        const list = document.createElement("div");
        list.style.cssText = "position:absolute;top:24px;right:8px;background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.25);min-width:140px;overflow:hidden;";
        items.forEach((it, i) => {
            const d = document.createElement("div");
            d.textContent = it;
            d.style.cssText = "padding:12px 18px;font-size:14px;cursor:pointer;" + (i ? "border-top:1px solid #f0f0f0;" : "");
            d.className = "iyu-btn-active";
            d.addEventListener("click", () => { ov.remove(); resolve(i); });
            list.appendChild(d);
        });
        ov.appendChild(list);
        ov.addEventListener("click", (e) => { if (e.target === ov) { ov.remove(); resolve(-1); } });
        __menuLayer.appendChild(ov);
    });
}

// ---------------- 动画执行 ----------------
function playViewAnim(c, anim) {
    const el = c.el;
    const p = anim.props || {};
    const dur = (p.duration ?? 400);
    const delay = (p.delay ?? 0);
    const ease = "cubic-bezier(.25,.8,.35,1)";
    setTimeout(() => {
        let from, to;
        switch (anim.type) {
            case "alpha":
                from = p.from ?? 1; to = p.to ?? 1;
                el.animate([{ opacity: from }, { opacity: to }], { duration: dur, easing: ease, fill: p.fillAfter ? "forwards" : "none" });
                break;
            case "scale":
                el.animate([
                    { transform: `scale(${p.fromX ?? 1},${p.fromY ?? 1})` },
                    { transform: `scale(${p.toX ?? 1},${p.toY ?? 1})` }
                ], { duration: dur, easing: ease, fill: p.fillAfter ? "forwards" : "none" });
                break;
            case "translate":
                el.animate([
                    { transform: `translate(${p.fromX ?? 0}px,${p.fromY ?? 0}px)` },
                    { transform: `translate(${p.toX ?? 0}px,${p.toY ?? 0}px)` }
                ], { duration: dur, easing: ease, fill: p.fillAfter ? "forwards" : "none" });
                break;
            case "rotate":
                el.animate([
                    { transform: `rotate(${p.from ?? 0}deg)` },
                    { transform: `rotate(${p.to ?? 0}deg)` }
                ], { duration: dur, easing: ease, fill: p.fillAfter ? "forwards" : "none" });
                break;
            case "set":
                for (const sub of (anim.subs || [])) playViewAnim(c, sub);
                break;
        }
        if (anim.type !== "set" && __animListen.has(anim.id)) {
            setTimeout(() => { __M._iyu_anim_event(anim.id, "end"); ensurePump(); }, dur);
        } else if (anim.type === "set" && __animListen.has(anim.id)) {
            setTimeout(() => { __M._iyu_anim_event(anim.id, "end"); ensurePump(); }, dur);
        }
    }, delay);
}

function playPropertyAnim(anim) {
    const p = anim.props || {};
    const ctrl = __ctrls.get(p.target);
    if (!ctrl) return;
    const el = ctrl.el;
    const prop = p.prop;
    const vals = anim.vals || [];
    const dur = (p.duration ?? 400) / Math.max(1, vals.length - 1);
    let kf = [];
    if (prop === "alpha") kf = vals.map(v => ({ opacity: v }));
    else if (prop === "rotation" || prop === "rotationX" || prop === "rotationY") kf = vals.map(v => ({ transform: `rotate(${v}deg)` }));
    else if (prop === "scaleX") kf = vals.map(v => ({ transform: `scaleX(${v})` }));
    else if (prop === "scaleY") kf = vals.map(v => ({ transform: `scaleY(${v})` }));
    else if (prop === "translationX") kf = vals.map(v => ({ transform: `translateX(${v}px)` }));
    else if (prop === "translationY") kf = vals.map(v => ({ transform: `translateY(${v}px)` }));
    if (kf.length >= 2) {
        const a = el.animate(kf, { duration: p.duration ?? 400, easing: "cubic-bezier(.25,.8,.35,1)", fill: "forwards" });
        if (__animListen.has(anim.id)) a.onfinish = () => { __M._iyu_anim_event(anim.id, "end"); ensurePump(); };
    }
}

function startFrameAnim(c, anim) {
    const frames = (anim.vals || []).map(f => {
        const [src, ms] = String(f).split("|");
        return { url: resolveSrc(src), ms: parseInt(ms) || 100 };
    });
    if (!frames.length) return;
    const el = c.el;
    let i = 0;
    const oneshot = anim.props?.oneshot;
    const step = () => {
        el.style.backgroundImage = `url("${frames[i].url}")`;
        i++;
        if (i >= frames.length) {
            if (oneshot) { if (__animListen.has(anim.id)) { __M._iyu_anim_event(anim.id, "end"); ensurePump(); } return; }
            i = 0;
        }
        setTimeout(step, frames[i - 1].ms);
    };
    step();
}

IYUHost.setAnim = function (ctrlId, animId) { /* 兼容保留 */ };

// ---------------- 界面实例 ----------------
IYUHost.ifaceLoaded = function (inst) { /* 容器已在创建时挂载 */ };
IYUHost.ifaceDestroyed = function (inst, keepHost) {
    // 找到该实例的根容器
    for (const [id, c] of __ctrls) {
        if ((c.type === "iyu_root" || c.type === "iyu_dialoghost") && c.el.dataset.inst == inst) {
            if (keepHost) c.el.style.display = "none";
            else { const removeRec = (cid) => { const cc = __ctrls.get(cid); if (!cc) return; [...cc.kids].forEach(removeRec); cc.el.remove(); __ctrls.delete(cid); }; removeRec(id); }
            break;
        }
    }
};
// ---------------- 虚拟内存文件系统 ----------------
function fsInit() {
    __fs.set("/sd", { dir: true, data: "", b64: false });
    __fs.set("/res", { dir: true, data: "", b64: false });
}
function fsNorm(path) {
    let p = String(path || "/");
    if (!p.startsWith("/")) p = "/sd/" + p;
    p = p.replace(/\/+/g, "/").replace(/\/$/, "");
    return p || "/";
}
function fsOp(a) {
    const act = a.act;
    const path = fsNorm(a.path);
    switch (act) {
        case "write": {
            __fs.set(path, { data: String(a.data ?? ""), b64: false });
            const i = path.lastIndexOf("/");
            if (i > 0) __fs.set(path.slice(0, i), { dir: true, data: "", b64: false });
            return { ok: true };
        }
        case "read": {
            const f = __fs.get(path);
            return { ok: !!f && !f.dir, data: f ? (f.b64 ? atob(f.data) : f.data) : "" };
        }
        case "readb64": {
            const f = __fs.get(path);
            if (!f) return { ok: false, data: "" };
            if (f.b64) return { ok: true, data: f.data };
            return { ok: true, data: btoa(unescape(encodeURIComponent(f.data))) };
        }
        case "writeb64": {
            __fs.set(path, { data: String(a.data ?? ""), b64: true });
            const i = path.lastIndexOf("/");
            if (i > 0) __fs.set(path.slice(0, i), { dir: true, data: "", b64: false });
            return { ok: true };
        }
        case "exists": return { ok: __fs.has(path) };
        case "del": return { ok: __fs.delete(path) };
        case "size": {
            const f = __fs.get(path);
            if (!f || f.dir) return { size: -1 };
            const raw = f.b64 ? atob(f.data) : f.data;
            return { size: raw.length };
        }
        case "isdir": return { ok: __fs.get(path)?.dir === true };
        case "list": {
            const items = [];
            for (const [p, f] of __fs) {
                if (p.startsWith(path + "/") && !p.slice(path.length + 1).includes("/")) {
                    items.push(p.slice(path.length + 1));
                }
            }
            return { list: items };
        }
        case "copy": {
            const dst = fsNorm(a.data);
            const f = __fs.get(path);
            if (!f) return { ok: false };
            __fs.set(dst, { ...f });
            const i = dst.lastIndexOf("/");
            if (i > 0) __fs.set(dst.slice(0, i), { dir: true, data: "", b64: false });
            return { ok: true };
        }
        case "move": {
            const dst = fsNorm(a.data);
            const f = __fs.get(path);
            if (!f) return { ok: false };
            __fs.set(dst, { ...f });
            __fs.delete(path);
            return { ok: true };
        }
        default: return { ok: false };
    }
}

// ---------------- SQLite（IndexedDB 模拟） ----------------
const __dbs = new Map();
function idbOpen(name) {
    if (__dbs.has(name)) return Promise.resolve(__dbs.get(name));
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("iyu_" + name, 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains("__iyu_meta")) {
                db.createObjectStore("__iyu_meta", { keyPath: "name" });
            }
        };
        req.onsuccess = () => { __dbs.set(name, req.result); resolve(req.result); };
        req.onerror = () => reject(req.error);
    });
}
function idbTx(db, store, mode, fn) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const os = tx.objectStore(store);
        const out = fn(os);
        tx.oncomplete = () => resolve(out?.result ?? out);
        tx.onerror = () => reject(tx.error);
    });
}

// 迷你 SQL 引擎
function sqlSplitTop(s, word) {
    const re = new RegExp("\\s" + word + "\\s", "i");
    const m = s.match(re);
    if (!m) return null;
    return [s.slice(0, m.index), s.slice(m.index + m[0].length)];
}
function parseCond(cond) {
    if (!cond || cond.toLowerCase() === "null") return null;
    const parts = cond.split(/\s+and\s+/i);
    return parts.map(p => {
        p = p.trim();
        let m = p.match(/^([\w_]+)\s*(>=|<=|!=|<>|=|>|<|like)\s*(.+)$/i);
        if (!m) return null;
        let v = m[3].trim();
        if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
        else if (v.toLowerCase() === "null") v = null;
        else if (!isNaN(v)) v = parseFloat(v);
        return { col: m[1], op: m[2].toLowerCase(), val: v };
    }).filter(Boolean);
}
function condMatch(row, conds) {
    if (!conds) return true;
    return conds.every(c => {
        let v = row[c.col];
        if (c.op === "=") return v == c.val;
        if (c.op === "!=" || c.op === "<>") return v != c.val;
        if (c.op === ">") return v > c.val;
        if (c.op === "<") return v < c.val;
        if (c.op === ">=") return v >= c.val;
        if (c.op === "<=") return v <= c.val;
        if (c.op === "like") return String(v).includes(String(c.val).replace(/%/g, ""));
        return false;
    });
}
function splitSqlValues(s) {
    // 按顶层逗号分割（尊重引号）
    const out = [];
    let cur = "", inS = false;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === "'" ) { inS = !inS; cur += ch; continue; }
        if (ch === "," && !inS) { out.push(cur.trim()); cur = ""; continue; }
        cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out.map(v => {
        if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
        if (v.toLowerCase() === "null") return null;
        const n = parseFloat(v);
        return isNaN(n) ? v : n;
    });
}
async function sqlExec(dbName, sql) {
    try {
        const db = await idbOpen(dbName);
        const s = sql.trim().replace(/;$/, "");
        const low = s.toLowerCase();
        // 元数据辅助
        const getTables = async () => {
            const tx = db.transaction("__iyu_meta", "readonly");
            const req = tx.objectStore("__iyu_meta").getAll();
            return await new Promise((res, rej) => { req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error); });
        };
        const putTable = async (t) => {
            const tx = db.transaction("__iyu_meta", "readwrite");
            tx.objectStore("__iyu_meta").put(t);
            return await new Promise((res, rej) => { tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); });
        };
        // CREATE TABLE
        let m = s.match(/^create\s+table\s+(if\s+not\s+exists\s+)?(\w+)\s*\((.+)\)$/is);
        if (m) {
            const name = m[2], defs = m[3];
            const tables = await getTables();
            if (m[1] && tables.find(t => t.name === name)) return { ok: true };
            if (tables.find(t => t.name === name)) return { ok: false };
            const cols = defs.split(",").map(d => d.trim().split(/\s+/)[0]).filter(c => c && !c.toLowerCase().startsWith("primary"));
            if (!db.objectStoreNames.contains(name)) {
                await new Promise((res, rej) => {
                    db.close();
                    const req = indexedDB.open("iyu_" + dbName, db.version + 1);
                    req.onupgradeneeded = () => { req.result.createObjectStore(name, { keyPath: "_id", autoIncrement: true }); };
                    req.onsuccess = () => { __dbs.set(dbName, req.result); res(true); };
                    req.onerror = () => rej(req.error);
                });
            }
            await putTable({ name, cols });
            return { ok: true };
        }
        // DROP TABLE
        m = s.match(/^drop\s+table\s+(if\s+exists\s+)?(\w+)$/is);
        if (m) {
            const name = m[2];
            const dbv = db.version;
            await new Promise((res) => {
                db.close();
                const req = indexedDB.open("iyu_" + dbName, dbv + 1);
                req.onupgradeneeded = () => { try { req.result.deleteObjectStore(name); } catch (e) {} };
                req.onsuccess = () => { __dbs.set(dbName, req.result); res(true); };
                req.onerror = () => res(true);
            });
            const tx = (await idbOpen(dbName)).transaction("__iyu_meta", "readwrite");
            tx.objectStore("__iyu_meta").delete(name);
            return { ok: true };
        }
        // INSERT
        m = s.match(/^insert\s+into\s+(\w+)\s*(?:\(([^)]+)\))?\s*values\s*\((.+)\)$/is);
        if (m) {
            const name = m[1];
            const db2 = await idbOpen(dbName);
            const tables = await getTables();
            const tinfo = tables.find(t => t.name === name);
            let cols = m[2] ? m[2].split(",").map(c => c.trim()) : (tinfo?.cols || []);
            const vals = splitSqlValues(m[3]);
            const row = {};
            cols.forEach((c, i) => row[c] = vals[i]);
            const tx = db2.transaction(name, "readwrite");
            tx.objectStore(name).add(row);
            return await new Promise((res, rej) => { tx.oncomplete = () => res({ ok: true }); tx.onerror = () => rej(tx.error); });
        }
        // UPDATE
        m = s.match(/^update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+))?$/is);
        if (m) {
            const name = m[1];
            const sets = {};
            for (const kv of m[2].split(",")) {
                const [k, v] = kv.split("=");
                sets[k.trim()] = splitSqlValues(v.trim())[0];
            }
            const conds = parseCond(m[3]);
            const db2 = await idbOpen(dbName);
            const tx = db2.transaction(name, "readwrite");
            const os = tx.objectStore(name);
            const getAllReq = os.getAll();
            getAllReq.onsuccess = () => {
                for (const row of getAllReq.result) {
                    if (condMatch(row, conds)) { Object.assign(row, sets); os.put(row); }
                }
            };
            return await new Promise((res, rej) => { tx.oncomplete = () => res({ ok: true }); tx.onerror = () => rej(tx.error); });
        }
        // DELETE
        m = s.match(/^delete\s+from\s+(\w+)(?:\s+where\s+(.+))?$/is);
        if (m) {
            const name = m[1];
            const conds = parseCond(m[2]);
            const db2 = await idbOpen(dbName);
            const tx = db2.transaction(name, "readwrite");
            const os = tx.objectStore(name);
            const getAllReq = os.getAll();
            getAllReq.onsuccess = () => {
                for (const row of getAllReq.result) {
                    if (condMatch(row, conds)) os.delete(row._id);
                }
            };
            return await new Promise((res, rej) => { tx.oncomplete = () => res({ ok: true }); tx.onerror = () => rej(tx.error); });
        }
        // SELECT
        m = s.match(/^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+order\s+by\s+(\w+)(\s+desc)?)?(?:\s+limit\s+(\d+)\s*,\s*(\d+))?$/is);
        if (m) {
            const colSpec = m[1].trim();
            const name = m[2];
            const conds = parseCond(m[3]);
            const orderCol = m[4], orderDesc = !!m[5];
            const limSkip = m[6] ? parseInt(m[6]) : 0, limTake = m[7] ? parseInt(m[7]) : Infinity;
            if (low.startsWith("select count(*) from sqlite_master")) {
                const tables = await getTables();
                const found = tables.find(t => t.name === name);
                return { ok: true, cols: ["c"], rows: [[found ? 1 : 0]] };
            }
            const db2 = await idbOpen(dbName);
            const tx = db2.transaction(name, "readonly");
            const req = tx.objectStore(name).getAll();
            const all = await new Promise((res, rej) => { req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error); });
            let rows = all.filter(r => condMatch(r, conds));
            if (orderCol) rows.sort((a, b) => (a[orderCol] > b[orderCol] ? 1 : -1) * (orderDesc ? -1 : 1));
            rows = rows.slice(limSkip, limSkip + limTake);
            let cols;
            if (colSpec === "*") {
                cols = [];
                for (const r of rows) for (const k of Object.keys(r)) if (k !== "_id" && !cols.includes(k)) cols.push(k);
            } else {
                cols = colSpec.split(",").map(c => c.trim());
            }
            const out = rows.map(r => cols.map(c => r[c] !== undefined ? r[c] : null));
            return { ok: true, cols, rows: out };
        }
        return { ok: false };
    } catch (e) {
        return { ok: false, error: String(e) };
    }
}

// ---------------- 二维码（自实现编码器，Byte 模式，ECC 级 M，版本 1-25） ----------------
const GF_EXP = new Uint8Array(512), GF_LOG = new Uint8Array(256);
(function () {
    let x = 1;
    for (let i = 0; i < 255; i++) { GF_EXP[i] = x; GF_LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
    for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();
function gfMul(a, b) { if (a === 0 || b === 0) return 0; return GF_EXP[GF_LOG[a] + GF_LOG[b]]; }
function rsGenPoly(n) {
    let poly = [1];
    for (let i = 0; i < n; i++) {
        const np = new Array(poly.length + 1).fill(0);
        for (let j = 0; j < poly.length; j++) { np[j] ^= poly[j]; np[j + 1] ^= gfMul(poly[j], GF_EXP[i]); }
        poly = np;
    }
    return poly;
}
function rsEncode(data, ecLen) {
    const gen = rsGenPoly(ecLen);
    const res = new Array(ecLen).fill(0);
    for (const b of data) {
        const f = b ^ res[0];
        res.shift(); res.push(0);
        if (f !== 0) for (let i = 0; i < ecLen; i++) res[i] ^= gfMul(gen[i + 1], f);
    }
    return res;
}
// M 级：每版本每块 EC 码字 / 块数（ISO/IEC 18004）
const ECC_PER_BLOCK_M = [0,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28];
const NUM_BLOCKS_M = [0,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21];
function numRawDataModules(ver) {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
        const na = Math.floor(ver / 7) + 2;
        result -= (25 * na - 10) * na - 55;
        if (ver >= 7) result -= 36;
    }
    return result;
}
function alignPositions(ver) {
    const size = 17 + ver * 4;
    const na = Math.floor(ver / 7) + 2;
    const step = ver === 32 ? 26 : Math.floor((ver * 4 + na * 2 + 1) / (na * 2 - 2)) * 2;
    const pos = [size - 7];
    while (pos[pos.length - 1] - step >= 6) pos.push(pos[pos.length - 1] - step);
    pos.reverse();
    return pos;
}
function qrFormatBits(mask) {
    // EC 级 M → formatBits = 0
    let data = (0 << 3) | mask;
    let rem = data << 10;
    const g = 0x537;
    for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= g << (i - 10);
    return ((data << 10) | rem) ^ 0x5412;
}
function qrEncodeCore(bytes) {
    // 选版本
    let ver = 0;
    for (let v = 1; v <= 25; v++) {
        const dataCw = Math.floor(numRawDataModules(v) / 8) - ECC_PER_BLOCK_M[v] * NUM_BLOCKS_M[v];
        if (bytes.length <= dataCw - 2) { ver = v; break; }  // 预留模式头最多 2 字节
    }
    if (!ver) return null;
    const size = 17 + ver * 4;
    const nBlocks = NUM_BLOCKS_M[ver], ecPer = ECC_PER_BLOCK_M[ver];
    const totalCw = Math.floor(numRawDataModules(ver) / 8) - nBlocks * ecPer;
    // 数据比特流
    const bits = [];
    const push = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); };
    push(4, 4);
    push(bytes.length, ver < 10 ? 8 : 16);
    for (const b of bytes) push(b, 8);
    const capBits = totalCw * 8;
    push(0, Math.min(4, capBits - bits.length));
    while (bits.length % 8) bits.push(0);
    const dataCW = [];
    for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; dataCW.push(b); }
    const pads = [0xec, 0x11]; let pIdx = 0;
    while (dataCW.length < totalCw) dataCW.push(pads[pIdx++ % 2]);
    // 分块 + 纠错
    const shortBlocks = nBlocks - (totalCw % nBlocks);
    const blocks = [], ecBlocks = [];
    let off = 0;
    for (let i = 0; i < nBlocks; i++) {
        const len = Math.floor(totalCw / nBlocks) + (i < shortBlocks ? 0 : 1);
        const d = dataCW.slice(off, off + len); off += len;
        blocks.push(d);
        ecBlocks.push(rsEncode(d, ecPer));
    }
    const maxDataLen = Math.ceil(totalCw / nBlocks);
    const final = [];
    for (let i = 0; i < maxDataLen; i++) for (const b of blocks) if (i < b.length) final.push(b[i]);
    for (let i = 0; i < ecPer; i++) for (const b of ecBlocks) final.push(b[i]);
    // 矩阵与功能图形
    const mat = Array.from({ length: size }, () => new Array(size).fill(0));
    const reserved = Array.from({ length: size }, () => new Array(size).fill(false));
    const setFn = (r, c, dark) => { if (r >= 0 && r < size && c >= 0 && c < size) { mat[r][c] = dark ? 1 : 0; reserved[r][c] = true; } };
    const placeFinder = (r, c) => {
        for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
            const rr = r + i, cc = c + j;
            if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
            const dark = (i >= 0 && i <= 6 && j >= 0 && j <= 6) &&
                (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
            setFn(rr, cc, dark);
        }
    };
    placeFinder(0, 0); placeFinder(0, size - 7); placeFinder(size - 7, 0);
    for (let i = 8; i < size - 8; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    const apos = alignPositions(ver);
    for (const r of apos) for (const c of apos) {
        if (reserved[r] && reserved[r][c]) continue;
        for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++)
            setFn(r + i, c + j, Math.max(Math.abs(i), Math.abs(j)) !== 1);
    }
    // 保留格式信息区与黑块
    for (let i = 0; i <= 8; i++) {
        if (i !== 6) { reserved[8][i] = true; reserved[i][8] = true; }
    }
    setFn(size - 8, 8, true);
    if (ver >= 7) {
        let rem = ver << 12;
        const g = 0x1f25;
        for (let i = 17; i >= 12; i--) if ((rem >> i) & 1) rem ^= g << (i - 12);
        const vb = (ver << 12) | rem;
        for (let i = 0; i < 18; i++) {
            const dark = ((vb >> i) & 1) !== 0;
            const r = Math.floor(i / 3), c = size - 11 + (i % 3);
            setFn(r, c, dark); setFn(c, r, dark);
        }
    }
    // 数据放置
    let bitIdx = 0, upward = true;
    for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        for (let i = 0; i < size; i++) {
            const row = upward ? size - 1 - i : i;
            for (const cc of [col, col - 1]) {
                if (!reserved[row][cc]) {
                    let bit = 0;
                    if (bitIdx < final.length * 8) { bit = (final[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1; bitIdx++; }
                    mat[row][cc] = bit;
                }
            }
        }
        upward = !upward;
    }
    // 掩码择优
    let best = null, bestPen = Infinity;
    for (let mask = 0; mask < 8; mask++) {
        const m2 = mat.map(r => r.slice());
        for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
            if (reserved[r][c]) continue;
            let flip = false;
            switch (mask) {
                case 0: flip = (r + c) % 2 === 0; break;
                case 1: flip = r % 2 === 0; break;
                case 2: flip = c % 3 === 0; break;
                case 3: flip = (r + c) % 3 === 0; break;
                case 4: flip = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; break;
                case 5: flip = ((r * c) % 2 + (r * c) % 3) % 2 === 0; break;
                case 6: flip = (((r * c) % 2 + (r * c) % 3) % 2) === 0; break;
                case 7: flip = (((r + c) % 2 + (r * c) % 3) % 2) === 0; break;
            }
            if (flip) m2[r][c] = m2[r][c] ? 0 : 1;
        }
        // 绘制格式信息
        const f = qrFormatBits(mask);
        const fb = [];
        for (let i = 0; i < 15; i++) fb.push((f >> i) & 1);
        const c1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
        for (let i = 0; i < 15; i++) m2[c1[i][0]][c1[i][1]] = fb[i];
        for (let i = 0; i <= 6; i++) m2[size - 1 - i][8] = fb[i];
        for (let i = 7; i < 15; i++) m2[8][size - 8 + (i - 7)] = fb[i];
        const pen = qrPenalty(m2, size);
        if (pen < bestPen) { bestPen = pen; best = m2; }
    }
    return { size, mat: best, ver };
}
function qrPenalty(m, size) {
    let p = 0;
    for (let r = 0; r < size; r++) {
        let run = 1;
        for (let c = 1; c < size; c++) {
            if (m[r][c] === m[r][c - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p += 1; }
            else run = 1;
        }
    }
    for (let c = 0; c < size; c++) {
        let run = 1;
        for (let r = 1; r < size; r++) {
            if (m[r][c] === m[r - 1][c]) { run++; if (run === 5) p += 3; else if (run > 5) p += 1; }
            else run = 1;
        }
    }
    for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) {
        if (m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) p += 3;
    }
    return p;
}
let __qrSeq = 100;
function qrToDataUrl(text, size) {
    const bytes = new TextEncoder().encode(String(text));
    const res = qrEncodeCore(bytes);
    if (!res) return null;
    const { size: n, mat } = res;
    const quiet = 4;
    const scale = Math.max(2, Math.floor((size || 400) / (n + quiet * 2)));
    const dim = (n + quiet * 2) * scale;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = dim;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = "#000000";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        if (mat[r][c] === 1) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
    }
    const url = canvas.toDataURL("image/png");
    const h = ++__qrSeq;
    __imgs.set(h, { url, b64: url.split(",")[1], w: dim, h: dim });
    return { h, size: dim };
}
// ---------------- 异步操作派发 ----------------
async function resolveDataUrl(path) {
    const url = resolveSrc(path);
    if (url.startsWith("data:") || url.startsWith("blob:")) return url;
    if (/^https?:/.test(url)) {
        const r = await fetch(url);
        const blob = await r.blob();
        return await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
    }
    return null;
}

function loadImageEl(url) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.onerror = () => rej(new Error("图像加载失败: " + url));
        img.src = url;
    });
}

async function opImg(a, done) {
    try {
        if (a.img) {
            // 基于已有图像操作
            const src = __imgs.get(a.img);
            if (!src) throw new Error("图像不存在");
            const imgEl = await loadImageEl(src.url);
            const canvas = document.createElement("canvas");
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(imgEl, 0, 0);
            if (a.op === "rotate") {
                const deg = a.a1 || 0;
                const rad = deg * Math.PI / 180;
                const w = canvas.width, h = canvas.height;
                const c2 = document.createElement("canvas");
                c2.width = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
                c2.height = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
                const cx = c2.getContext("2d");
                cx.translate(c2.width / 2, c2.height / 2);
                cx.rotate(rad);
                cx.drawImage(canvas, -w / 2, -h / 2);
                canvas.width = c2.width; canvas.height = c2.height;
                canvas.getContext("2d").drawImage(c2, 0, 0);
            } else if (a.op === "scale") {
                const c2 = document.createElement("canvas");
                if (a.a3 !== undefined) {
                    c2.width = a.a1; c2.height = a.a2;
                } else {
                    c2.width = canvas.width * (a.a1 || 1);
                    c2.height = canvas.height * (a.a1 || 1);
                }
                c2.getContext("2d").drawImage(canvas, 0, 0, c2.width, c2.height);
                canvas.width = c2.width; canvas.height = c2.height;
                canvas.getContext("2d").drawImage(c2, 0, 0);
            } else if (a.op === "flip") {
                const c2 = document.createElement("canvas");
                c2.width = canvas.width; c2.height = canvas.height;
                const cx = c2.getContext("2d");
                if (a.a1 === "y") { cx.translate(0, canvas.height); cx.scale(1, -1); }
                else { cx.translate(canvas.width, 0); cx.scale(-1, 1); }
                cx.drawImage(canvas, 0, 0);
                canvas.width = c2.width; canvas.height = c2.height;
                canvas.getContext("2d").drawImage(c2, 0, 0);
            }
            const url = canvas.toDataURL("image/png");
            const h = ++__qrSeq;
            __imgs.set(h, { url, b64: url.split(",")[1], w: canvas.width, h: canvas.height });
            done({ h, w: canvas.width, hh: canvas.height });
        } else {
            // 加载新图像（含裁剪/旋转）
            const url = await resolveDataUrl(a.src);
            if (!url) throw new Error("图像路径无效: " + a.src);
            const imgEl = await loadImageEl(url);
            let w = imgEl.naturalWidth, hgt = imgEl.naturalHeight;
            let sx = 0, sy = 0, sw = w, sh = hgt;
            if (a.w !== undefined) { sx = a.x; sy = a.y; sw = a.w; sh = a.h; }
            const canvas = document.createElement("canvas");
            canvas.width = sw; canvas.height = sh;
            const ctx = canvas.getContext("2d");
            if (a.rotate) {
                const rad = a.rotate * Math.PI / 180;
                const c2 = document.createElement("canvas");
                c2.width = Math.abs(sw * Math.cos(rad)) + Math.abs(sh * Math.sin(rad));
                c2.height = Math.abs(sw * Math.sin(rad)) + Math.abs(sh * Math.cos(rad));
                const cx = c2.getContext("2d");
                cx.translate(c2.width / 2, c2.height / 2);
                cx.rotate(rad);
                cx.drawImage(imgEl, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
                canvas.width = c2.width; canvas.height = c2.height;
                canvas.getContext("2d").drawImage(c2, 0, 0);
            } else {
                ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, sw, sh);
            }
            const outUrl = canvas.toDataURL("image/png");
            const h = ++__qrSeq;
            __imgs.set(h, { url: outUrl, b64: outUrl.split(",")[1], w: canvas.width, h: canvas.height });
            done({ h, w: canvas.width, hh: canvas.height });
        }
    } catch (e) {
        __err("img: " + e.message);
        done({ h: 0, w: 0, hh: 0 });
    }
}

async function opHs(a, done) {
    try {
        const headers = {};
        if (a.headers) {
            for (const h of String(a.headers).split("||")) {
                const i = h.indexOf("=");
                if (i > 0) headers[h.slice(0, i)] = h.slice(i + 1);
            }
        }
        if (a.cookie) headers["Cookie"] = a.cookie;
        let method = "GET";
        let body = undefined;
        if (a.post) {
            method = "POST";
            if (a.post.trim().startsWith("{")) {
                headers["Content-Type"] = headers["Content-Type"] || "application/json";
                body = a.post;
            } else {
                headers["Content-Type"] = headers["Content-Type"] || "application/x-www-form-urlencoded";
                body = a.post.replace(/\\&/g, "&");
            }
        }
        const r = await fetch(a.url, { method, headers, body });
        let text;
        try {
            const buf = await r.arrayBuffer();
            const cs = (a.charset || "utf-8").toLowerCase();
            text = new TextDecoder(cs).decode(buf);
        } catch (e) { text = await r.text(); }
        done({ code: r.status, body: text });
    } catch (e) {
        done({ code: -1, body: "" });
    }
}

async function opHd(a, done) {
    try {
        const path = fsNorm("/sd/" + a.name.replace(/^%/, ""));
        if (__fs.has(path) && !a.ow) { done({ status: 1 }); return; }
        const headers = {};
        if (a.headers) for (const h of String(a.headers).split("||")) {
            const i = h.indexOf("=");
            if (i > 0) headers[h.slice(0, i)] = h.slice(i + 1);
        }
        let method = "GET", body;
        if (a.post) {
            method = "POST";
            headers["Content-Type"] = a.post.trim().startsWith("{") ? "application/json" : "application/x-www-form-urlencoded";
            body = a.post;
        }
        const r = await fetch(a.url, { method, headers, body });
        if (!r.ok) { done({ status: -1 }); return; }
        const blob = await r.blob();
        const b64 = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); });
        __fs.set(path, { data: b64, b64: true });
        done({ status: 0 });
    } catch (e) { done({ status: -1 }); }
}

async function opHuf(a, done) {
    try {
        const fd = new FormData();
        for (const kv of String(a.form || "").split("&")) {
            const i = kv.indexOf("=");
            if (i > 0) fd.append(kv.slice(0, i), kv.slice(i + 1).replace(/\\&/g, "&"));
        }
        for (const fp of String(a.files || "").split("|")) {
            if (!fp) continue;
            let name = "file", p = fp;
            if (fp.includes("\n")) { const [n, rest] = fp.split("\n"); name = n; p = rest; }
            const url = await resolveDataUrl(p);
            if (url) {
                const blob = await (await fetch(url)).blob();
                fd.append(name, blob, p.split("/").pop());
            }
        }
        const headers = {};
        if (a.headers) for (const h of String(a.headers).split("||")) {
            const i = h.indexOf("=");
            if (i > 0) headers[h.slice(0, i)] = h.slice(i + 1);
        }
        const r = await fetch(a.url, { method: "POST", body: fd, headers });
        done({ body: await r.text() });
    } catch (e) { done({ body: "" }); }
}

async function opUjp(a, done) {
    try {
        // 截屏：将屏幕区域序列化为 SVG foreignObject 渲染到 canvas
        const w = __opts.width, h = __opts.height;
        const clone = __screen.cloneNode(true);
        clone.style.cssText = __screen.style.cssText;
        // 简单内联样式拷贝（部分效果可能丢失）
        const ser = new XMLSerializer().serializeToString(clone);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
            <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px;position:relative;background:#fff;">
            ${ser}</div></foreignObject></svg>`;
        const img = new Image();
        const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", (a.q || 70) / 100);
        const b64 = dataUrl.split(",")[1];
        __fs.set(fsNorm(a.path), { data: b64, b64: true });
        done({});
    } catch (e) {
        __err("ujp 截屏失败（跨域图像无法截取）: " + e.message);
        done({});
    }
}

async function opCam(a, done) {
    try {
        const c = __ctrls.get(a.ctrl);
        if (!c) throw new Error("面控件不存在");
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: a.front ? "user" : "environment" }, audio: false
        });
        __camStreams.set(a.cam, stream);
        const video = document.createElement("video");
        video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;";
        video.autoplay = true; video.muted = true; video.playsInline = true;
        video.srcObject = stream;
        c.el.style.position = c.el.style.position || "relative";
        c.el.appendChild(video);
        c._camVideo = video;
        done({});
    } catch (e) {
        __err("摄像头启动失败: " + e.message);
        done({});
    }
}

async function opCamShot(a, done) {
    try {
        const c = __ctrls.get(a.ctrl);
        const stream = __camStreams.get(a.cam);
        if (!stream) throw new Error("摄像头未开启");
        const video = c?._camVideo;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const b64 = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
        __fs.set(fsNorm(a.path), { data: b64, b64: true });
        done({});
    } catch (e) {
        __err("拍照失败: " + e.message);
        done({});
    }
}

IYUHost.asyncOp = function (taskId, op, argsStr) {
    let a = {};
    try { a = JSON.parse(argsStr); } catch (e) {}
    const token = a.token;
    a = a.args || {};
    const done = (result) => {
        if (!taskId) return;
        const pj = cstr(JSON.stringify(result));
        try { __M._iyu_async_done(taskId, token, pj); ensurePump(); } catch (e) { __err(e.message); }
        cstrFree(pj);
    };
    switch (op) {
        case "hs": opHs(a, done); break;
        case "hd": opHd(a, done); break;
        case "huf": opHuf(a, done); break;
        case "sql": sqlExec(a.db, a.sql).then(r => done(r)); break;
        case "sqlite":
            if (a.act === "open") idbOpen(a.name).then(() => done({ ok: true })).catch(() => done({ ok: false }));
            else if (a.act === "ip") {
                indexedDB.databases?.().then(list => done({ ok: list.some(d => d.name === "iyu_" + a.name) })).catch(() => done({ ok: false }));
            } else if (a.act === "del") {
                __dbs.delete(a.name);
                indexedDB.deleteDatabase("iyu_" + a.name).onsuccess = () => done({ ok: true });
            }
            break;
        case "ujp": opUjp(a, done); break;
        case "cam": opCam(a, done); break;
        case "camshot": opCamShot(a, done); break;
        case "img": case "imgop": opImg(a, done); break;
        case "menu":
            showMenu(a.items || []).then(idx => done({ idx }));
            break;
        // ---- 即发即忘（taskId=0） ----
        case "tws": showTws(a); break;
        case "notify": showNotify(a); break;
        case "share":
            if (navigator.share) navigator.share({ title: a.title, text: a.text }).catch(() => {});
            else { try { navigator.clipboard.writeText(a.text); } catch (e) {} __log(0, "ushsp: 已复制到剪贴板"); }
            break;
        case "openfile": {
            const f = __fs.get(fsNorm(a.path));
            if (f) {
                const mime = { png: "image/png", jpg: "image/jpeg", mp3: "audio/mpeg", mp4: "video/mp4", webm: "video/webm", txt: "text/plain" }[a.path.split(".").pop()] || "application/octet-stream";
                const url = f.b64 ? `data:${mime};base64,${f.data}` : URL.createObjectURL(new Blob([f.data]));
                const link = document.createElement("a");
                link.href = url; link.download = a.path.split("/").pop();
                link.click();
            }
            break;
        }
        case "wakelock":
            if (a.keep && navigator.wakeLock) navigator.wakeLock.request("screen").catch(() => {});
            break;
        case "uxfshow": {
            const el = instEl(a.inst);
            if (el) {
                __uxfLayer.appendChild(el);
                positionUxf(a.inst, a.w, a.h, a.gravity);
            }
            break;
        }
        case "uxfrefresh": positionUxfFromProps(a.inst); break;
        case "uxfset": {
            const el = instEl(a.inst);
            if (el) {
                el.dataset.uxfX = a.x; el.dataset.uxfY = a.y;
                el.dataset.uxfW = a.w; el.dataset.uxfH = a.h;
                positionUxfFromProps(a.inst);
            }
            break;
        }
        case "renderList": {
            const ctrlId = a.ctrl;
            if (!ctrlId) break;
            const count = a.idx !== undefined ? 1 : undefined;
            rebuildList(ctrlId);
            break;
        }
        case "bindList": {
            const c = __ctrls.get(a.ctrl);
            if (c) {
                c.el.innerHTML = "";
                c._listCount = a.count;
                for (let i = 0; i < a.count; i++) {
                    const item = document.createElement("div");
                    item.style.cssText = `width:${a.w === -1 ? "100%" : a.w + "px"};height:${a.h === -2 ? "auto" : a.h === -1 ? "100%" : a.h + "px"};border-bottom:1px solid #f5f5f5;box-sizing:border-box;`;
                    item.dataset.idx = i;
                    c.el.appendChild(item);
                    const cid = __uid();
                    __ctrls.set(cid, { id: cid, el: item, type: "iyu_itemhost", props: {}, parent: a.ctrl, kids: [], inst: 0, obj: item });
                    try { __M._iyu_list_item(a.ctrl, i, cid); } catch (e) { __err(e.message); }
                    item.addEventListener("click", () => {
                        fireCtrl(c, "clickitem", { st_pN: i });
                    });
                }
                ensurePump();
            }
            break;
        }
        case "simpleList": renderSimpleData(__ctrls.get(a.ctrl), a.data); break;
        case "pagerAdd": {
            const c = __ctrls.get(a.ctrl);
            const el = instEl(a.inst);
            if (c && el) {
                const page = document.createElement("div");
                page.style.cssText = "flex:0 0 100%;scroll-snap-align:start;height:100%;overflow-y:auto;";
                page.appendChild(el);
                c.el.appendChild(page);
                __pagerTitles.set(a.ctrl + ":" + (c.el.children.length - 1), a.title);
                renderPagerTabs(c);
            }
            break;
        }
        case "pagerDel": {
            const c = __ctrls.get(a.ctrl);
            if (c) { const idx = a.idx < 0 ? c.el.children.length - 1 : a.idx; c.el.children[idx]?.remove(); renderPagerTabs(c); }
            break;
        }
        case "pagerTitle": break;
        case "pagerBind": case "pagerClear": {
            const c = __ctrls.get(a.ctrl);
            if (c && a.op === "pagerClear") c.el.innerHTML = "";
            break;
        }
        case "download": {
            // hdfl/hdda 下载项
            (async () => {
                try {
                    const r = await fetch(a.url);
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    const blob = await r.blob();
                    const b64 = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); });
                    let path = a.path || ((a.dir || "/sd") + "/" + (a.name || a.url.split("/").pop()));
                    __fs.set(fsNorm(path), { data: b64, b64: true });
                    try { __M._iyu_dl_done(a.dl, a.idx, 2); } catch (e) {}
                    ensurePump();
                } catch (e) {
                    try { __M._iyu_dl_done(a.dl, a.idx, -1); } catch (e2) {}
                    ensurePump();
                }
            })();
            break;
        }
        default:
            __err("未知异步操作: " + op);
            done({});
    }
};

function instEl(inst) {
    for (const [id, c] of __ctrls) {
        if ((c.type === "iyu_root" || c.type === "iyu_dialoghost") && c.inst === inst) return c.el;
    }
    return null;
}

function positionUxf(inst, w, h, gravity) {
    const el = instEl(inst);
    if (!el) return;
    el.style.position = "absolute";
    el.style.pointerEvents = "auto";
    el.style.background = "#fff";
    el.style.boxShadow = "0 4px 20px rgba(0,0,0,.35)";
    el.style.zIndex = "5";
    el.style.borderRadius = "8px";
    applyUxfDims(el, w, h, gravity);
    el.dataset.uxfW = w; el.dataset.uxfH = h; el.dataset.uxfG = gravity;
}
function applyUxfDims(el, w, h, gravity) {
    const g = String(gravity || "center").split("|");
    el.style.width = dimToCss(w) === "100%" ? "100%" : (w === -1 ? "auto" : dimToCss(w) || "auto");
    el.style.height = h === -1 ? "auto" : dimToCss(h) || "auto";
    el.style.left = g.includes("right") ? "auto" : "10px";
    el.style.right = g.includes("right") ? "10px" : "auto";
    el.style.top = g.includes("bottom") ? "auto" : "10px";
    el.style.bottom = g.includes("bottom") ? "10px" : "auto";
}
function positionUxfFromProps(inst) {
    const el = instEl(inst);
    if (!el) return;
    const x = parseFloat(el.dataset.uxfX);
    const y = parseFloat(el.dataset.uxfY);
    if (!isNaN(x)) el.style.left = x + "px";
    if (!isNaN(y)) el.style.top = y + "px";
}

function rebuildList(ctrlId) {
    const c = __ctrls.get(ctrlId);
    if (!c) return;
    const count = c._listCount || 0;
    c.el.innerHTML = "";
    // 重建由 C++ 侧通过 renderList 触发时无法拿到数量，通知引擎重新 bindList
    // 简化：保留占位，条目重建由引擎的 renderList 回调处理
}

function showTws(a) {
    const bar = document.createElement("div");
    bar.style.cssText = `position:absolute;left:0;right:0;bottom:0;background:#323232;color:#fff;padding:12px 16px;
        display:flex;align-items:center;justify-content:space-between;font-size:14px;z-index:940;animation:iyu-fadein .2s;`;
    const txt = document.createElement("span");
    txt.textContent = a.text;
    bar.appendChild(txt);
    if (a.btn) {
        const b = document.createElement("button");
        b.textContent = a.btn;
        b.style.cssText = "border:none;background:none;color:#8ab4f8;cursor:pointer;font-size:14px;";
        b.addEventListener("click", () => { bar.remove(); __M._iyu_utw_btn(a.handle, 1); ensurePump(); });
        bar.appendChild(b);
    }
    __frame.appendChild(bar);
    setTimeout(() => bar.remove(), a.dur === -2 ? 4000 : a.dur === -1 ? 3000 : 2200);
}

async function showNotify(a) {
    try {
        if (!("Notification" in window)) { __log(1, "浏览器不支持通知"); return; }
        let perm = Notification.permission;
        if (perm !== "granted") perm = await Notification.requestPermission();
        if (perm !== "granted") { __log(1, "通知权限被拒绝"); return; }
        const n = new Notification(a.title, { body: a.body, tag: String(a.handle) });
        n.onclick = () => { window.focus(); __M._iyu_utw_btn(a.handle, 1); ensurePump(); };
    } catch (e) { __log(1, "通知失败: " + e.message); }
}

function renderPagerTabs(c) {
    if (!c._tabs) return;
    c._tabs.innerHTML = "";
    for (let i = 0; i < c.el.children.length; i++) {
        const t = document.createElement("div");
        t.textContent = __pagerTitles.get(c.id + ":" + i) || ("页 " + (i + 1));
        t.style.cssText = "padding:10px 16px;cursor:pointer;white-space:nowrap;flex:0 0 auto;font-size:13px;";
        t.dataset.idx = i;
        c._tabs.appendChild(t);
    }
}
const __sockState = new Map();

// ---------------- 同步桥派发 ----------------
function jsValToIyu(v) {
    if (v === undefined || v === null) return null;
    if (typeof v === "number" || typeof v === "boolean") return v;
    if (typeof v === "string") return v;
    if (typeof v === "function") { const h = ++__qrSeq + 100000; __jsObjs.set(h, v); return { __h: h }; }
    const h = ++__qrSeq + 100000;
    __jsObjs.set(h, v);
    return { __h: h };
}
function jsArg(v) {
    // 还原 {"__h":n} → JS 对象
    if (v && typeof v === "object" && typeof v.__h === "number") return __jsObjs.get(v.__h);
    return v;
}
function getHandleObj(h) {
    if (typeof h === "object" && h !== null && typeof h.__h === "number") return __jsObjs.get(h.__h);
    if (typeof h === "number") return __jsObjs.get(h);
    return h;
}

IYUHost.bridgeSync = function (op, argsStr) {
    let a = {};
    try { a = JSON.parse(argsStr || "{}"); } catch (e) {}
    switch (op) {
        case "fs": return fsOp(a);
        case "sr": {
            let s = String(a.s ?? "");
            if (a.re) {
                try { s = s.replace(new RegExp(a.from, "g"), a.to.replace(/\$(\d)/g, (_, d) => "$" + d)); } catch (e) {}
            } else {
                s = s.split(a.from).join(a.to);
            }
            return { r: s };
        }
        case "split": {
            try { return { list: String(a.s).split(new RegExp(a.sep)) }; }
            catch (e) { return { list: [a.s] }; }
        }
        case "enc": {
            const s = String(a.s ?? "");
            if (a.mode === 1) return { r: encodeURIComponent(s) };
            let out = "";
            for (const ch of s) {
                if (/[\x00-\x7f]/.test(ch)) out += ch;
                else out += encodeURIComponent(ch);
            }
            return { r: out };
        }
        case "dec": {
            try { return { r: decodeURIComponent(String(a.s ?? "")) }; } catch (e) { return { r: a.s }; }
        }
        case "b64": {
            if (a.enc === 1) return { r: btoa(unescape(encodeURIComponent(String(a.s ?? "")))) };
            try { return { r: decodeURIComponent(escape(atob(String(a.s ?? "")))) }; } catch (e) { return { r: "" }; }
        }
        case "time": {
            const d = new Date();
            const spec = String(a.spec ?? "0");
            const p2 = (n) => String(n).padStart(2, "0");
            const week = "日一二三四五六"[d.getDay()];
            if (/^[0-5]$/.test(spec)) {
                const fmts = [
                    `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`,
                    `${d.getFullYear()}/${p2(d.getMonth() + 1)}/${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`,
                    `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`,
                    `${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`,
                    String(d.getTime()),
                    `${d.getFullYear()}年${p2(d.getMonth() + 1)}月${p2(d.getDate())}日 ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`
                ];
                return { r: fmts[parseInt(spec)] };
            }
            // 自定义格式
            let out = "";
            for (const ch of spec) {
                switch (ch) {
                    case "Y": out += d.getFullYear(); break;
                    case "m": out += p2(d.getMonth() + 1); break;
                    case "d": out += p2(d.getDate()); break;
                    case "H": out += p2(d.getHours()); break;
                    case "M": out += p2(d.getMinutes()); break;
                    case "S": out += p2(d.getSeconds()); break;
                    case "a": case "A": out += "星期" + week; break;
                    default: out += ch;
                }
            }
            return { r: out };
        }
        case "screen": {
            const what = a.what;
            const map = {
                w: __opts.width, h: __opts.height - 22, hh: __opts.height,
                pxw: __opts.width, pxh: __opts.height - 22, pxhh: __opts.height,
                pxztl: 22, pxbvk: 0
            };
            return { r: map[what] ?? 0 };
        }
        case "device": {
            return { list: ["JS/WASM", "0", __opts.width, __opts.height - 22, __opts.width, __opts.height,
                       "Browser", navigator.platform || "Web", "wasm"] };
        }
        case "clipwrite":
            try { navigator.clipboard.writeText(a.s).catch(() => {}); } catch (e) {}
            try {
                const ta = document.createElement("textarea");
                ta.value = a.s; document.body.appendChild(ta); ta.select();
                document.execCommand("copy"); ta.remove();
            } catch (e) {}
            return {};
        case "clipread":
            return { r: window.__iyuClipboard || "" };
        case "blur": {
            const ae = document.activeElement;
            if (ae && ae.blur) ae.blur();
            return {};
        }
        case "lan": {
            const el = instEl(a.inst);
            if (el && a.n >= 0) {
                el.classList.remove(...[...el.classList].filter(c => c.startsWith("iyu-lan")));
                el.classList.add("iyu-lan-" + (a.n === 6 ? 6 : a.n === 7 ? 7 : a.n === 10 ? 10 : 0));
            }
            return {};
        }
        case "show": {
            const el = instEl(a.inst);
            if (el) el.style.display = "";
            return {};
        }
        case "eval": {
            try {
                const r = (0, eval)(a.code);
                return jsValToIyu(r === undefined ? null : r);
            } catch (e) { return { __err: String(e) }; }
        }
        case "wg": return IYUHost.widgetGet(a.id, a.k, a.extra);
        case "children": {
            const c = __ctrls.get(a.id);
            return JSON.stringify(c ? c.kids : []);
        }
        case "parent": {
            const c = __ctrls.get(a.id);
            return JSON.stringify(c ? (c.parent > 0 ? c.parent : 0) : 0);
        }
        case "childof": {
            const base = __ctrls.get(a.id);
            if (!base) return false;
            const walk = (cid) => {
                const cc = __ctrls.get(cid);
                if (!cc) return false;
                if (cid === a.cid) return true;
                return cc.kids.some(walk);
            };
            return base.kids.some(walk) || walk(a.cid);
        }
        case "utb": {
            // 工具栏设置：set title/subtitle/left/right 或绑定工具栏控件
            if (a["0"] !== undefined && typeof a["0"] === "number") {
                const c = __ctrls.get(a["0"]);
                if (c) __frame._iyuToolbar = c;
            } else if (a["0"] === "set") {
                const tc = __frame._iyuToolbar;
                if (tc) {
                    if (a["1"] === "title") applyProp(tc, "text", a["2"]);
                    else if (a["1"] === "subtitle") { const sub = tc.el.querySelector(".iyu-tb-sub") || (() => { const s = document.createElement("span"); s.className = "iyu-tb-sub"; s.style.fontSize = "11px"; tc.el.appendChild(s); return s; })(); sub.textContent = a["2"]; }
                    else if (a["1"] === "left") { const ic = document.createElement("img"); ic.src = resolveSrc(a["2"]); ic.style.cssText = "height:22px;cursor:pointer;"; tc.el.prepend(ic); }
                    else if (a["1"] === "right") { const ic = document.createElement("img"); ic.src = resolveSrc(a["2"]); ic.style.cssText = "height:22px;cursor:pointer;margin-left:auto;"; tc.el.appendChild(ic); }
                }
            } else if (a["0"] === "get") {
                const tc = __frame._iyuToolbar;
                if (a["1"] === "title") return tc ? (tc.el.textContent || "") : "";
            }
            return {};
        }
        case "hsas": {
            const c = __ctrls.get(a.ctrl);
            if (c && c.el.tagName === "IFRAME" && a.on) {
                const inject = () => {
                    try {
                        const win = c.el.contentWindow;
                        if (!win || win.__iyuBridge) return;
                        win.__iyuBridge = true;
                        win.iapp = {
                            fn: (code) => { const p = cstr(String(code)); __M._iyu_ifn(p); cstrFree(p); ensurePump(); },
                            fn2: (code, v) => {
                                const p1 = cstr(String(code ?? "")), p2 = cstr(String(v ?? ""));
                                const rp = __M._iyu_ifn2(p1, p2);
                                const r = __M.UTF8ToString(rp);
                                cstrFree(p1); cstrFree(p2);
                                return r;
                            },
                            s: (n, v) => { const p1 = cstr(String(n)), p2 = cstr(String(v)); __M._iyu_iset(p1, p2); cstrFree(p1); cstrFree(p2); },
                            g: (n) => {
                                const p1 = cstr(""), p2 = cstr(String(n ?? ""));
                                const rp = __M._iyu_ifn2(p1, p2);
                                const r = __M.UTF8ToString(rp);
                                cstrFree(p1); cstrFree(p2);
                                return r;
                            }
                        };
                    } catch (e) {}
                };
                c.el.addEventListener("load", inject);
                inject();
            }
            return {};
        }
        case "haseval": {
            const c = __ctrls.get(a.ctrl);
            try { c?.el.contentWindow?.eval(a.code); } catch (e) { __err("has: " + e.message); }
            return {};
        }
        case "bfm": {
            let pid = a.pid;
            if (!pid || !__audio.has(pid)) pid = ++__qrSeq + 200000;
            let audio = __audio.get(pid);
            if (!audio) { audio = new Audio(); __audio.set(pid, audio); }
            audio.src = resolveSrc(a.path);
            audio.play().catch(() => {});
            return { pid };
        }
        case "bfms": {
            const audio = __audio.get(a.pid);
            if (!audio) return 0;
            switch (a.op) {
                case "st": audio.play().catch(() => {}); return {};
                case "pe": audio.pause(); return {};
                case "sp": audio.pause(); audio.currentTime = 0; return {};
                case "re": audio.pause(); __audio.delete(a.pid); return {};
                case "ip": return audio.paused ? 0 : 1;
                case "dn": return isNaN(audio.duration) ? 0 : Math.round(audio.duration * 1000);
                case "cn": return Math.round(audio.currentTime * 1000);
                case "seekto": audio.currentTime = (a.vals?.[0] || 0) / 1000; return {};
                case "volume": audio.volume = Math.min(1, a.vals?.[0] ?? 1); return {};
                case "sl": audio.loop = !!a.vals?.[0]; return {};
            }
            return {};
        }
        case "bfvss": {
            const c = __ctrls.get(a.ctrl);
            const v = c?.el;
            if (!v || v.tagName !== "VIDEO") return 0;
            switch (a.op) {
                case "st": v.play().catch(() => {}); return {};
                case "pe": v.pause(); return {};
                case "sp": v.pause(); v.currentTime = 0; return {};
                case "seekto": v.currentTime = (parseFloat(a.val) || 0) / 1000; return {};
                case "ip": return v.paused ? 0 : 1;
                case "dn": return isNaN(v.duration) ? 0 : Math.round(v.duration * 1000);
                case "cn": return Math.round(v.currentTime * 1000);
                case "media": return {};
            }
            return {};
        }
        case "recstart": {
            (async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const rec = new MediaRecorder(stream);
                    const chunks = [];
                    rec.ondataavailable = (e) => chunks.push(e.data);
                    rec.start();
                    __recs.set(a.rec, { rec, chunks });
                    return { ok: true };
                } catch (e) { __log(1, "录音启动失败: " + e.message); return { ok: false }; }
            })();
            return { ok: true };
        }
        case "recstop": {
            const r = __recs.get(a.rec);
            if (!r) return {};
            return new Promise((res) => {
                r.rec.onstop = async () => {
                    r.rec.stream.getTracks().forEach(t => t.stop());
                    const blob = new Blob(r.chunks, { type: r.rec.mimeType });
                    const b64 = await new Promise((res2) => { const fr = new FileReader(); fr.onload = () => res2(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); });
                    __recs.delete(a.rec);
                    res({ b64 });
                };
                r.rec.stop();
            });
        }
        case "scrrec": {
            if (a.op === "config") { __scrRec = { path: a.path }; return {}; }
            if (a.op === "st") {
                (async () => {
                    try {
                        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                        const rec = new MediaRecorder(stream);
                        rec.start();
                        __scrRec.rec = rec; __scrRec.stream = stream;
                    } catch (e) { __log(1, "录屏启动失败: " + e.message); }
                })();
                return true;
            }
            if (a.op === "sp" && __scrRec?.rec) {
                return new Promise((res) => {
                    __scrRec.rec.onstop = async () => {
                        const chunks = [];
                        // 简化：不保存实际数据
                        __scrRec.stream.getTracks().forEach(t => t.stop());
                        res(true);
                    };
                    __scrRec.rec.stop();
                });
            }
            if (a.op === "ip") return !!__scrRec?.rec;
            if (a.op === "re") { __scrRec = null; return true; }
            return {};
        }
        case "vibrate": {
            if (!navigator.vibrate) return {};
            if (a.pattern) navigator.vibrate(String(a.pattern).split(/\s+/).map(Number));
            else navigator.vibrate(a.ms || 0);
            return {};
        }
        case "tts": {
            if (!window.speechSynthesis) return 0;
            switch (a.op) {
                case "st": {
                    const u = new SpeechSynthesisUtterance(a.text);
                    if (a.lang) u.lang = a.lang === "zh" ? "zh-CN" : a.lang === "en" ? "en-US" : a.lang;
                    if (a.rate) u.rate = a.rate;
                    if (a.pitch) u.pitch = a.pitch;
                    speechSynthesis.speak(u);
                    return 1;
                }
                case "lg": case "se": case "ph": return {};
                case "sp": speechSynthesis.cancel(); return 1;
                case "ip": return speechSynthesis.speaking ? 1 : 0;
                case "zt": return 1;
                case "is": return 1;
                case "re": return {};
            }
            return {};
        }
        case "cam": {
            const c = null;
            // 旋转等：暂存
            if (a.op === "sp") {
                const st = __camStreams.get(a.cam);
                st?.getTracks().forEach(t => t.stop());
                __camStreams.delete(a.cam);
            }
            return {};
        }
        case "dhq": {
            const anim = typeof a.anim === "string" ? JSON.parse(a.anim) : a.anim;
            if (a.op === "start") playPropertyAnim(anim);
            if (a.op === "running") return false;
            return {};
        }
        case "dhon": {
            const anim = typeof a.anim === "string" ? JSON.parse(a.anim) : a.anim;
            __animListen.add(anim.id);
            return {};
        }
        case "dhb": {
            const anim = typeof a.anim === "string" ? JSON.parse(a.anim) : a.anim;
            if (a.op === "start") {
                // 动画背景：找绑定控件
                const c = anim._target ? __ctrls.get(anim._target) : null;
                if (c) startFrameAnim(c, anim);
            }
            if (a.op === "running") return false;
            return {};
        }
        case "se": {
            switch (a.op) {
                case "init": {
                    let flags = "";
                    const f = a.flags || 0;
                    if (f & 2) flags += "i";
                    if (f & 8) flags += "m";
                    if (f & 32) flags += "s";
                    const h = ++__qrSeq + 300000;
                    __matchers.set(h, { re: new RegExp(a.pattern, flags), s: String(a.s), pos: 0, last: null });
                    return { h };
                }
                case "find": {
                    const m = __matchers.get(a.h);
                    if (!m) return { ok: false };
                    m.re.lastIndex = a.from >= 0 ? a.from : m.pos;
                    const r = m.re.exec(m.s);
                    if (r) { m.pos = m.re.lastIndex; m.last = r; return { ok: true }; }
                    m.last = null; m.pos = 0;
                    return { ok: false };
                }
                case "ms": {
                    const m = __matchers.get(a.h);
                    if (!m) return { r: false };
                    const full = new RegExp("^(?:" + m.re.source + ")$");
                    return { r: full.test(m.s) };
                }
                case "gl": {
                    const m = __matchers.get(a.h);
                    return { r: m ? m.re.source.replace(/\\./g, ".").length && countGroups(m.re) : 0 };
                }
                case "group": {
                    const m = __matchers.get(a.h);
                    const g = a.n || 0;
                    return { r: m?.last ? (m.last[g] ?? "") : "" };
                }
                case "start": {
                    const m = __matchers.get(a.h);
                    return { r: m?.last ? (m.last.index ?? -1) : -1 };
                }
                case "end": {
                    const m = __matchers.get(a.h);
                    const g = a.n || 0;
                    if (!m?.last) return { r: -1 };
                    if (g === 0) return { r: m.last.index + m.last[0].length };
                    const indices = groupEnd(m.last, m.s);
                    return { r: indices[g] ?? -1 };
                }
                case "sral": case "srft": {
                    const m = __matchers.get(a.h);
                    if (!m) return { r: "" };
                    const tmpl = String(a.tmpl).replace(/\$(\d)/g, "$$$1");
                    if (a.op === "sral") return { r: m.s.replace(new RegExp(m.re.source, "g" + m.re.flags.replace("g", "")), tmpl) };
                    return { r: m.s.replace(new RegExp(m.re.source, m.re.flags.replace("g", "")), tmpl) };
                }
            }
            return {};
        }
        case "qr": {
            const r = qrToDataUrl(a.text, a.size || 400);
            if (!r) { __err("二维码内容过长（最大约 590 字节）"); return {}; }
            return r;
        }
        case "imgget": {
            const img = __imgs.get(a.h);
            if (!img) return {};
            if (a.b64) return { url: img.b64 };
            return { url: img.url };
        }
        case "pagerSize": {
            const c = __ctrls.get(a.ctrl);
            return c ? c.el.children.length : 0;
        }
        case "jsglobal": {
            try {
                const val = (0, eval)(`(${a.name})`);
                return jsValToIyu(val);
            } catch (e) { return null; }
        }
        case "jscall": {
            try {
                const obj = getHandleObj(a.h) ?? window;
                const fn = a.name.split(".").reduce((o, k) => o?.[k], obj) ?? (a.name.split(".").reduce((o, k) => o?.[k], window));
                const args = (a.args || []).map(jsArg);
                const r = typeof fn === "function" ? fn.apply(a.h ? obj : window, args) : undefined;
                return jsValToIyu(r === undefined ? null : r);
            } catch (e) { __err("js.call: " + e.message); return null; }
        }
        case "jsnew": {
            try {
                const ctor = a.cls.split(".").reduce((o, k) => o?.[k], window);
                const args = (a.args || []).map(jsArg);
                return jsValToIyu(new ctor(...args));
            } catch (e) { __err("js.new: " + e.message); return null; }
        }
        case "jsget": {
            try {
                const obj = getHandleObj(a.h) ?? window;
                const v = a.prop.split(".").reduce((o, k) => o?.[k], obj);
                return jsValToIyu(typeof v === "function" ? v.bind(obj) : v);
            } catch (e) { return null; }
        }
        case "jsset": {
            try {
                const obj = getHandleObj(a.h) ?? window;
                const parts = a.prop.split(".");
                const last = parts.pop();
                const target = parts.reduce((o, k) => o?.[k], obj);
                if (target) target[last] = jsArg(a.v);
                return {};
            } catch (e) { return {}; }
        }
        case "jseval": {
            try { return jsValToIyu((0, eval)(a.code)); } catch (e) { __err("js.eval: " + e.message); return null; }
        }
        case "sockopen": {
            const h = a.h;
            try {
                const ws = new WebSocket("ws://" + a.host + ":" + a.port);
                const obj = { ws };
                __jsObjs.set(h + 900000, ws);
                ws.onmessage = (ev) => {
                    const pd = cstr(String(ev.data));
                    try { __M._iyu_sock_msg(h, pd); ensurePump(); } catch (e) {}
                    cstrFree(pd);
                };
                ws.onclose = () => { __sockState.set(h, "closed"); };
                ws.onopen = () => { __sockState.set(h, "open"); };
                __sockState.set(h, "connecting");
            } catch (e) { __err("sot: " + e.message); __sockState.set(h, "closed"); }
            return {};
        }
        case "socksend": {
            const ws = __jsObjs.get(a.h + 900000);
            if (ws && ws.readyState === 1) ws.send(a.msg);
            return {};
        }
        case "sockclose": {
            const ws = __jsObjs.get(a.h + 900000);
            if (ws) { try { ws.close(); } catch (e) {} }
            __sockState.set(a.h, "closed");
            return {};
        }
        case "sockstate": {
            return { r: __sockState.get(a.h) || "closed" };
        }
        case "jscb": {
            window[a.js] = (...args) => {
                const p1 = cstr(a.yu), p2 = cstr(JSON.stringify(args.map(v => jsValToIyu(v))));
                try {
                    __M._iyu_js_cb(p1, p2);
                    ensurePump();
                } catch (e) { __err(e.message); }
                cstrFree(p1); cstrFree(p2);
            };
            return {};
        }
        default:
            __err("未知同步桥操作: " + op);
            return {};
    }
};

function countGroups(re) {
    // 计算捕获组数量
    const src = re.source;
    let n = 0, inClass = false, esc = false;
    for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        if (esc) { esc = false; continue; }
        if (ch === "\\") { esc = true; continue; }
        if (inClass) { if (ch === "]") inClass = false; continue; }
        if (ch === "[") { inClass = true; continue; }
        if (ch === "(" && src[i + 1] !== "?") n++;
    }
    return n;
}
function groupEnd(match, s) {
    // 估算各组结束位置（简化：使用 indices 需要 'd' flag，这里回退用搜索）
    const out = [match.index + match[0].length];
    return out;
}

// ---------------- IYU 公开 API ----------------
const IYU = {
    version: IYU_VERSION,

    async init(options = {}) {
        Object.assign(__opts, options);
        buildFrame();
        fsInit();
        __M = await YuruCreateModule();
        __M._iyuHost = IYUHost;
        __M._iyuOnLog = (level, s) => {
            if (level === 0 && __opts.onLog) { try { __opts.onLog(s); } catch (e) {} }
            if (level !== 0 && __opts.onError) { try { __opts.onError(s); } catch (e) {} }
        };
        return IYU;
    },

    async run(source) {
        if (!__M) throw new Error("请先调用 IYU.init()");
        try { __M._iyu_reset(); } catch (e) {}
        ensurePump();
        const psrc = cstr(String(source));
        const r = __M._iyu_load(psrc);
        cstrFree(psrc);
        ensurePump();
        if (r === -1) {
            const err = __M.UTF8ToString(__M._iyu_last_error());
            __err(err);
            throw new Error(err);
        }
        return IYU;
    },

    async runUrl(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error("加载失败: " + url);
        return IYU.run(await r.text());
    },

    stop() {
        if (__M) { try { __M._iyu_reset(); } catch (e) {} }
    },

    on(event, fn) {
        if (__listeners[event]) __listeners[event].push(fn);
        return IYU;
    },

    get ctrlCount() { return __ctrls.size; }
};

export { IYU, IYUHost as __IYUHost };
if (typeof window !== "undefined") window.__iyuHost = IYUHost;
