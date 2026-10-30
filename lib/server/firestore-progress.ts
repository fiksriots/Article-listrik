import 'server-only';
import {createHash} from 'node:crypto';
import {Firestore, FieldValue} from '@google-cloud/firestore';
import {validRow, type ProgressStore} from './progress-handler';
let database: Firestore|undefined;
export function getProgressStore(): ProgressStore|null {
  const projectId=process.env.FIRESTORE_PROJECT_ID;
  const clientEmail=process.env.FIRESTORE_CLIENT_EMAIL;
  const privateKey=process.env.FIRESTORE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) return null;
  database ??= new Firestore({projectId,credentials:{client_email:clientEmail,private_key:privateKey.replace(/\\n/g,'\n')},preferRest:true});
  const db=database;
  const collection=(owner:string)=>db.collection('education_progress').doc(createHash('sha256').update(owner).digest('hex')).collection('lessons');
  return {
    async migrate(owner,legacyOwners) {
      for(const oldOwner of legacyOwners){
        if(oldOwner===owner)continue;
        const marker=collection(owner).parent!.collection('migrations').doc(createHash('sha256').update(oldOwner).digest('hex'));
        if((await marker.get()).exists)continue;
        const old=await collection(oldOwner).get();
        const rows=old.docs.map(doc=>{const {academy,lesson_slug,completed}=doc.data();return {academy,lesson_slug,completed};}).filter(validRow);
        // Never overwrite a canonical record, including an explicit uncheck.
        for(let offset=0;offset<rows.length;offset+=400){
          const batch=rows.slice(offset,offset+400);
          await db.runTransaction(async transaction=>{
            const targets=batch.map(row=>collection(owner).doc(row.academy+'--'+row.lesson_slug));
            const current=await transaction.getAll(...targets);
            current.forEach((doc,index)=>{if(!doc.exists)transaction.create(targets[index],{...batch[index],updated_at:FieldValue.serverTimestamp()});});
          });
        }
        await marker.set({completed_at:FieldValue.serverTimestamp()});
      }
    },
    async read(owner) {
      const snapshot=await collection(owner).get();
      return snapshot.docs.map(doc=>{const {academy,lesson_slug,completed}=doc.data();return {academy,lesson_slug,completed};}).filter(validRow);
    },
    async write(owner,rows) {
      if (!rows.length) return;
      const batch=db.batch();
      for (const row of rows) batch.set(collection(owner).doc(row.academy+'--'+row.lesson_slug),{...row,updated_at:FieldValue.serverTimestamp()});
      await batch.commit();
    },
  };
}
