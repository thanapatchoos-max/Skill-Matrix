import { useSyncExternalStore } from 'react';
import { requestTraining, reviewTrainingRequest, evaluateTraining, certifyTraining } from './trainingCore';
import type { TrainingRequest } from './trainingCore';
import { DEMO_REVISION, populateTrainingDemo, trainingDemo } from './demoData';

const LEGACY_KEY='daihen.training.role-pages.v1';
const KEY='daihen.training.role-pages.v2';
const listeners=new Set<()=>void>();
function read(): TrainingRequest[] {
  try {
    const text=localStorage.getItem(KEY);
    if(text) {
      const data=JSON.parse(text);
      if(!Array.isArray(data.records)) throw new Error();
      if(data.demoRevision !== DEMO_REVISION) {
        const migrated = populateTrainingDemo(data.records);
        localStorage.setItem(KEY, JSON.stringify({ demoRevision: DEMO_REVISION, records: migrated }));
        return migrated;
      }
      return data.records;
    }
    const legacy=localStorage.getItem(LEGACY_KEY);
    const saved=legacy?JSON.parse(legacy):null;
    if(saved && !Array.isArray(saved)) throw new Error();
    const records=saved?populateTrainingDemo(saved):trainingDemo();
    localStorage.setItem(KEY,JSON.stringify({demoRevision:DEMO_REVISION,records}));
    return records;
  }
  catch {
    try {
      const fallback = trainingDemo();
      localStorage.setItem(KEY, JSON.stringify({ demoRevision: DEMO_REVISION, records: fallback }));
      return fallback;
    } catch {
      throw new Error('อ่านข้อมูลฝึกอบรมไม่ได้ กรุณาตรวจสอบข้อมูลในเบราว์เซอร์');
    }
  }
}
let error='';
let records:TrainingRequest[]=[];
try { records=read(); } catch(e) { error=(e as Error).message; }
function update(action:(current:TrainingRequest[])=>TrainingRequest[]) {
  if(error) throw new Error(error);
  const next=action(localStorage.getItem(KEY) ? read() : records);
  try {localStorage.setItem(KEY,JSON.stringify({demoRevision:DEMO_REVISION,records:next}));} catch {throw new Error('บันทึกข้อมูลฝึกอบรมไม่ได้ กรุณาตรวจสอบพื้นที่จัดเก็บ');}
  records=next; listeners.forEach(listener=>listener());
}
window.addEventListener('storage',event=>{if(event.key===KEY || event.key===LEGACY_KEY || event.key===null){try{records=read();error='';}catch(e){error=(e as Error).message;}listeners.forEach(listener=>listener());}});
export function useTrainingRequests() {return useSyncExternalStore(listener=>{listeners.add(listener);return()=>{listeners.delete(listener);};},()=>records,()=>records);}
export function trainingStorageError() {return error;}
export const submitTraining=(form:Parameters<typeof requestTraining>[2])=>update(current=>requestTraining(current,'staff',form));
export const decideTrainingRequest=(id:string,approve:boolean,date:string,remark:string)=>update(current=>reviewTrainingRequest(current,'chief',id,approve,date,remark));
export const scoreTraining=(id:string,theory:number,practical:number,note:string)=>update(current=>evaluateTraining(current,'chief',id,theory,practical,note));
export const approveTrainingResult=(id:string,approve:boolean,remark:string)=>update(current=>certifyTraining(current,'manager',id,approve,remark));
export function resetTrainingDemoState() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
  const fresh = trainingDemo();
  localStorage.setItem(KEY, JSON.stringify({ demoRevision: DEMO_REVISION, records: fresh }));
  records = fresh;
  error = '';
  listeners.forEach(listener => listener());
}

