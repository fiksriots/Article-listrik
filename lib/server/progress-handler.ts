export type ProgressRow = {academy: 'listrik'|'jaringan'|'iot'|'git'|'programming'; lesson_slug: string; completed: boolean};
export type ProgressStore = {migrate?: (owner:string,legacyOwners:string[])=>Promise<void>; read: (owner: string)=>Promise<ProgressRow[]>; write: (owner: string, rows: ProgressRow[])=>Promise<void>};
export function validRow(value: unknown): value is ProgressRow {
  if (!value || typeof value !== 'object') return false;
  const row=value as Record<string,unknown>;
  return Object.keys(row).sort().join(',')==='academy,completed,lesson_slug' &&
    ['listrik','jaringan','iot','git','programming'].includes(String(row.academy)) && typeof row.lesson_slug==='string' &&
    row.lesson_slug.length<=150 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.lesson_slug) && typeof row.completed==='boolean';
}
export function progressHandlers(getOwner: ()=>Promise<string|null>, getStore: ()=>ProgressStore|null) {
  const json=(body: unknown, status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
  return {
    async GET() {
      try {
        const owner=await getOwner(); if (!owner) return json({error:'unauthorized'},401);
        const store=getStore(); if (!store) return json({error:'not_configured'},503);
        return json({rows:await store.read(owner)});
      } catch {return json({error:'storage_unavailable'},503);}
    },
    async PUT(request: Request) {
      // Cookie authentication requires a same-origin mutation, even when cookies are SameSite=Lax.
      if (request.headers.get('origin')!==new URL(request.url).origin) return json({error:'invalid_origin'},403);
      try {
        const owner=await getOwner(); if (!owner) return json({error:'unauthorized'},401);
        if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error:'invalid_content_type'},415);
        if (Number(request.headers.get('content-length'))>100000) return json({error:'too_large'},413);
        const text=await request.text();if(text.length>100000)return json({error:'too_large'},413);
        let body;try {body=JSON.parse(text);}catch{return json({error:'invalid_json'},400);}
        if (!body || Object.keys(body).join(',')!=='rows' || !Array.isArray(body.rows) || body.rows.length>400 || !body.rows.every(validRow)) return json({error:'invalid_rows'},400);
        if (new Set(body.rows.map((r:ProgressRow)=>r.academy+'/'+r.lesson_slug)).size!==body.rows.length) return json({error:'duplicate_rows'},400);
        const store=getStore();if(!store)return json({error:'not_configured'},503);
        await store.write(owner,body.rows);return json({ok:true});
      } catch {return json({error:'storage_unavailable'},503);}
    },
  };
}
