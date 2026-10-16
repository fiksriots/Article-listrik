'use client';
import {readDone,saveDone} from '@/lib/auth/progress-store';
export function readCompleted(slug:string){return readDone('listrik',slug);}
export function saveCompleted(slug:string,done:boolean){return saveDone('listrik',slug,done);}
