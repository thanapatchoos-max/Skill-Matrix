import type { Content, Style, TableCell, TableCellProperties, TDocumentDefinitions } from 'pdfmake/interfaces';
import { individualAssessment, sectionAssessment } from '../data/skillAssessment';
import { employeeTeam } from '../data/teamScope';

type Individual = ReturnType<typeof individualAssessment>;
type Section = ReturnType<typeof sectionAssessment>;
const navy='#0a2540', blue='#2563eb', muted='#64748b', light='#f1f5f9';
const number=(value:number|null,digits=2)=>value===null?'-':value.toFixed(digits);
const dateLabel=(date:Date)=>new Intl.DateTimeFormat('th-TH',{timeZone:'Asia/Bangkok',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(date);
const thaiWords=new Intl.Segmenter('th',{granularity:'word'});
// Split long Thai runs at word boundaries without introducing unsupported font glyphs.
const wrapThai=(text:string)=>text.replace(/[\p{Script=Thai}\p{M}]{49,}/gu,run=>{
  const lines:string[]=[];let line='';
  for(const {segment} of thaiWords.segment(run)){if(line.length+segment.length>48&&line){lines.push(line);line='';}line+=segment;}
  if(line)lines.push(line);return lines.join('\n');
});
const cell=(text:string|number,extra:Style & TableCellProperties={}):TableCell=>({text:wrapThai(String(text)),...extra});
const heading=(text:string):Content=>({text,style:'section',margin:[0,16,0,8]});

function table(headers:string[],rows:TableCell[][],widths:(number|string)[],footer?:TableCell[],compact=false):Content {
  return {table:{headerRows:1,widths,body:[headers.map(text=>cell(text,{bold:true,color:'#ffffff',fillColor:navy,fontSize:9})),...rows,...(footer?[footer.map(item=>typeof item==='object'?{...item,bold:true,fillColor:'#eaf2ff',color:navy} as TableCell:cell(String(item),{bold:true,fillColor:'#eaf2ff',color:navy}))]:[])],dontBreakRows:true,keepWithHeaderRows:1},layout:{hLineWidth:()=>0.5,vLineWidth:()=>0,hLineColor:()=> '#e2e8f0',paddingLeft:()=>8,paddingRight:()=>8,paddingTop:()=>compact?4:7,paddingBottom:()=>compact?4:7,fillColor:(row)=>row>0&&row%2===0?'#f8fafc':null},fontSize:9};
}
function metric(label:string,value:string,note:string,compact=false):Content {
  return {stack:[{text:label,fontSize:compact?8:9,color:muted},{text:value,fontSize:compact?18:24,bold:true,color:navy,margin:[0,compact?2:4,0,compact?2:3]},{text:note,fontSize:compact?7:8,color:muted}],margin:compact?[8,6,8,6]:[10,10,10,10]};
}
function metrics(items:Content[],compact=false):Content {return {table:{widths:items.map(()=>'*'),body:[items]},layout:{hLineWidth:()=>0,vLineWidth:()=>4,vLineColor:()=> '#ffffff',fillColor:()=>light},margin:[0,compact?8:12,0,compact?8:12]};}
function sectionTitle(subtitle:string):Content[] {return [{columns:[{width:110,stack:[{text:'DAIHEN',fontSize:18,bold:true,color:navy},{text:'SKILL ASSESSMENT',fontSize:7,color:muted}]},{stack:[{text:'รายงานประเมินคะแนนรายแผนก',fontSize:17,bold:true,color:navy},{text:subtitle,fontSize:9,color:muted,margin:[0,4,0,0]}],alignment:'right'}]},{canvas:[{type:'line',x1:0,y1:0,x2:770,y2:0,lineWidth:1.5,lineColor:blue}],margin:[0,9,0,3]}];}
function reportTitle(title:string,subtitle:string,year:number):Content[] {
  return [{columns:[{text:'DAIHEN',fontSize:22,bold:true,color:navy},{text:`SKILL ASSESSMENT\nANNUAL REVIEW ${year}`,alignment:'right',fontSize:8,color:muted}],margin:[0,0,0,12]}, {canvas:[{type:'line',x1:0,y1:0,x2:180,y2:0,lineWidth:3,lineColor:blue}],margin:[0,0,0,14]}, {text:title,fontSize:20,bold:true,color:navy}, {text:subtitle,fontSize:10,color:muted,margin:[0,5,0,8]}];
}
function formula(section=false):Content {
  return {stack:[{text:'หลักการคำนวณ',bold:true,color:navy,fontSize:9},{text:`คะแนนรวม = ผลรวมระดับสกิลที่ยืนยันแล้ว${section?' · เฉลี่ยต่อคน = คะแนนรวม ÷ จำนวนพนักงาน':''}\nเฉลี่ยต่อสกิล = คะแนนรวม ÷ จำนวนสกิล (0–3) · สัดส่วนคะแนน = คะแนนรวม ÷ คะแนนเต็ม × 100`,fontSize:8,color:muted,margin:[0,3,0,0]}],margin:[0,12,0,0]};
}
function signOff(compact=false):Content {
  return {columns:[{text:compact?'ผู้จัดทำรายงาน ____________________  วันที่ ______________':'ผู้จัดทำรายงาน ____________________\nวันที่ ____________________',fontSize:compact?8:9,color:muted},{text:compact?'ผู้พิจารณา ____________________  วันที่ ______________':'ผู้พิจารณา ____________________\nวันที่ ____________________',fontSize:compact?8:9,color:muted,alignment:'right'}],margin:[0,compact?12:25,0,0],unbreakable:true};
}
function base(title:string,id:string,content:Content[],date:Date,landscape=false):TDocumentDefinitions {
  return {pageSize:'A4',pageOrientation:landscape?'landscape':'portrait',pageMargins:[36,36,36,48],defaultStyle:{font:'Sarabun',fontSize:10,color:'#334155',lineHeight:1.15},info:{title,author:'DAIHEN Skill Matrix',subject:'รายงานสรุปคะแนนที่ยืนยันแล้วเพื่อประกอบการประเมิน'},styles:{section:{bold:true,fontSize:12,color:navy}},content,header:(page)=>page>1?{columns:[{text:'DAIHEN · Skill Matrix',bold:true,color:navy},{text:id,alignment:'right',color:muted}],margin:[36,14,36,0],fontSize:8}:null,footer:(page,pages)=>({stack:[{canvas:[{type:'line',x1:0,y1:0,x2:landscape?770:523,y2:0,lineWidth:0.5,lineColor:'#cbd5e1'}]},{columns:[{text:`ข้อมูลสาธิต · ส่งออก ${dateLabel(date)}`,color:muted},{text:`${id} · หน้า ${page} / ${pages}`,alignment:'right',color:muted}],fontSize:8,margin:[0,6,0,0]}],margin:[36,0,36,0]})};
}

export function individualReport(result:Individual,year:number,date=new Date()):TDocumentDefinitions {
  const e=result.employee;const team=employeeTeam(e);
  const content:Content[]=[...reportTitle('รายงานประเมินคะแนนรายบุคคล',`ปีประเมิน ${year} · คะแนนสกิลที่ผู้จัดการยืนยันแล้ว`,year),
    {stack:[{text:wrapThai(e.name),bold:true,fontSize:16,color:navy},{text:wrapThai(`${e.id} · ${e.position}`),fontSize:10,color:muted,margin:[0,4,0,0]},{text:wrapThai(`แผนก ${e.department} · ${team?.name??'ไม่ระบุทีม'}`),fontSize:10,color:muted,margin:[0,3,0,0]}],margin:[0,10,0,6]},
    metrics([metric('ผลรวมคะแนนรายบุคคล',`${result.total} / ${result.maximum}`,`${result.rows.length} สกิล · ${result.jobs.length} งาน W/I`),metric('คะแนนเฉลี่ยต่อสกิล',number(result.averagePerSkill),'คะแนนระดับ 0–3'),metric('สัดส่วนคะแนนเต็ม',result.scorePercent===null?'—':`${number(result.scorePercent,1)}%`,'คะแนนรวม ÷ คะแนนเต็ม')]),
    heading('สรุปคะแนนตามประเภทสกิล'),
    table(['ประเภท','จำนวนสกิล','รวม / เต็ม','เฉลี่ย / สกิล'],result.types.map(t=>[cell(`Type ${t.type}`,{bold:true}),cell(t.count,{alignment:'right'}),cell(`${t.total} / ${t.maximum}`,{alignment:'right',bold:true,color:blue}),cell(number(t.averagePerSkill),{alignment:'right'})]),['*',70,90,85],[cell('รวม'),cell(result.rows.length,{alignment:'right'}),cell(`${result.total} / ${result.maximum}`,{alignment:'right'}),cell(number(result.averagePerSkill),{alignment:'right'})]),
    formula(),{text:'ระดับ 0 ยังทำไม่ได้ · ระดับ 1 ต้องมีผู้ดูแล · ระดับ 2 ทำงานเองได้ · ระดับ 3 ถ่ายทอด/ควบคุมงานได้',fontSize:8,color:muted,margin:[0,12,0,0]},
    {text:'ใช้ประกอบการพิจารณาความสามารถ ไม่ได้กำหนดเกณฑ์ผ่านหรือเปลี่ยนคะแนนจากรายงานนี้',fontSize:8,color:muted,margin:[0,7,0,0]},signOff(),
    {text:'รายละเอียดคะแนนตามงาน W/I',style:'section',pageBreak:'before',margin:[0,10,0,5]},
    {text:`${e.id} · ${e.name} · ${e.department} · ปี ${year}`,fontSize:9,color:muted,margin:[0,0,0,12]},
    table(['W/I / ชื่องาน',...result.types.map(type=>`Type ${type.type}`),'รวม / เต็ม'],result.jobs.map(job=>[cell(`${job.wiCode}\n${job.wiName}`,{fontSize:9}),...result.types.map(type=>{const row=job.skills.find(skill=>skill.type===type.type);return cell(row?.level??'-',{alignment:'center',bold:true,color:row?.level===3?'#059669':row?.level===2?blue:row?.level===1?'#b45309':muted});}),cell(`${job.total} / ${job.maximum}`,{alignment:'right',bold:true,color:blue})]),['*',...result.types.map(()=>35),60],[cell('รวมทุกงาน'),...result.types.map(type=>cell(type.total,{alignment:'center'})),cell(`${result.total} / ${result.maximum}`,{alignment:'right'})]),
    {text:'ตัวเลขในช่อง Type คือระดับสกิล 0-3 · เครื่องหมาย - หมายถึงประเภทที่ไม่เกี่ยวข้องกับงาน',fontSize:9,color:muted,margin:[0,12,0,0]},
    {text:'0 ยังทำไม่ได้ · 1 ต้องมีผู้ดูแล · 2 ทำงานเองได้ · 3 ถ่ายทอด / ควบคุมงานได้',fontSize:9,color:muted,margin:[0,5,0,0]},
    {text:`ผลรวมคะแนน ${result.total} / ${result.maximum} · เฉลี่ยต่อสกิล ${number(result.averagePerSkill)}`,bold:true,color:navy,margin:[0,14,0,0]},
  ];
  return base('ประเมินคะแนนรายบุคคล',`IND-${e.id}-${year}`,content,date);
}

export function sectionReport(result:Section,year:number,department:string,date=new Date()):TDocumentDefinitions {
  const scope=department==='ALL'?'ทุกแผนก':department;
  const content:Content[]=[...sectionTitle(`ปีประเมิน ${year} · ขอบเขต ${scope} · ${result.people.length} พนักงาน`),
    metrics([metric('ผลรวมคะแนนแผนกที่เลือก',`${result.total} / ${result.maximum}`,`${result.departments.length} แผนก · ${result.people.length} คน`,true),metric('คะแนนเฉลี่ยต่อคน',number(result.averagePerPerson),`${result.total} คะแนน ÷ ${result.people.length} คน`,true),metric('สัดส่วนคะแนนเต็ม',result.scorePercent===null?'—':`${number(result.scorePercent,1)}%`,'คะแนนรวม ÷ คะแนนเต็ม',true)],true),
  ];
  if(result.departments.length>1){
    content.push(heading('ภาพรวมคะแนนแต่ละแผนก'),table(['แผนก','พนักงาน','รวม / เต็ม','เฉลี่ย / คน','สัดส่วนคะแนน'],result.departments.map(group=>[cell(group.department,{bold:true}),cell(group.people,{alignment:'right'}),cell(`${group.total} / ${group.maximum}`,{alignment:'right',bold:true,color:blue}),cell(number(group.averagePerPerson),{alignment:'right'}),cell(`${number(group.scorePercent,1)}%`,{alignment:'right'})]),['*',65,100,100,95],[cell('รวมทุกแผนก'),cell(result.people.length,{alignment:'right'}),cell(`${result.total} / ${result.maximum}`,{alignment:'right'}),cell(number(result.averagePerPerson),{alignment:'right'}),cell(`${number(result.scorePercent,1)}%`,{alignment:'right'})]),formula(true),{text:'จำนวน W/I และสกิลของแต่ละแผนกอาจต่างกัน ควรอ่านคะแนนรวมคู่กับคะแนนเต็มและสัดส่วนคะแนน',fontSize:9,color:muted,margin:[0,12,0,0]},signOff(true));
  }
  for(const group of result.departments){
    const types=group.types.map(t=>t.type);
    if(result.departments.length>1)content.push({text:`${group.department} · รายชื่อและคะแนนพนักงาน`,style:'section',pageBreak:'before',margin:[0,14,0,5]},
      {text:`${group.people} คน · ผลรวม ${group.total} / ${group.maximum} คะแนน · เฉลี่ย ${number(group.averagePerPerson)} คะแนนต่อคน`,fontSize:10,color:muted,margin:[0,0,0,12]});
    content.push(
      table(['พนักงาน / ทีม',...types.map(type=>`Type ${type}`),'รวม / เต็ม','เฉลี่ย / สกิล','สัดส่วนคะแนน'],group.members.map(person=>[cell(`${person.employee.name}\n${person.employee.id} · ${employeeTeam(person.employee)?.name??'ไม่ระบุทีม'}`,{fontSize:9}),...types.map(type=>cell(person.types.find(t=>t.type===type)?.total??'—',{alignment:'right'})),cell(`${person.total} / ${person.maximum}`,{alignment:'right',bold:true,color:blue}),cell(number(person.averagePerSkill),{alignment:'right'}),cell(`${number(person.scorePercent,1)}%`,{alignment:'right'})]),['*',...types.map(()=>42),85,80,80],[cell(`รวม ${group.people} คน`),...group.types.map(t=>cell(t.total,{alignment:'right'})),cell(`${group.total} / ${group.maximum}`,{alignment:'right'}),cell(number(group.averagePerSkill),{alignment:'right'}),cell(`${number(group.scorePercent,1)}%`,{alignment:'right'})],true),
      {text:`คะแนนเฉลี่ยต่อคนของแผนก = ${group.total} ÷ ${group.people} = ${number(group.averagePerPerson)} คะแนน/คน`,fontSize:9,bold:true,color:navy,margin:[0,8,0,0]},
      {text:'เฉลี่ยต่อสกิล = คะแนนรวม ÷ จำนวนสกิล (0–3) · สัดส่วนคะแนน = คะแนนรวม ÷ คะแนนเต็ม × 100',fontSize:8,color:muted,margin:[0,3,0,0]},signOff(true));
  }
  return base('ประเมินคะแนนรายแผนก',`SEC-${department==='ALL'?'ALL':department.replaceAll(' ','-')}-${year}`,content,date,true);
}
