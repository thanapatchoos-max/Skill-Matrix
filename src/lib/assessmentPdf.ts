import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { assessmentFonts } from './assessmentFonts';

export async function createAssessmentPdf(definition:TDocumentDefinitions):Promise<Blob>{
  const {default:pdfMake}=await import('pdfmake/build/pdfmake');
  const fonts={Sarabun:{normal:'Sarabun-Regular.ttf',bold:'Sarabun-Bold.ttf',italics:'Sarabun-Regular.ttf',bolditalics:'Sarabun-Bold.ttf'}};
  // The synchronous stream API surfaces layout/font errors to the caller instead
  // of leaving pdfmake's callback promise pending indefinitely.
  const stream=pdfMake.createPdf(definition,undefined,fonts,assessmentFonts).getStream();
  return new Promise<Blob>((resolve,reject)=>{
    const chunks:Uint8Array<ArrayBuffer>[]=[];
    stream.on('data',(chunk:Uint8Array)=>chunks.push(new Uint8Array(chunk)));
    stream.on('error',reject);
    stream.on('end',()=>resolve(new Blob(chunks,{type:'application/pdf'})));
    stream.end();
  });
}
export async function downloadAssessmentPdf(filename:string,definition:TDocumentDefinitions){
  const blob=await createAssessmentPdf(definition);
  const url=URL.createObjectURL(blob);const link=document.createElement('a');
  link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
}
