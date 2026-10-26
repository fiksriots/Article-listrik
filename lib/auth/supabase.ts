'use client';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {accountFetch} from './errors';
let client:SupabaseClient|null=null;
export function getSupabase(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return null;
 if(!client)client=createClient(url,key,{global:{fetch:accountFetch},auth:{storageKey:'fiks-education-auth-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return client;
}
