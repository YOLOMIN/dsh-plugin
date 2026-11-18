import { randomUUID } from 'node:crypto';

export const ACTIONS = ['status', 'snapshot', 'open', 'inspect', 'click', 'fill', 'reload', 'mouse'];
export const parameters = {
  type:'object', additionalProperties:false,
  properties:{
    action:{type:'string',enum:ACTIONS,description:'status checks the panel connection; snapshot lists up to 80 visible controls; inspect reads one element and computed styles; click and fill act on exactly one element.'},
    selector:{type:'string',description:'CSS selector matching exactly one element for inspect, click or fill.'},
    value:{type:'string',description:'Text for fill. Tool arguments are recorded in the session; prefer entering passwords in the panel.'},
    mouse:{type:'object',additionalProperties:false,description:'For action mouse: native webview input. Coordinates are guest viewport CSS pixels from its top-left; obtain viewport and element rectangles with snapshot/inspect. Only the visible current panel is operated.',properties:{kind:{type:'string',enum:['move','click','doubleClick','drag','wheel']},x:{type:'number'},y:{type:'number'},toX:{type:'number'},toY:{type:'number'},button:{type:'string',enum:['left','right','middle']},deltaX:{type:'number'},deltaY:{type:'number'},durationMs:{type:'number',description:'Animation duration 0–2000 ms; default 400.'}},required:['kind','x','y']},
    url:{type:'string',description:'HTTP(S) destination for open; must not be the DSH application.'}
  },required:['action']
};
export function validate(input) {
  if(!input||!ACTIONS.includes(input.action)) throw Error('Invalid browser action');
  if(['inspect','click','fill'].includes(input.action) && (typeof input.selector!=='string'||!input.selector.trim()||input.selector.length>2000)) throw Error('A CSS selector of 1–2000 characters is required');
  if(input.action==='fill'&&(typeof input.value!=='string'||input.value.length>16000)) throw Error('Fill requires a value up to 16000 characters');
  if(input.action==='open') {const u=new URL(input.url);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Invalid application URL');}
  if(input.action==='mouse'){
    const m=input.mouse;
    if(!m||!['move','click','doubleClick','drag','wheel'].includes(m.kind))throw Error('Invalid mouse operation');
    const coordinate=k=>{if(!Number.isFinite(m[k])||m[k]<0||m[k]>20000)throw Error('Invalid mouse coordinate '+k);};coordinate('x');coordinate('y');
    if(m.kind==='drag'){coordinate('toX');coordinate('toY');}
    if(m.button!==undefined&&!['left','right','middle'].includes(m.button))throw Error('Invalid mouse button');
    if(m.durationMs!==undefined&&(!Number.isFinite(m.durationMs)||m.durationMs<0||m.durationMs>2000))throw Error('Invalid duration');
    for(const k of ['deltaX','deltaY'])if(m[k]!==undefined&&(!Number.isFinite(m[k])||Math.abs(m[k])>5000))throw Error('Invalid wheel delta');
  }
  return Object.fromEntries(Object.entries(input).filter(([k])=>['action','selector','value','url','mouse'].includes(k)));
}

// Ephemeral transport only: tool results remain in the ordinary DSH session log.
export class BrowserBroker {
  constructor({ttl=25000,deadline=20000}={}){this.panels=new Map();this.ttl=ttl;this.deadline=deadline;}
  current(sessionId){const p=this.panels.get(sessionId);if(p&&Date.now()-p.seen>this.ttl){this.close(p,'Desktop panel disconnected');this.panels.delete(sessionId);return undefined;}return p;}
  register(sessionId,instance){
    if(typeof sessionId!=='string'||!sessionId||typeof instance!=='string'||instance.length>100)throw Error('Invalid panel identity');
    const previous=this.current(sessionId);
    if(previous){if(previous.instance===instance){previous.seen=Date.now();return {token:previous.token};}throw Error('Another Web development tools panel already owns this session; close it first');}
    const p={sessionId,instance,token:randomUUID(),seen:Date.now(),pending:null,waiter:null};this.panels.set(sessionId,p);return {token:p.token};
  }
  panel(sessionId,token){const p=this.current(sessionId);if(!p||p.token!==token)throw Error('Panel lease is no longer valid');p.seen=Date.now();return p;}
  async poll(sessionId,token,signal){
    const p=this.panel(sessionId,token);
    if(p.waiter)throw Error('Only one panel poll is allowed');
    if(p.pending&&!p.pending.delivered){p.pending.delivered=true;return {command:{id:p.pending.id,...p.pending.command}};}
    return new Promise(resolve=>{
      const done=value=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);if(p.waiter===done)p.waiter=null;resolve(value);};
      const abort=()=>done({});const timer=setTimeout(()=>done({}),10000);p.waiter=done;signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
    });
  }
  result(sessionId,token,id,outcome){const p=this.panel(sessionId,token),q=p.pending;if(!q||q.id!==id)return {accepted:false};q.finish(outcome);return {accepted:true};}
  async execute(sessionId,input,signal){
    const command=validate(input),p=this.current(sessionId);
    if(command.action==='status')return {connected:!!p,sessionId,busy:!!p?.pending};
    if(!p)throw Error('Open Web development tools in this DSH session first');
    if(p.pending)throw Error('Another panel operation is in progress');
    if(signal?.aborted)throw Error('Operation cancelled');
    return new Promise((resolve,reject)=>{
      const id=randomUUID();const finish=outcome=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);if(p.pending?.id===id)p.pending=null;outcome.ok?resolve(outcome.value??null):reject(Error(String(outcome.error||'Desktop operation failed').slice(0,1500)));};
      const abort=()=>finish({ok:false,error:'Operation cancelled; an already dispatched browser action may still complete. Do not blindly retry mutations.'});
      const timer=setTimeout(()=>finish({ok:false,error:'Desktop operation timed out; a dispatched action may still complete. Inspect state before retrying.'}),this.deadline);
      p.pending={id,command,delivered:false,finish};signal?.addEventListener('abort',abort,{once:true});
      if(p.waiter){p.pending.delivered=true;p.waiter({command:{id,...command}});}
    });
  }
  unregister(sessionId,token){const p=this.panel(sessionId,token);this.close(p,'Panel closed');this.panels.delete(sessionId);return {closed:true};}
  close(p,reason){p.waiter?.({});p.pending?.finish({ok:false,error:reason});}
  dispose(){for(const p of this.panels.values())this.close(p,'Plugin unloaded');this.panels.clear();}
}
