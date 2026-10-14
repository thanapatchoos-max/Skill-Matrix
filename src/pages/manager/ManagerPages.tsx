import { bangkokYear, employeesForYear } from '../../data/phase1Core';
import { useSkillState } from '../../data/phase1Store';
import { RolePageIntro } from '../../components/RolePageIntro';
import PeopleDirectory from '../../components/PeopleDirectory';
import PhaseOneMatrix from '../PhaseOneMatrix';
import YearlySkill from '../YearlySkill';
import JobSummary from '../JobSummary';
import SkillApprovals from '../SkillApprovals';
import ExecutiveDashboard from './ExecutiveDashboard';
import { WILibrary } from '../WILibrary';
export function ManagerHomePage({onNavigate}:{onNavigate:(page:string)=>void}) {return <ExecutiveDashboard onNavigate={onNavigate}/>;}
export function ManagerSkillApprovalsPage(){return <SkillApprovals userRole="manager" title="ยืนยันการแก้ไขคะแนน"/>;}
export function ManagerIndividualScoresPage(){return <PhaseOneMatrix userRole="manager" individual title="ดูคะแนนรายบุคคล"/>;}
export function ManagerSectionSkillsPage(){return <PhaseOneMatrix userRole="manager" title="ดูคะแนนรายแผนก"/>;}
export function ManagerYearlyPage(){return <YearlySkill userRole="manager" title="แนวโน้มทักษะรายแผนก"/>;}
export function ManagerJobSummaryPage(){return <JobSummary userRole="manager" title="รายงานความสามารถตามงาน"/>;}
export function ManagerDirectoryPage(){const employees=employeesForYear(useSkillState(),bangkokYear());return <div className="space-y-5"><RolePageIntro title="ข้อมูลบุคลากรประกอบการพิจารณา" description="ข้อมูลบุคลากรสำหรับตรวจผลประเมินและวางแผนพัฒนา"/><PeopleDirectory employees={employees}/></div>;}
export function ManagerReferencePage(){return <div className="space-y-5"><RolePageIntro title="เอกสารประกอบการพิจารณา" description="มาตรฐาน W/I สำหรับทบทวนผลการประเมินและข้อเสนอคะแนน"/><WILibrary userRole="manager"/></div>;}
