async function Module(moduleArg={}){var Module=moduleArg;var ENVIRONMENT_IS_WEB=!!globalThis.window;var ENVIRONMENT_IS_WORKER=!!globalThis.WorkerGlobalScope;var ENVIRONMENT_IS_NODE=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer";var programArgs=[];var thisProgram="./this.program";var _scriptName=import.meta.url;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href}catch{}{if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=async url=>{var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=console.log.bind(console);var err=console.error.bind(console);var wasmBinary;var ABORT=false;class EmscriptenEH{}class EmscriptenSjLj extends EmscriptenEH{}var runtimeInitialized=false;function getMemoryBuffer(){return wasmMemory.buffer}function updateMemoryViews(){if(HEAP8?.buffer?.resizable)return;var b=getMemoryBuffer();HEAP8=new Int8Array(b);HEAPU8=new Uint8Array(b);HEAP32=new Int32Array(b);HEAPU32=new Uint32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b)}function preRun(){var preRun=Module["preRun"];if(preRun){if(typeof preRun=="function")preRun=[preRun];onPreRuns.push(...preRun)}callRuntimeCallbacks(onPreRuns)}function initRuntime(){runtimeInitialized=true;wasmExports["m"]()}function postRun(){var postRun=Module["postRun"];if(postRun){if(typeof postRun=="function")postRun=[postRun];onPostRuns.push(...postRun)}callRuntimeCallbacks(onPostRuns)}function abort(what){Module["onAbort"]?.(what);what=`Aborted(${what})`;err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var wasmBinaryFile;function findWasmBinary(){if(Module["locateFile"]){return locateFile("iyu-runtime.wasm")}return new URL("iyu-runtime.wasm",import.meta.url).href}function getBinarySync(file){if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){var imports={a:wasmImports};return imports}async function createWasm(){function receiveInstance(instance){wasmExports=instance.exports;assignWasmExports(wasmExports);updateMemoryViews();return wasmExports}function receiveInstantiationResult(result){return receiveInstance(result["instance"])}var info=getWasmImports();var instantiateWasm=Module["instantiateWasm"];if(instantiateWasm){return new Promise(resolve=>{instantiateWasm(info,inst=>resolve(receiveInstance(inst)))})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var HEAP8;var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var onPostRuns=[];var onPreRuns=[];var noExitRuntime=true;var HEAPU32;class ExceptionInfo{constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[this.ptr+4>>2]=type}get_type(){return HEAPU32[this.ptr+4>>2]}set_destructor(destructor){HEAPU32[this.ptr+8>>2]=destructor}get_destructor(){return HEAPU32[this.ptr+8>>2]}set_caught(caught){caught=caught?1:0;HEAP8[this.ptr+12]=caught}get_caught(){return HEAP8[this.ptr+12]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13]=rethrown}get_rethrown(){return HEAP8[this.ptr+13]!=0}init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[this.ptr+16>>2]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[this.ptr+16>>2]}}var uncaughtExceptionCount=0;var __Unwind_RaiseException=ex=>{abort()};var ___cxa_throw=(ptr,type,destructor)=>{var info=new ExceptionInfo(ptr);info.init(type,destructor);uncaughtExceptionCount++;__Unwind_RaiseException(ptr)};var __abort_js=()=>abort("");var isLeapYear=year=>year%4===0&&(year%100!==0||year%400===0);var MONTH_DAYS_LEAP_CUMULATIVE=[0,31,60,91,121,152,182,213,244,274,305,335];var MONTH_DAYS_REGULAR_CUMULATIVE=[0,31,59,90,120,151,181,212,243,273,304,334];var ydayFromDate=date=>{var leap=isLeapYear(date.getFullYear());var monthDaysCumulative=leap?MONTH_DAYS_LEAP_CUMULATIVE:MONTH_DAYS_REGULAR_CUMULATIVE;var yday=monthDaysCumulative[date.getMonth()]+date.getDate()-1;return yday};var INT53_MAX=9007199254740992;var INT53_MIN=-9007199254740992;var bigintToI53Checked=num=>num<INT53_MIN||num>INT53_MAX?NaN:Number(num);var HEAP32;function __localtime_js(time,tmPtr){time=bigintToI53Checked(time);var date=new Date(time*1e3);if(isNaN(date.getTime())){return 1}HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var yday=ydayFromDate(date)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst;return 0}var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;i++}}heap[outIdx]=0;return outIdx-startIdx};var HEAPU8;var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var __tzset_js=(timezone,daylight,std_name,dst_name)=>{var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>2]=stdTimezoneOffset*60;HEAP32[daylight>>2]=Number(winterOffset!=summerOffset);var extractZone=timezoneOffset=>{var sign=timezoneOffset>=0?"-":"+";var absOffset=Math.abs(timezoneOffset);var hours=String(Math.floor(absOffset/60)).padStart(2,"0");var minutes=String(absOffset%60).padStart(2,"0");return`UTC${sign}${hours}${minutes}`};var winterName=extractZone(winterOffset);var summerName=extractZone(summerOffset);if(summerOffset<winterOffset){stringToUTF8(winterName,std_name,17);stringToUTF8(summerName,dst_name,17)}else{stringToUTF8(winterName,dst_name,17);stringToUTF8(summerName,std_name,17)}};var readEmAsmArgsArray=[];var HEAPF64;var HEAP64;var readEmAsmArgs=(sigPtr,buf)=>{readEmAsmArgsArray.length=0;var ch;while(ch=HEAPU8[sigPtr++]){var wide=ch!=105;wide&=ch!=112;buf+=wide&&buf%8?4:0;readEmAsmArgsArray.push(ch==112?HEAPU32[buf>>2]:ch==106?HEAP64[buf>>3]:ch==105?HEAP32[buf>>2]:HEAPF64[buf>>3]);buf+=wide?8:4}return readEmAsmArgsArray};var runEmAsmFunction=(code,sigPtr,argbuf)=>{var args=readEmAsmArgs(sigPtr,argbuf);return ASM_CONSTS[code](...args)};var _emscripten_asm_const_int=(code,sigPtr,argbuf)=>runEmAsmFunction(code,sigPtr,argbuf);var _emscripten_date_now=()=>Date.now();var _emscripten_get_now=()=>performance.now();var getHeapMax=()=>2147483648;var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var growMemory=size=>{var oldHeapSize=wasmMemory.buffer.byteLength;var pages=(size-oldHeapSize+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};var UTF8Decoder=new TextDecoder;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;if(ignoreNul)return maxIdx;while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>{if(!ptr)return"";var end=findStringEnd(HEAPU8,ptr,maxBytesToRead,ignoreNul);return UTF8Decoder.decode(HEAPU8.subarray(ptr,end))};var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};{if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["arguments"])programArgs=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];var preInit=Module["preInit"];if(preInit){if(typeof preInit=="function")Module["preInit"]=preInit=[preInit];while(preInit.length>0){preInit.shift()()}}}Module["UTF8ToString"]=UTF8ToString;Module["stringToUTF8"]=stringToUTF8;Module["lengthBytesUTF8"]=lengthBytesUTF8;var ASM_CONSTS={43649:$0=>{if(globalThis.__iyuState)globalThis.__iyuState($0)}};function iyu_bridge_js(ptr){var s=Module.UTF8ToString(ptr);var r='{"err":"no host"}';try{if(globalThis.__iyuHost)r=globalThis.__iyuHost(s)}catch(e){r=JSON.stringify({err:String(e&&e.message||e)})}var len=Module.lengthBytesUTF8(r);var buf=Module._malloc(len+1);Module.stringToUTF8(r,buf,len+1);return buf}function host_schedule_js(ms){if(globalThis.__iyuSchedule)globalThis.__iyuSchedule(ms)}function host_log_js(ptr,isErr){var s=Module.UTF8ToString(ptr);if(isErr)console.error("[iyu]",s);else console.log("[iyu]",s);if(globalThis.__iyuLog)globalThis.__iyuLog(s,isErr!=0)}var _malloc,_free,_iyu_run,_iyu_event,_iyu_post,_iyu_tick,_iyu_stop,_iyu_alive,_iyu_menuitems,_iyu_getvar,_iyu_setvar,memory,__indirect_function_table,wasmMemory;function assignWasmExports(wasmExports){_malloc=Module["_malloc"]=wasmExports["n"];_free=Module["_free"]=wasmExports["o"];_iyu_run=Module["_iyu_run"]=wasmExports["p"];_iyu_event=Module["_iyu_event"]=wasmExports["q"];_iyu_post=Module["_iyu_post"]=wasmExports["r"];_iyu_tick=Module["_iyu_tick"]=wasmExports["s"];_iyu_stop=Module["_iyu_stop"]=wasmExports["t"];_iyu_alive=Module["_iyu_alive"]=wasmExports["u"];_iyu_menuitems=Module["_iyu_menuitems"]=wasmExports["v"];_iyu_getvar=Module["_iyu_getvar"]=wasmExports["w"];_iyu_setvar=Module["_iyu_setvar"]=wasmExports["x"];memory=wasmMemory=wasmExports["l"];__indirect_function_table=wasmExports["__indirect_function_table"]}var wasmImports={a:___cxa_throw,e:__abort_js,f:__localtime_js,g:__tzset_js,j:_emscripten_asm_const_int,h:_emscripten_date_now,c:_emscripten_get_now,k:_emscripten_resize_heap,d:host_log_js,b:host_schedule_js,i:iyu_bridge_js};async function run(){preRun();var setStatus=Module["setStatus"];if(setStatus){setStatus("Running...");await new Promise(resolve=>setTimeout(resolve,1));setTimeout(setStatus,1,"")}if(ABORT)return;initRuntime();Module["onRuntimeInitialized"]?.();postRun()}var wasmExports;wasmExports=await createWasm();await run();
;return Module}

var iyu_runtime = Module;
// ============================================================================
// IYU API 层 Part 1: 核心基础设施 — 状态 / VFS / 桥分发 / 工具
// ============================================================================
'use strict';

var M = null;                 // wasm 模块
var readyP = null;
var opt = { host: null, width: 480, height: 720, debug: 1, onLog: null, onError: null, onEvent: null };
var hostEl = null;            // 根容器
var screenStack = [];         // 屏幕栈 [{el, root}]
var VFS = new Map();          // path -> {t: string} | {b: Uint8Array}
var ctrls = new Map();        // ctrlId -> 记录 {el, type, id(logical), owner, props, evs, itemCtx, kids, parent, list}
var logicalId = new Map();    // 逻辑id -> ctrlId
var objs = new Map();         // host 对象池 id -> {kind, ...}
var hostSeq = 1000000;        // host 分配的控件/对象 id 计数
var listeners = { log: [], error: [], event: [], state: [] };
var eventLog = [];

function nextHostId() { return ++hostSeq; }

function emit(ev, a, b) {
    if (ev === 'log') eventLog.push(s(a));
    (listeners[ev] || []).forEach(function (fn) { try { fn(a, b); } catch (e) { console.error(e); } });
    if (ev === 'log' && typeof opt.onLog === 'function') opt.onLog(a, !!b);
    if (ev === 'error' && typeof opt.onError === 'function') opt.onError(a);
    if (ev === 'event' && typeof opt.onEvent === 'function') opt.onEvent(a, b);
}
function s(v) { return v === null || v === undefined ? 'null' : String(v); }

// ---------- 值序列化 ----------
function deval(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === 'object') {
        if (v.$o !== undefined) {
            var id = v.$o;
            if (v.$c !== undefined) return getCtrl(v.$c);
            if (id < 0) {
                // JS 句柄 (js.global/js.eval 等返回的对象)
                var h = jsHandles.get(-id - 100000000);
                if (h !== undefined) return h;
            }
            var o = objs.get(id);
            return o !== undefined ? o : { __objId: id };
        }
        return v;
    }
    return v;
}
function serVal(v) {
    // JS → C++ 可理解的 JSON 值
    if (v === null || v === undefined) return null;
    var t = typeof v;
    if (t === 'number' || t === 'boolean' || t === 'string') return v;
    if (Array.isArray(v)) return v.map(serVal);
    if (v instanceof Uint8Array) return bytesToByteStr(v);
    if (t === 'object') {
        if (v.__objId !== undefined) return { $o: v.__objId };
        var out = {};
        for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = serVal(v[k]);
        return out;
    }
    return null;
}
// 字节组: 裕语言中以字符串表示 (每字符一个字节码)
function bytesToByteStr(u8) {
    var out = '';
    for (var i = 0; i < u8.length; i++) out += String.fromCharCode(u8[i]);
    return out;
}
function byteStrToBytes(str) {
    var u8 = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) u8[i] = str.charCodeAt(i) & 0xFF;
    return u8;
}

// ---------- C++ 回调 postResult ----------
function postResult(opId, value) {
    if (!M) return;
    var payload = JSON.stringify({ r: serVal(value) });
    var len = M.lengthBytesUTF8(payload);
    var buf = M._malloc(len + 1);
    M.stringToUTF8(payload, buf, len + 1);
    M._iyu_post(opId, buf);   // C++ 负责释放
}

// ---------- 桥入口 (C++ → JS, 同步) ----------
var OPS = {};
function bridgeHost(reqJson) {
    var req;
    try { req = JSON.parse(reqJson); } catch (e) { return JSON.stringify({ err: 'bad req' }); }
    var op = req.op, args = (req.args || []).map(deval);
    var qid = req.qid, preId = req.id;
    var fn = OPS[op];
    if (!fn) return JSON.stringify({ err: '未知桥操作: ' + op });
    try {
        var r = fn(args, { qid: qid, preId: preId, req: req });
        if (r && typeof r.then === 'function') {
            r.then(function (v) {
                postResult(qid, v === undefined ? null : v);
            })
             .catch(function (e) {
                 emit('log', '[iyu] 异步操作失败: ' + (e && e.message || e), true);
                 postResult(qid, null);
             });
            return JSON.stringify({ async: true });
        }
        return JSON.stringify({ r: serVal(r === undefined ? null : r) });
    } catch (e) {
        return JSON.stringify({ err: String((e && e.message) || e) });
    }
}

// ---------- 工具 ----------
function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
}
function normPath(p) {
    var str = s(p);
    if (str.charAt(0) === '%' || str.charAt(0) === '@') str = str.slice(1);
    if (str.charAt(0) !== '/') str = '/' + str;
    return str;
}
function isRemote(p) { return /^https?:\/\//i.test(s(p)) || /^data:/i.test(s(p)) || /^blob:/i.test(s(p)); }
function vfsResolve(p) {
    // %xxx / @xxx / 绝对路径 → {type:'vfs', path} | {type:'url', url}
    var str = s(p);
    if (isRemote(str)) return { url: str };
    return { path: normPath(str) };
}
function vfsReadBytes(p) {
    var r = vfsResolve(p);
    if (r.url) return null;
    var f = VFS.get(r.path);
    if (!f) return null;
    if (f.b) return f.b;
    return new TextEncoder().encode(f.t);
}
function vfsReadText(p) {
    var r = vfsResolve(p);
    if (r.url) return null;
    var f = VFS.get(r.path);
    if (!f) return null;
    return f.b != null ? new TextDecoder().decode(f.b) : f.t;
}
function vfsWrite(p, data, isBytes) {
    var path = normPath(p);
    VFS.set(path, isBytes ? { b: data } : { t: data });
    ensureParentDirs(path);
}
function ensureParentDirs(path) {
    var parts = path.split('/').filter(Boolean);
    for (var i = 1; i < parts.length; i++) {
        var dp = '/' + parts.slice(0, i).join('/');
        if (!VFS.has(dp)) VFS.set(dp, { dir: true });
    }
}
function vfsList(dir, mode) {
    var d = normPath(dir);
    if (!VFS.has(d)) VFS.set(d, { dir: true });
    var out = [];
    VFS.forEach(function (v, k) {
        if (v.dir) return;
        if (k.indexOf(d + '/') === 0) {
            var rest = k.slice(d.length + 1);
            if (rest.indexOf('/') >= 0) {
                // 子目录 (报告目录本身一次)
                var sub = d + '/' + rest.split('/')[0];
                if (mode === 'file') return;
                if (out.indexOf(sub) < 0) out.push(sub);
            } else {
                if (mode === 'dir') return;
                out.push(k);
            }
        }
    });
    // 目录条目
    VFS.forEach(function (v, k) {
        if (v.dir && k.indexOf(d + '/') === 0 && (mode !== 'file')) {
            if (out.indexOf(k) < 0) out.push(k);
        }
    });
    return out.sort();
}
function colorCss(c) {
    var str = s(c).trim();
    if (!str) return '';
    if (/^#[0-9a-fA-F]{3,8}$/.test(str)) {
        if (str.length === 9) { // #RRGGBBAA → rgba
            var r = parseInt(str.slice(1, 3), 16), g = parseInt(str.slice(3, 5), 16),
                b = parseInt(str.slice(5, 7), 16), a = parseInt(str.slice(7, 9), 16) / 255;
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        }
        return str;
    }
    return str;
}
function pxSize(v, parentPct) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') {
        if (v === -1) return 'auto';
        if (v === -2) return '100%';
        if (v === -3) return 'auto';
        return v + 'px';
    }
    var str = s(v).trim();
    if (str === '-1' || str === 'auto' || str === 'wrap_content') return 'auto';
    if (str === '-2' || str === 'match_parent' || str === 'fill') return '100%';
    if (/^-?\d+$/.test(str)) {
        var n = parseInt(str, 10);
        if (n === -1) return 'auto';
        if (n === -2) return '100%';
        return n + 'px';
    }
    return str;
}
function applySize(el, w, h) {
    var wc = pxSize(w), hc = pxSize(h);
    el.style.width = wc || '';
    el.style.height = hc || '';
    if (wc === 'auto') el.style.width = '';
    if (hc === 'auto') el.style.height = '';
}
function parseProps(str) {
    var out = {};
    if (str === null || str === undefined) return out;
    s(str).split('\n').forEach(function (line) {
        var i = line.indexOf('=');
        if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1);
    });
    return out;
}
function getCtrl(id) {
    if (typeof id === 'object' && id && id.__ctrl) return id;
    var cid = typeof id === 'object' && id ? id.ctrlId : id;
    var n = Number(cid);
    if (!isFinite(n)) return null;
    var rec = ctrls.get(n);
    if (rec) return rec;
    // 逻辑 id 查找
    var mapped = logicalId.get(n);
    if (mapped !== undefined) return ctrls.get(mapped) || null;
    return null;
}
function ctrlRef(rec) { return { __ctrl: true, ctrlId: rec ? rec.id : -1 }; }
function objIdOf(v) {
    if (v === null || v === undefined) return -1;
    if (typeof v === 'number') return v;
    if (typeof v === 'object') {
        if (v.__objId !== undefined) return v.__objId;
        if (v.$o !== undefined) return v.$o;
    }
    var n = Number(v);
    return isFinite(n) ? n : -1;
}
function ctrlIdOf(v) {
    if (v === null || v === undefined) return -1;
    if (typeof v === 'object') {
        if (v.__ctrl) return v.ctrlId;
        if (v.ctrlId !== undefined) return v.ctrlId;
        return -1;
    }
    var n = Number(v);
    return isFinite(n) ? n : -1;
}

// ---------- 事件触发 (JS → C++) ----------
function fireCtrlEvent(rec, evName, st, sel) {
    var token = rec && rec.evs ? rec.evs.get(evName) : null;
    if (!token) return false;
    callEvent(token, st, sel);
    return true;
}
function callEvent(token, st, sel) {
    if (!M) return;
    var payload = JSON.stringify({ tok: token, st: st || {}, sel: sel === undefined ? null : serVal(sel) });
    var len = M.lengthBytesUTF8(payload);
    var buf = M._malloc(len + 1);
    M.stringToUTF8(payload, buf, len + 1);
    M._iyu_event(buf);   // C++ 负责释放
}
// st 公共字段
function baseSt(rec) {
    return { st_vId: rec ? rec.id : 0, st_vW: rec ? ctrlRef(rec) : null };
}
// 给控件绑定 DOM 事件
function bindDomEvents(rec) {
    var elx = rec.el, id = rec.id;
    var EVENTS = {
        clicki: function () {
            elx.addEventListener('click', function (e) {
                e.stopPropagation();
                fireCtrlEvent(rec, 'clicki', baseSt(rec));
            });
        },
        touchmonitor: function () {
            function pt(e, action) {
                var r = elx.getBoundingClientRect();
                fireCtrlEvent(rec, 'touchmonitor', Object.assign(baseSt(rec), {
                    st_eA: action, st_eX: Math.round(e.clientX - r.left), st_eY: Math.round(e.clientY - r.top),
                    st_rX: Math.round(e.clientX), st_rY: Math.round(e.clientY)
                }));
            }
            elx.addEventListener('pointerdown', function (e) { pt(e, 0); });
            elx.addEventListener('pointermove', function (e) { if (e.buttons || e.pointerType === 'touch') pt(e, 2); });
            elx.addEventListener('pointerup', function (e) { pt(e, 1); });
        },
        press: function () {
            var timer = null;
            elx.addEventListener('pointerdown', function () {
                timer = setTimeout(function () {
                    fireCtrlEvent(rec, 'press', baseSt(rec));
                }, 600);
            });
            ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
                elx.addEventListener(ev, function () { if (timer) { clearTimeout(timer); timer = null; } });
            });
        },
        pressmenu: function () {
            elx.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                var tok = rec.evs.get('pressmenu');
                if (tok) {
                    // 先向 C++ 索取菜单项 (case 分支)
                    var items = menuItemsFor(tok);
                    if (items && items.length) {
                        showPopupMenu(items, function (sel) {
                            callEvent(tok, baseSt(rec), sel);
                        });
                    } else {
                        callEvent(tok, baseSt(rec));
                    }
                }
            });
        },
        keyboard: function () {
            elx.addEventListener('keydown', function (e) {
                fireCtrlEvent(rec, 'keyboard', Object.assign(baseSt(rec), {
                    st_kC: e.keyCode, st_eA: e.type === 'keydown' ? 0 : 1, st_eR: ''
                }));
            });
        },
        editormonitor: function () {
            elx.addEventListener('keydown', function (e) {
                fireCtrlEvent(rec, 'editormonitor', Object.assign(baseSt(rec), {
                    st_aI: e.keyCode === 13 ? 1 : 0, st_eA: 0, st_eR: '', st_eK: e.keyCode
                }));
            });
        },
        ontextchanged: function () { rec.__prevText = inputVal(elx); elx.addEventListener('input', function () {
            var now = inputVal(elx);
            fireCtrlEvent(rec, 'ontextchanged', Object.assign(baseSt(rec), {
                st_sS: now, st_sT: now, st_bE: rec.__prevText, st_cT: now, st_aR: now
            }));
            rec.__prevText = now;
        }); },
        beforetextchanged: function () { rec.__prevText2 = inputVal(elx); elx.addEventListener('input', function () {
            fireCtrlEvent(rec, 'beforetextchanged', Object.assign(baseSt(rec), {
                st_sS: rec.__prevText2, st_bE: rec.__prevText2, st_cT: inputVal(elx)
            }));
            rec.__prevText2 = inputVal(elx);
        }); },
        aftertextchanged: function () { rec.__prevText3 = inputVal(elx); elx.addEventListener('input', function () {
            fireCtrlEvent(rec, 'aftertextchanged', Object.assign(baseSt(rec), {
                st_sS: inputVal(elx), st_aR: inputVal(elx), st_bE: rec.__prevText3
            }));
            rec.__prevText3 = inputVal(elx);
        }); },
        focuschange: function () {
            elx.addEventListener('focus', function () { fireCtrlEvent(rec, 'focuschange', Object.assign(baseSt(rec), { st_hF: true })); });
            elx.addEventListener('blur', function () { fireCtrlEvent(rec, 'focuschange', Object.assign(baseSt(rec), { st_hF: false })); });
        },
        onprogresschanged: function () {
            elx.addEventListener('input', function () {
                fireCtrlEvent(rec, 'onprogresschanged', Object.assign(baseSt(rec), { st_pN: Number(elx.value) || 0 }));
            });
        },
        onitemselected: function () {
            elx.addEventListener('change', function () {
                var idx = elx.selectedIndex || 0;
                fireCtrlEvent(rec, 'onitemselected', Object.assign(baseSt(rec), {
                    st_pN: idx, st_iD: elx.value
                }));
            });
        },
        onscroll: function () {
            elx.addEventListener('scroll', function () {
                fireCtrlEvent(rec, 'onscroll', Object.assign(baseSt(rec), {
                    st_eX: elx.scrollLeft || 0, st_eY: elx.scrollTop || 0
                }));
            });
        },
        onscrollstatechanged: function () {
            var t = null;
            elx.addEventListener('scroll', function () {
                if (t) clearTimeout(t);
                fireCtrlEvent(rec, 'onscrollstatechanged', Object.assign(baseSt(rec), { st_sC: 1 }));
                t = setTimeout(function () {
                    fireCtrlEvent(rec, 'onscrollstatechanged', Object.assign(baseSt(rec), { st_sC: 0 }));
                }, 150);
            });
        },
        onpageselected: function () { rec.__pageSel = function (idx) { fireCtrlEvent(rec, 'onpageselected', Object.assign(baseSt(rec), { st_pN: idx })); }; },
        onpagescrolled: function () { rec.__pageScr = function (idx, off) { fireCtrlEvent(rec, 'onpagescrolled', Object.assign(baseSt(rec), { st_pN: idx, st_eX: off })); }; },
        onpagescrollstatechanged: function () { rec.__pageSt = function (stt) { fireCtrlEvent(rec, 'onpagescrollstatechanged', Object.assign(baseSt(rec), { st_sC: stt })); }; },
        ondrawerclosed: function () { rec.__drawerClosed = function () { fireCtrlEvent(rec, 'ondrawerclosed', baseSt(rec)); }; },
        ondraweropened: function () { rec.__drawerOpened = function () { fireCtrlEvent(rec, 'ondraweropened', baseSt(rec)); }; },
        shouldoverrideurlloading: function () { rec.__urlFilter = true; },
        ondownloadstart: function () { rec.__dlStart = true; },
        onoptionsitemselected: function () { rec.__optSel = true; },
        clickitem: function () { /* 由列表渲染绑定 */ },
    };
    rec.__binders = EVENTS;
}
function bindEvent(rec, evName) {
    if (!rec.__binders) bindDomEvents(rec);
    rec.__boundEvs = rec.__boundEvs || {};
    if (rec.__boundEvs[evName]) return;
    rec.__boundEvs[evName] = true;
    var b = rec.__binders[evName];
    try { if (b) b(); } catch (e) { console.error('bind event fail', evName, e); }
}
function inputVal(elx) {
    return elx && (elx.value !== undefined ? elx.value : elx.textContent || '');
}

// ---------- 菜单 (case 分支) ----------
var menuRegistry = new Map();  // token → 菜单项数组
function showPopupMenu(items, cb) {
    var mask = el('div', null, document.body);
    mask.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:transparent';
    var menu = el('div', null, mask);
    menu.style.cssText = 'position:absolute;min-width:140px;background:#fff;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,.3);padding:6px 0;font-size:14px;color:#333';
    items.forEach(function (it) {
        var item = el('div', null, menu);
        item.textContent = it.title;
        item.style.cssText = 'padding:10px 18px;cursor:pointer;white-space:nowrap';
        item.onmouseenter = function () { item.style.background = '#f2f2f2'; };
        item.onmouseleave = function () { item.style.background = ''; };
        item.onclick = function (e) { e.stopPropagation(); mask.remove(); cb(it.title); };
    });
    mask.addEventListener('click', function () { mask.remove(); });
    menu.style.left = '40%'; menu.style.top = '60px';
}
// ============================================================================
// IYU API 层 Part 2: 控件系统 — 类型构建 / 属性读写 / nvw us ug gvs
// ============================================================================
var TYPE_BUILDERS = {
    '文本': function (p) { var e = el('div'); e.style.cssText += ';display:block;white-space:pre-wrap;word-break:break-word'; return e; },
    '按钮': function (p) { var e = el('button'); e.style.cssText += ';border:none;cursor:pointer;font-size:14px;padding:8px 14px;background:#e8e8e8;color:#333;border-radius:4px'; e.type = 'button'; return e; },
    '图像': function (p) { var e = el('img'); e.style.cssText += ';display:block;object-fit:contain'; return e; },
    '图像按钮': function (p) { var e = el('button'); e.type = 'button'; e.style.cssText += ';border:none;background:none;padding:0;cursor:pointer'; var i = el('img', null, e); i.style.cssText += ';display:block;pointer-events:none'; return e; },
    '编辑框': function (p) {
        var e = el(p && p.lines && Number(p.lines) > 1 ? 'textarea' : 'input');
        e.style.cssText += ';border:1px solid #ccc;border-radius:4px;padding:8px;font-size:14px;outline:none;background:#fff;color:#333;box-sizing:border-box';
        if (e.tagName === 'INPUT') e.type = 'text';
        return e;
    },
    '单选布局': function (p) { var e = el('div'); return e; },
    '单选项': function (p) { var e = el('label'); e.style.cssText += ';display:flex;align-items:center;gap:6px;cursor:pointer'; var i = el('input', null, e); i.type = 'radio'; i.style.pointerEvents = 'none'; var t = el('span', null, e); e.__input = i; e.__span = t; return e; },
    '多选': function (p) { var e = el('label'); e.style.cssText += ';display:flex;align-items:center;gap:6px;cursor:pointer'; var i = el('input', null, e); i.type = 'checkbox'; i.style.pointerEvents = 'none'; var t = el('span', null, e); e.__input = i; e.__span = t; return e; },
    '多选布局': function (p) { var e = el('div'); return e; },
    '下拉菜单': function (p) { var e = el('select'); e.style.cssText += ';border:1px solid #ccc;border-radius:4px;padding:6px;background:#fff;color:#333;font-size:14px'; return e; },
    '开关': function (p) {
        var e = el('label'); e.style.cssText += ';display:inline-flex;align-items:center;cursor:pointer';
        var i = el('input', null, e); i.type = 'checkbox'; i.style.display = 'none';
        var sld = el('span', null, e);
        sld.style.cssText = 'width:40px;height:22px;border-radius:11px;background:#ccc;position:relative;transition:background .2s;display:inline-block';
        var kn = el('span', null, sld);
        kn.style.cssText = 'position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:2px;left:2px;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)';
        i.addEventListener('change', function () {
            sld.style.background = i.checked ? '#4caf50' : '#ccc';
            kn.style.left = i.checked ? '20px' : '2px';
        });
        e.__input = i;
        return e;
    },
    '列表': function (p) { var e = el('div'); e.style.cssText += ';overflow-y:auto'; return e; },
    'V7列表': function (p) { var e = el('div'); e.style.cssText += ';overflow-y:auto'; return e; },
    '网格视图': function (p) { var e = el('div'); e.style.cssText += ';display:grid;grid-template-columns:repeat(2,1fr);overflow-y:auto'; return e; },
    '线性布局': function (p) { var e = el('div'); e.style.cssText += ';display:flex;flex-direction:column'; return e; },
    '相对布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '帧布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '约束性布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '标签布局': function (p) { var e = el('div'); e.style.cssText += ';display:flex;flex-direction:row;align-items:center;background:#fff;border-bottom:1px solid #eee'; return e; },
    '协调性布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '应用栏布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '折叠工具栏布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '工具栏布局': function (p) { var e = el('div'); e.style.cssText += ';position:relative'; return e; },
    '文本输入布局': function (p) {
        var e = el('div'); e.style.cssText += ';position:relative';
        var input = el('input', null, e);
        input.style.cssText += ';width:100%;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;padding:10px 8px 4px;font-size:14px;outline:none';
        var label = el('label', null, e);
        label.style.cssText = 'position:absolute;left:9px;top:8px;font-size:12px;color:#999;pointer-events:none;transition:all .15s';
        input.addEventListener('focus', function () { label.style.top = '-6px'; label.style.fontSize = '10px'; label.style.color = '#1976d2'; });
        input.addEventListener('blur', function () { if (!input.value) { label.style.top = '8px'; label.style.fontSize = '12px'; label.style.color = '#999'; } });
        e.__input = input; e.__label = label;
        return e;
    },
    '滚动': function (p) { var e = el('div'); e.style.cssText += ';overflow-y:auto;overflow-x:hidden'; e.__inner = el('div', null, e); e.__inner.style.minHeight = '100%'; return e; },
    '水平滚动': function (p) { var e = el('div'); e.style.cssText += ';overflow-x:auto;overflow-y:hidden;white-space:nowrap'; e.__inner = el('div', null, e); e.__inner.style.display = 'inline-block'; e.__inner.style.minWidth = '100%'; return e; },
    '滑动窗体': function (p) { var e = el('div'); e.style.cssText += ';overflow-x:auto;overflow-y:hidden;display:flex;scroll-snap-type:x mandatory;scrollbar-width:none'; e.__pager = true; return e; },
    '垂直滑动窗体': function (p) { var e = el('div'); e.style.cssText += ';overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;scroll-snap-type:y mandatory;scrollbar-width:none'; e.__pager = true; return e; },
    '侧滑窗体': function (p) {
        var e = el('div'); e.style.cssText += ';position:relative;overflow:hidden';
        var content = el('div', null, e);
        content.style.cssText += ';width:100%;height:100%;position:relative;z-index:2;background:#fff;transition:transform .25s';
        var left = el('div', null, e);
        left.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:70%;background:#fafafa;z-index:1;transform:translateX(-100%);transition:transform .25s;box-shadow:2px 0 8px rgba(0,0,0,.15);overflow-y:auto';
        var right = el('div', null, e);
        right.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:70%;background:#fafafa;z-index:1;transform:translateX(100%);transition:transform .25s;box-shadow:-2px 0 8px rgba(0,0,0,.15);overflow-y:auto';
        e.__drawerContent = content; e.__drawerLeft = left; e.__drawerRight = right;
        e.__drawerOpen = { left: false, right: false };
        return e;
    },
    '嵌套滚动': function (p) { var e = el('div'); e.style.cssText += ';overflow:auto'; return e; },
    '卡片': function (p) { var e = el('div'); e.style.cssText += ';background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.12);overflow:hidden'; return e; },
    '拖动条': function (p) { var e = el('input'); e.type = 'range'; e.min = 0; e.max = 100; e.value = 0; e.style.cssText += ';width:100%;accent-color:#1976d2'; return e; },
    '进度条': function (p) {
        var e = el('div'); e.style.cssText += ';background:#e0e0e0;border-radius:4px;overflow:hidden;min-height:6px';
        var bar = el('div', null, e);
        bar.style.cssText = 'height:100%;width:0%;background:#1976d2;transition:width .2s';
        e.__bar = bar;
        return e;
    },
    '日期选择': function (p) { var e = el('input'); e.type = 'date'; e.style.cssText += ';border:1px solid #ccc;border-radius:4px;padding:8px;background:#fff;color:#333'; return e; },
    '时间选择': function (p) { var e = el('input'); e.type = 'time'; e.style.cssText += ';border:1px solid #ccc;border-radius:4px;padding:8px;background:#fff;color:#333'; return e; },
    '视频': function (p) { var e = el('video'); e.controls = false; e.style.cssText += ';background:#000'; return e; },
    '动态图': function (p) { var e = el('img'); e.style.cssText += ';display:block'; return e; },
    '圆形图': function (p) { var e = el('img'); e.style.cssText += ';display:block;border-radius:50%;object-fit:cover'; return e; },
    '浏览器': function (p) {
        var e = el('iframe');
        e.style.cssText += ';border:none;width:100%;height:100%;background:#fff';
        e.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin allow-popups allow-downloads allow-modals');
        return e;
    },
    '下拉刷新控件': function (p) {
        var e = el('div'); e.style.cssText += ';position:relative;overflow-y:auto';
        var sp = el('div', null, e);
        sp.style.cssText = 'position:absolute;top:-36px;left:50%;margin-left:-14px;width:28px;height:28px;border:3px solid #ddd;border-top-color:#1976d2;border-radius:50%;transition:top .2s;z-index:5;background:#fff';
        e.__spinner = sp;
        return e;
    },
    '浮动动作按钮': function (p) {
        var e = el('button'); e.type = 'button';
        e.style.cssText += ';width:56px;height:56px;border-radius:50%;border:none;background:#1976d2;color:#fff;font-size:24px;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center';
        return e;
    },
    '面控件': function (p) { var e = el('div'); e.style.cssText += ';background:#000;position:relative;overflow:hidden'; return e; },
    'Toolbar': function (p) {
        var e = el('div'); e.style.cssText += ';display:flex;align-items:center;background:#1976d2;color:#fff;min-height:48px;padding:0 12px;gap:10px';
        var leftIcon = el('img', null, e); leftIcon.style.cssText += ';width:22px;height:22px;display:none;cursor:pointer';
        var title = el('span', null, e); title.style.cssText += ';font-size:17px;flex:1';
        var rightIcon = el('img', null, e); rightIcon.style.cssText += ';width:22px;height:22px;display:none;cursor:pointer';
        e.__tb = { leftIcon: leftIcon, title: title, rightIcon: rightIcon, drawer: null };
        return e;
    },
    // 别名
    '文本框': function (p) { return TYPE_BUILDERS['文本'](p); },
    '编辑框多行': function (p) { p = p || {}; p.lines = 3; return TYPE_BUILDERS['编辑框'](p); },
};
TYPE_BUILDERS['评分条'] = function (p) { var e = el('input'); e.type = 'range'; e.min = 0; e.max = 5; e.step = 0.5; return e; };

function currentScreenEl() { return screenStack.length ? screenStack[screenStack.length - 1].el : hostEl; }

function createControl(id, parentId, type, propsStr) {
    var builder = TYPE_BUILDERS[type];
    if (!builder) { emit('log', '[iyu] 未知控件类型: ' + type + ' (使用文本代替)', true); builder = TYPE_BUILDERS['文本']; }
    var props = parseProps(propsStr);
    var elx = builder(props);
    var parentRec = parentId ? getCtrl(parentId) : null;
    var parentEl = parentRec ? (parentRec.el.__inner || parentRec.el) : currentScreenEl();
    if (parentRec && parentRec.el.__pager) {
        elx.style.scrollSnapAlign = 'start';
        elx.style.flexShrink = '0';
        elx.style.width = '100%';
        elx.style.height = '100%';
        attachPagerWatcher(parentRec.el);
    }
    parentEl.appendChild(elx);
    var rec = {
        el: elx, type: type, id: Number(id), owner: currentUnitName || '',
        props: {}, evs: new Map(), kids: [], parent: parentRec ? parentRec.id : 0,
        itemCtx: null
    };
    if (parentRec) parentRec.kids.push(rec);
    ctrls.set(rec.id, rec);
    if (Number(id) < 1000000) logicalId.set(Number(id), rec.id);
    applyAllProps(rec, props);
    bindCtrlChildrenWatcher(rec);
    return rec;
}
var currentUnitName = 'main';
function bindCtrlChildrenWatcher(rec) {
    // 线性布局默认纵向排列子控件
    var t = rec.type;
    if (t === '相对布局' || t === '约束性布局' || t === '帧布局' || t === '协调性布局') return;
}
function attachPagerWatcher(elx) {
    if (elx.__pagerWatched) return;
    elx.__pagerWatched = true;
    var idx = -1;
    elx.addEventListener('scroll', function () {
        var w = elx.clientWidth || 1;
        var page = Math.round(elx.scrollLeft / w);
        if (page !== idx) {
            idx = page;
            firePagerEvents(elx, page, 'sel');
        }
        firePagerEvents(elx, page === -1 ? 0 : page, 'scr', elx.scrollLeft);
    });
    elx.addEventListener('scrollend', function () { firePagerEvents(elx, Math.round(elx.scrollLeft / (elx.clientWidth || 1)), 'st', 0); });
}
function firePagerEvents(elx, page, kind, off) {
    ctrls.forEach(function (rec) {
        if (rec.el !== elx) return;
        if (kind === 'sel' && rec.__pageSel) rec.__pageSel(page);
        if (kind === 'scr' && rec.__pageScr) rec.__pageScr(page, off || 0);
        if (kind === 'st' && rec.__pageSt) rec.__pageSt(0);
    });
}

// ---------- 属性应用 ----------
function bgOf(v) {
    // 背景: 颜色 / 图像路径 / 背景对象
    if (v === null || v === undefined) return '';
    if (typeof v === 'object' && v.$o !== undefined) {
        var o = objs.get(v.$o);
        if (o && o.css) return o.css;
        return '';
    }
    var str = s(v);
    if (/^#[0-9a-fA-F]{3,8}$/.test(str.trim())) return str.trim();
    return 'url("' + resolveSrc(str) + '") center/cover no-repeat';
}
function resolveSrc(v) {
    if (v === null || v === undefined) return '';
    var str = s(v);
    if (isRemote(str)) return str;
    var bytes = vfsReadBytes(str);
    if (!bytes) return '';
    var ext = str.split('.').pop().toLowerCase();
    var mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : ext === 'svg' ? 'image/svg+xml' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
}
function applyAllProps(rec, props) {
    for (var k in props) applyProp(rec, k, props[k]);
}
function applyProp(rec, key, val) {
    var e = rec.el;
    rec.props[key] = val;
    var st = e.style;
    switch (key) {
        case 'text': {
            var str = s(val);
            if (str.slice(0, 6) === '(html)') e.innerHTML = str.slice(6);
            else if (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' || e.tagName === 'SELECT') { e.value = str; }
            else if (e.__span && e.__input) e.__span.textContent = str;
            else if (e.__label && e.__input) { e.__input.value = str; }
            else if (e.__tb) e.__tb.title.textContent = str;
            else e.textContent = str;
            break;
        }
        case 'hint':
            if (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA') e.placeholder = s(val);
            else if (e.__input) e.__input.placeholder = s(val);
            break;
        case 'imeoptions': e.setAttribute('enterkeyhint', s(val) === 'search' ? 'search' : 'done'); break;
        case 'src': {
            var src2 = resolveSrc(val);
            if (e.tagName === 'IMG') e.src = src2;
            else if (e.tagName === 'VIDEO') { e.src = src2; }
            else if (e.tagName === 'BUTTON' && e.firstChild && e.firstChild.tagName === 'IMG') e.firstChild.src = src2;
            break;
        }
        case 'background': {
            var css = bgOf(val);
            if (css) st.background = css;
            break;
        }
        case 'backgroundcolor': st.backgroundColor = colorCss(val); break;
        case 'width': { var w = pxSize(val); st.width = w === 'auto' ? '' : w; break; }
        case 'height': { var h = pxSize(val); st.height = h === 'auto' ? '' : h; break; }
        case 'x': st.position = st.position || 'relative'; st.left = pxNum(val) + 'px'; break;
        case 'y': st.position = st.position || 'relative'; st.top = pxNum(val) + 'px'; break;
        case 'paddingleft': st.paddingLeft = pxNum(val) + 'px'; break;
        case 'paddingtop': st.paddingTop = pxNum(val) + 'px'; break;
        case 'paddingright': st.paddingRight = pxNum(val) + 'px'; break;
        case 'paddingbottom': st.paddingBottom = pxNum(val) + 'px'; break;
        case 'padding': st.padding = pxNum(val) + 'px'; break;
        case 'layout_marginleft': st.marginLeft = pxNum(val) + 'px'; break;
        case 'layout_margintop': st.marginTop = pxNum(val) + 'px'; break;
        case 'layout_marginright': st.marginRight = pxNum(val) + 'px'; break;
        case 'layout_marginbottom': st.marginBottom = pxNum(val) + 'px'; break;
        case 'layout_margin': st.margin = pxNum(val) + 'px'; break;
        case 'visibility': {
            var str = s(val).trim();
            var on = !(str === 'false' || str === '0' || str === '8' || str === 'gone' || str === '2');
            var invis = (str === '4' || str === '1' && false);
            if (!on) { st.display = str === '8' || str === 'gone' ? 'none' : 'none'; }
            else if (str === '4' || str === 'invisible') { st.display = ''; st.visibility = 'hidden'; }
            else { st.display = ''; st.visibility = 'visible'; }
            break;
        }
        case 'checked': {
            if (e.__input) e.__input.checked = val === true || s(val) === 'true' || val === 1 || s(val) === '1';
            else if (e.tagName === 'INPUT') e.checked = val === true || s(val) === 'true';
            break;
        }
        case 'title':
            if (e.__tb) e.__tb.title.textContent = s(val);
            break;
        case 'url': {
            if (e.tagName === 'IFRAME') {
                var str = s(val);
                if (str === 'about:blank') { e.srcdoc = '<html><body></body></html>'; break; }
                if (isRemote(str)) { e.src = str; }
                else if (str.charAt(0) === '@' || str.charAt(0) === '%') { e.srcdoc = vfsReadText(str) || ''; }
                else { e.srcdoc = str; }
                attachWebviewEvents(rec);
            }
            break;
        }
        case 'selecteditem':
            if (e.tagName === 'SELECT') e.value = s(val);
            break;
        case 'rating': case 'progress': {
            if (e.tagName === 'INPUT') { e.value = s(val); }
            else if (e.__bar) { e.__bar.style.width = Math.max(0, Math.min(100, Number(val) || 0)) + '%'; }
            break;
        }
        case 'max': if (e.tagName === 'INPUT') e.max = s(val); break;
        case 'date': case 'time': if (e.tagName === 'INPUT') e.value = s(val); break;
        case 'currentitem': {
            if (e.__pager) {
                var w2 = e.clientWidth || 1;
                e.scrollTo({ left: Number(val) * w2, behavior: 'smooth' });
            }
            break;
        }
        case 'isdraweropen': {
            if (e.__drawerLeft) {
                var side = rec.props.__drawerSide || 'left';
                setDrawer(rec, side, val === true || s(val) === 'true');
            }
            break;
        }
        case 'refreshing': {
            if (e.__spinner) {
                var show = val === true || s(val) === 'true';
                e.__spinner.style.top = show ? '12px' : '-36px';
                if (show) setTimeout(function () { e.__spinner.style.top = '-36px'; }, 1200);
            }
            break;
        }
        case 'shadow': break;   // 多参由 us 特殊处理
        case 'backgroundripple': {
            var rc = colorCss(val);
            e.addEventListener('mousedown', function () { e.style.filter = 'brightness(0.85)'; });
            e.addEventListener('mouseup', function () { e.style.filter = ''; });
            e.addEventListener('mouseleave', function () { e.style.filter = ''; });
            break;
        }
        case 'textcursordrawable': st.caretColor = colorCss(val); break;
        case 'typeface': {
            var tf = s(val);
            var bytes = tf.charAt(0) === '@' || tf.charAt(0) === '%' ? vfsReadBytes(tf) : null;
            if (bytes) {
                var fid = 'font' + nextHostId();
                var ff = new FontFace(fid, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
                ff.load().then(function (f) { document.fonts.add(f); e.style.fontFamily = fid; }).catch(function () {});
            } else st.fontFamily = tf;
            break;
        }
        case 'textcolor': st.color = colorCss(val); break;
        case 'textsize': st.fontSize = pxNum(val) + 'px'; break;
        case 'textstyle': {
            var ts = s(val);
            if (ts.indexOf('bold') >= 0) st.fontWeight = 'bold';
            if (ts.indexOf('italic') >= 0) st.fontStyle = 'italic';
            if (ts.indexOf('underline') >= 0) st.textDecoration = 'underline';
            break;
        }
        case 'orientation': {
            if (st.display === 'flex' || e.style.display === 'flex')
                st.flexDirection = s(val).indexOf('horizontal') >= 0 ? 'row' : 'column';
            break;
        }
        case 'gravity': {
            var gv = s(val);
            var ja = 'flex-start', jc = 'flex-start';
            if (gv.indexOf('center_horizontal') >= 0) jc = 'center';
            if (gv.indexOf('center_vertical') >= 0) ja = 'center';
            if (gv === 'center') { jc = 'center'; ja = 'center'; }
            if (gv.indexOf('right') >= 0) jc = 'flex-end';
            if (gv.indexOf('bottom') >= 0) ja = 'flex-end';
            st.alignItems = ja; st.justifyContent = jc;
            if (e.tagName === 'BUTTON' || e.tagName === 'DIV') st.textAlign = jc === 'center' ? 'center' : (jc === 'flex-end' ? 'right' : 'left');
            break;
        }
        case 'layout_gravity': {
            var gv2 = s(val);
            var mapg = { top: 'flex-start', bottom: 'flex-end', left: 'flex-start', right: 'flex-end', center: 'center' };
            if (gv2 === 'center') { st.alignSelf = 'center'; }
            else {
                if (mapg[gv2]) st.alignSelf = mapg[gv2];
                var parts = gv2.split('|');
                parts.forEach(function (pp) { if (mapg[pp]) st.alignSelf = mapg[pp]; });
            }
            break;
        }
        case 'clickeable': case 'clickable': e.style.pointerEvents = (val === false || s(val) === 'false') ? 'none' : 'auto'; break;
        case 'singlesline': case 'singleline': break;
        case 'columncolumns': case 'columnnum': {
            if (e.style.display === 'grid') e.style.gridTemplateColumns = 'repeat(' + (Number(val) || 2) + ',1fr)';
            break;
        }
        case 'app_tabadd': {
            var tab = el('div', null, e);
            tab.textContent = s(val);
            tab.style.cssText = 'padding:12px 16px;font-size:14px;color:#666;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap';
            break;
        }
        case 'dh': {
            var ao = typeof val === 'object' && val.$o !== undefined ? objs.get(val.$o) : null;
            if (ao) runAnimation(ao, rec);
            break;
        }
        case 'lines': break;
        case 'numeric': if (e.tagName === 'INPUT') { e.type = 'number'; e.inputMode = 'numeric'; } break;
        case 'password': if (e.tagName === 'INPUT') e.type = 'password'; break;
        case 'phonenumber': if (e.tagName === 'INPUT') { e.type = 'tel'; } break;
        case 'emails': if (e.tagName === 'INPUT') { e.type = 'email'; } break;
        case 'enabled': e.disabled = !(val === true || s(val) === 'true' || val === 1); break;
        case 'scrollbars': break;
        case 'fadingedge': break;
        case 'textcolorhint': if (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA') { var stl = document.createElement('style'); stl.textContent = ''; break; } break;
        case 'singlesline': break;
        default: break;
    }
}
function pxNum(v) { var n = Number(v); return isFinite(n) ? n : 0; }
function setDrawer(rec, side, open) {
    var e = rec.el;
    if (!e.__drawerLeft) return;
    var isOpen = e.__drawerOpen;
    if (open && !isOpen[side]) {
        e.__drawerContent.style.transform = side === 'left' ? 'translateX(70%)' : 'translateX(-70%)';
        (side === 'left' ? e.__drawerLeft : e.__drawerRight).style.transform = 'translateX(0)';
        isOpen[side] = true;
        if (rec.__drawerOpened) rec.__drawerOpened();
    } else if (!open && isOpen[side]) {
        e.__drawerContent.style.transform = 'translateX(0)';
        (side === 'left' ? e.__drawerLeft : e.__drawerRight).style.transform = side === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
        isOpen[side] = false;
        if (rec.__drawerClosed) rec.__drawerClosed();
    }
}
function attachWebviewEvents(rec) {
    var e = rec.el;
    if (e.__wvAttached) return;
    e.__wvAttached = true;
    e.addEventListener('load', function () {
        try {
            var win = e.contentWindow;
            if (win && !win.iapp && window.iapp) {
                try { win.iapp = window.iapp; } catch (er) {}
            }
            if (rec.__urlFilter && win) {
                win.document.addEventListener('click', function (ev) {
                    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
                    if (a && a.href && rec.evs.get('shouldoverrideurlloading')) {
                        ev.preventDefault();
                        fireCtrlEvent(rec, 'shouldoverrideurlloading', Object.assign(baseSt(rec), { st_msG: a.href }));
                    }
                }, true);
            }
        } catch (er) {}
    });
}

// ---------- ug / us OPS ----------
OPS.us = function (args) {
    // us(id, prop, val[, extra..., out]) — 多参特殊属性处理
    var rec = getCtrl(args[0]);
    if (!rec) return false;
    var key = s(args[1]);
    // 特殊多参: shadow / selection / url(4参) / isdraweropen(side)
    if (key === 'shadow' && args.length >= 6) {
        rec.el.style.boxShadow = pxNum(args[2]) + 'px ' + pxNum(args[3]) + 'px ' + pxNum(args[2]) + 'px ' + colorCss(args[5]);
        return true;
    }
    if (key === 'selection' && args.length >= 5) {
        var inp = rec.el.tagName === 'INPUT' ? rec.el : rec.el.__input;
        if (inp) { inp.focus(); try { inp.setSelectionRange(Number(args[2]), Number(args[3])); } catch (e) {} }
        return true;
    }
    if (key === 'url' && args.length >= 6 && rec.el.tagName === 'IFRAME') {
        var mime = s(args[4]) || 'text/html';
        var content = s(args[2]);
        if (content.charAt(0) === '@' || content.charAt(0) === '%') content = vfsReadText(content) || '';
        rec.el.srcdoc = content;
        return true;
    }
    if (key === 'isdraweropen' && args.length >= 4) {
        rec.props.__drawerSide = s(args[2]) === 'end' ? 'right' : 'left';
        setDrawer(rec, rec.props.__drawerSide, args[3] === true || s(args[3]) === 'true');
        return true;
    }
    if (key === 'opendrawer' || key === 'closedrawer') {
        var side2 = s(args[2]) === 'end' ? 'right' : 'left';
        setDrawer(rec, side2, key === 'opendrawer');
        return true;
    }
    if (key === 'gobackorforward') {
        try { rec.el.contentWindow.history.go(Number(args[2]) || 0); } catch (e) {}
        return true;
    }
    if (key === 'drawerlockmode') { rec.props.drawerlockmode = args[2]; return true; }
    applyProp(rec, key, args[2]);
    return true;
};
OPS.ug = function (args) {
    var rec = getCtrl(args[0]);
    if (!rec) return null;
    var key = s(args[1]);
    var e = rec.el;
    switch (key) {
        case 'text': return e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' ? e.value : (e.__span ? e.__span.textContent : (e.__input ? e.__input.value : (e.__tb ? e.__tb.title.textContent : e.textContent)));
        case 'background': return rec.props['background'] !== undefined ? rec.props['background'] : '';
        case 'width': return e.offsetWidth;
        case 'height': return e.offsetHeight;
        case 'x': return e.offsetLeft;
        case 'y': return e.offsetTop;
        case 'paddingleft': return pxNum(getComputedStyle(e).paddingLeft);
        case 'paddingtop': return pxNum(getComputedStyle(e).paddingTop);
        case 'paddingright': return pxNum(getComputedStyle(e).paddingRight);
        case 'paddingbottom': return pxNum(getComputedStyle(e).paddingBottom);
        case 'layout_marginleft': return pxNum(getComputedStyle(e).marginLeft);
        case 'layout_margintop': return pxNum(getComputedStyle(e).marginTop);
        case 'layout_marginright': return pxNum(getComputedStyle(e).marginRight);
        case 'layout_marginbottom': return pxNum(getComputedStyle(e).marginBottom);
        case 'hint': return e.placeholder || (e.__input ? e.__input.placeholder : '');
        case 'visibility': return e.style.display === 'none' ? 8 : (e.style.visibility === 'hidden' ? 4 : 0);
        case 'checked': return !!(e.__input ? e.__input.checked : (e.tagName === 'INPUT' ? e.checked : false));
        case 'title': return e.__tb ? e.__tb.title.textContent : (rec.props['title'] !== undefined ? rec.props['title'] : '');
        case 'url': return e.tagName === 'IFRAME' ? e.src : '';
        case 'lastvisibleposition': return Math.floor((e.scrollTop || 0) / Math.max(1, e.firstChild ? e.firstChild.offsetHeight : 1));
        case 'count': return e.children ? e.children.length : 0;
        case 'selecteditem': return e.tagName === 'SELECT' ? e.value : '';
        case 'rating': case 'progress': return e.tagName === 'INPUT' ? Number(e.value) : 0;
        case 'date': case 'time': return e.tagName === 'INPUT' ? e.value : '';
        case 'currentitem': return e.__pager ? Math.round((e.scrollLeft || 0) / Math.max(1, e.clientWidth)) : 0;
        case 'isdraweropen': {
            var side = args.length >= 4 ? s(args[2]) : 'start';
            return !!(e.__drawerOpen && e.__drawerOpen[side === 'end' ? 'right' : 'left']);
        }
        case 'selectionstart': { var inp = e.tagName === 'INPUT' ? e : e.__input; return inp ? inp.selectionStart : 0; }
        case 'selectionend': { var inp2 = e.tagName === 'INPUT' ? e : e.__input; return inp2 ? inp2.selectionEnd : 0; }
        case 'cangoback': try { return !!e.contentWindow && e.contentWindow.history.length > 1; } catch (er) { return false; }
        case 'cangoforward': return false;
        case 'src': return rec.props['src'] !== undefined ? rec.props['src'] : '';
        case 'count': return e.childElementCount;
        default: return rec.props[key] !== undefined ? rec.props[key] : null;
    }
};
OPS.nvw = function (args) {
    // nvw(id, parent) 移动 | nvw(id, parent, index) | nvw(id, parent, type, props[, out])
    var id = ctrlIdOf(args[0]);
    var parentId = ctrlIdOf(args[1]);
    if (args.length === 2 || (args.length === 3 && typeof args[2] === 'number' && !TYPE_BUILDERS[s(args[2])])) {
        // 移动
        var rec = getCtrl(id);
        var prec = parentId ? getCtrl(parentId) : null;
        if (rec) {
            var pel = prec ? (prec.el.__inner || prec.el) : currentScreenEl();
            pel.appendChild(rec.el);
            if (args.length === 3 && prec) {
                var idx = Math.max(0, Math.min(Number(args[2]), prec.kids.length));
                prec.kids.splice(idx, 0, rec);
            } else if (prec) prec.kids.push(rec);
            rec.parent = prec ? prec.id : 0;
        }
        return ctrlRef(rec);
    }
    var type = s(args[2]), propsStr = args[3];
    var rec2 = createControl(id, parentId, type, propsStr);
    return ctrlRef(rec2);
};
OPS.urvw = function (args) {
    var rec = getCtrl(args[0]);
    if (rec) {
        removeCtrlTree(rec);
    }
    return true;
};
function removeCtrlTree(rec) {
    (rec.kids || []).slice().forEach(removeCtrlTree);
    ctrls.delete(rec.id);
    if (rec.el && rec.el.parentNode) rec.el.parentNode.removeChild(rec.el);
}
OPS.uall = function (args) {
    var rec = getCtrl(args[0]);
    var asObj = args[1] === true || s(args[1]) === 'true';
    if (!rec) return [];
    return (rec.kids || []).map(function (k) { return asObj ? ctrlRef(k) : k.id; });
};
OPS.gvs = function (args) {
    // gvs(id, out) | gvs(0, root) | gvs(parentObj, childId, out) | gvs(id, 0, parentOut)
    if (args.length === 1) {
        var r0 = getCtrl(args[0]);
        return r0 ? r0.id : null;
    }
    var a0 = args[0], a1 = args[1];
    if (Number(a1) === 0 && typeof a0 !== 'object') {
        // gvs(0, root) — 根控件由 C++ 传入实际 id
        var r1 = getCtrl(a0);
        return r1 ? r1.id : null;
    }
    if (Number(a1) === 0) {
        // gvs(obj, 0, out) — 父控件
        var recp = getCtrl(a0);
        return recp && recp.parent ? recp.parent : null;
    }
    // gvs(parentObj, childId, out)
    var prec2 = getCtrl(a0);
    if (!prec2) return null;
    var want = ctrlIdOf(a1);
    var found = findKid(prec2, want);
    return found ? found.id : null;
};
function findKid(rec, id) {
    var kids = rec.kids || [];
    for (var i = 0; i < kids.length; i++) {
        if (kids[i].id === id) return kids[i];
        var sub = findKid(kids[i], id);
        if (sub) return sub;
    }
    return null;
}
OPS.evbind = function (args) {
    var id = ctrlIdOf(args[0]), evName = s(args[1]), token = s(args[2]);
    var rec = getCtrl(id);
    if (rec) {
        rec.evs.set(evName, token);
        bindEvent(rec, evName);
        // clickitem 特殊: 列表项点击
        return true;
    }
    return false;
};
// ============================================================================
// IYU API 层 Part 3: 弹窗 / 屏幕 / 列表 / 工具栏 / 滑动窗体 / yul
// ============================================================================

// ---------- tw 提示 ----------
OPS.toast = function (args) {
    var text = s(args[0]);
    var dur = args.length >= 2 ? Number(args[1]) || 0 : 0;
    var t = el('div', null, document.body);
    t.style.cssText = 'position:fixed;left:50%;bottom:15%;transform:translateX(-50%);background:rgba(30,30,30,.9);color:#fff;padding:10px 18px;border-radius:8px;font-size:14px;z-index:2147483600;max-width:80%;white-space:pre-wrap;box-shadow:0 4px 12px rgba(0,0,0,.3)';
    t.textContent = text;
    setTimeout(function () { t.remove(); }, dur >= 1 ? 3500 : 2000);
    return true;
};

// ---------- tws 视图内弹窗 ----------
OPS.tws = function (args) {
    var rec = args[0] && typeof args[0] === 'object' ? getCtrl(args[0]) : null;
    var text = s(args[1]);
    var dur = Number(args[2]) || 0;
    var btn = args.length >= 4 ? s(args[3]) : null;
    var token = args.length >= 5 ? s(args[4]) : '';
    var host = rec ? rec.el : (hostEl || document.body);
    var box = el('div', null, host);
    box.style.cssText = 'position:absolute;left:50%;top:12%;transform:translateX(-50%);background:rgba(30,30,30,.92);color:#fff;border-radius:8px;padding:14px 18px;font-size:14px;z-index:900;max-width:86%;white-space:pre-wrap;box-shadow:0 6px 18px rgba(0,0,0,.35)';
    var txt = el('div', null, box); txt.textContent = text;
    if (btn) {
        var b = el('button', null, box);
        b.textContent = btn;
        b.style.cssText = 'margin-top:10px;background:#1976d2;color:#fff;border:none;border-radius:4px;padding:6px 20px;cursor:pointer;font-size:13px';
        b.onclick = function (e) { e.stopPropagation(); box.remove(); if (token) callEvent(token, {}); };
    } else {
        setTimeout(function () { box.remove(); }, dur === -1 ? 6000 : dur === -2 ? 10000 : 2500);
    }
    return true;
};

// ---------- utw 弹窗 ----------
var dialogStack = [];
OPS.utw = function (args) {
    // 布局: [ctrlId, nbtn, cancelable, icon, title, content, b1..bn, tok1..tokN]
    var ctrlId = ctrlIdOf(args[0]);
    var nbtn = Number(args[1]) || 0;
    var cancelable = args[2] !== false && s(args[2]) !== 'false';
    var icon = args[3], title = s(args[4]), content = args[5];
    var toks = [];
    for (var i = 0; i < nbtn; i++) toks.push(s(args[6 + nbtn + i]));
    var mask = el('div', null, document.body);
    mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483400;display:flex;align-items:center;justify-content:center';
    var box = el('div', null, mask);
    box.style.cssText = 'background:#fff;border-radius:10px;min-width:72%;max-width:86%;max-height:70%;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.4);display:flex;flex-direction:column';
    var body = el('div', null, box);
    body.style.cssText = 'padding:20px;overflow-y:auto';
    if (title) { var tt = el('div', null, body); tt.textContent = title; tt.style.cssText = 'font-size:16px;font-weight:bold;color:#222;margin-bottom:10px'; }
    var cc = el('div', null, body);
    var contentStr = s(content);
    if (/\.iyu$/.test(contentStr)) {
        cc.textContent = '(界面文件弹窗: ' + contentStr + ' — 请使用 utw 显示文本或 HTML)';
    } else if (contentStr.slice(0, 6) === '(html)' || /<[a-z][\s\S]*>/i.test(contentStr)) {
        cc.innerHTML = contentStr.slice(0, 6) === '(html)' ? contentStr.slice(6) : contentStr;
    } else {
        cc.textContent = contentStr;
        cc.style.whiteSpace = 'pre-wrap';
    }
    cc.style.cssText += ';font-size:14px;color:#555;line-height:1.5';
    if (nbtn > 0) {
        var btnRow = el('div', null, box);
        btnRow.style.cssText = 'display:flex;border-top:1px solid #eee';
        var labels = [];
        for (var j = 0; j < nbtn; j++) labels.push(s(args[6 + j]));
        labels.forEach(function (lab, idx2) {
            var b = el('button', null, btnRow);
            b.textContent = lab;
            b.style.cssText = 'flex:1;border:none;background:none;padding:13px;font-size:14px;color:#1976d2;cursor:pointer;border-left:' + (idx2 ? '1px solid #eee' : 'none');
            b.onclick = function () {
                mask.remove();
                var di = dialogStack.indexOf(mask);
                if (di >= 0) dialogStack.splice(di, 1);
                if (toks[idx2]) callEvent(toks[idx2], {});
            };
        });
    }
    dialogStack.push(mask);
    if (cancelable) mask.addEventListener('click', function (e) {
        if (e.target === mask) { mask.remove(); var di2 = dialogStack.indexOf(mask); if (di2 >= 0) dialogStack.splice(di2, 1); }
    });
    // 注册对话框控件记录 (供 endutw / ug 操作)
    var dEl = box;
    var rec = { el: dEl, type: '对话框', id: ctrlId, owner: '', props: {}, evs: new Map(), kids: [], parent: 0, itemCtx: null };
    ctrls.set(ctrlId, rec);
    return true;
};
OPS.dialog = function (args) {
    var sub = s(args[0]);
    if (sub === 'endutw') {
        var top = dialogStack.pop();
        if (top) top.remove();
        return true;
    }
    return false;
};

// ---------- 屏幕: ui.addv / ui.uigo / ui.end ----------
OPS['ui.addv'] = function (args) {
    var parentId = ctrlIdOf(args[0]);
    var files = s(args[1]);
    var count = Number(args[2]) || 1;
    var prec = parentId ? getCtrl(parentId) : null;
    var parentEl = prec ? (prec.el.__inner || prec.el) : currentScreenEl();
    var roots = [];
    if (count > 1) {
        // 滑动窗体: 横向分页
        var pager = el('div', null, parentEl);
        pager.style.cssText = 'width:100%;height:100%;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overflow-y:hidden';
        for (var i = 0; i < count; i++) {
            var page = el('div', null, pager);
            page.style.cssText = 'min-width:100%;height:100%;scroll-snap-align:start;position:relative;overflow:hidden';
            var rid = nextHostId();
            var rec = { el: page, type: '滑动窗体页', id: rid, owner: '', props: {}, evs: new Map(), kids: [], parent: prec ? prec.id : 0, itemCtx: null };
            ctrls.set(rid, rec);
            roots.push(rid);
        }
        attachPagerWatcher(pager);
    } else {
        var cont = el('div', null, parentEl);
        cont.style.cssText = 'width:100%;height:100%;position:relative;overflow:hidden';
        var rid2 = nextHostId();
        var rec2 = { el: cont, type: '界面容器', id: rid2, owner: '', props: {}, evs: new Map(), kids: [], parent: prec ? prec.id : 0, itemCtx: null };
        ctrls.set(rid2, rec2);
        roots.push(rid2);
    }
    return roots;
};
OPS['ui.uigo'] = function (args) {
    var name = s(args[0]);
    var prev = screenStack[screenStack.length - 1];
    if (prev) prev.el.style.display = 'none';   // 隐藏上一屏幕
    var scr = el('div', null, hostEl);
    scr.style.cssText = 'position:absolute;inset:0;overflow:hidden;background:#fff';
    var root = nextHostId();
    var rec = { el: scr, type: '界面根', id: root, owner: name, props: {}, evs: new Map(), kids: [], parent: 0, itemCtx: null };
    ctrls.set(root, rec);
    screenStack.push({ el: scr, root: root, name: name });
    return root;
};
OPS['ui.end'] = function (args) {
    var top = screenStack.pop();
    if (top) {
        removeCtrlTree(ctrls.get(top.root) || top);
        if (top.el.parentNode) top.el.parentNode.removeChild(top.el);
    }
    var prev = screenStack[screenStack.length - 1];
    if (prev) prev.el.style.display = '';   // 恢复上一屏幕
    return true;
};
OPS.lan = function (args) {
    // 跳转动画: 应用到最新屏幕
    var n = Number(args[0]) || 0;
    var scr = screenStack.length ? screenStack[screenStack.length - 1].el : null;
    if (!scr) return false;
    var anims = {
        0: 'iyu-fade', 1: 'iyu-zoom', 6: 'iyu-slide-left', 7: 'iyu-slide-up', 8: 'iyu-cross',
    };
    var name = anims[n] || 'iyu-fade';
    var keyframes = {
        'iyu-fade': [{ opacity: 0 }, { opacity: 1 }],
        'iyu-zoom': [{ opacity: 0, transform: 'scale(1.3)' }, { opacity: 1, transform: 'scale(1)' }],
        'iyu-slide-left': [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
        'iyu-slide-up': [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        'iyu-cross': [{ opacity: 0, transform: 'translateX(30%)' }, { opacity: 1, transform: 'none' }],
    };
    try { scr.animate(keyframes[name], { duration: 300, easing: 'ease-out' }); } catch (e) {}
    return true;
};

// ---------- 列表 ----------
var listBinding = new Map();   // listObjId → ctrlId
function renderItems(rec, items) {
    // items: 解析后的数组 (字符串或对象)
    var e = rec.el;
    e.innerHTML = '';
    if (e.tagName === 'SELECT') {
        items.forEach(function (it, i) {
            var o = el('option', null, e);
            o.value = typeof it === 'object' ? s(it.text || it['0'] || JSON.stringify(it)) : s(it);
            o.textContent = o.value;
        });
        return;
    }
    items.forEach(function (it, i) {
        rec.__templateRoots = rec.__templateRoots || [];
        if (rec.__templateRoots[i] && rec.__templateRoots[i].el.parentNode) {
            // 已有根 (模板模式): 只更新数据
            rec.__templateRoots[i].itemCtx = typeof it === 'object' ? it : { '0': it };
            return;
        }
        var itemRec;
        if (rec.__template) {
            // 模板模式: 根容器由 C++ 编译单元填充, 这里只建容器
            return;
        }
        var row = el('div', null, e);
        row.style.cssText = 'padding:12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;cursor:pointer';
        if (typeof it === 'object') {
            var html = '';
            for (var k in it) html += '<div>' + escapeHtml(s(it[k])) + '</div>';
            row.innerHTML = html;
        } else {
            row.textContent = s(it);
        }
        itemRec = { el: row, type: '列表项', id: nextHostId(), owner: '', props: {}, evs: new Map(), kids: [], parent: rec.id, itemCtx: typeof it === 'object' ? it : { '0': it } };
        ctrls.set(itemRec.id, itemRec);
        row.addEventListener('click', function (ev) {
            ev.stopPropagation();
            var tok = rec.evs.get('clickitem');
            if (tok) callEvent(tok, Object.assign(baseSt(rec), { st_pN: items.indexOf(it), st_iD: it }));
        });
    });
}
function escapeHtml(x) { return s(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

OPS.uls = function (args, ctx) {
    var ctrlId = ctrlIdOf(args[0]);
    var rec = getCtrl(ctrlId);
    if (!rec) return false;
    var items;
    try { items = JSON.parse(s(args[1]) || '[]'); } catch (e) { items = []; }
    var listObjId = Number(args[2]) || -1;
    var layout = args[3];
    var w = args[4], h = args[5];
    if (listObjId >= 0) listBinding.set(listObjId, ctrlId);
    if (rec.el.tagName === 'SELECT' || !layout || layout === null) {
        rec.__template = null;
        renderItems(rec, items);
        return true;
    }
    // 模板模式: 为每项建根容器, 返回根id数组 → C++ 编译界面单元填充
    rec.el.innerHTML = '';
    rec.__template = s(layout);
    rec.__items = items;
    rec.__templateRoots = [];
    var roots = [];
    items.forEach(function (it, i) {
        var row = el('div', null, rec.el.__inner || rec.el);
        row.style.cssText = 'width:' + pxSize(w === undefined ? -1 : w) + ';height:' + pxSize(h === undefined ? -2 : h) + ';position:relative;overflow:hidden;border-bottom:1px solid #f5f5f5';
        var rid = nextHostId();
        var irec = { el: row, type: '列表项根', id: rid, owner: '', props: {}, evs: new Map(), kids: [], parent: rec.id, itemCtx: typeof it === 'object' ? it : { '0': it } };
        ctrls.set(rid, irec);
        rec.__templateRoots.push(irec);
        roots.push(rid);
        row.addEventListener('click', function (ev) {
            if (ev.__iyuItem) return;
            var tok = rec.evs.get('clickitem');
            if (tok) callEvent(tok, Object.assign(baseSt(rec), { st_pN: i, st_iD: it }));
        });
    });
    return roots;
};
OPS.ula = function (args) {
    var mode = s(args[1]);
    var listObjId = Number(args[2]) || -1;
    var ctrlId = listBinding.get(listObjId);
    if (mode === 'obj') return ctrlId !== undefined ? ctrlId : null;
    var rec = ctrlId !== undefined ? getCtrl(ctrlId) : null;
    if (!rec) return false;
    var items;
    try { items = JSON.parse(s(args[3]) || '[]'); } catch (e) { items = []; }
    if (mode === 'refreshat') {
        var at = Number(args[4]) || 0;
        if (rec.__templateRoots && rec.__templateRoots[at]) {
            rec.__templateRoots[at].itemCtx = typeof items[at] === 'object' ? items[at] : { '0': items[at] };
        }
        rec.__items = items;
        return true;
    }
    if (rec.__template) {
        // 重建根容器 + C++ 重新编译由 ula 刷新流程负责 (简单模式: 直接重渲染)
        rec.__items = items;
        renderItems(rec, items);
        return true;
    }
    renderItems(rec, items);
    return true;
};
OPS.ulag = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    var key = s(args[1]);
    if (!rec) return null;
    var d = rec.itemCtx;
    if (!d) return null;
    return d[key] !== undefined ? d[key] : null;
};
OPS.ulas = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    var key = s(args[1]);
    if (!rec || !rec.itemCtx) return false;
    rec.itemCtx[key] = args[2];
    return true;
};

// ---------- utb Toolbar ----------
var activeToolbar = null;
OPS.utb = function (args) {
    var a0 = args[0];
    if (typeof a0 === 'object' || (typeof a0 === 'number' && getCtrl(a0))) {
        var rec = getCtrl(a0);
        if (rec && rec.el.__tb) {
            activeToolbar = rec;
            if (args.length >= 2) {
                var drec = getCtrl(args[1]);
                if (drec && drec.el.__drawerLeft) {
                    rec.el.__tb.drawer = drec;
                    rec.el.__tb.leftIcon.style.display = 'block';
                    rec.el.__tb.leftIcon.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="white" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>');
                    rec.el.__tb.leftIcon.onclick = function () {
                        var side = drec.props.__drawerSide || 'left';
                        setDrawer(drec, side, !drec.el.__drawerOpen[side]);
                    };
                }
            }
        }
        return true;
    }
    var cmd = s(a0);
    var tb = activeToolbar;
    if (cmd === 'set') {
        var key = s(args[1]), val = args[2];
        if (!tb) return false;
        if (key === 'title') tb.el.__tb.title.textContent = s(val);
        else if (key === 'subtitle') { /* 简化 */ }
        else if (key === 'dshe') tb.el.__tb.leftIcon.style.display = (val === true || s(val) === 'true') && tb.el.__tb.drawer ? 'block' : 'none';
        else if (key === 'dste') tb.el.__tb.title.style.display = (val === false || s(val) === 'false') ? 'none' : '';
        else if (key === 'leftck') { /* token 由 args[3] 传入 */ }
        else if (key === 'do') { /* 显示选项 */ }
        return true;
    }
    if (cmd === 'left') {
        if (!tb) return false;
        tb.el.__tb.leftIcon.style.display = 'block';
        tb.el.__tb.leftIcon.src = resolveSrc(args[2]);
        tb.el.__tb.leftIcon.onclick = function () {
            var tok = tb.evs.get('utb0');
            if (tok) callEvent(tok, baseSt(tb));
            else if (tb.el.__tb.drawer) {
                var side = tb.el.__tb.drawer.props.__drawerSide || 'left';
                setDrawer(tb.el.__tb.drawer, side, !tb.el.__tb.drawer.el.__drawerOpen[side]);
            }
        };
        return true;
    }
    if (cmd === 'right') {
        if (!tb) return false;
        tb.el.__tb.rightIcon.style.display = 'block';
        tb.el.__tb.rightIcon.src = resolveSrc(args[2]);
        tb.el.__tb.rightIcon.onclick = function () {
            var items = menuItemsFor('u0|c-1|e菜单');
            if (items && items.length) {
                showPopupMenu(items, function (sel) {
                    callEvent('u0|c-1|e菜单', { st_vId: tb.id }, sel);
                });
            }
        };
        return true;
    }
    if (cmd === 'get') {
        var key2 = s(args[1]);
        if (!tb) return '';
        if (key2 === 'title') return tb.el.__tb.title.textContent;
        if (key2 === 'subtitle') return '';
        if (key2 === 'height') return tb.el.offsetHeight;
        return '';
    }
    return false;
};

// ---------- uht 滑动窗体控制 ----------
OPS.uht = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    if (!rec) return 0;
    var cmd = s(args[1]);
    var e = rec.el;
    if (cmd === 'add') {
        var idx = Number(args[2]) || -1;
        var page = el('div', null, e);
        page.style.cssText = 'min-width:100%;height:100%;scroll-snap-align:start;position:relative;overflow:hidden';
        var rid = nextHostId();
        var prec = { el: page, type: '滑动窗体页', id: rid, owner: '', props: {}, evs: new Map(), kids: [], parent: rec.id, itemCtx: null };
        ctrls.set(rid, prec);
        rec.kids.push(prec);
        attachPagerWatcher(e);
        // 返回根 id → C++ 编译布局单元
        return rid;
    }
    if (cmd === 'del') {
        var idx2 = Number(args[2]);
        var kids = rec.kids;
        if (idx2 === -1) idx2 = kids.length - 1;
        if (kids[idx2]) { removeCtrlTree(kids[idx2]); }
        return true;
    }
    if (cmd === 'title') return true;
    if (cmd === 'size') return rec.kids.length;
    if (cmd === 'close') { e.innerHTML = ''; rec.kids = []; return true; }
    if (cmd === 'bd') return true;
    return false;
};

// ---------- uxf 悬浮窗 ----------
var floatWins = new Map();
OPS.uxf = function (args) {
    var mode = s(args[0]);
    var winId = ctrlIdOf(args[1]);
    if (mode === 'ctl') {
        var rec = getCtrl(winId);
        if (!rec) return false;
        var sub = s(args[2]);
        if (sub === 'del') { removeCtrlTree(rec); floatWins.delete(winId); return true; }
        if (sub === 'set') {
            var st2 = rec.el.style;
            var x = args[3], y = args[4], w = args[5], h = args[6];
            if (x !== null && x !== undefined && x !== '') st2.left = pxNum(x) + 'px';
            if (y !== null && y !== undefined && y !== '') st2.top = pxNum(y) + 'px';
            if (w !== null && w !== undefined) st2.width = pxSize(w);
            if (h !== null && h !== undefined) st2.height = pxSize(h);
            var g = args[7];
            if (g !== null && g !== undefined) applyFloatGravity(rec.el, s(g));
            return true;
        }
        return true;
    }
    if (mode === 'new') {
        var w2 = args[3], h2 = args[4], gravity = args[5];
        var d = el('div', null, document.body);
        d.style.cssText = 'position:fixed;z-index:2147483200;background:#fff;box-shadow:0 6px 24px rgba(0,0,0,.35);border-radius:6px;overflow:hidden;inset:auto';
        if (w2 !== null && w2 !== undefined) d.style.width = pxSize(w2);
        if (h2 !== null && h2 !== undefined) d.style.height = pxSize(h2);
        d.style.width = d.style.width || '280px';
        d.style.height = d.style.height || 'auto';
        applyFloatGravity(d, s(gravity || 'center'));
        var rec2 = { el: d, type: '悬浮窗', id: winId, owner: s(args[8]) || '', props: {}, evs: new Map(), kids: [], parent: 0, itemCtx: null };
        ctrls.set(winId, rec2);
        floatWins.set(winId, rec2);
        return winId;
    }
    return false;
};
function applyFloatGravity(d, g) {
    d.style.right = 'auto'; d.style.bottom = 'auto'; d.style.left = 'auto'; d.style.top = 'auto';
    var parts = g.split('|');
    var hz = null, vt = null;
    parts.forEach(function (p) {
        if (p === 'left') hz = 'left';
        if (p === 'right') hz = 'right';
        if (p === 'top') vt = 'top';
        if (p === 'bottom') vt = 'bottom';
        if (p === 'center') { hz = 'center'; vt = 'center'; }
        if (p === 'center_horizontal') hz = 'center';
        if (p === 'center_vertical') vt = 'center';
    });
    if (hz === 'left') d.style.left = '10px';
    else if (hz === 'right') d.style.right = '10px';
    else if (hz === 'center') d.style.left = '50%'; d.style.transform = 'translateX(-50%)';
    if (vt === 'top') d.style.top = '10px';
    else if (vt === 'bottom') d.style.bottom = '10px';
    else if (vt === 'center') d.style.top = '50%';
}

// ---------- 菜单项查询 (走 C++) ----------
function menuItemsFor(token) {
    if (!M) return null;
    if (menuRegistry.has(token)) return menuRegistry.get(token);
    try {
        var len = M.lengthBytesUTF8(token);
        var buf = M._malloc(len + 1);
        M.stringToUTF8(token, buf, len + 1);
        var rp = M._iyu_menuitems(buf);
        var out = JSON.parse(rp ? M.UTF8ToString(rp) : '[]');
        menuRegistry.set(token, out);
        return out;
    } catch (e) { return null; }
}

// ---------- yul 布局 ----------
var YUL_TAG = {
    'LinearLayout': { tag: 'div', css: 'display:flex;flex-direction:column' },
    'RelativeLayout': { tag: 'div', css: 'position:relative' },
    'FrameLayout': { tag: 'div', css: 'position:relative' },
    'TextView': { tag: 'div', css: 'white-space:pre-wrap' },
    'Button': { tag: 'button', css: 'border:none;cursor:pointer;background:#e8e8e8;border-radius:4px;padding:8px 14px' },
    'ImageView': { tag: 'img', css: 'display:block;object-fit:contain' },
    'EditText': { tag: 'input', css: 'border:1px solid #ccc;border-radius:4px;padding:8px' },
    'CheckBox': { tag: 'input', css: '' },
    'RadioButton': { tag: 'input', css: '' },
    'ScrollView': { tag: 'div', css: 'overflow-y:auto' },
    'HorizontalScrollView': { tag: 'div', css: 'overflow-x:auto' },
    'WebView': { tag: 'iframe', css: 'border:none;width:100%;height:100%' },
    'VideoView': { tag: 'video', css: 'background:#000' },
    'ProgressBar': { tag: 'div', css: 'background:#e0e0e0;border-radius:4px;min-height:6px' },
    'SeekBar': { tag: 'input', css: 'width:100%;accent-color:#1976d2' },
    'Switch': { tag: 'input', css: '' },
    'Space': { tag: 'div', css: '' },
};
OPS.yul = function (args) {
    var rec = args.length >= 2 && !args[0].yulSrc ? getCtrl(ctrlIdOf(args[0])) : null;
    var yulFile = s(args[0]);
    var src = vfsReadText(yulFile);
    if (src === null) return null;
    var root = yulParse(src);
    if (!root) return null;
    var parentEl = rec ? (rec.el.__inner || rec.el) : currentScreenEl();
    parentEl.appendChild(root.el);
    return root.id;
};
function yulParse(xml) {
    // 极简 XML 解析
    var doc = new DOMParser().parseFromString(xml, 'text/xml');
    var rootEl = doc.documentElement;
    if (!rootEl || rootEl.nodeName === 'parsererror') return null;
    function build(node, parentRec) {
        var info = YUL_TAG[node.nodeName] || { tag: 'div', css: 'position:relative' };
        var e = el(info.tag);
        e.style.cssText += ';' + info.css;
        var attrs = {};
        for (var i = 0; i < node.attributes.length; i++) {
            var at = node.attributes[i];
            attrs[at.name.replace('android:', '')] = at.value;
        }
        // id
        var id = 0;
        if (attrs.id) {
            var idv = attrs.id.replace('@+id/', '').replace('@id/', '').replace('@+id', '');
            id = parseInt(idv.replace(/^s/, ''), 10);
            if (!isFinite(id)) id = 0;
        }
        var rec2 = { el: e, type: 'yul:' + node.nodeName, id: id || nextHostId(), owner: '', props: attrs, evs: new Map(), kids: [], parent: parentRec ? parentRec.id : 0, itemCtx: null };
        ctrls.set(rec2.id, rec2);
        if (id) logicalId.set(id, rec2.id);
        if (parentRec) parentRec.kids.push(rec2);
        // 属性映射
        var st = e.style;
        if (attrs.layout_width) { var w3 = pxSize(androidSize(attrs.layout_width)); if (w3 !== 'auto') st.width = w3; }
        if (attrs.layout_height) { var h3 = pxSize(androidSize(attrs.layout_height)); if (h3 !== 'auto') st.height = h3; }
        if (attrs.text) e.textContent = attrs.text;
        if (attrs.hint && (e.tagName === 'INPUT')) e.placeholder = attrs.hint;
        if (attrs.textColor) st.color = colorCss(attrs.textColor);
        if (attrs.textSize) st.fontSize = pxNum(parseFloat(attrs.textSize)) + 'px';
        if (attrs.background) { var bg = bgOf(attrs.background); if (bg) st.background = bg; }
        if (attrs.src && e.tagName === 'IMG') e.src = resolveSrc(attrs.src);
        if (attrs.padding) st.padding = pxNum(parseFloat(attrs.padding)) + 'px';
        if (attrs.layout_margin) st.margin = pxNum(parseFloat(attrs.layout_margin)) + 'px';
        if (attrs.gravity) { st.textAlign = attrs.gravity.indexOf('center') >= 0 ? 'center' : attrs.gravity; }
        if (attrs.orientation === 'horizontal' && st.display === 'flex') st.flexDirection = 'row';
        for (var ci = 0; ci < node.children.length; ci++) {
            var childNode = node.children[ci];
            if (childNode.nodeType === 1) build(childNode, rec2);
        }
        return rec2;
    }
    return build(rootEl, null);
}
function androidSize(v) {
    if (!v) return '-1';
    if (v === 'match_parent' || v === 'fill_parent') return '-2';
    if (v === 'wrap_content') return '-1';
    var m = /^(-?[\d.]+)(dp|dip|px|sp)?$/.exec(v);
    if (m) return String(Math.round(parseFloat(m[1])));
    return '-1';
}
// ============================================================================
// IYU API 层 Part 4: 文件系统 / 网络 / ZIP / 下载管理器 / 剪贴板 / 字节 / 正则
// ============================================================================

// ---------- 文件系统 (同步) ----------
OPS.fsop = function (args) {
    var op = s(args[0]);
    var p1 = args[1], p2 = args[2];
    switch (op) {
        case 'fd': return VFS.delete(normPath(p1));
        case 'fe': return VFS.has(normPath(p1)) && !VFS.get(normPath(p1)).dir;
        case 'fs': {
            var f = VFS.get(normPath(p1));
            if (!f || f.dir) return -1;
            if (f.b) return f.b.length;
            return new TextEncoder().encode(f.t).length;
        }
        case 'fr': {
            var t = vfsReadText(p1);
            return t === null ? '' : t;
        }
        case 'fw': {
            vfsWrite(p1, s(p2 === undefined ? '' : p2), false);
            return true;
        }
        case 'fc': {
            var src = normPath(p1), dst = normPath(p2);
            var ow = args.length >= 4 ? (args[3] === true || s(args[3]) === 'true') : true;
            if (!VFS.has(src) || VFS.get(src).dir) return false;
            if (VFS.has(dst) && !ow) return false;
            VFS.set(dst, VFS.get(src));
            ensureParentDirs(dst);
            return true;
        }
        case 'ft': {
            var s1 = normPath(p1), d1 = normPath(p2);
            if (!VFS.has(s1)) return false;
            VFS.set(d1, VFS.get(s1));
            VFS.delete(s1);
            ensureParentDirs(d1);
            return true;
        }
        case 'fl': {
            var mode = args.length >= 3 ? (args[2] === true ? 'dir' : args[2] === false ? 'file' : null) : null;
            return vfsList(p1, mode);
        }
        case 'fi': {
            var ff = VFS.get(normPath(p1));
            return !!(ff && ff.dir);
        }
        case 'fo': {
            var path = normPath(p1);
            var ffo = VFS.get(path);
            if (!ffo) { emit('log', '[iyu] fo: 文件不存在 ' + path, true); return false; }
            var bytes = ffo.b || new TextEncoder().encode(ffo.t);
            var ext = path.split('.').pop().toLowerCase();
            var mime = 'application/octet-stream';
            var mm = { jpg: 'image/jpeg', png: 'image/png', gif: 'image/gif', mp3: 'audio/mpeg', mp4: 'video/mp4', txt: 'text/plain', html: 'text/html', pdf: 'application/pdf' };
            if (mm[ext]) mime = mm[ext];
            var url = URL.createObjectURL(new Blob([bytes], { type: mime }));
            window.open(url, '_blank');
            return true;
        }
        case 'fdir': {
            // fdir(out) → 根 | fdir("%dir", out) → 绝对路径
            if (args.length >= 2) return normPath(p1);
            return '/';
        }
        case 'mkdir': VFS.set(normPath(p1), { dir: true }); return true;
        default: return null;
    }
};

// ---------- 字节转换 ----------
OPS.otob = function (args) {
    // otob(path, out) | otob(enc, str, out) | otob("file", null, path, out) | otob("str", enc, str, out)
    if (args.length === 2) return bytesToByteStr(vfsReadBytes(args[0]) || new Uint8Array(0));
    var a0 = s(args[0]);
    if (a0 === 'file') return bytesToByteStr(vfsReadBytes(args[2]) || new Uint8Array(0));
    if (a0 === 'str' || a0 === 'utf-8' || a0 === 'utf8') {
        var str = args.length >= 4 ? s(args[2]) : s(args[1]);
        return bytesToByteStr(new TextEncoder().encode(str));
    }
    return bytesToByteStr(new TextEncoder().encode(s(args[1] || '')));
};
OPS.btoo = function (args) {
    // btoo(bytes, path) → 写文件 | btoo(enc, bytes, out) → 字符串
    if (args.length === 2) {
        var b = typeof args[0] === 'string' ? byteStrToBytes(args[0]) : new Uint8Array(0);
        vfsWrite(args[1], b, true);
        return true;
    }
    var enc = s(args[0]);
    var bytes = typeof args[1] === 'string' ? byteStrToBytes(args[1]) : new Uint8Array(0);
    if (!enc || enc === 'null') return args[1];
    try { return new TextDecoder(enc === 'utf8' ? 'utf-8' : enc).decode(bytes); } catch (e) { return new TextDecoder().decode(bytes); }
};

// ---------- 正则 (se / sr regex 模式) ----------
var reObjs = new Map();
OPS.remk = function (args) {
    var id = Number(args[0]);
    var pat = s(args[1]);
    var flags = Number(args[2]) || 0;
    var fl = 'g';
    if (flags & 2) fl += 'i';       // CASE_INSENSITIVE
    if (flags & 8) fl += 'm';       // MULTILINE
    if (flags & 4) fl = fl.replace('g', '');  // DOTALL → 无对应, s 标志省略
    var re;
    try { re = new RegExp(pat, fl); } catch (e) { try { re = new RegExp(pat, 'g'); } catch (e2) { re = null; } }
    reObjs.set(id, { re: re, pat: pat, flags: fl, groups: [], input: args.length >= 4 ? s(args[3]) : '' });
    return true;
};
OPS.regex = function (args) {
    var mode = s(args[0]);
    var str = s(args[1]), pat = s(args[2]), rep = args.length >= 4 ? s(args[3]) : '';
    var first = args.length >= 5 ? args[4] === true : false;
    try {
        var re = new RegExp(pat, first ? '' : 'g');
        if (mode === 'sral' || mode === 'srft') {
            return str.replace(re, function () {
                var args2 = arguments;
                return rep.replace(/\$(\d)/g, function (m2, d) {
                    var gi = Number(d);
                    return gi < args2.length - 2 ? s(args2[gi]) : m2;
                });
            });
        }
        if (mode === 'split') return str.split(new RegExp(pat, 'g'));
        return null;
    } catch (e) { return null; }
};
OPS.rexx = function (args) {
    var id = Number(args[0]);
    var cmd = s(args[1]);
    var ro = reObjs.get(id);
    if (!ro || !ro.re) return null;
    var re = ro.re;
    switch (cmd) {
        case 'ms': {
            re.lastIndex = 0;
            var m = re.exec(s(args[2] || ''));
            return !!m;
        }
        case 'find': {
            ro.__input = ro.input || '';
            if (args.length >= 4 && typeof args[2] === 'number') { ro.__pos = Number(args[2]); }
            re.lastIndex = ro.__pos || 0;
            var m2 = re.exec(ro.__input);
            if (m2) {
                ro.__pos = re.lastIndex;
                ro.groups = m2.slice(0);
                ro.__matched = true;
                return true;
            }
            return false;
        }
        case 'gl': return ro.groups.length ? Math.max(0, ro.groups.length - 1) : 0;
        case '_ensurefind': return null;
        case 'start': {
            var gi = Number(args[2]) || 0;
            return 0;
        }
        case 'end': return 0;
        case 'group': {
            if (!ro.__matched) {
                ro.__pos = 0;
                re.lastIndex = 0;
                var m0 = re.exec(ro.input || '');
                if (m0) { ro.__pos = re.lastIndex; ro.groups = m0.slice(0); ro.__matched = true; }
            }
            var gi2 = Number(args[2]) || 0;
            return ro.groups[gi2] !== undefined ? ro.groups[gi2] : '';
        }
        case 'sral': case 'srft': {
            var rep2 = s(args[2]);
            try {
                var re2 = new RegExp(ro.pat, cmd === 'srft' ? '' : 'g');
                return ro.input.replace(re2, function () {
                    var a2 = arguments;
                    return rep2.replace(/\$(\d)/g, function (m3, d3) {
                        var gi3 = Number(d3);
                        return gi3 < a2.length - 2 ? s(a2[gi3]) : m3;
                    });
                });
            } catch (e) { return null; }
        }
        default: return null;
    }
};

// ---------- 网络 ----------
var cookieJar = new Map();
function parseHeaderStr(h) {
    var headers = {};
    s(h || '').split('||').forEach(function (pair) {
        var i = pair.indexOf('=');
        if (i > 0) headers[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
    });
    return headers;
}
OPS.net = function (args) {
    var a0 = s(args[0]);
    if (a0 === 'cookie') return Array.from(cookieJar.entries()).map(function (k) { return k.join('='); }).join('; ');
    if (a0 === 'del cookie') { cookieJar.clear(); return true; }
    if (a0.indexOf('cookie:') === 0) {
        var u = a0.slice(7);
        return cookieJar.get(u) || cookieJar.get(new URL(u).hostname) || '';
    }
    // hs(url[, post, enc, cookie, autoCookie, header, t1, t2, proxy], out)
    return (function () {
        var url = s(args[0]);
        var post = args.length >= 3 && args[1] !== null && args[1] !== undefined ? s(args[1]) : null;
        var cookieArg = args.length >= 5 ? args[3] : null;
        var autoCookie = args.length >= 6 ? args[4] === true : false;
        var headerStr = args.length >= 7 ? args[5] : null;
        var init = { method: post ? 'POST' : 'GET', headers: {} };
        if (post) {
            var body = post.replace(/\\\&/g, '&');
            if (body.trim().charAt(0) === '{') { init.headers['Content-Type'] = 'application/json'; }
            else { init.headers['Content-Type'] = 'application/x-www-form-urlencoded'; }
            init.body = body;
        }
        var hdrs = parseHeaderStr(headerStr);
        for (var hk in hdrs) {
            if (/^cookie$/i.test(hk)) init.headers['Cookie'] = hdrs[hk];
            else if (/^user-agent$/i.test(hk)) { /* 浏览器禁止设置 UA */ }
            else init.headers[hk] = hdrs[hk];
        }
        if (cookieArg !== null && cookieArg !== undefined && s(cookieArg) !== 'null') {
            init.headers['Cookie'] = s(cookieArg);
        } else if (autoCookie) {
            var ck = cookieJar.get(url);
            if (ck) init.headers['Cookie'] = ck;
        }
        if (init.headers['Cookie']) { /* 跨域下浏览器可能忽略 */ }
        return fetch(url, init).then(function (resp) {
            var setCookie = resp.headers.get('set-cookie');
            if (autoCookie && setCookie) cookieJar.set(url, setCookie);
            else if (autoCookie) {
                var cc = resp.headers.get('cookie');
                if (cc) cookieJar.set(url, cc);
            }
            return resp.text();
        });
    })();
};
OPS.openurl = function (args) {
    var sys = args.length >= 2 && s(args[0]) === 'sys';
    var url = s(sys ? args[1] : args[0]);
    window.open(url, '_blank');
    return true;
};
OPS.download = function (args) {
    // hd(url, path[, overwrite, post, enc, cookie, auto, header], out) → 1存在 0成功 -1失败
    var url = s(args[0]), path = normPath(args[1]);
    var ow = args.length >= 4 ? (args[2] === true || s(args[2]) === 'true') : false;
    if (VFS.has(path) && !ow) return 1;
    var post = args.length >= 5 && args[3] !== null ? s(args[3]) : null;
    var init = { method: post ? 'POST' : 'GET' };
    if (post) init.body = post.replace(/\\\&/g, '&');
    return fetch(url, init).then(function (r) {
        if (!r.ok) return -1;
        return r.arrayBuffer().then(function (ab) {
            vfsWrite(path, new Uint8Array(ab), true);
            return 0;
        });
    }).catch(function () { return -1; });
};
OPS.upload = function (args) {
    // huf(url, form, files, enc[, header], out)
    var url = s(args[0]);
    var formStr = s(args[1]);
    var filesStr = s(args[2]);
    var fd = new FormData();
    s(formStr).split('&').forEach(function (kv) {
        var i = kv.indexOf('=');
        if (i > 0) fd.append(kv.slice(0, i), kv.slice(i + 1).replace(/\\\&/g, '&'));
    });
    filesStr.split('|').forEach(function (fp) {
        var name = 'file';
        var pp = fp;
        var nl = fp.indexOf('\n');
        if (nl > 0) { name = fp.slice(0, nl); pp = fp.slice(nl + 1); }
        var bytes = vfsReadBytes(pp);
        if (bytes) {
            var fname = pp.split('/').pop().split('\\').pop();
            fd.append(name, new Blob([bytes]), fname);
        }
    });
    var init = { method: 'POST', body: fd };
    if (args.length >= 6) {
        var hdrs = parseHeaderStr(args[4]);
        for (var hk in hdrs) { if (!/^cookie$/i.test(hk)) init.headers[hk] = hdrs[hk]; }
    }
    return fetch(url, init).then(function (r) { return r.text(); }).catch(function () { return ''; });
};

// ---------- ZIP ----------
async function zipCreate(entries, deflate) {
    // entries: [{name, data:Uint8Array}]
    var chunks = [];
    var central = [];
    var offset = 0;
    var enc = new TextEncoder();
    for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        var nameB = enc.encode(e.name);
        var data = e.data;
        var method = 0;
        if (deflate && typeof CompressionStream !== 'undefined' && data.length > 32) {
            try {
                var cs = new CompressionStream('deflate-raw');
                var stream = new Blob([data]).stream().pipeThrough(cs);
                var buf = await new Response(stream).arrayBuffer();
                data = new Uint8Array(buf);
                method = 8;
            } catch (er) { method = 0; }
        }
        var crc = crc32(e.data);
        var lh = new DataView(new ArrayBuffer(30));
        lh.setUint32(0, 0x04034b50, true);
        lh.setUint16(4, 20, true);
        lh.setUint16(6, 0, true);
        lh.setUint16(8, method, true);
        lh.setUint16(10, 0, true); lh.setUint16(12, 0x2c21, true); // time/date
        lh.setUint32(14, crc, true);
        lh.setUint32(18, data.length, true);
        lh.setUint32(22, e.data.length, true);
        lh.setUint16(26, nameB.length, true);
        lh.setUint16(28, 0, true);
        chunks.push(new Uint8Array(lh.buffer), nameB, data);
        central.push({ name: nameB, crc: crc, csize: data.length, usize: e.data.length, off: offset, method: method });
        offset += 30 + nameB.length + data.length;
    }
    var cdStart = offset;
    var cdSize = 0;
    central.forEach(function (c) {
        var ch = new DataView(new ArrayBuffer(46));
        ch.setUint32(0, 0x02014b50, true);
        ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
        ch.setUint16(8, 0, true);
        ch.setUint16(10, c.method, true);
        ch.setUint16(12, 0, true); ch.setUint16(14, 0x2c21, true);
        ch.setUint32(16, c.crc, true);
        ch.setUint32(20, c.csize, true);
        ch.setUint32(24, c.usize, true);
        ch.setUint16(28, c.name.length, true);
        ch.setUint32(42, c.off, true);
        var hv = new Uint8Array(ch.buffer);
        chunks.push(hv, c.name);
        cdSize += 46 + c.name.length;
    });
    var eo = new DataView(new ArrayBuffer(22));
    eo.setUint32(0, 0x06054b50, true);
    eo.setUint16(8, central.length, true);
    eo.setUint16(10, central.length, true);
    eo.setUint32(12, cdSize, true);
    eo.setUint32(16, cdStart, true);
    chunks.push(new Uint8Array(eo.buffer));
    var total = chunks.reduce(function (a, c) { return a + c.length; }, 0);
    var out = new Uint8Array(total);
    var pos = 0;
    chunks.forEach(function (c) { out.set(c, pos); pos += c.length; });
    return out;
}
var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c >>> 0;
    }
    return t;
})();
function crc32(u8) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}
async function zipParse(u8) {
    // 返回 [{name, data}]
    var dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    var eocd = -1;
    for (var i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) return [];
    var count = dv.getUint16(eocd + 10, true);
    var cdOff = dv.getUint32(eocd + 16, true);
    var dec = new TextDecoder();
    var out = [];
    var p = cdOff;
    for (var n2 = 0; n2 < count; n2++) {
        if (dv.getUint32(p, true) !== 0x02014b50) break;
        var method = dv.getUint16(p + 10, true);
        var csize = dv.getUint32(p + 20, true);
        var usize = dv.getUint32(p + 24, true);
        var nlen = dv.getUint16(p + 28, true);
        var elen = dv.getUint16(p + 30, true);
        var clen = dv.getUint16(p + 32, true);
        var lho = dv.getUint32(p + 42, true);
        var name = dec.decode(u8.subarray(p + 46, p + 46 + nlen));
        // local header
        var lNameLen = dv.getUint16(lho + 26, true);
        var lExtraLen = dv.getUint16(lho + 28, true);
        var dataStart = lho + 30 + lNameLen + lExtraLen;
        var cdata = u8.subarray(dataStart, dataStart + csize);
        var data = null;
        if (method === 0) data = cdata;
        else if (method === 8 && typeof DecompressionStream !== 'undefined') {
            try {
                var ds = new DecompressionStream('deflate-raw');
                var ab = await new Response(new Blob([cdata]).stream().pipeThrough(ds)).arrayBuffer();
                data = new Uint8Array(ab);
            } catch (er) { data = cdata; }
        } else data = cdata;
        out.push({ name: name, data: data, usize: usize });
        p += 46 + nlen + elen + clen;
    }
    return out;
}
OPS.zip = function (args) {
    var mode = s(args[0]);
    if (mode === 'fuz') {
        var zipPath = normPath(args[1]), entryName = s(args[2]), dest = normPath(args[3]);
        var ow = args.length >= 5 ? (args[4] === true || s(args[4]) === 'true') : true;
        return (async function () {
            var z = vfsReadBytes(zipPath);
            if (!z) return 0;
            var entries = await zipParse(z);
            var n = 0;
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].name === entryName || entries[i].name.endsWith('/' + entryName)) {
                    if (VFS.has(dest) && !ow) continue;
                    vfsWrite(dest, entries[i].data, true);
                    n++;
                }
            }
            return n;
        })();
    }
    if (mode === 'fuzs') {
        var zipPath2 = normPath(args[1]), destDir = normPath(args[2]);
        var ow2 = args.length >= 4 ? (args[3] === true || s(args[3]) === 'true') : true;
        return (async function () {
            var z2 = vfsReadBytes(zipPath2);
            if (!z2) return false;
            var es = await zipParse(z2);
            for (var i = 0; i < es.length; i++) {
                var nm = es[i].name.replace(/\\/g, '/');
                var dp = destDir.replace(/\/$/, '') + '/' + nm;
                if (nm.endsWith('/')) { VFS.set(dp, { dir: true }); continue; }
                if (VFS.has(dp) && !ow2) continue;
                vfsWrite(dp, es[i].data, true);
            }
            return true;
        })();
    }
    if (mode === 'fj') {
        var srcPath = normPath(args[1]), zipPath3 = normPath(args[2]);
        var keepRoot = args.length >= 4 ? !(args[3] === false || s(args[3]) === 'false') : true;
        return (async function () {
            var entries = [];
            var srcEnt = VFS.get(srcPath);
            var base = srcPath.replace(/\/$/, '');
            var baseName = base.split('/').pop();
            var collect = function (dir, prefix) {
                VFS.forEach(function (v, k) {
                    if (!v.dir && k.indexOf(dir + '/') === 0) {
                        var rel = k.slice(dir.length + 1);
                        if (rel.indexOf('/') < 0) {
                            entries.push({ name: prefix + rel, data: v.b || new TextEncoder().encode(v.t) });
                        }
                    }
                });
                // 子目录
                VFS.forEach(function (v, k) {
                    if (v.dir && k.indexOf(dir + '/') === 0 && k.slice(dir.length + 1).indexOf('/') < 0) {
                        collect(k, prefix + k.slice(dir.length + 1) + '/');
                    }
                });
            };
            if (srcEnt && !srcEnt.dir) {
                entries.push({ name: keepRoot ? baseName : baseName, data: srcEnt.b || new TextEncoder().encode(srcEnt.t) });
            } else {
                collect(base, keepRoot ? baseName + '/' : '');
            }
            if (!entries.length) return false;
            var z = await zipCreate(entries, true);
            vfsWrite(zipPath3, z, true);
            return true;
        })();
    }
    return false;
};

// ---------- 剪贴板 ----------
OPS.clip = function (args) {
    var mode = s(args[0]);
    if (mode === 'w') {
        var text = s(args[1]);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () {
                legacyCopy(text); return true;
            });
        }
        legacyCopy(text);
        return true;
    }
    if (navigator.clipboard && navigator.clipboard.readText) {
        return navigator.clipboard.readText().catch(function () { return ''; });
    }
    return '';
};
function legacyCopy(text) {
    var ta = el('textarea', null, document.body);
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
}

// ---------- 下载管理器 ----------
var dlItems = new Map();     // id → item
var dlCfg = { tempdir: '/iApp/DownloadFileDir/TempDefaultDownFile', savedir: '/iApp/DownloadFileDir/DefaultDownFile', threads: 3, perThread: 3, retry: 2, timeout: 25000, notify: true };
var dlSeq = 1;
function dlFire(tok, st) { if (tok) callEvent(tok, st); }
OPS.hdfl = function (args) {
    // hdfl(id, savedir[, tempdir...], tok0, tok1)
    var id = Number(args[0]);
    var o = objs.get(id);
    if (!o) { o = { kind: 'downloader', items: [], tok0: '', tok1: '' }; objs.set(id, o); }
    var saveDir = args.length >= 2 ? normPath(args[1]) : dlCfg.savedir;
    var tempDir = args.length >= 3 ? normPath(args[2]) : dlCfg.tempdir;
    o.saveDir = saveDir; o.tempDir = tempDir;
    o.tok0 = args.length >= 4 ? s(args[args.length - 2]) : '';
    o.tok1 = args.length >= 5 ? s(args[args.length - 1]) : '';
    return true;
};
OPS.hdfla = function (args) {
    var id = Number(args[0]);
    var o = objs.get(id);
    if (!o) return false;
    var url = s(args[1]);
    var type = args[2];
    var data = args[3];
    var customPath = args.length >= 5 ? normPath(args[4]) : null;
    var idx = o.items.length;
    var itemId = nextHostId();
    var item = { id: itemId, idx: idx, url: url, type: type, text: data, filename: customPath || (o.saveDir + '/' + url.split('/').pop().split('?')[0]), status: 0, equivalent: 0, contentlength: 0, speed: 0, pct: 0 };
    o.items.push(item);
    dlItems.set(itemId, item);
    startDownload(item, function () {
        dlFire(o.tok0, { st_drD: idx, st_drI: item.status });
        if (o.items.every(function (it2) { return it2.status === 2 || it2.status < 0; })) {
            dlFire(o.tok1, { st_drJ: o.items.length });
        }
    });
    return true;
};
function startDownload(item, onDone) {
    item.status = 1;
    fetch(item.url).then(function (r) {
        item.contentlength = Number(r.headers.get('content-length')) || 0;
        if (!r.body || !r.body.getReader) {
            return r.arrayBuffer().then(function (ab) {
                var u8 = new Uint8Array(ab);
                item.equivalent = u8.length; item.pct = 100; item.status = 2;
                vfsWrite(item.filename, u8, true);
                onDone && onDone();
                return null;
            });
        }
        var reader = r.body.getReader();
        var chunks = [], got = 0;
        function pump() {
            return reader.read().then(function (res) {
                if (res.done) {
                    var total = chunks.reduce(function (a, c) { return a + c.length; }, 0);
                    var all = new Uint8Array(total);
                    var pos = 0;
                    chunks.forEach(function (c) { all.set(c, pos); pos += c.length; });
                    item.equivalent = total; item.pct = 100; item.status = 2;
                    vfsWrite(item.filename, all, true);
                    onDone && onDone();
                    return null;
                }
                chunks.push(res.value);
                got += res.value.length;
                item.equivalent = got;
                if (item.contentlength) { item.pct = Math.round(got * 100 / item.contentlength); item.speed = got; }
                return pump();
            });
        }
        return pump();
    }).catch(function () {
        item.status = -1;
        onDone && onDone();
    });
}
OPS.hdd = function (args) {
    if (args.length >= 7) {
        dlCfg.tempdir = normPath(args[0]);
        dlCfg.savedir = normPath(args[1]);
        dlCfg.threads = Number(args[2]) || 3;
        dlCfg.perThread = Number(args[3]) || 3;
        dlCfg.retry = Number(args[4]) || 2;
        dlCfg.timeout = Number(args[5]) || 25000;
        dlCfg.notify = args[6] === true;
    }
    return true;
};
OPS.hdda = function (args) {
    // hdda(url, name[, title[, icon]], data, out) / (url, dir, name, title, icon, show, data, out)
    var url, name, title, icon, data, dir;
    if (args.length >= 8) {
        url = s(args[0]); dir = normPath(args[1]); name = s(args[2]); title = s(args[3]); icon = s(args[4]); data = args[6];
    } else if (args.length >= 6) {
        url = s(args[0]); name = s(args[1]); title = s(args[2]); icon = s(args[3]); data = args[4];
        dir = dlCfg.savedir;
    } else if (args.length >= 5) {
        url = s(args[0]); name = s(args[1]); title = s(args[2]); data = args[3];
        dir = dlCfg.savedir; icon = null;
    } else {
        url = s(args[0]); name = s(args[1]); data = args[2];
        dir = dlCfg.savedir; title = name; icon = null;
    }
    var itemId = nextHostId();
    var item = { id: itemId, url: url, filename: dir + '/' + name, title: title || name, icon: icon, text: data, status: 0, equivalent: 0, contentlength: 0, speed: 0, pct: 0, notificationshow: dlCfg.notify };
    dlItems.set(itemId, item);
    startDownload(item, function () {});
    return itemId;
};
OPS.hddgl = function (args) {
    return Array.from(dlItems.keys());
};
OPS.hddg = function (args) {
    var item = dlItems.get(objIdOf(args[0]));
    if (!item) return null;
    var k = s(args[1]);
    switch (k) {
        case 'id': return item.id;
        case 'url': return item.url;
        case 'dirfilename': return item.filename;
        case 'urlmd5': return '';
        case 'dir': return item.filename.split('/').slice(0, -1).join('/');
        case 'filename': return item.filename;
        case 'contentlength': return item.contentlength;
        case 'equivalent': return item.equivalent;
        case 'downloadspeed': return item.speed;
        case 'downloadpercentage': return item.pct;
        case 'status': return item.status;
        case 'notificationshow': return item.notificationshow;
        case 'text': return item.text;
        case 'title': return item.title;
        case 'icon': return item.icon;
        default: return null;
    }
};
OPS.hdds = function (args) {
    var item = dlItems.get(objIdOf(args[0]));
    if (!item) return false;
    var k = s(args[1]);
    if (k === 'status') {
        item.status = Number(args[2]) || 0;
        if (item.status === 0 && item.equivalent === 0) startDownload(item, function () {});
    }
    else if (k === 'notificationshow') item.notificationshow = args[2] === true;
    else if (k === 'text') item.text = args[2];
    else if (k === 'title') item.title = s(args[2]);
    else if (k === 'icon') item.icon = args[2];
    return true;
};
OPS.hdduigo = function (args) {
    var mask = el('div', null, document.body);
    mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:2147483300;display:flex;align-items:center;justify-content:center';
    var box = el('div', null, mask);
    box.style.cssText = 'background:#fff;border-radius:10px;width:78%;max-width:420px;max-height:70%;overflow:auto;padding:16px';
    var tt = el('div', null, box); tt.textContent = '下载管理'; tt.style.cssText = 'font-size:16px;font-weight:bold;margin-bottom:10px;color:#222';
    dlItems.forEach(function (item) {
        var row = el('div', null, box);
        row.style.cssText = 'border-bottom:1px solid #eee;padding:8px 0;font-size:13px;color:#333';
        row.innerHTML = '<div style="font-weight:bold">' + escapeHtml(item.title) + '</div>' +
            '<div style="color:#888;font-size:12px">' + item.pct + '% · ' + ['等待', '下载中', '完成', '暂停', '失败', '已删除'][item.status + 2 === 5 ? 3 : item.status + 2] + '</div>';
    });
    var close = el('button', null, box);
    close.textContent = '关闭';
    close.style.cssText = 'margin-top:12px;background:#1976d2;color:#fff;border:none;border-radius:4px;padding:8px 20px;cursor:pointer';
    close.onclick = function () { mask.remove(); };
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
    return true;
};
// ============================================================================
// IYU API 层 Part 5: 音视频 / 摄像头 / 录音录屏 / 图像 / 二维码 / TTS / 设备
// ============================================================================

// ---------- 音频 bfm / bfms ----------
var audioPlayers = new Map();
OPS.bfm = function (args) {
    var id = Number(args[0]);
    var src = s(args[1]);
    var player = audioPlayers.get(id);
    if (!player) {
        var a = new Audio();
        player = { el: a };
        audioPlayers.set(id, player);
    }
    if (src && src !== 'null' && src !== 'undefined') {
        var r = vfsResolve(src);
        player.el.src = r.url || vfsObjectURL(r.path);
        player.el.play().catch(function () {});
    }
    return true;
};
function vfsObjectURL(path) {
    var bytes = vfsReadBytes(path);
    if (!bytes) return '';
    return URL.createObjectURL(new Blob([bytes]));
}
OPS.bfms = function (args) {
    var player = audioPlayers.get(objIdOf(args[0]));
    if (!player) return null;
    var cmd = s(args[1]);
    var a = player.el;
    switch (cmd) {
        case 'st': a.play().catch(function () {}); return true;
        case 'pe': a.pause(); return true;
        case 'sp': a.pause(); a.currentTime = 0; return true;
        case 're': a.pause(); a.src = ''; return true;
        case 'ip': return !a.paused && !a.ended;
        case 'dn': return Math.round((a.duration || 0) * 1000);
        case 'cn': return Math.round(a.currentTime * 1000);
        case 'seekto': a.currentTime = (Number(args[2]) || 0) / 1000; return true;
        case 'volume': a.volume = Number(args[2]); if (args.length >= 4) a.volume = (Number(args[2]) + Number(args[3])) / 2; return true;
        case 'sl': a.loop = args[2] === true || s(args[2]) === 'true'; return true;
        default: return null;
    }
};

// ---------- 视频 bfv / bfvs / bfvss ----------
var videoOverlay = null;
OPS.bfv = function (args) {
    var src = s(args[0]);
    var r = vfsResolve(src);
    if (videoOverlay) videoOverlay.remove();
    var mask = el('div', null, document.body);
    mask.style.cssText = 'position:fixed;inset:0;background:#000;z-index:2147483500;display:flex;align-items:center;justify-content:center';
    var v = el('video', null, mask);
    v.style.cssText = 'max-width:100%;max-height:100%';
    v.controls = true;
    v.autoplay = true;
    v.src = r.url || vfsObjectURL(r.path);
    v.play().catch(function () {});
    mask.addEventListener('click', function (e) { if (e.target === mask) { v.pause(); mask.remove(); videoOverlay = null; } });
    videoOverlay = mask;
    return true;
};
OPS.bfvs = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    var src = s(args[1]);
    if (rec && rec.el.tagName === 'VIDEO') {
        var r = vfsResolve(src);
        rec.el.src = r.url || vfsObjectURL(r.path);
    }
    return true;
};
OPS.bfvss = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    if (!rec || rec.el.tagName !== 'VIDEO') return null;
    var v = rec.el;
    var cmd = s(args[1]);
    switch (cmd) {
        case 'media': v.controls = true; return true;
        case 'st': v.play().catch(function () {}); return true;
        case 'pe': v.pause(); return true;
        case 'sp': v.pause(); v.currentTime = 0; return true;
        case 'seekto': v.currentTime = (Number(args[2]) || 0) / 1000; return true;
        case 'ip': return !v.paused && !v.ended;
        case 'dn': return Math.round((v.duration || 0) * 1000);
        case 'cn': return Math.round(v.currentTime * 1000);
        default: return null;
    }
};

// ---------- 摄像头 ----------
var camStreams = new Map();
OPS.cam = function (args) {
    var id = Number(args[0]);
    var mode = s(args[1]);   // front|back|shot|st|sp|re|rotaing|getrotaing|usg
    if (mode === 'front' || mode === 'back') {
        var ctrlId = ctrlIdOf(args[2]);
        var rotate = Number(args[3]) || 0;
        var rec = getCtrl(ctrlId);
        return navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode === 'front' ? 'user' : 'environment' }, audio: false
        }).then(function (stream) {
            camStreams.set(id, { stream: stream, rotate: rotate, ctrl: ctrlId });
            if (rec) {
                rec.el.innerHTML = '';
                var v = el('video', null, rec.el);
                v.autoplay = true; v.playsInline = true;
                v.style.cssText = 'width:100%;height:100%;object-fit:cover;transform:rotate(' + rotate + 'deg)';
                if (mode === 'front') v.style.transform += ' scaleX(-1)';
                v.srcObject = stream;
                rec.__camVideo = v;
            }
            return true;
        }).catch(function (e) { emit('log', '[iyu] 摄像头开启失败: ' + (e && e.message), true); return false; });
    }
    var cs = camStreams.get(id);
    if (!cs) { if (mode === 'getrotaing') return 0; return false; }
    var rec2 = getCtrl(cs.ctrl);
    switch (mode) {
        case 'st': if (rec2 && rec2.__camVideo) rec2.__camVideo.play().catch(function () {}); return true;
        case 'sp': if (rec2 && rec2.__camVideo) rec2.__camVideo.pause(); return true;
        case 're': cs.stream.getTracks().forEach(function (t) { t.stop(); }); if (rec2) rec2.el.innerHTML = ''; camStreams.delete(id); return true;
        case 'rotaing': cs.rotate = Number(args[2]) || 0; if (rec2 && rec2.__camVideo) rec2.__camVideo.style.transform = 'rotate(' + cs.rotate + 'deg)'; return true;
        case 'getrotaing': return cs.rotate;
        case 'usg': return false;
        case 'shot': {
            var path = normPath(args[2]);
            var stopPreview = args.length >= 5 && (args[4] === true || s(args[4]) === 'true');
            return (async function () {
                var v = rec2 && rec2.__camVideo;
                if (!v || !v.videoWidth) return false;
                var c = document.createElement('canvas');
                c.width = v.videoWidth; c.height = v.videoHeight;
                var ctx = c.getContext('2d');
                ctx.translate(c.width / 2, c.height / 2);
                ctx.rotate((cs.rotate || 0) * Math.PI / 180);
                ctx.drawImage(v, -c.width / 2, -c.height / 2);
                var blob = await new Promise(function (res) { c.toBlob(res, 'image/jpeg', 0.92); });
                if (!blob) return false;
                var ab = await blob.arrayBuffer();
                vfsWrite(path, new Uint8Array(ab), true);
                if (stopPreview) { v.pause(); }
                return true;
            })();
        }
        default: return false;
    }
};

// ---------- 录音 bly ----------
var recState = new Map();
OPS.bly = function (args) {
    var id = objIdOf(args[0]);
    var a1 = args[1];
    var st = recState.get(id);
    if (typeof a1 === 'string' && (a1 === 'sp' || a1 === 're')) {
        if (st && st.mr && st.mr.state === 'recording') {
            return new Promise(function (res) {
                st.mr.onstop = function () {
                    st.stream.getTracks().forEach(function (t) { t.stop(); });
                    var blob = new Blob(st.chunks, { type: st.mr.mimeType || 'audio/webm' });
                    blob.arrayBuffer().then(function (ab) {
                        vfsWrite(normPath(st.path), new Uint8Array(ab), true);
                        recState.delete(id);
                        res(true);
                    });
                };
                st.mr.stop();
            });
        }
        return false;
    }
    if (a1 && !st) {
        var path = normPath(a1);
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            var mr = new MediaRecorder(stream);
            var chunks = [];
            mr.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
            mr.start();
            recState.set(id, { mr: mr, stream: stream, chunks: chunks, path: path });
            return true;
        }).catch(function (e) { emit('log', '[iyu] 录音失败: ' + (e && e.message), true); return false; });
    }
    return false;
};

// ---------- 录屏 blp ----------
var screenRec = { cfg: null, mr: null, stream: null, chunks: [] };
OPS.blp = function (args) {
    var a0 = s(args[0]);
    if (a0 !== 'st' && a0 !== 'sp' && a0 !== 're' && a0 !== 'ip') {
        screenRec.cfg = { path: normPath(args[0]), w: Number(args[1]), h: Number(args[2]), bitrate: Number(args[3]), fps: Number(args[4]) };
        return true;
    }
    if (a0 === 'st') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) { emit('log', '[iyu] 当前环境不支持录屏', true); return false; }
        return navigator.mediaDevices.getDisplayMedia({ video: true }).then(function (stream) {
            var mr = new MediaRecorder(stream, screenRec.cfg && screenRec.cfg.bitrate ? { videoBitsPerSecond: screenRec.cfg.bitrate } : undefined);
            screenRec.chunks = [];
            mr.ondataavailable = function (e) { if (e.data.size) screenRec.chunks.push(e.data); };
            mr.start(1000);
            screenRec.mr = mr; screenRec.stream = stream;
            return true;
        }).catch(function () { return false; });
    }
    if (a0 === 'sp') {
        return new Promise(function (res) {
            if (!screenRec.mr) { res(false); return; }
            screenRec.mr.onstop = function () {
                var blob = new Blob(screenRec.chunks, { type: 'video/webm' });
                blob.arrayBuffer().then(function (ab) {
                    vfsWrite(screenRec.cfg ? screenRec.cfg.path : '/screen.webm', new Uint8Array(ab), true);
                    screenRec.stream.getTracks().forEach(function (t) { t.stop(); });
                    screenRec.mr = null;
                    res(true);
                });
            };
            screenRec.mr.stop();
        });
    }
    if (a0 === 're') { if (screenRec.stream) screenRec.stream.getTracks().forEach(function (t) { t.stop(); }); screenRec.mr = null; return true; }
    if (a0 === 'ip') return !!(screenRec.mr && screenRec.mr.state === 'recording');
    return false;
};

// ---------- 截屏 ujp ----------
OPS.ujp = function (args) {
    var path = normPath(args[0]);
    var quality = (Number(args[1]) || 70) / 100;
    return domScreenshot(hostEl || document.body).then(function (c) {
        if (!c) return false;
        return new Promise(function (res) {
            c.toBlob(function (blob) {
                if (!blob) { res(false); return; }
                blob.arrayBuffer().then(function (ab) {
                    vfsWrite(path, new Uint8Array(ab), true);
                    res(true);
                });
            }, 'image/jpeg', quality);
        });
    });
};
function domScreenshot(srcEl) {
    return new Promise(function (res) {
        try {
            var w = srcEl.offsetWidth, h = srcEl.offsetHeight;
            if (!w || !h) { res(null); return; }
            var clone = srcEl.cloneNode(true);
            var wrapper = document.createElement('div');
            wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
            clone.style.cssText += ';position:static;transform:none';
            wrapper.appendChild(clone);
            var xhtml = new XMLSerializer().serializeToString(wrapper);
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
                '<foreignObject width="100%" height="100%">' + xhtml + '</foreignObject></svg>';
            var img = new Image();
            img.onload = function () {
                var c = document.createElement('canvas');
                c.width = w; c.height = h;
                var ctx = c.getContext('2d');
                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0);
                res(c);
            };
            img.onerror = function () { res(null); };
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        } catch (e) { res(null); }
    });
}

// ---------- 图像 sbp / bfs / tot / tzz / tsf / tfz / tcc ----------
function imgOf(v) {
    if (typeof v === 'object' && v && v.$o !== undefined) return objs.get(v.$o) || null;
    var id = objIdOf(v);
    return id >= 0 ? (objs.get(id) || null) : null;
}
function imgFromBytes(bytes) {
    return new Promise(function (res) {
        var blob = new Blob([bytes]);
        var url = URL.createObjectURL(blob);
        var im = new Image();
        im.onload = function () {
            var c = document.createElement('canvas');
            c.width = im.naturalWidth; c.height = im.naturalHeight;
            c.getContext('2d').drawImage(im, 0, 0);
            URL.revokeObjectURL(url);
            res({ kind: 'img', canvas: c, w: c.width, h: c.height });
        };
        im.onerror = function () { res(null); };
        im.src = url;
    });
}
function canvasToBytes(c, type, q) {
    return new Promise(function (res) {
        c.toBlob(function (b) {
            if (!b) { res(null); return; }
            b.arrayBuffer().then(function (ab) { res(new Uint8Array(ab)); });
        }, type || 'image/png', q);
    });
}
function imgWrap(id, canvas) {
    return { kind: 'img', canvas: canvas, w: canvas.width, h: canvas.height };
}
function imgOutBind(preId) {
    return function (obj) {
        if (obj) objs.set(preId, obj);
    };
}
OPS.sbp = function (args, ctx) {
    var preId = ctx.preId;
    var a0 = args[1];
    // sbp(path, out) | sbp(path, x, y, w, h, out) | sbp(path, x, y, w, h, rotate, out)
    return (async function () {
        var base = null;
        if (typeof a0 === 'object' && a0 && a0.$o !== undefined) {
            var o = objs.get(a0.$o);
            if (o && o.canvas) base = o.canvas;
        } else {
            var bytes = vfsReadBytes(a0);
            if (bytes) {
                var im = await imgFromBytes(bytes);
                if (im) base = im.canvas;
            }
        }
        if (!base) return null;
        var c = base;
        var crop = args.length >= 6 && args[5] !== null && typeof args[2] === 'number';
        var rot = args.length >= 7 ? Number(args[5]) || 0 : 0;
        if (crop || rot !== 0) {
            var x = crop ? Number(args[2]) : 0, y = crop ? Number(args[3]) : 0;
            var cw = crop ? Number(args[4]) : base.width, ch = crop ? Number(args[5] !== undefined && typeof args[5] === 'number' && args.length >= 7 ? args[5] : base.height) : base.height;
            if (args.length >= 7) { cw = Number(args[4]); ch = Number(args[5]); }
            var c2 = document.createElement('canvas');
            var rad = rot * Math.PI / 180;
            var sw = Math.abs(cw * Math.cos(rad)) + Math.abs(ch * Math.sin(rad));
            var sh = Math.abs(cw * Math.sin(rad)) + Math.abs(ch * Math.cos(rad));
            c2.width = Math.max(1, Math.round(rot !== 0 ? sw : cw));
            c2.height = Math.max(1, Math.round(rot !== 0 ? sh : ch));
            var ctx2 = c2.getContext('2d');
            if (rot !== 0) {
                ctx2.translate(c2.width / 2, c2.height / 2);
                ctx2.rotate(rad);
                ctx2.drawImage(base, -base.width / 2, -base.height / 2);
            } else {
                ctx2.drawImage(base, x, y, cw, ch, 0, 0, cw, ch);
            }
            c = c2;
        }
        var obj = imgWrap(preId, c);
        objs.set(preId, obj);
        return { $o: preId };
    })();
};
OPS.bfs = function (args) {
    var o = imgOf(args[0]);
    if (!o || !o.canvas) return false;
    var path, q = 0.92;
    if (args.length >= 3) { q = (Number(args[1]) || 70) / 100; path = normPath(args[2]); }
    else path = normPath(args[1]);
    var ext = path.split('.').pop().toLowerCase();
    var type = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    return canvasToBytes(o.canvas, type, q).then(function (bytes) {
        if (!bytes) return false;
        vfsWrite(path, bytes, true);
        return true;
    });
};
OPS.tot = function (args, ctx) {
    var preId = ctx.preId;
    var rec = getCtrl(ctrlIdOf(args[1]));
    return (async function () {
        if (!rec) return null;
        var c = null;
        if (rec.el.tagName === 'IMG' && rec.el.src) {
            var im = new Image();
            await new Promise(function (res) { im.onload = res; im.onerror = res; im.src = rec.el.src; });
            if (im.naturalWidth) {
                c = document.createElement('canvas');
                c.width = im.naturalWidth; c.height = im.naturalHeight;
                c.getContext('2d').drawImage(im, 0, 0);
            }
        }
        if (!c) c = await domScreenshot(rec.el);
        if (!c) return null;
        objs.set(preId, imgWrap(preId, c));
        return { $o: preId };
    })();
};
OPS.img = function (args, ctx) {
    // tzz/tsf/tfz 统一: [newId, srcObj, param...]
    var preId = ctx.preId;
    var o = imgOf(args[1]);
    if (!o || !o.canvas) return null;
    var src = o.canvas;
    var c = document.createElement('canvas');
    var ctx2 = c.getContext('2d');
    var p1 = Number(args[2]) || 0;
    if (args.length === 3) {           // tzz(img, deg, out)
        var rad = p1 * Math.PI / 180;
        c.width = Math.abs(src.width * Math.cos(rad)) + Math.abs(src.height * Math.sin(rad));
        c.height = Math.abs(src.width * Math.sin(rad)) + Math.abs(src.height * Math.cos(rad));
        c.width = Math.max(1, Math.round(c.width)); c.height = Math.max(1, Math.round(c.height));
        ctx2.translate(c.width / 2, c.height / 2);
        ctx2.rotate(rad);
        ctx2.drawImage(src, -src.width / 2, -src.height / 2);
    } else if (args.length === 4) {    // tsf(img, factor, out) | tfz(img, "x", out)
        if (typeof args[2] === 'string') {
            c.width = src.width; c.height = src.height;
            if (s(args[2]) === 'y') { ctx2.translate(0, c.height); ctx2.scale(1, -1); }
            else { ctx2.translate(c.width, 0); ctx2.scale(-1, 1); }
            ctx2.drawImage(src, 0, 0);
        } else {
            var f = p1 || 1;
            c.width = Math.max(1, Math.round(src.width * f));
            c.height = Math.max(1, Math.round(src.height * f));
            ctx2.drawImage(src, 0, 0, c.width, c.height);
        }
    } else {                            // tsf(img, w, h, out)
        c.width = Math.max(1, Math.round(p1));
        c.height = Math.max(1, Math.round(Number(args[3]) || 1));
        ctx2.drawImage(src, 0, 0, c.width, c.height);
    }
    objs.set(preId, imgWrap(preId, c));
    return { $o: preId };
};
OPS.imginfo = function (args) {
    var o = imgOf(args[0]);
    if (!o) return 0;
    return s(args[1]) === 'h' ? o.h : o.w;
};

// ---------- 二维码 ----------
OPS.uqr = function (args) {
    var mode = s(args[0]);
    if (mode === 'gen') {
        var preId = ctx_preId(args);
        var text = s(args[2]);
        var size = Number(args[3]) || 400;
        var c = qrGenerate(text, size);
        if (!c) { emit('log', '[iyu] 二维码生成失败 (内容过长)', true); return null; }
        objs.set(preId, imgWrap(preId, c));
        return { $o: preId };
    }
    if (mode === 'read') {
        return (async function () {
            var canvas = null;
            var a1 = args[1];
            if (typeof a1 === 'object' && a1 && a1.$o !== undefined) {
                var o = objs.get(a1.$o);
                if (o && o.canvas) canvas = o.canvas;
            } else {
                var bytes = vfsReadBytes(a1);
                if (bytes) { var im = await imgFromBytes(bytes); if (im) canvas = im.canvas; }
            }
            if (!canvas) return '';
            return qrDecode(canvas);
        })();
    }
    if (mode === 'scan') {
        return qrScan().then(function (text) {
            // 触发回调结果事件: st_sC=1102, st_msG=内容
            callEvent('u0|c-1|e回调结果', { st_sC: 1102, st_lC: -1, st_iT: null, st_msG: text || '' });
            return text || '';
        });
    }
    return false;
};
function ctx_preId(args) { return Number(args[1]) || 0; }
function qrDecode(canvas) {
    if (typeof window.BarcodeDetector !== 'undefined') {
        var det = new window.BarcodeDetector();
        return det.detect(canvas).then(function (codes) {
            return codes && codes.length ? codes[0].rawValue : '';
        }).catch(function () { return ''; });
    }
    emit('log', '[iyu] 识别二维码需要浏览器支持 BarcodeDetector API', true);
    return Promise.resolve('');
}
function qrScan() {
    return new Promise(function (res) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { res(''); return; }
        if (typeof window.BarcodeDetector === 'undefined') {
            emit('log', '[iyu] 扫描二维码需要浏览器支持 BarcodeDetector API', true);
            res(''); return;
        }
        var mask = el('div', null, document.body);
        mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2147483400;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px';
        var v = el('video', null, mask);
        v.style.cssText = 'max-width:80%;max-height:60%;border-radius:8px';
        v.autoplay = true; v.playsInline = true;
        var tip = el('div', null, mask);
        tip.textContent = '对准二维码...'; tip.style.cssText = 'color:#fff;font-size:14px';
        var cancel = el('button', null, mask);
        cancel.textContent = '取消';
        cancel.style.cssText = 'padding:8px 24px;border:none;border-radius:6px;background:#444;color:#fff;cursor:pointer';
        var done = false;
        var det = new window.BarcodeDetector({ formats: ['qr_code'] });
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
            v.srcObject = stream;
            cancel.onclick = function () {
                done = true;
                stream.getTracks().forEach(function (t) { t.stop(); });
                mask.remove();
                res('');
            };
            function tick() {
                if (done) return;
                det.detect(v).then(function (codes) {
                    if (codes && codes.length) {
                        done = true;
                        stream.getTracks().forEach(function (t) { t.stop(); });
                        mask.remove();
                        res(codes[0].rawValue);
                        return;
                    }
                    requestAnimationFrame(tick);
                }).catch(function () { setTimeout(tick, 300); });
            }
            v.addEventListener('loadeddata', tick);
        }).catch(function () { mask.remove(); res(''); });
    });
}

// ---------- TTS ----------
var ttsObjs = new Map();
OPS.tts = function (args) {
    var id = objIdOf(args[0]);
    var mode = s(args[1]);
    var st = ttsObjs.get(id);
    if (mode === 'new') {
        ttsObjs.set(id, { lang: 'zh', rate: 1, pitch: 1 });
        return true;
    }
    if (!st) return false;
    if (mode === 'speak') {
        var u = new SpeechSynthesisUtterance(s(args[3]));
        u.lang = s(args[2]) === 'en' ? 'en-US' : 'zh-CN';
        u.rate = Number(args[4]) || 1;
        u.pitch = Number(args[5]) || 1;
        speechSynthesis.speak(u);
        return true;
    }
    var cmd = s(args[2]);
    switch (cmd) {
        case 'zt': return 1;
        case 'st': {
            var u2 = new SpeechSynthesisUtterance(s(args[3]));
            u2.lang = st.lang === 'en' ? 'en-US' : 'zh-CN';
            u2.rate = st.rate; u2.pitch = st.pitch;
            if (Number(args[4]) === 1) speechSynthesis.queue = null;
            speechSynthesis.speak(u2);
            return true;
        }
        case 'ft': return false;
        case 'lg': st.lang = s(args[3]); return true;
        case 'se': st.rate = Number(args[3]) || 1; return true;
        case 'ph': st.pitch = Number(args[3]) || 1; return true;
        case 'ip': return speechSynthesis.speaking;
        case 'sp': speechSynthesis.cancel(); return true;
        case 'is': return true;
        case 're': ttsObjs.delete(id); return true;
        default: return null;
    }
};

// ---------- 通知 / 权限 ----------
OPS.ftz = function (args) {
    var title = s(args[0]), t2 = s(args[1]), content = s(args[2]);
    var token = args.length >= 5 ? s(args[4]) : '';
    function show() {
        try {
            var n = new Notification(t2 || title, { body: content, tag: 'iyu' });
            if (token) n.onclick = function () { window.focus(); callEvent(token, {}); n.close(); };
            return true;
        } catch (e) { return false; }
    }
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return show();
    return Notification.requestPermission().then(function (p) {
        return p === 'granted' ? show() : false;
    });
};
var ANDROID_PERM = {
    'android.permission.CAMERA': 'camera',
    'android.permission.RECORD_AUDIO': 'microphone',
    'android.permission.WRITE_EXTERNAL_STORAGE': 'storage',
    'android.permission.READ_EXTERNAL_STORAGE': 'storage',
    'android.permission.ACCESS_FINE_LOCATION': 'geolocation',
    'android.permission.ACCESS_COARSE_LOCATION': 'geolocation',
    'android.permission.RECORD_SCREEN': 'display-capture',
};
OPS.perm = function (args) {
    var mode = s(args[0]);
    var names = args.slice(1).map(function (v) { return ANDROID_PERM[s(v)] || null; }).filter(Boolean);
    function checkAll() {
        if (!navigator.permissions) return Promise.resolve([]);
        return Promise.all(names.map(function (n) {
            return navigator.permissions.query({ name: n }).then(function (r) { return r.state; }).catch(function () { return 'granted'; });
        }));
    }
    if (mode === 'check') {
        if (!names.length) return Promise.resolve(false);
        return checkAll().then(function (states) {
            return states.every(function (s2) { return s2 === 'granted'; }) ? false : true;   // true=需要申请
        });
    }
    if (mode === 'ask') {
        if (!names.length) return true;
        // 尝试最小化申请: camera/mic → getUserMedia 拒绝
        var needCam = names.indexOf('camera') >= 0 || names.indexOf('microphone') >= 0;
        if (needCam && navigator.mediaDevices) {
            return navigator.mediaDevices.getUserMedia(names.indexOf('camera') >= 0 ? { video: true } : { audio: true })
                .then(function (st2) { st2.getTracks().forEach(function (t) { t.stop(); }); return true; })
                .catch(function () { return false; });
        }
        return checkAll().then(function () { return true; });
    }
    if (mode === 'all') return true;
    return true;
};

// ---------- 设备 ----------
OPS.uzd = function (args) {
    var cmd = s(args[1]);
    if (cmd === 'sp') { navigator.vibrate(0); return true; }
    if (cmd === 'ip') return 'vibrate' in navigator;
    if (cmd === 'ms' || args.length >= 2 && typeof args[1] === 'number') {
        var ms = typeof args[1] === 'number' ? Number(args[1]) : 0;
        navigator.vibrate(ms);
        return true;
    }
    if (cmd && args.length >= 3) {
        // uzd(obj, "ip", b) 已处理; uzd(obj, pattern, repeat)
        var pat = s(args[1]).split(/\s+/).map(Number).filter(function (n) { return n > 0; });
        navigator.vibrate(pat);
        return true;
    }
    if (typeof args[1] === 'number') { navigator.vibrate(Number(args[1])); return true; }
    return false;
};
var wakeLock = null;
OPS.usjxm = function (args) {
    var keep = !(args[0] === false || s(args[0]) === 'false');   // false = 不休眠
    if (keep) {
        if (wakeLock) { wakeLock.release(); wakeLock = null; }
        return true;
    }
    if ('wakeLock' in navigator) {
        return navigator.wakeLock.request('screen').then(function (wl) {
            wakeLock = wl;
            return true;
        }).catch(function () { return false; });
    }
    emit('log', '[iyu] 当前浏览器不支持 Screen Wake Lock', true);
    return false;
};
OPS.sjxx = function (args) {
    var ua = navigator.userAgent;
    var model = 'Browser';
    var brand = 'Web';
    if (/Android/.test(ua)) { brand = 'Android'; model = (ua.match(/Android[^;]+;\s*([^;)]+)/) || [, 'Android'])[1]; }
    else if (/iPhone|iPad/.test(ua)) { brand = 'Apple'; model = /iPhone/.test(ua) ? 'iPhone' : 'iPad'; }
    else if (/Windows/.test(ua)) { brand = 'Microsoft'; model = 'Windows PC'; }
    else if (/Macintosh/.test(ua)) { brand = 'Apple'; model = 'Mac'; }
    var dpr = window.devicePixelRatio || 1;
    return [
        'JS Engine', 'browser',                       // CPU 型号 \n CPU 频率
        String(Math.round(window.innerWidth / 1)), String(Math.round(window.innerHeight / 1)),
        String(Math.round(screen.width * dpr)), String(Math.round(screen.height * dpr)),
        model, brand, 'Web'
    ];
};
OPS.swh = function (args) {
    var mode = s(args[0]);
    var dpr = window.devicePixelRatio || 1;
    switch (mode) {
        case 'w': return Math.round(window.innerWidth);
        case 'h': return Math.round(window.innerHeight);
        case 'hh': return Math.round(screen.height);
        case 'pxw': return Math.round(window.innerWidth * dpr);
        case 'pxh': return Math.round(window.innerHeight * dpr);
        case 'pxhh': return Math.round(screen.height * dpr);
        case 'pxztl': return 0;
        case 'pxbvk': return 0;
        default: return 0;
    }
};

// ---------- 其他 ----------
OPS.endkeyboard = function () {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    return true;
};
OPS.ends = function () {
    try { window.blur(); window.top && window.top.blur && window.top.blur(); } catch (e) {}
    return true;
};
OPS.hsas = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    if (rec && rec.el.tagName === 'IFRAME') {
        rec.__interactive = args[1] === true || s(args[1]) === 'true';
        rec.__urlFilter = rec.__interactive;
        try {
            var win = rec.el.contentWindow;
            if (win && window.iapp) win.iapp = window.iapp;
        } catch (e) {}
    }
    return true;
};
OPS.has = function (args) {
    var rec = getCtrl(ctrlIdOf(args[0]));
    var code = s(args[1]);
    if (rec && rec.el.tagName === 'IFRAME') {
        try { rec.el.contentWindow.eval(code); return true; } catch (e) {
            try { window.eval(code); return true; } catch (e2) { return false; }
        }
    }
    try { window.eval(code); return true; } catch (e) { return false; }
};
// ============================================================================
// IYU API 层 Part 6a: 动画系统 / js桥 / iapp API
// ============================================================================

// ---------- 动画 ----------
var animObjs = objs;   // 统一对象池
OPS.anim = function (args) {
    var id = Number(args[0]);
    var kind = s(args[1]);
    var o = objs.get(id) || {};
    if (kind === 'set') {
        // dhset(list, share, dh1, dh2...) — args[2]=share, 后续动画引用
        o.type = 'set'; o.share = args[2] === true; o.children = [];
        for (var i = 3; i < args.length; i++) {
            var c = args[i] && args[i].$o !== undefined ? objs.get(args[i].$o) : null;
            if (c) o.children.push(c);
        }
    } else if (kind === 'qset') {
        o.type = 'qset'; o.mode = s(args[2]) || 'together'; o.children = [];
        for (var j = 3; j < args.length; j++) {
            var c2 = args[j] && args[j].$o !== undefined ? objs.get(args[j].$o) : null;
            if (c2) o.children.push(c2);
        }
    } else if (kind === 'q') {
        // dhas(dh, viewId, prop, values...)
        o.type = 'queue'; o.target = args[2]; o.prop = s(args[3]); o.values = [];
        for (var k = 4; k < args.length; k++) o.values.push(Number(args[k]));
        o.dur = 500; o.delay = 0; o.repeat = 0; o.token = s(args[args.length - 1]);
        if (o.token.indexOf('u') === 0 && o.token.indexOf('|') > 0) o.token = '';
    } else {
        // dha/dhs/dht/dhr: args[2..] 参数
        var which = args[args.length - 1];
        o.type = kind;
        if (kind === 'alpha') { o.from = Number(args[2]); o.to = Number(args[3]); }
        else if (kind === 'scale') {
            o.fx = Number(args[2]); o.tx = Number(args[3]); o.fy = Number(args[4]); o.ty = Number(args[5]);
            if (args.length >= 10) { o.pivx = Number(args[7]); o.pivy = Number(args[9]); }
        } else if (kind === 'trans') { o.fx = Number(args[2]); o.tx = Number(args[3]); o.fy = Number(args[4]); o.ty = Number(args[5]); }
        else if (kind === 'rotate') {
            o.from = Number(args[2]); o.to = Number(args[3]);
            if (args.length >= 8) { o.pivx = Number(args[5]); o.pivy = Number(args[7]); }
        }
    }
    o.dur = o.dur || 500; o.delay = o.delay || 0; o.repeat = o.repeat || 0;
    objs.set(id, o);
    return true;
};
OPS.animctl = function (args) {
    // dh(dh, cmd[, val]) — dh 可以是对象或 $o
    var ao = objs.get(objIdOf(args[0]));
    if (!ao) return null;
    var cmd = s(args[1]);
    switch (cmd) {
        case 'duration': ao.dur = Number(args[2]) || 500; return true;
        case 'delay': ao.delay = Number(args[2]) || 0; return true;
        case 'repeat': ao.repeat = Number(args[2]) || 0; return true;
        case 'enabled': case 'after': case 'before': ao.fill = cmd === 'after' || (cmd === 'enabled' && args[2] !== false); ao.__before = cmd === 'before'; return true;
        case 'add': { var c = args[2] && args[2].$o !== undefined ? objs.get(args[2].$o) : null; if (c) (ao.children = ao.children || []).push(c); return true; }
        case 'target': ao.target = args[2]; return true;
        case 'clone': return { $o: args[0].$o };
        case 'running': return !!(ao.__anim && ao.__anim.playState === 'running');
        case 'cancel': if (ao.__anim) { try { ao.__anim.cancel(); } catch (e) {} } if (ao.__timer) { clearTimeout(ao.__timer); } return true;
        case 'reset': ao.__anim = null; return true;
        case 'start': return runAnimObj(ao);
        default: return null;
    }
};
function resolveTarget(t) {
    var rec = getCtrl(t);
    return rec ? rec.el : null;
}
function runAnimObj(ao) {
    var elx = resolveTarget(ao.target);
    if (!elx && ao.__el) elx = ao.__el;
    if (!elx) { emit('log', '[iyu] 动画目标控件未找到 (用 dh(dh,"target",id) 或 us(id,"dh",dh))', true); return false; }
    ao.__el = elx;
    var keyframes = [], kf;
    var fill = ao.fill ? 'forwards' : 'none';
    if (ao.type === 'set') {
        ao.children.forEach(function (c) { c.target = ao.target; c.__el = elx; c.fill = ao.fill; runAnimObj(c); });
        return true;
    }
    if (ao.type === 'qset') {
        if (ao.mode === 'sequen') {
            var total = 0;
            ao.children.forEach(function (c) { c.target = ao.target; c.__el = elx; c.__startDelay = total; total += (c.dur || 500) * ((c.repeat || 0) + 1); runAnimObj(c); });
        } else {
            ao.children.forEach(function (c) { c.target = ao.target; c.__el = elx; runAnimObj(c); });
        }
        return true;
    }
    if (ao.type === 'alpha') {
        keyframes = [{ opacity: clamp01(ao.from) }, { opacity: clamp01(ao.to) }];
    } else if (ao.type === 'scale') {
        keyframes = [{ transform: (ao.fy !== undefined ? 'scale(' + ao.fx + ',' + ao.fy + ')' : 'scale(' + ao.fx + ')') },
                     { transform: (ao.ty !== undefined ? 'scale(' + ao.tx + ',' + ao.ty + ')' : 'scale(' + ao.tx + ')') }];
    } else if (ao.type === 'trans') {
        keyframes = [{ transform: 'translate(' + (ao.fx || 0) + 'px,' + (ao.fy || 0) + 'px)' },
                     { transform: 'translate(' + (ao.tx || 0) + 'px,' + (ao.ty || 0) + 'px)' }];
    } else if (ao.type === 'rotate') {
        keyframes = [{ transform: 'rotate(' + (ao.from || 0) + 'deg)' }, { transform: 'rotate(' + (ao.to || 0) + 'deg)' }];
    } else if (ao.type === 'queue') {
        // 队列动画: 依次执行 values
        var frames = [];
        ao.values.forEach(function (v) {
            var t2 = v;
            if (ao.prop === 'alpha') frames.push({ opacity: clamp01(t2) });
            else if (ao.prop === 'rotation' || ao.prop === 'rotationX' || ao.prop === 'rotationY') frames.push({ transform: 'rotate(' + t2 + 'deg)' });
            else if (ao.prop === 'scaleX' || ao.prop === 'scaleY') frames.push({ transform: 'scale(' + (ao.prop === 'scaleX' ? t2 : lastScaleX(ao, frames)) + ',' + (ao.prop === 'scaleY' ? t2 : lastScaleY(ao, frames)) + ')' });
            else if (ao.prop === 'translationX' || ao.prop === 'translationY') {
                var px = ao.prop === 'translationX' ? t2 : lastTr(ao, frames, 'x');
                var py = ao.prop === 'translationY' ? t2 : lastTr(ao, frames, 'y');
                frames.push({ transform: 'translate(' + px + 'px,' + py + 'px)' });
            }
        });
        keyframes = frames.length ? frames : [{ opacity: 1 }, { opacity: 1 }];
    }
    if (!keyframes.length) return false;
    try {
        var opts = { duration: ao.dur || 500, delay: (ao.__startDelay || 0) + (ao.delay || 0), iterations: (ao.repeat || 0) + 1, fill: fill };
        var anim = elx.animate(keyframes, opts);
        ao.__anim = anim;
        if (ao.__tokStart) callEvent(ao.__tokStart, {});
        anim.onfinish = function () { if (ao.__tokEnd) callEvent(ao.__tokEnd, {}); if (ao.onEnd) ao.onEnd(); };
        anim.oncancel = function () { if (ao.__tokCancel) callEvent(ao.__tokCancel, {}); };
    } catch (e) { emit('log', '[iyu] 动画执行失败: ' + (e && e.message), true); return false; }
    return true;
}
function clamp01(x) { return Math.max(0, Math.min(1, Number(x) || 0)); }
function lastScaleX(ao, frames) { for (var i = frames.length - 1; i >= 0; i--) { var m = /scale\(([-\d.]+)/.exec(frames[i].transform || ''); if (m) return m[1]; } return 1; }
function lastScaleY(ao, frames) { for (var i = frames.length - 1; i >= 0; i--) { var m = /,\s*([-\d.]+)\)/.exec(frames[i].transform || ''); if (m) return m[1]; } return 1; }
function lastTr(ao, frames, axis) {
    for (var i = frames.length - 1; i >= 0; i--) {
        var m = axis === 'x' ? /translate\(([-\d.]+)px/.exec(frames[i].transform || '') : /translate\(([-\d.]+)px,\s*([-\d.]+)px/.exec(frames[i].transform || '');
        if (m) return axis === 'x' ? m[1] : m[2];
    }
    return 0;
}
OPS.dhon = function (args) {
    var id = objIdOf(args[0]);
    var o = objs.get(id);
    if (!o) return false;
    o.__tokEnd = s(args[1]) || null;
    o.__tokRepeat = s(args[2]) || null;
    o.__tokStart = s(args[3]) || null;
    o.__tokCancel = s(args[4]) || null;
    return true;
};
OPS.dhb = function (args) {
    var id = objIdOf(args[0]);
    var o = objs.get(id) || { kind: 'animbg', frames: [], css: '' };
    o.kind = 'animbg';
    var a1 = args[1];
    if (typeof a1 === 'boolean') { o.loop = a1 === true; }
    else if (typeof a1 === 'string' && (a1 === 'start' || a1 === 'stop')) {
        var rec = o.__rec;
        if (rec) {
            if (a1 === 'stop') { if (o.__timer) clearInterval(o.__timer); o.__running = false; }
            else {
                var i = 0;
                if (o.__timer) clearInterval(o.__timer);
                o.__running = true;
                o.__timer = setInterval(function () {
                    if (!o.frames.length) return;
                    rec.el.style.background = o.frames[i % o.frames.length].css;
                    i++;
                    if (!o.loop && i >= o.frames.length) { clearInterval(o.__timer); o.__running = false; }
                }, o.frames[0].dur || 500);
            }
        }
        if (a1 === 'start' && args.length >= 3) callEvent(s(args[2]), {});
    } else if (a1 !== undefined && a1 !== null) {
        // dhb(dh, img, dur)
        o.frames.push({ css: bgOf(a1), dur: Number(args[2]) || 500 });
    }
    objs.set(id, o);
    return o.__running || false;
};

// ---------- js 桥 ----------
var jsHandles = new Map();   // id → JS 对象
var jsHandleSeq = 1;
function wrapJs(v) {
    if (v === null || v === undefined) return null;
    var t = typeof v;
    if (t === 'string' || t === 'number' || t === 'boolean') return v;
    var id = jsHandleSeq++;
    jsHandles.set(id, v);
    return { $o: -id - 100000000 };   // JS句柄用负id域 (与C++对象区分)
}
function unwrapJs(v) {
    if (v && typeof v === 'object' && v.$o !== undefined) {
        var id = v.$o;
        if (id < 0) return jsHandles.get(-id - 100000000) || null;
        return objs.get(id) || null;
    }
    return v;
}
OPS['js.global'] = function (args) {
    var name = s(args[0]);
    try {
        var v = new Function('return ' + name)();
        return wrapJs(v);
    } catch (e) { return null; }
};
OPS['js.call'] = function (args) {
    var obj = unwrapJs(args[0]) || (typeof args[0] === 'string' ? new Function('return ' + args[0])() : null);
    var name = s(args[1]);
    if (!obj) return null;
    var fn = obj[name];
    if (typeof fn !== 'function') return null;
    var margs = args.slice(2).map(function (v) { return unwrapJs(v); });
    try { return wrapJs(fn.apply(obj, margs)); } catch (e) { emit('log', '[iyu] js.call 失败: ' + (e && e.message), true); return null; }
};
OPS['js.new'] = function (args) {
    var name = s(args[0]);
    var Ctor;
    try { Ctor = new Function('return (' + name + ')')(); } catch (e) { return null; }
    if (typeof Ctor !== 'function') return null;
    var margs = args.slice(1).map(function (v) { return unwrapJs(v); });
    try { return wrapJs(new (Function.prototype.bind.apply(Ctor, [null].concat(margs)))()); } catch (e) { return null; }
};
OPS['js.get'] = function (args) {
    var obj = unwrapJs(args[0]);
    if (obj === null || obj === undefined) {
        try { obj = new Function('return ' + s(args[0]))(); } catch (e) { return null; }
    }
    if (!obj) return null;
    try { return wrapJs(obj[s(args[1])]); } catch (e) { return null; }
};
OPS['js.set'] = function (args) {
    var obj = unwrapJs(args[0]);
    if (obj === null || obj === undefined) {
        try { obj = new Function('return ' + s(args[0]))(); } catch (e) { return false; }
    }
    if (!obj) return false;
    try { obj[s(args[1])] = unwrapJs(args[2]); return true; } catch (e) { return false; }
};
OPS.jseval = function (args) {
    try {
        var r = window.eval(s(args[0]));
        return wrapJs(r);
    } catch (e) { emit('log', '[iyu] js块: ' + (e && e.message), true); return null; }
};
OPS['js.eval'] = function (args) {
    try {
        var r = window.eval(s(args[0]));
        return wrapJs(r);
    } catch (e) { emit('log', '[iyu] js.eval: ' + (e && e.message), true); return null; }
};
OPS['js.log'] = function (args) {
    console.log.apply(console, args.map(function (v) { return unwrapJs(v); }));
    return true;
};
OPS.calljs = function (args) {
    var name = s(args[0]);
    var fn = null;
    if (jsCallbacks.has(name)) fn = jsCallbacks.get(name);
    else {
        try { fn = new Function('return ' + name)(); } catch (e) {}
    }
    if (typeof fn !== 'function') return { err: 'JS 回调未找到: ' + name };
    var margs = args.slice(1).map(function (v) { return unwrapJs(v); });
    try { return wrapJs(fn.apply(null, margs)); } catch (e) { return { err: String((e && e.message) || e) }; }
};
var jsCallbacks = new Map();

// ---------- iapp.* API (JS → 裕语言) ----------
function callIyuCode(code, varname) {
    // 通过 C++ 编译执行一段裕语言代码; fn2 时延迟读取变量
    if (!M) return null;
    var payload = JSON.stringify({ code: code });
    var len = M.lengthBytesUTF8(payload);
    var buf = M._malloc(len + 1);
    M.stringToUTF8(payload, buf, len + 1);
    M._iyu_event(buf);   // C++ 负责释放
    return null;
}
function getVarSync(name) {
    if (!M) return null;
    var payload = JSON.stringify({ name: name });
    var len = M.lengthBytesUTF8(payload);
    var buf = M._malloc(len + 1);
    M.stringToUTF8(payload, buf, len + 1);
    var rp = M._iyu_getvar(buf);
    var out = null;
    try { var parsed = JSON.parse(M.UTF8ToString(rp)); out = parsed && parsed.r !== undefined ? parsed.r : null; } catch (e) {}
    if (rp) M._free(rp);
    return out;
}
function setVarSync(name, v) {
    if (!M) return;
    var payload = JSON.stringify({ name: name, v: serVal(v) });
    var len = M.lengthBytesUTF8(payload);
    var buf = M._malloc(len + 1);
    M.stringToUTF8(payload, buf, len + 1);
    M._iyu_setvar(buf);   // C++ 负责释放
}
if (typeof window !== 'undefined') {
    window.iapp = {
        fn: function (code) { callIyuCode(code, null); },
        fn2: function (code, varname) {
            callIyuCode(code, varname);
            return new Promise(function (res) {
                setTimeout(function () { res(getVarSync(varname)); }, 120);
            });
        },
        s: function (name, v) { setVarSync(name, v); },
        g: function (name) { return getVarSync(name); }
    };
    window.iyu = {
        jsCallback: function (name, fn) { jsCallbacks.set(name, fn); }
    };
}
// ============================================================================
// IYU API 层 Part 6b: 二维码编码器 / 数据库 / Socket
// ============================================================================

// ---------------- QR 编码器 (byte 模式, 纠错 L, 版本 1-9, 自带 RS/掩码) ----------------
var QR = (function () {
    var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
    (function () {
        var x = 1;
        for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
        for (var i2 = 255; i2 < 512; i2++) EXP[i2] = EXP[i2 - 255];
    })();
    function gmul(a, b) { if (!a || !b) return 0; return EXP[LOG[a] + LOG[b]]; }
    function polyMul(a, b) {
        var r = new Array(a.length + b.length - 1);
        for (var i = 0; i < r.length; i++) r[i] = 0;
        for (var i2 = 0; i2 < a.length; i2++)
            for (var j = 0; j < b.length; j++) r[i2 + j] ^= gmul(a[i2], b[j]);
        return r;
    }
    function rsEnc(data, ecLen) {
        var g = [1];
        for (var i = 0; i < ecLen; i++) g = polyMul(g, [1, EXP[i]]);
        var res = data.slice();
        for (var i3 = 0; i3 < ecLen; i3++) res.push(0);
        for (var i4 = 0; i4 < data.length; i4++) {
            var f = res[i4];
            if (f) for (var j = 0; j < g.length; j++) res[i4 + j] ^= gmul(g[j], f);
        }
        return res.slice(data.length);
    }
    // [totalCodewords, dataCodewords] 每 block (L 级, v1-9)
    var BLOCKS = [
        [[26, 19]], [[44, 34]], [[70, 55]], [[100, 80]], [[134, 108]],
        [[86, 68], [86, 68]], [[108, 78], [108, 78]], [[130, 97], [130, 97]], [[150, 116], [150, 116]]
    ];
    var ALIGN = [null, [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46]];
    function encode(text) {
        var bytes = new TextEncoder().encode(text);
        var ver = -1, dcTotal = 0;
        for (var v = 1; v <= 9; v++) {
            var blocks = BLOCKS[v - 1];
            var dc = 0;
            blocks.forEach(function (b) { dc += b[1]; });
            if (bytes.length <= dc - 2) { ver = v; dcTotal = dc; break; }
        }
        if (ver < 0) return null;
        // 数据比特流
        var bits = [];
        function push(val, n) { for (var i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); }
        push(4, 4);                       // byte mode
        push(bytes.length, 8);
        for (var i2 = 0; i2 < bytes.length; i2++) push(bytes[i2], 8);
        var capBits = dcTotal * 8;
        var term = Math.min(4, capBits - bits.length);
        push(0, term);
        while (bits.length % 8) bits.push(0);
        var dataCw = [];
        for (var i3 = 0; i3 < bits.length; i3 += 8) {
            var b = 0;
            for (var j = 0; j < 8; j++) b = (b << 1) | bits[i3 + j];
            dataCw.push(b);
        }
        var pad = [0xEC, 0x11], pi = 0;
        while (dataCw.length < dcTotal) { dataCw.push(pad[pi++ % 2]); }
        // 分块 + 纠错 + 交织
        var blocks = BLOCKS[ver - 1];
        var dcs = [], ecs = [], offsets = [];
        var off = 0;
        blocks.forEach(function (bl) {
            var total = bl[0], dc = bl[1];
            var d = dataCw.slice(off, off + dc);
            off += dc;
            dcs.push(d);
            ecs.push(rsEnc(d, total - dc));
        });
        var interleaved = [];
        var maxDc = Math.max.apply(null, blocks.map(function (b) { return b[1]; }));
        for (var i4 = 0; i4 < maxDc; i4++)
            dcs.forEach(function (d) { if (i4 < d.length) interleaved.push(d[i4]); });
        var maxEc = Math.max.apply(null, blocks.map(function (b) { return b[0] - b[1]; }));
        for (var i5 = 0; i5 < maxEc; i5++)
            ecs.forEach(function (e) { if (i5 < e.length) interleaved.push(e[i5]); });
        // 矩阵
        var size = 17 + ver * 4;
        var mod = [], fn = [];
        for (var r = 0; r < size; r++) { mod.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
        function setFn(y, x, dark) { if (y >= 0 && y < size && x >= 0 && x < size) { mod[y][x] = dark; fn[y][x] = true; } }
        function drawFinder(cx, cy) {
            for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
                var dist = Math.max(Math.abs(dx), Math.abs(dy));
                var dark = dist !== 2 && dist !== 4;
                setFn(cy + dy, cx + dx, dark);
            }
        }
        drawFinder(3, 3); drawFinder(size - 4, 3); drawFinder(3, size - 4);
        // timing
        for (var t = 8; t < size - 8; t++) { setFn(6, t, t % 2 === 0); setFn(t, 6, t % 2 === 0); }
        // alignment
        var align = ALIGN[ver - 1];
        if (align) {
            align.forEach(function (ay) {
                align.forEach(function (ax) {
                    if ((ay <= 8 && ax <= 8) || (ay <= 8 && ax >= size - 9) || (ay >= size - 9 && ax <= 8)) return;
                    for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++) {
                        var d2 = Math.max(Math.abs(dx2), Math.abs(dy2));
                        setFn(ay + dy2, ax + dx2, d2 !== 1);
                    }
                });
            });
        }
        // 保留格式区
        for (var i6 = 0; i6 < 9; i6++) { setFn(8, i6, false); setFn(i6, 8, false); }
        for (var i7 = 0; i7 < 8; i7++) { setFn(8, size - 1 - i7, false); setFn(size - 1 - i7, 8, false); }
        setFn(size - 8, 8, true);   // dark module
        // 数据放置 (mask 0)
        var maskFn = function (y, x) { return (y + x) % 2 === 0; };
        var bitIdx = 0;
        function totalBits() { return interleaved.length * 8; }
        for (var right = size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5;
            for (var vert = 0; vert < size; vert++) {
                for (var j2 = 0; j2 < 2; j2++) {
                    var x = right - j2;
                    var upward = ((right + 1) & 2) === 0;
                    var y = upward ? size - 1 - vert : vert;
                    if (!fn[y][x]) {
                        var dark = false;
                        if (bitIdx < totalBits()) {
                            dark = ((interleaved[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) !== 0;
                            bitIdx++;
                        }
                        if (maskFn(y, x)) dark = !dark;
                        mod[y][x] = dark;
                    }
                }
            }
        }
        // 掩码 0 的格式信息
        var fmt = formatBits(0);
        placeFormat(fmt, size, setFn);
        return { size: size, mod: mod };
    }
    function formatBits(mask) {
        var d = (1 << 3) | mask;   // L=01
        var g = 0b10100110111;
        var v = d << 10;
        for (var i = 14; i >= 10; i--) if ((v >> i) & 1) v ^= g << (i - 10);
        return ((d << 10) | (v & 0x3FF)) ^ 0b101010000010010;
    }
    function placeFormat(bits, size, setFn) {
        for (var i = 0; i <= 5; i++) setFn(8, i, getBit(bits, i));
        setFn(8, 7, getBit(bits, 6));
        setFn(8, 8, getBit(bits, 7));
        setFn(7, 8, getBit(bits, 8));
        for (var i2 = 9; i2 < 15; i2++) setFn(14 - i2, 8, getBit(bits, i2));
        for (var i3 = 0; i3 < 8; i3++) setFn(size - 1 - i3, 8, getBit(bits, i3));
        for (var i4 = 8; i4 < 15; i4++) setFn(8, size - 15 + i4, getBit(bits, i4));
    }
    function getBit(v, i) { return ((v >> i) & 1) !== 0; }
    function draw(text, size) {
        var q = encode(text);
        if (!q) return null;
        var quiet = 4;
        var total = (q.size + quiet * 2);
        var scale = Math.max(1, Math.floor(size / total));
        var c = document.createElement('canvas');
        c.width = c.height = total * scale;
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#000';
        for (var y = 0; y < q.size; y++) {
            for (var x = 0; x < q.size; x++) {
                if (q.mod[y][x]) ctx.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale);
            }
        }
        return c;
    }
    return { draw: draw };
})();
function qrGenerate(text, size) {
    try { return QR.draw(s(text), size || 400); } catch (e) { return null; }
}

// ---------------- 数据库 (IndexedDB) ----------------
var dbHandles = new Map();
function idbOpen(name) {
    return new Promise(function (res, rej) {
        var req = indexedDB.open('iyu_' + name.replace(/[^\w.]/g, '_'));
        req.onupgradeneeded = function () {
            if (!req.result.objectStoreNames.contains('info'))
                req.result.createObjectStore('info', { keyPath: '_id', autoIncrement: true });
        };
        req.onsuccess = function () { res(req.result); };
        req.onerror = function () { rej(req.error); };
        req.onblocked = function () { rej(new Error('blocked')); };
    });
}
function idbEnsureTable(db, table) {
    return new Promise(function (res) {
        if (db.objectStoreNames.contains(table)) { res(true); return; }
        var v = db.version + 1;
        db.close();
        var req = indexedDB.open(db.name, v);
        req.onupgradeneeded = function () { req.result.createObjectStore(table, { keyPath: '_id', autoIncrement: true }); };
        req.onsuccess = function () { res(true); };
        req.onerror = function () { res(false); };
    });
}
function idbTx(db, table, mode, fn) {
    return new Promise(function (res, rej) {
        try {
            var tx = db.transaction(table, mode);
            var store = tx.objectStore(table);
            var out = fn(store);
            var settled = false;
            var unwrap = function () {
                if (settled) return;
                settled = true;
                var v = out;
                if (v && typeof IDBRequest !== 'undefined' && v instanceof IDBRequest) v = v.result;
                res(v && v.__val !== undefined ? v.__val : v);
            };
            if (out && typeof IDBRequest !== 'undefined' && out instanceof IDBRequest) {
                out.onsuccess = unwrap;
                out.onerror = function () { if (!settled) { settled = true; rej(out.error); } };
            }
            tx.oncomplete = unwrap;
            tx.onerror = function () { if (!settled) { settled = true; rej(tx.error); } };
        } catch (e) { rej(e); }
    });
}
function parseCsv(str) {
    // 解析 iyu 风格的值列表: 'a', 'b', 1, 2
    var out = [], cur = '', inQ = false;
    var ss = s(str);
    for (var i = 0; i < ss.length; i++) {
        var c = ss[i];
        if (inQ) {
            if (c === "'" && ss[i + 1] === "'") { cur += "'"; i++; }
            else if (c === "'") { inQ = false; }
            else cur += c;
        } else if (c === "'") inQ = true;
        else if (c === ',') { out.push(cur.trim()); cur = ''; }
        else cur += c;
    }
    out.push(cur.trim());
    return out.filter(function (x, i2) { return !(x === '' && i2 === out.length - 1); });
}
function sqlWhere(rows, where) {
    // 解析 "status=1 and b>2 order by _id desc LIMIT 0,1"
    var w = s(where || '').trim();
    if (!w) return rows;
    var limit = null, order = null;
    var m = /order\s+by\s+(\S+)(\s+(asc|desc))?/i.exec(w);
    if (m) { order = { col: m[1], desc: (m[3] || '').toLowerCase() === 'desc' }; w = w.replace(/order\s+by\s+\S+(\s+(asc|desc))?/i, ''); }
    var m2 = /limit\s+(\d+)\s*(,\s*(\d+))?/i.exec(w);
    if (m2) { limit = { skip: Number(m2[1]) || 0, take: m2[3] !== undefined ? Number(m2[3]) : 1 }; w = w.replace(/limit\s+\d+\s*(,\s*\d+)?/i, ''); }
    w = w.trim();
    var filtered = rows;
    if (w) {
        // 按 and / or 拆分 (优先 or)
        var orParts = w.split(/\s+or\s+/i);
        filtered = rows.filter(function (row) {
            return orParts.some(function (part) {
                var andParts = part.split(/\s+and\s+/i);
                return andParts.every(function (cond) {
                    var mm = /^\s*(\w+)\s*(>=|<=|!=|=|>|<|like)\s*(.+?)\s*$/i.exec(cond);
                    if (!mm) return true;
                    var col = mm[1], op = mm[2].toLowerCase();
                    var rv = mm[3].replace(/^'(.*)'$/, '$1').replace(/^\/(.*)\/$/, '$1');
                    var lv = row[col];
                    var ln = Number(lv), rn = Number(rv);
                    var bothNum = isFinite(ln) && isFinite(rn) && lv !== '' && rv !== '' && typeof lv !== 'object';
                    switch (op) {
                        case '=': return bothNum ? ln === rn : s(lv) === s(rv);
                        case '!=': return bothNum ? ln !== rn : s(lv) !== s(rv);
                        case '>': return bothNum ? ln > rn : s(lv) > s(rv);
                        case '<': return bothNum ? ln < rn : s(lv) < s(rv);
                        case '>=': return bothNum ? ln >= rn : s(lv) >= s(rv);
                        case '<=': return bothNum ? ln <= rn : s(lv) <= s(rv);
                        case 'like': return s(lv).indexOf(rv) >= 0;
                        default: return true;
                    }
                });
            });
        });
    }
    if (order) {
        filtered = filtered.slice().sort(function (a, b) {
            var av = a[order.col], bv = b[order.col];
            var r = av < bv ? -1 : av > bv ? 1 : 0;
            return order.desc ? -r : r;
        });
    }
    if (limit) filtered = filtered.slice(limit.skip, limit.skip + limit.take);
    return filtered;
}
OPS.sqlite = function (args) {
    var id = objIdOf(args[0]);
    var a1 = s(args[1]);
    if (a1 === 're') { dbHandles.delete(id); return true; }
    if (a1 === 'ip' || a1 === 'del') {
        var nm = normPath(s(args[0])).replace(/^\//, '');
        if (a1 === 'ip') {
            return idbOpen(nm).then(function (db) { db.close(); return VFS.has('/' + nm) || true; }).catch(function () { return false; });
        }
        return new Promise(function (res) {
            try { indexedDB.deleteDatabase('iyu_' + nm.replace(/[^\w.]/g, '_')); VFS.delete('/' + nm); res(true); } catch (e) { res(false); }
        });
    }
    // sqlite(obj, "name.db") — 打开
    var name = normPath(a1).replace(/^\//, '');
    return idbOpen(name).then(function (db) {
        dbHandles.set(id, { db: db, name: name });
        vfsWrite('/' + name, '', false);
        return true;
    }).catch(function (e) {
        emit('log', '[iyu] 数据库打开失败: ' + (e && e.message), true);
        return false;
    });
};
OPS.sql = function (args, ctx) {
    var dbId = objIdOf(args[0]);
    var dh = dbHandles.get(dbId);
    if (!dh) return Promise.resolve(false);
    var db = dh.db;
    // 自定义 SQL
    var a1 = s(args[1]);
    if (args.length === 2 || /^\s*(select|insert|update|delete|create)\s/i.test(a1)) {
        var sqlRaw = a1;
        var mSel = /^\s*select\s+(.+?)\s+from\s+(\w+)\s*(?:where\s+(.+?))?\s*(?:order\s+by\s+(\S+)(?:\s+(asc|desc)))?\s*(?:limit\s+(\d+)(?:\s*,\s*(\d+))?)?\s*;?\s*$/i.exec(sqlRaw);
        if (mSel) {
            var wantCols = mSel[1].split(',').map(function (x) { return x.trim(); });
            return (async function () {
                var rows = await idbTx(db, mSel[2], 'readonly', function (st) { return st.getAll(); });
                rows = sqlWhere(rows, (mSel[3] || '') + (mSel[4] ? ' order by ' + mSel[4] + ' ' + (mSel[5] || '') : '') + (mSel[6] ? ' limit ' + mSel[6] + (mSel[7] ? ',' + mSel[7] : '') : ''));
                var cols = wantCols[0] === '*' ? (rows.length ? Object.keys(rows[0]) : []) : wantCols;
                var rs = rows.map(function (r) { return cols.map(function (c) { return r[c] !== undefined ? r[c] : null; }); });
                return { cols: cols, rows: rs };
            })();
        }
        var mIns = /^\s*insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\((.+)\)\s*;?\s*$/i.exec(sqlRaw);
        if (mIns) {
            var cols2 = mIns[2].split(',').map(function (x) { return x.trim(); });
            var vals2 = parseCsv(mIns[3]);
            var row = {};
            cols2.forEach(function (c2, i2) { row[c2] = coerceNum(vals2[i2]); });
            return idbTx(db, mIns[1], 'readwrite', function (st) { st.add(row); return true; }).catch(function () { return false; });
        }
        var mUpd = /^\s*update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+))?\s*;?\s*$/i.exec(sqlRaw);
        if (mUpd) {
            return (async function () {
                var rows = await idbTx(db, mUpd[1], 'readwrite', function (st) { return st.getAll(); });
                var sets = mUpd[2].split(',').map(function (p2) {
                    var kv = p2.split('=');
                    return [kv[0].trim(), kv.slice(1).join('=').trim()];
                });
                var match = sqlWhere(rows, mUpd[3] || '');
                var ids = match.map(function (r) { return r._id; });
                await idbTx(db, mUpd[1], 'readwrite', function (st) {
                    rows.forEach(function (r) {
                        if (ids.indexOf(r._id) >= 0) {
                            sets.forEach(function (kv2) { r[kv2[0]] = coerceNum(kv2[1]); });
                            st.put(r);
                        }
                    });
                    return true;
                });
                return true;
            })();
        }
        var mDel = /^\s*delete\s+from\s+(\w+)(?:\s+where\s+(.+))?\s*;?\s*$/i.exec(sqlRaw);
        if (mDel) {
            return (async function () {
                var rows = await idbTx(db, mDel[1], 'readwrite', function (st) { return st.getAll(); });
                var match = sqlWhere(rows, mDel[2] || '');
                await idbTx(db, mDel[1], 'readwrite', function (st) {
                    match.forEach(function (r) { st.delete(r._id); });
                    return true;
                });
                return true;
            })();
        }
        return Promise.resolve(false);
    }
    var table = a1;
    var op = s(args[2]);
    if (op === 'add' && args.length === 5) {
        // 建表: sql(db, table, "add", cols, out)
        var cols3 = s(args[3]);
        return idbEnsureTable(db, table).then(function (ok) {
            if (ok) vfsWrite('/' + dh.name, '', false);
            return ok;
        });
    }
    if (op === 'add' && args.length >= 6) {
        // 插入: sql(db, table, "add", cols, values, out)
        var colList = s(args[3]).split(',').map(function (x) { return x.trim(); });
        var valList = parseCsv(s(args[4]));
        var row2 = {};
        colList.forEach(function (c3, i3) { row2[c3] = coerceNum(valList[i3]); });
        return idbTx(db, table, 'readwrite', function (st) { st.add(row2); return true; }).then(function () { return true; }).catch(function (e) { emit('log', '[iyu] 插入失败: ' + (e && e.message), true); return false; });
    }
    if (op === 'ip') {
        return Promise.resolve(db.objectStoreNames.contains(table));
    }
    if (op === 'del' && args.length === 4) {
        // 删表
        return new Promise(function (res) {
            var v = db.version + 1;
            db.close();
            var req = indexedDB.open(db.name, v);
            req.onupgradeneeded = function () {
                try { req.result.deleteObjectStore(table); } catch (e) {}
            };
            req.onsuccess = function () { dbHandles.set(dbId, { db: req.result, name: dh.name }); res(true); };
            req.onerror = function () { res(false); };
        });
    }
    if (op === 'del' && args.length >= 5) {
        // 删数据: sql(db, table, "del", where, out)
        return (async function () {
            var rows = await idbTx(db, table, 'readwrite', function (st) { return st.getAll(); });
            var match = sqlWhere(rows, s(args[3]));
            await idbTx(db, table, 'readwrite', function (st) {
                match.forEach(function (r) { st.delete(r._id); });
                return true;
            });
            return true;
        })();
    }
    if (op === 'up') {
        return (async function () {
            var rows = await idbTx(db, table, 'readwrite', function (st) { return st.getAll(); });
            var sets = s(args[3]).split(',').map(function (p3) {
                var kv = p3.split('=');
                return [kv[0].trim(), kv.slice(1).join('=').trim()];
            });
            var match = sqlWhere(rows, s(args[4]));
            var ids = match.map(function (r) { return r._id; });
            await idbTx(db, table, 'readwrite', function (st) {
                rows.forEach(function (r) {
                    if (ids.indexOf(r._id) >= 0) {
                        sets.forEach(function (kv3) { r[kv3[0]] = coerceNum(kv3[1]); });
                        st.put(r);
                    }
                });
                return true;
            });
            return true;
        })();
    }
    if (op === 'sele') {
        // sql(db, table, "sele", cols, where, out) → 光标
        var cols4 = s(args[3]);
        var where = s(args[4]);
        return (async function () {
            await idbEnsureTable(db, table);
            var rows = await idbTx(db, table, 'readonly', function (st) { return st.getAll(); });
            rows = sqlWhere(rows, where);
            var allCols = rows.length ? Object.keys(rows[0]) : (cols4 !== '*' ? cols4.split(',').map(function (x) { return x.trim(); }) : []);
            if (cols4 !== '*' && allCols.length) allCols = allCols.filter(function (c4) { return cols4.indexOf(c4) >= 0 || c4 === '_id'; });
            return { cols: allCols, rows: rows.map(function (r) { return allCols.map(function (c5) { return r[c5] !== undefined ? r[c5] : null; }); }) };
        })();
    }
    return Promise.resolve(false);
};
function coerceNum(v) {
    var str = s(v === undefined ? '' : v);
    if (str !== '' && !isNaN(Number(str))) return Number(str);
    return v;
}

// ---------------- Socket (WebSocket) ----------------
var sockHandles = new Map();
OPS.sot = function (args) {
    var id = objIdOf(args[0]);
    var a1 = args[1];
    if (typeof a1 === 'string' && ['str', 'file', 'bt', 'bt2', 're', 'ip', 'id', 'list', 'size', 'new', 'sl'].indexOf(a1) >= 0) {
        var so = sockHandles.get(id);
        if (!so) return null;
        switch (a1) {
            case 'str': if (so.ws && so.ws.readyState === 1) so.ws.send(s(args[2])); return true;
            case 'file': case 'bt': {
                var bytes = vfsReadBytes(args[2]);
                if (so.ws && so.ws.readyState === 1 && bytes) so.ws.send(bytes);
                return true;
            }
            case 'bt2': {
                var b2 = typeof args[2] === 'string' ? byteStrToBytes(args[2]) : null;
                if (so.ws && so.ws.readyState === 1 && b2) so.ws.send(b2);
                return true;
            }
            case 're': if (so.ws) try { so.ws.close(); } catch (e) {} so.closed = true; return true;
            case 'ip': return !!(so.closed || (so.ws && so.ws.readyState > 1));
            case 'id': return id;
            case 'list': return [id];
            case 'size': return so.closed ? 0 : 1;
            case 'new': return true;
            case 'sl': return id;
            default: return null;
        }
    }
    // 客户端: sot(host, port, timeout, overwrite, out, tok)
    var host = s(args[1]);
    var port = Number(args[2]);
    var url = /^wss?:\/\//.test(host) ? host : 'ws://' + host + (port ? ':' + port : '');
    var tok = args.length >= 6 ? s(args[args.length - 1]) : (args.length >= 5 ? s(args[4]) : '');
    if (tok.indexOf('u') !== 0 || tok.indexOf('|') < 0) tok = args.length >= 6 ? s(args[5]) : '';
    var ws = new WebSocket(url);
    var o = { ws: ws, closed: false, tok: tok };
    sockHandles.set(id, o);
    ws.onmessage = function (ev) {
        if (tok) {
            var msg = typeof ev.data === 'string' ? ev.data : bytesToByteStr(new Uint8Array(ev.data));
            callEvent(tok, { st_msG: msg, st_ssR: id });
        }
    };
    ws.onclose = function () { o.closed = true; };
    ws.onerror = function () { o.closed = true; };
    return true;
};
OPS.sota = function (args) {
    var id = objIdOf(args[0]);
    var so = sockHandles.get(id);
    if (!so) return null;
    var cmd = s(args[1]);
    switch (cmd) {
        case 'ht': return so.ws && so.ws.url ? so.ws.url : '';
        case 'ip': return !!(so.closed || (so.ws && so.ws.readyState > 1));
        case 're': if (so.ws) try { so.ws.close(); } catch (e) {} so.closed = true; return true;
        case 'socket': return id;
        case 'id': return id;
        case 'str': if (so.ws && so.ws.readyState === 1) so.ws.send(s(args[2])); return true;
        case 'file': case 'bt': {
            var bytes = vfsReadBytes(args[2]);
            if (so.ws && so.ws.readyState === 1 && bytes) so.ws.send(bytes);
            return true;
        }
        default: return null;
    }
};
// ============================================================================
// IYU API 层 Part 7: IYU 公开 API / 初始化 / 调度
// ============================================================================

// ---------- 界面级事件桥 (window focus/blur/devicemotion 等) ----------
function setupGlobalEvents() {
    document.addEventListener('visibilitychange', function () {
        var ev = document.hidden ? '暂停' : '恢复';
        callEvent('u0|c-1|e' + ev, {});
        callEvent('u0|c-1|e' + (document.hidden ? '停止' : '重新开始'), {});
    });
    window.addEventListener('focus', function () { callEvent('u0|c-1|e恢复', {}); });
    window.addEventListener('blur', function () { callEvent('u0|c-1|e暂停', {}); });
    window.addEventListener('keydown', function (e) {
        callEvent('u0|c-1|e按键按下', { st_kC: e.keyCode });
    });
    window.addEventListener('keyup', function (e) {
        callEvent('u0|c-1|e按键释放', { st_kC: e.keyCode });
    });
    window.addEventListener('devicemotion', function (e) {
        var a = e.accelerationIncludingGravity;
        if (a) {
            callEvent('u0|c-1|e重力感应', {
                st_x: Math.round((a.x || 0) * 100) / 100,
                st_y: Math.round((a.y || 0) * 100) / 100,
                st_z: Math.round((a.z || 0) * 100) / 100
            });
        }
    });
}

// ---------- 调度 ----------
var schedTimer = null;
function schedule(ms) {
    if (schedTimer) { clearTimeout(schedTimer); schedTimer = null; }
    schedTimer = setTimeout(function () {
        schedTimer = null;
        if (M) { try { M._iyu_tick(); } catch (e) { console.error(e); } }
    }, Math.max(0, ms));
}

// ---------- 主流程 ----------
function runSource(source) {
    if (!M) throw new Error('IYU 未初始化, 请先 await IYU.init(...)');
    // 重置界面
    resetHost();
    var len = M.lengthBytesUTF8(source);
    var buf = M._malloc(len + 1);
    M.stringToUTF8(source, buf, len + 1);
    var r = M._iyu_run(buf);   // C++ 负责释放
    if (r !== 0) throw new Error('裕语言编译失败 (详见控制台/日志)');
    return true;
}
function resetHost() {
    ctrls.clear();
    logicalId.clear();
    objs.clear();
    listBinding.clear();
    menuRegistry.clear();
    dialogStack.slice().forEach(function (d) { d.remove(); });
    dialogStack.length = 0;
    floatWins.forEach(function (rec) { if (rec.el && rec.el.parentNode) rec.el.parentNode.removeChild(rec.el); });
    floatWins.clear();
    screenStack.slice().forEach(function (sc) { if (sc.el.parentNode) sc.el.parentNode.removeChild(sc.el); });
    screenStack.length = 0;
    audioPlayers.forEach(function (p) { try { p.el.pause(); } catch (e) {} });
    audioPlayers.clear();
    camStreams.forEach(function (cs) { try { cs.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} });
    camStreams.clear();
    sockHandles.forEach(function (so) { try { so.ws && so.ws.close(); } catch (e) {} });
    sockHandles.clear();
    if (videoOverlay) { videoOverlay.remove(); videoOverlay = null; }
    if (hostEl) hostEl.innerHTML = '';
    currentUnitName = 'main';
}

var IYU = {
    version: '1.0.0',
    /** 初始化: { host, width, height, debug, onLog, onError, onEvent } */
    init: function (options) {
        if (readyP) return readyP;
        var o = options || {};
        if (o.debug !== undefined) opt.debug = o.debug;
        if (o.onLog) opt.onLog = o.onLog;
        if (o.onError) opt.onError = o.onError;
        if (o.onEvent) opt.onEvent = o.onEvent;
        var hostSel = o.host || '#app';
        var hostNode = typeof hostSel === 'string' ? document.querySelector(hostSel) : hostSel;
        if (!hostNode) hostNode = document.body;
        hostEl = document.createElement('div');
        hostEl.id = 'iyu-host-root';
        hostEl.style.cssText = 'position:relative;overflow:hidden;background:#fff;font-family:system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;box-sizing:border-box;user-select:none';
        if (o.width) hostEl.style.width = typeof o.width === 'number' ? o.width + 'px' : o.width;
        if (o.height) hostEl.style.height = typeof o.height === 'number' ? o.height + 'px' : o.height;
        hostNode.appendChild(hostEl);
        readyP = iyu_runtime().then(function (mod) {
            M = mod;
            globalThis.__iyuHost = bridgeHost;
            globalThis.__iyuSchedule = schedule;
            globalThis.__iyuLog = function (s2, isErr2) {
                emit('log', s2, isErr2);
                if (isErr2) emit('error', s2);
            };
            globalThis.__iyuState = function (st) { emit('state', st); };
            setupGlobalEvents();
            IYU._M = mod;   // 调试用
            return mod;
        });
        return readyP;
    },
    /** 运行裕语言源码 */
    run: function (source) {
        return readyP.then(function () { return runSource(source); });
    },
    /** 从 URL 加载 .iyu 并运行 */
    runUrl: function (url) {
        return readyP.then(function () {
            return fetch(url).then(function (r) {
                if (!r.ok) throw new Error('加载失败: ' + url + ' (' + r.status + ')');
                return r.text();
            }).then(function (src) { return runSource(src); });
        });
    },
    /** 停止运行 */
    stop: function () {
        if (M) M._iyu_stop();
        resetHost();
    },
    /** 事件监听: log / error / event / state */
    on: function (event, fn) {
        (listeners[event] = listeners[event] || []).push(fn);
        return IYU;
    },
    /** 手动触发界面事件 */
    fire: function (event, data) { emit(event, data); },
    /** 注册 JS 回调供裕语言调用 */
    jsCallback: function (name, fn) { jsCallbacks.set(name, fn); },
    /** 虚拟文件系统: 写入文本 / 读取文本 / 写入字节(Uint8Array) */
    vfsWrite: function (path, data) {
        if (data instanceof Uint8Array) vfsWrite(path, data, true);
        else vfsWrite(path, String(data), false);
    },
    vfsRead: function (path) { return vfsReadText(path); },
    vfsList: function (dir) { return vfsList(dir || '/', null); }
};

// ---------- 导出 ----------
export { IYU };
export default IYU;
