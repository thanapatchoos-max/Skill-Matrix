import { ACTORS, bangkokYear, employeesForYear, visibleEmployees } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { RolePageIntro } from '../../components/RolePageIntro';
import ChiefDashboard from './ChiefDashboard';
import PeopleDirectory from '../../components/PeopleDirectory';
import PhaseOneMatrix from '../PhaseOneMatrix';
import YearlySkill from '../YearlySkill';
import JobSummary from '../JobSummary';
import { WILibrary } from '../WILibrary';
function useChiefTeam(){return visibleEmployees(employeesForYear(useSkillState(),bangkokYear()),'chief');}
export function ChiefHomePage({onNavigate}:{onNavigate:(page:string)=>void}) {
  return <ChiefDashboard onNavigate={onNavigate}/>;
}
export function ChiefTeamSkillsPage(){return <PhaseOneMatrix userRole="chief" title="ดูคะแนนรายแผนก"/>;}
export function ChiefYearlyPage(){return <YearlySkill userRole="chief" title="พัฒนาการของทีม"/>;}
export function ChiefJobSummaryPage(){return <JobSummary userRole="chief" title="สรุปความสามารถทีมตามงาน"/>;}
export function ChiefDirectoryPage(){const team=useChiefTeam();return <div className="space-y-5"><RolePageIntro title="รายชื่อพนักงานในทีม" description={`ข้อมูลพนักงานใน ${ACTORS.chief.department} สำหรับติดตามและประเมินความสามารถ`}/><PeopleDirectory employees={team}/></div>;}
export function ChiefGuidePage(){return <div className="space-y-5"><RolePageIntro title="คู่มือสำหรับหัวหน้างาน" description="มาตรฐาน W/I สำหรับตรวจและประเมินการปฏิบัติงานของทีม"/><WILibrary userRole="chief"/></div>;}
