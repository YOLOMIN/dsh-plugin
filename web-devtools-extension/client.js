window.__ModuleLoader__.load({
  id: '@local/web-devtools-extension',
  factory(require) {
    const R = require('react'), h = R.createElement;
    const ID = '@local/web-devtools-extension';
    const DEFAULT = 'http://192.168.60.124:9091/#/login';
    const COPY = {
      zh: {title:'Web 开发调试',desc:'独立的桌面内嵌网页与元素检查',open:'打开',reload:'刷新',inspect:'检查样式',click:'点击元素',fill:'填写',selector:'CSS 选择器',value:'输入值（不持久化）',address:'应用地址',ready:'网页已就绪，可以直接用鼠标操作。',idle:'输入网址开始浏览',desktop:'此扩展仅支持 DSH 桌面端；没有启动外部浏览器或 iframe 替代。',busy:'操作中…',tools:'开发者工具',failed:'网页初始化失败',loading:'正在加载…'},
      en: {title:'Web development tools',desc:'Independent Desktop webview and element inspection',open:'Open',reload:'Reload',inspect:'Inspect styles',click:'Click element',fill:'Fill',selector:'CSS selector',value:'Input value (not persisted)',address:'Application URL',ready:'Page ready. You can interact with the mouse.',idle:'Enter a URL to browse',desktop:'This extension requires DSH Desktop. No external browser or iframe fallback is used.',busy:'Working…',tools:'Developer tools',failed:'Page initialization failed',loading:'Loading…'}
    };
    const CSS = `.wdx{position:relative;box-sizing:border-box;height:100%;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font-size:12px;overflow:hidden}.wdx *{box-sizing:border-box}.wdx-row{display:flex;align-items:center;gap:6px;padding:8px;flex:none;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap}.wdx input{min-width:80px;flex:1;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:inherit;border-radius:6px;padding:6px;font:inherit}.wdx button{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:inherit;border-radius:6px;padding:6px 8px;cursor:pointer;font:inherit}.wdx button:disabled{opacity:.5;cursor:default}.wdx-stage{flex:1;min-height:150px;position:relative;overflow:hidden}.wdx-view{position:absolute;inset:0}.wdx-pointer{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}.wdx-mouse{flex:none;max-height:150px;overflow:auto}.wdx select{background:var(--dsw-alias-bg-layer-1);color:inherit;border:1px solid var(--dsw-alias-border-l2);padding:5px}.wdx summary{padding:6px;cursor:pointer}.wdx-view webview{display:flex;width:100%;height:100%}.wdx-status{padding:8px;height:36px;flex:0 0 36px;overflow:auto;color:var(--dsw-alias-label-secondary)}.wdx pre{height:110px;flex:0 0 110px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:8px;background:var(--dsw-alias-bg-layer-1);font:11px/1.5 monospace}.wdx-empty{padding:16px}.wdx-error{color:var(--dsw-alias-state-error-primary);padding:10px;flex:none;max-height:70px;overflow:auto}.wdx-dot{display:inline-block;width:7px;height:7px;border-radius:50%;flex:none}.wdx-notice{padding:6px 10px;flex:none;color:var(--dsw-alias-label-secondary)}.wdx-drawer{position:absolute;z-index:5;top:46px;right:8px;width:min(500px,calc(100% - 16px));max-height:calc(100% - 60px);overflow:auto;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;box-shadow:0 4px 16px color-mix(in srgb,var(--dsw-alias-label-primary) 15%,transparent)}.wdx-welcome{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;color:var(--dsw-alias-label-secondary)}`;
    function script(action, selector, value) {
      return `(() => {
        const action=${JSON.stringify(action)}, selector=${JSON.stringify(selector)}, value=${JSON.stringify(value)};
        if(action==='snapshot') return {viewport:{width:innerWidth,height:innerHeight,scrollX,scrollY},url:location.href,title:document.title,controls:[...document.querySelectorAll('button,a,input,select,textarea,[role="button"]')].filter(e=>e.getClientRects().length).slice(0,80).map(e=>({tag:e.tagName,id:e.id,role:e.getAttribute('role'),type:e.type||null,placeholder:e.getAttribute('placeholder'),name:e.getAttribute('aria-label'),text:(e.innerText||'').slice(0,160)}))};
        const items=document.querySelectorAll(selector);
        if(items.length!==1) throw Error('Selector must match exactly one element; matched '+items.length);
        const el=items[0];
        if(action==='click') { el.scrollIntoView({block:'center'}); el.click(); }
        if(action==='fill') {
          if(!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) throw Error('Element is not an input or textarea');
          const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);
          el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));
        }
        const style=getComputedStyle(el), rect=el.getBoundingClientRect();
        return {action,selector,tag:el.tagName,text:el.type==='password'?'[redacted]':(el.innerText||'').slice(0,300),rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},style:Object.fromEntries(['display','position','color','backgroundColor','fontFamily','fontSize','fontWeight','margin','padding','width','height','border','zIndex'].map(k=>[k,style[k]]))};
      })()`;
    }
    class Boundary extends R.Component {
      constructor(p){super(p);this.state={error:null};}
      static getDerivedStateFromError(e){return {error:String(e.message||e)};}
      render(){return this.state.error?h('div',{className:'wdx-error',role:'alert'},'Web development tools: '+this.state.error):this.props.children;}
    }
    return { inject:['slots','sidebarRightTabs','locale'], apply(ctx) {
      const locale=ctx.get('locale'), tabs=ctx.get('sidebarRightTabs');
      if(!locale||!tabs) throw Error('Required sidebar services unavailable');
      const ns='localWebDevtools';
      ctx.effect(()=>locale.register(ns,{zh:COPY.zh,en:COPY.en}));
      const t=locale.bind(ns);
      function Panel(props) {
        const tabInfo=props.useTabInfo();
        const visibleRef=R.useRef(false);visibleRef.current=tabInfo.tab.visible;
        const viewport=R.useRef(null), guest=R.useRef(null), opening=R.useRef(null), dead=R.useRef(false);
        const lease=R.useRef(null), executor=R.useRef(null);
        const [connection,setConnection]=R.useState('Agent: connecting');
        const mousePosition=R.useRef(null), mouseLife=R.useRef(0);
        const canvasRef=R.useRef(null), visual=R.useRef({pointer:null,trail:[],rings:[]});
        function paint(){
          const canvas=canvasRef.current;if(!canvas)return;
          const box=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1;
          if(canvas.width!==Math.round(box.width*dpr)||canvas.height!==Math.round(box.height*dpr)){canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);}
          const c=canvas.getContext('2d');if(!c)return;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,box.width,box.height);
          const color=getComputedStyle(canvas).getPropertyValue('--dsw-alias-brand-primary').trim()||'#3478ef';
          const v=visual.current;c.strokeStyle=color;c.lineWidth=2;
          for(let i=1;i<v.trail.length;i++){c.globalAlpha=i/v.trail.length*.5;c.beginPath();c.moveTo(v.trail[i-1].x,v.trail[i-1].y);c.lineTo(v.trail[i].x,v.trail[i].y);c.stroke();}
          c.globalAlpha=1;for(const p of v.rings){c.beginPath();c.arc(p.x,p.y,14,0,Math.PI*2);c.stroke();}
          if(v.pointer){c.save();c.translate(v.pointer.x,v.pointer.y);c.fillStyle=color;c.beginPath();c.moveTo(0,0);c.lineTo(0,20);c.lineTo(5,15);c.lineTo(10,24);c.lineTo(14,22);c.lineTo(9,13);c.lineTo(17,13);c.closePath();c.fill();c.restore();}
        }
        function setRings(rings){visual.current.rings=rings;paint();}
        function clearVisual(){visual.current={pointer:null,trail:[],rings:[]};paint();}
        const [coords,setCoords]=R.useState({x:80,y:80,toX:200,toY:160,deltaY:-300}),[mouseKind,setMouseKind]=R.useState('move'),[mouseButton,setMouseButton]=R.useState('left');
        const [showPointer,setShowPointer]=R.useState(true);
        const [toolsOpen,setToolsOpen]=R.useState(false),[error,setError]=R.useState('');
        async function rpc(payload,signal){
          const response=await fetch('/api/local-web-devtools',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:props.sessionId,...payload}),signal});
          const data=await response.json();if(!data.ok)throw Error(data.error||'Desktop bridge failed');return data.value;
        }
        R.useEffect(()=>{
          const controller=new AbortController(),instance=crypto.randomUUID();let token;
          const delay=ms=>new Promise(resolve=>{const done=()=>{clearTimeout(timer);controller.signal.removeEventListener('abort',done);resolve();};const timer=setTimeout(done,ms);controller.signal.addEventListener('abort',done,{once:true});});
          const loop=async()=>{
            let retry=0;
            while(!controller.signal.aborted){
              try{
                const registered=await rpc({op:'register',instance},controller.signal);
                if(controller.signal.aborted)break;
                token=registered.token;lease.current=token;retry=0;setConnection('Agent: connected');
                while(!controller.signal.aborted){
                  const message=await rpc({op:'poll',token},controller.signal);
                  if(message.command){
                    const {id,...command}=message.command;let outcome;
                    try{outcome={ok:true,value:await executor.current(command)};}catch(e){outcome={ok:false,error:String(e.message||e)};}
                    // A failed acknowledgement never replays an already dispatched action.
                    await rpc({op:'result',token,id,outcome},controller.signal);
                  }
                }
              }catch(e){
                lease.current=null;
                if(controller.signal.aborted)break;
                retry++;setConnection('Agent: reconnecting ('+String(e.message||e).slice(0,150)+')');
                await delay(Math.min(8000,500*Math.pow(2,Math.min(retry-1,4))));
              }
            }
          };
          loop();return ()=>{controller.abort();lease.current=null;if(token)rpc({op:'unregister',token}).catch(()=>{});};
        },[]);
        const [address,setAddress]=R.useState(DEFAULT), [selector,setSelector]=R.useState('button'), [value,setValue]=R.useState('');
        const [status,setStatus]=R.useState(t('idle')), [output,setOutput]=R.useState(''), [busy,setBusy]=R.useState(false), [ready,setReady]=R.useState(false);
        const [hasPage,setHasPage]=R.useState(false);
        const bridge=globalThis.dshDesktop?.protocolVersion===1?globalThis.dshDesktop.browser:undefined;
        R.useEffect(()=>{
          dead.current=false;
          return ()=>{dead.current=true; const held=guest.current;guest.current=null;held?.element.remove();held?.unsubscribe?.();if(held) bridge.release(held.lease).catch(()=>{});};
        },[]);
        function checkedUrl(raw=address){const u=new URL(raw);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.origin===location.origin)throw Error('Only HTTP(S) application URLs without credentials are supported');return u.href;}
        async function ensureGuest(){
          if(guest.current)return guest.current;
          if(opening.current)return opening.current;
          if(!bridge)throw Error(t('desktop'));
          opening.current=(async()=>{
            const reservation=await bridge.acquire('session:'+props.sessionId);
            if(dead.current){await bridge.release(reservation.lease);throw Error('Panel closed');}
            const el=document.createElement('webview');
            el.setAttribute('name',reservation.lease);el.setAttribute('partition',reservation.partition);el.setAttribute('allowpopups','');el.setAttribute('src','about:blank#'+reservation.lease);
            const held={element:el,lease:reservation.lease,ready:null};guest.current=held;
            held.ready=new Promise((resolve,reject)=>{
              const timer=setTimeout(()=>reject(Error('Embedded page did not become ready within 15 seconds')),15000);
              el.addEventListener('dom-ready',()=>{clearTimeout(timer);if(!dead.current){setReady(true);setStatus(t('ready'));}resolve();},{once:true});
              el.addEventListener('destroyed',()=>{clearTimeout(timer);reject(Error('Embedded page was destroyed'));},{once:true});
            });
            el.addEventListener('did-start-navigation',e=>{if(e.isMainFrame){mouseLife.current++;mousePosition.current=null;clearVisual();}});
            el.addEventListener('destroyed',()=>{mouseLife.current++;});
            el.addEventListener('did-fail-load',e=>{if(e.isMainFrame&&e.errorCode!==-3&&!dead.current)setError('Load failed '+e.errorCode+': '+e.errorDescription);});
            el.addEventListener('console-message',e=>{if(e.level>=3&&!dead.current)setOutput(prev=>(prev+'\nConsole: '+e.message).slice(-6000));});
            el.addEventListener('did-navigate',()=>{if(!dead.current){setAddress(el.getURL());setHasPage(true);}});
            el.addEventListener('did-navigate-in-page',e=>{if(e.isMainFrame&&!dead.current){setAddress(el.getURL());setHasPage(true);}});
            held.unsubscribe=bridge.onOpenRequested(reservation.lease,url=>{try{const u=new URL(url);if(['http:','https:'].includes(u.protocol)){setAddress(u.href);setHasPage(true);el.loadURL(u.href).catch(e=>setError(String(e.message)));}}catch(e){setError('Blocked unsafe popup');}});
            viewport.current.appendChild(el);
            try {await held.ready;return held;} catch(e){if(guest.current===held)guest.current=null;el.remove();held.unsubscribe?.();await bridge.release(held.lease);throw e;}
          })().finally(()=>{opening.current=null;});
          return opening.current;
        }
        async function run(fn){if(busy)return;setBusy(true);setError('');try{await fn();}catch(e){setError(String(e.message||e));}finally{if(!dead.current)setBusy(false);}}
        async function nativeMouse(m){
          const el=guest.current?.element;
          if(!el||typeof el.sendInputEvent!=='function')throw Error('Native sendInputEvent is unavailable; no synthetic DOM fallback was used');
          if(typeof props.useTabInfo!=='function'||!props.useTabInfo)throw Error('Panel visibility hook unavailable');
          const hostRect=el.getBoundingClientRect();
          if(!visibleRef.current||document.visibilityState!=='visible'||hostRect.width===0)throw Error('Mouse visibility check: '+JSON.stringify({tabVisible:visibleRef.current,documentVisibility:document.visibilityState,hostWidth:Math.round(hostRect.width),hostHeight:Math.round(hostRect.height),focused:document.hasFocus()}));
          const view=await el.executeJavaScript('({width:innerWidth,height:innerHeight})');
          const point=(x,y)=>{if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0||x>=view.width||y>=view.height)throw Error('Coordinates are outside guest viewport '+view.width+' x '+view.height);return {x:Math.round(x),y:Math.round(y)};};
          const start=point(m.x,m.y),end=m.kind==='drag'?point(m.toX,m.toY):start;
          const epoch=mouseLife.current,button=m.button||'left';let pressed=false;
          const check=()=>{if(dead.current||epoch!==mouseLife.current||!visibleRef.current||guest.current?.element!==el)throw Error('Mouse operation interrupted by navigation, hidden panel or disposal');};
          const metrics={events:0,inputMs:0,maxInputMs:0,frameIntervals:[]};let lastFrame=0;
          const draw=p=>{mousePosition.current=p;visual.current.pointer=p;visual.current.trail.push(p);if(visual.current.trail.length>36)visual.current.trail.shift();paint();};
          const send=(event,p)=>{check();const before=performance.now();el.sendInputEvent({...event,...p});const elapsed=performance.now()-before;metrics.events++;metrics.inputMs+=elapsed;metrics.maxInputMs=Math.max(metrics.maxInputMs,elapsed);draw(p);};
          const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
          const move=async(a,b,drag=false)=>{
            const distance=Math.hypot(b.x-a.x,b.y-a.y);
            if(distance<1){send({type:'mouseMove',...(drag?{button,modifiers:[button+'ButtonDown']}:{})},b);return;}
            const duration=m.durationMs??Math.min(900,Math.max(240,distance*1.25));
            if(duration===0){send({type:'mouseMove',...(drag?{button,modifiers:[button+'ButtonDown']}:{})},b);return;}
            const started=performance.now();let lastX=-1,lastY=-1;
            while(true){
              const now=performance.now();if(lastFrame)metrics.frameIntervals.push(now-lastFrame);lastFrame=now;
              const u=Math.min(1,(now-started)/duration);
              const eased=u*u*u*(u*(u*6-15)+10);
              const p={x:Math.round(a.x+(b.x-a.x)*eased),y:Math.round(a.y+(b.y-a.y)*eased)};
              if(p.x!==lastX||p.y!==lastY||u===1){send({type:'mouseMove',...(drag?{button,modifiers:[button+'ButtonDown']}:{})},p);lastX=p.x;lastY=p.y;}
              if(u===1)break;await new Promise(resolve=>requestAnimationFrame(resolve));
            }
          };
          el.focus();setRings([]);
          try{
            await move(mousePosition.current||start,start);
            if(m.kind==='drag'){
              send({type:'mouseDown',button,clickCount:1},start);pressed=true;
              await move(start,end,true);
              send({type:'mouseUp',button,clickCount:1},end);pressed=false;setRings([{...start},{...end}]);
            }else if(m.kind==='click'||m.kind==='doubleClick'){
              for(let i=1;i<=(m.kind==='doubleClick'?2:1);i++){await pause(i===1?70:90);send({type:'mouseDown',button,clickCount:i},start);pressed=true;await pause(55);send({type:'mouseUp',button,clickCount:i},start);pressed=false;}
              setRings([{...start}]);
            }else if(m.kind==='wheel'){
              const frames=m.durationMs===0?1:18;let sx=0,sy=0;
              for(let i=1;i<=frames;i++){const u=i/frames,ease=1-Math.pow(1-u,3),nx=Math.round((m.deltaX||0)*ease),ny=Math.round((m.deltaY||0)*ease);if(nx!==sx||ny!==sy)send({type:'mouseWheel',deltaX:nx-sx,deltaY:ny-sy,canScroll:true},start);sx=nx;sy=ny;if(frames>1)await pause(16);}
              setRings([{...start}]);
            }
            await pause(70);
            return {action:'mouse',kind:m.kind,button,position:mousePosition.current,viewport:view,native:true,performance:{events:metrics.events,meanInputMs:Math.round(metrics.inputMs/Math.max(1,metrics.events)*10)/10,maxInputMs:Math.round(metrics.maxInputMs*10)/10,maxFrameIntervalMs:Math.round(Math.max(0,...metrics.frameIntervals)),frames:metrics.frameIntervals.length},visual:{pointer:true,trailPoints:visual.current.trail.length,clickMarker:m.kind!=='move'}};
          }finally{if(pressed&&guest.current?.element===el){try{el.sendInputEvent({type:'mouseUp',button,clickCount:1,...(mousePosition.current||start)});}catch{}}}
        }
        async function perform(command){
          if(command.action==='open'){const url=checkedUrl(command.url);setAddress(url);const held=await ensureGuest();await held.element.loadURL(url);setHasPage(true);setError('');return {url:held.element.getURL(),title:held.element.getTitle()};}
          const held=guest.current;if(!held)throw Error('Open a page first');await held.ready;
          if(command.action==='mouse'){const result=await nativeMouse(command.mouse);setOutput(JSON.stringify(result,null,2));return result;}
          if(command.action==='reload'){held.element.reload();return {reloading:true};}
          const result=await held.element.executeJavaScript(script(command.action,command.selector,command.value),true);
          const bounded=JSON.stringify(result);if(bounded.length>35000)throw Error('Page result exceeds limit');
          setOutput(bounded);setStatus(command.action+' completed');return result;
        }
        executor.current=perform;
        async function dispatch(command){if(!lease.current)throw Error('Agent bridge not connected; reopen this panel');return rpc({op:'execute',token:lease.current,command});}
        async function open(){await dispatch({action:'open',url:checkedUrl()});}
        async function operate(action){await dispatch({action,selector,...(action==='fill'?{value}:{})});if(action==='fill')setValue('');}
        const btn=(label,fn,disabled=false)=>h('button',{type:'button',disabled:busy||disabled,onClick:()=>run(fn)},label);
        const connected=connection==='Agent: connected';
        return h('section',{className:'wdx','data-web-devtools-version':'0.4.1'},h('style',null,CSS),
          h('form',{className:'wdx-row',onSubmit:e=>{e.preventDefault();run(open);}},
            btn('←',()=>{const el=guest.current?.element;if(el?.canGoBack())el.goBack();},!ready),
            btn('→',()=>{const el=guest.current?.element;if(el?.canGoForward())el.goForward();},!ready),
            btn('↻',()=>dispatch({action:'reload'}),!ready),
            h('input',{type:'url',value:address,'aria-label':t('address'),onChange:e=>setAddress(e.target.value)}),
            h('button',{type:'submit',disabled:busy||!bridge,title:t('open')},'↵'),
            h('span',{className:'wdx-dot',role:'status','aria-label':connection,title:connection,style:{background:connected?'var(--dsw-alias-state-success-primary)':'var(--dsw-alias-state-warn-primary)'}}),
            h('button',{type:'button','aria-expanded':toolsOpen,'aria-label':t('tools'),title:'0.4.1',onClick:()=>setToolsOpen(v=>!v)},t('tools'))),
          !connected&&h('div',{className:'wdx-notice',role:'status'},connection),
          error&&h('div',{className:'wdx-error',role:'alert'},error,h('button',{type:'button',onClick:()=>setError(''),'aria-label':'Dismiss error'},'×')),
          toolsOpen&&h('aside',{className:'wdx-drawer','aria-label':t('tools')},
          h('div',{className:'wdx-row'},h('strong',null,'Web 开发调试 · 0.4.1'),btn('网页 DevTools',()=>guest.current.element.openDevTools(),!ready)),
          h('div',{className:'wdx-row'},h('input',{value:selector,'aria-label':t('selector'),placeholder:t('selector'),onChange:e=>setSelector(e.target.value)}),btn(t('inspect'),()=>operate('inspect'),!ready),btn(t('click'),()=>operate('click'),!ready)),
          h('div',{className:'wdx-row'},h('input',{type:'password',autoComplete:'off',value,'aria-label':t('value'),placeholder:t('value'),onChange:e=>setValue(e.target.value)}),btn(t('fill'),()=>operate('fill'),!ready)),
          h('details',{className:'wdx-mouse'},h('summary',null,'坐标鼠标 / Coordinate mouse'),
            h('div',{className:'wdx-row'},h('select',{'aria-label':'鼠标操作',value:mouseKind,onChange:e=>setMouseKind(e.target.value)},...['move','click','doubleClick','drag','wheel'].map(k=>h('option',{key:k,value:k},k))),h('select',{'aria-label':'鼠标按键',value:mouseButton,onChange:e=>setMouseButton(e.target.value)},...['left','right','middle'].map(k=>h('option',{key:k,value:k},k))),...['x','y',...(mouseKind==='drag'?['toX','toY']:[]),...(mouseKind==='wheel'?['deltaY']:[])].map(k=>h('label',{key:k},k,h('input',{type:'number','aria-label':k,value:coords[k],style:{width:65},onChange:e=>setCoords(old=>({...old,[k]:Number(e.target.value)}))}))),btn('执行 / Run',()=>dispatch({action:'mouse',mouse:{kind:mouseKind,button:mouseButton,...coords}}),!ready)),
            h('div',{className:'wdx-row'},h('label',null,h('input',{type:'checkbox',checked:showPointer,onChange:e=>setShowPointer(e.target.checked)}),'显示指针与轨迹'),h('button',{type:'button',onClick:clearVisual},'清除标记'),h('span',null,'坐标原点：网页左上角；CSS px'))),
          h('pre',null,output||'暂无调试结果')),
          h('div',{className:'wdx-stage'},h('div',{className:'wdx-view',ref:viewport},!bridge&&h('div',{className:'wdx-empty'},t('desktop'))),!hasPage&&bridge&&h('div',{className:'wdx-welcome'},t('idle')),h('canvas',{ref:canvasRef,className:'wdx-pointer','aria-hidden':true,style:{width:'100%',height:'100%',display:showPointer?'block':'none'}})));
      }
      const Body=p=>h(Boundary,null,h(Panel,p));
      ctx.effect(()=>tabs.register({id:ID,kind:'web-devtools-extension',keepMounted:true,title:()=>t('title'),guide:[{id:'open',order:45,title:()=>t('title'),description:()=>t('desc')}]}));
      ctx.effect(()=>ctx.slots.inject('sidebar.right.pane.tab',()=>ctx.slots.register({name:'sidebar.right.pane.tab',key:ID},Body)));
    }};
  }
});
