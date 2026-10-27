import {auth,googleAuthConfigured} from '@/auth';
import {getProgressStore} from '@/lib/server/firestore-progress';
import {progressHandlers} from '@/lib/server/progress-handler';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const {GET,PUT}=progressHandlers(async()=>{
  if(!googleAuthConfigured())return null;
  const session=await auth();return session?.user?.id || null;
},getProgressStore,['https://fikss.id']);
