import {auth,googleAuthConfigured} from '@/auth';
import {getProgressStore} from '@/lib/server/firestore-progress';
import {progressHandlers} from '@/lib/server/progress-handler';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const {GET,PUT}=progressHandlers(async()=>{
  if(!googleAuthConfigured())return null;
  const session=await auth();return session?.user?.id || null;
},()=>{
  const store=getProgressStore();
  if(!store)return null;
  return {...store,async read(owner:string){
    const session=await auth();
    if(session?.user?.id!==owner)throw new Error('unauthorized');
    await store.migrate?.(owner,session.legacyProgressIds||[]);
    return store.read(owner);
  }};
});
