import assert from 'node:assert/strict';
import {apply} from './index.js';
const definitions=[];const cleanups=[];
apply({effect(fn){const cleanup=fn();cleanups.push(cleanup);return cleanup;},connection:{fetch:{register(){return ()=>{};}}},tools:{register(definition){definitions.push(definition);return ()=>{};}}});
function strictJson(value,path='$'){
  if(value===null||typeof value==='string'||typeof value==='boolean')return;
  if(typeof value==='number'){assert.ok(Number.isFinite(value),path);return;}
  assert.equal(typeof value,'object',`${path} is not JSON-compatible`);
  for(const [key,child] of Object.entries(value))strictJson(child,path+'.'+key);
}
for(const d of definitions){const schema={name:d.name,description:d.description,parameters:d.parameters};strictJson(schema);assert.deepEqual(JSON.parse(JSON.stringify(schema)),schema);}
assert.equal(definitions.length,2);cleanups.reverse().forEach(fn=>fn());
console.log('PASS: every registered tool schema is strict JSON; no undefined/function/non-finite values');
