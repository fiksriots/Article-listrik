const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
function load(path,resolve=require){
 const module={exports:{}};
 const source=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 new Function('require','exports','module',source)(resolve,module.exports,module);
 return module.exports;
}
(async()=>{
 const jwt=await import('next-auth/jwt');
 const identity=load('lib/auth/identity.ts');
 let config;
 load('auth.ts',name=>{
  if(name==='next-auth')return {default:factory=>{config=factory;return {}}};
  if(name==='next-auth/providers/google')return {default:x=>x};
  if(name==='next-auth/jwt')return jwt;
  if(name==='@/lib/auth/identity')return identity;
  return require(name);
 });
 process.env.AUTH_SECRET='isolated-test-secret-not-a-production-key';
 process.env.AUTH_URL='https://article.fikss.site';
 const email='student@example.invalid';
 const old={sub:crypto.randomUUID(),email};
 const cookieName='__Secure-authjs.session-token';
 const encrypted=await jwt.encode({token:old,secret:process.env.AUTH_SECRET,salt:cookieName});
 const request=new Request(process.env.AUTH_URL+'/api/auth/callback/google',{headers:{cookie:cookieName+'='+encrypted}});
 const callbacks=config(request).callbacks;
 assert.equal(callbacks.signIn({account:{provider:'google'},profile:{email_verified:false}}),false);
 const login=async(sub,mail=email,subject='stable-google-sub')=>callbacks.jwt({token:{sub,email:mail},account:{provider:'google',providerAccountId:subject}});
 const a=await login(crypto.randomUUID());
 const b=await login(crypto.randomUUID());
 const session=token=>callbacks.session({session:{user:{}},token});
 assert.equal(session(a).user.id,'google:stable-google-sub');
 assert.equal(session(b).user.id,session(a).user.id,'independent OAuth logins must restore one owner');
 assert.deepEqual(session(a).legacyProgressIds,['google:'+old.sub],'migration requires a verified previous cookie');
 assert.equal(session(old).progressNeedsRelogin,true);
 assert.equal(session(a).progressNeedsRelogin,false);
 assert.notEqual(session(await login(crypto.randomUUID(),'different@example.invalid','other-google-sub')).user.id,session(a).user.id);
 assert.deepEqual(session(await login(crypto.randomUUID(),'different@example.invalid')).legacyProgressIds,[],'account switch must not migrate another user');
 const tampered=config(new Request(request.url,{headers:{cookie:cookieName+'='+encrypted+'tampered'}})).callbacks;
 const forged=await tampered.jwt({token:{sub:'random',email},account:{provider:'google',providerAccountId:'stable-google-sub'}});
 assert.deepEqual(session(forged).legacyProgressIds,[],'unsigned legacy owners cannot authorize migration');
 const refreshed=await callbacks.jwt({token:a,trigger:'update',session:{googleSubject:'attacker',legacyProgressIds:['google:victim']}});
 assert.equal(session(refreshed).user.id,session(a).user.id,'client session updates cannot change owner');
 assert.deepEqual(session(refreshed).legacyProgressIds,session(a).legacyProgressIds);
 const changedSubject={sub:'other',email};
 identity.bindGoogleIdentity(changedSubject,'different-google-sub',a);
 assert.deepEqual(changedSubject.legacyProgressIds,[],'a known Google subject cannot be migrated to a different subject');
 // Exercise the production migration against a Firestore-shaped in-memory adapter.
 const data=new Map();let reads=0;
 class Doc{
  constructor(path){this.path=path}
  collection(name){return new Collection(this.path+'/'+name,this)}
  async get(){return {exists:data.has(this.path),data:()=>data.get(this.path)}}
  async set(value){data.set(this.path,value)}
 }
 class Collection{
  constructor(path,parent){this.path=path;this.parent=parent}
  doc(id){return new Doc(this.path+'/'+id)}
  async get(){reads++;return {docs:[...data].filter(([key])=>key.startsWith(this.path+'/')&&!key.slice(this.path.length+1).includes('/')).map(([key,value])=>({data:()=>value}))}}
 }
 class Firestore{
  collection(name){return new Collection(name,null)}
  async runTransaction(fn){return fn({getAll:async(...refs)=>Promise.all(refs.map(ref=>ref.get())),create:(ref,value)=>{assert.ok(!data.has(ref.path));data.set(ref.path,value)}})}
  batch(){return {set:(ref,value)=>data.set(ref.path,value),commit:async()=>{}}}
 }
 const handlers=load('lib/server/progress-handler.ts');
 const firestore=load('lib/server/firestore-progress.ts',name=>name==='server-only'?{}:name==='@google-cloud/firestore'?{Firestore,FieldValue:{serverTimestamp:()=>1}}:name==='./progress-handler'?handlers:require(name));
 process.env.FIRESTORE_PROJECT_ID='fixture';process.env.FIRESTORE_CLIENT_EMAIL='fixture';process.env.FIRESTORE_PRIVATE_KEY='fixture';
 const store=firestore.getProgressStore();
 const canonical=session(a).user.id,legacy='google:'+old.sub;
 const row={academy:'git',lesson_slug:'apa-itu-git',completed:true};
 await store.write(legacy,[row,{...row,lesson_slug:'undo'}]);
 await store.write(canonical,[{...row,lesson_slug:'undo',completed:false}]);
 await store.migrate(canonical,[legacy]);
 const rows=await store.read(canonical);
 assert.equal(rows.find(r=>r.lesson_slug==='apa-itu-git').completed,true);
 assert.equal(rows.find(r=>r.lesson_slug==='undo').completed,false,'migration cannot resurrect canonical unchecks');
 const before=reads;await store.migrate(canonical,[legacy]);assert.equal(reads,before,'completed migration must not rescan old lessons');
 assert.equal((await store.read(legacy)).length,2,'old remote progress is preserved');
 console.log('PASS: real encrypted legacy cookie, stable Google owner across two logins, account isolation, tamper rejection, client update rejection, Firestore migration and undo preservation');
})().catch(error=>{console.error(error);process.exitCode=1});
