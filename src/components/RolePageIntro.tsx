import { ArrowRight } from 'lucide-react';
import { buttonClass, panelClass } from './Phase1Shared';
export function RolePageIntro({title,description,steps}:{title:string;description:string;steps?:string[]}) {
  return <div className="space-y-4"><div><h1 className="text-2xl font-bold text-slate-800">{title}</h1><p className="mt-1 text-sm text-slate-500">{description}</p></div>{steps && <ol className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 md:grid-cols-3">{steps.map((step,index)=><li key={step} className="flex items-center gap-2 text-sm text-blue-800"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index+1}</span>{step}</li>)}</ol>}</div>;
}
export function TaskCard({title,description,action,onClick}:{title:string;description:string;action:string;onClick:()=>void}) {
  return <div className={`${panelClass} flex flex-col items-start gap-3 p-5`}><h2 className="font-bold text-slate-800">{title}</h2><p className="flex-1 text-sm leading-6 text-slate-500">{description}</p><button className={buttonClass} onClick={onClick}>{action}<ArrowRight size={15}/></button></div>;
}
