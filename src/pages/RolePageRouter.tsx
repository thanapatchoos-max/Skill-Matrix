import type { ReactElement } from 'react';
import type { ScoreAssessmentScope } from '../data/skillAssessment';
import { roleCanVisit } from '../data/roleNavigation';
import { EmptyState } from '../components/Phase1Shared';
import { StaffHomePage, StaffSkillsPage, StaffYearlyPage, StaffGuidePage } from './staff/StaffPages';
import StaffTrainingRequestPage from './staff/TrainingRequestPage';
import StaffTrainingTrackingPage from './staff/TrainingTrackingPage';
import StaffTrainingResultsPage from './staff/TrainingResultsPage';
import { ChiefHomePage, ChiefTeamSkillsPage, ChiefYearlyPage, ChiefJobSummaryPage, ChiefDirectoryPage, ChiefGuidePage } from './chief/ChiefPages';
import ChiefIndividualScoresPage from './chief/IndividualScoresPage';
import ChiefTrainingRequestsPage from './chief/TrainingRequestsPage';
import ChiefTrainingEvaluationPage from './chief/TrainingEvaluationPage';
import { ManagerHomePage, ManagerSkillApprovalsPage, ManagerIndividualScoresPage, ManagerSectionSkillsPage, ManagerYearlyPage, ManagerJobSummaryPage, ManagerDirectoryPage } from './manager/ManagerPages';
import IndividualAssessmentPage from './manager/IndividualAssessmentPage';
import SectionAssessmentPage from './manager/SectionAssessmentPage';
import ManagerTrainingApprovalsPage from './manager/TrainingApprovalsPage';
import { AdminHomePage, AdminEmployeesPage, AdminMasterDataPage, AdminDocumentsPage, AdminSkillAuditPage, AdminReportsPage, AdminSettingsPage, AdminPermissionsPage, AdminTrainingAuditPage } from './admin/AdminPages';

export default function RolePageRouter({page,role,onNavigate,assessmentScope}:{page:string;role:string;onNavigate:(page:string,scope?:ScoreAssessmentScope)=>void;assessmentScope?:ScoreAssessmentScope}) {
  if(!roleCanVisit(page,role)) return <EmptyState>หน้านี้ไม่อยู่ในพื้นที่ของบทบาทที่เลือก</EmptyState>;
  const pages:Record<string,ReactElement>={
    'staff-home':<StaffHomePage onNavigate={onNavigate}/>,
    'staff-my-skills':<StaffSkillsPage/>, 'staff-yearly':<StaffYearlyPage/>,
    'staff-training-request':<StaffTrainingRequestPage onNavigate={onNavigate}/>,
    'staff-training-tracking':<StaffTrainingTrackingPage onNavigate={onNavigate}/>,
    'staff-training-results':<StaffTrainingResultsPage/>, 'staff-wi-guide':<StaffGuidePage/>,
    'chief-home':<ChiefHomePage onNavigate={onNavigate}/>, 'chief-training-requests':<ChiefTrainingRequestsPage/>,
    'chief-training-evaluation':<ChiefTrainingEvaluationPage/>, 'chief-team-skills':<ChiefTeamSkillsPage/>,
    'chief-individual-scores':<ChiefIndividualScoresPage/>, 'chief-yearly':<ChiefYearlyPage/>,
    'chief-job-summary':<ChiefJobSummaryPage/>, 'chief-team-directory':<ChiefDirectoryPage/>, 'chief-wi-guide':<ChiefGuidePage/>,
    'manager-home':<ManagerHomePage onNavigate={onNavigate}/>, 'manager-skill-approvals':<ManagerSkillApprovalsPage/>,
    'manager-training-approvals':<ManagerTrainingApprovalsPage/>, 'manager-section-skills':<ManagerSectionSkillsPage/>,
    'manager-individual-scores':<ManagerIndividualScoresPage/>,
    'manager-assessment-individual':<IndividualAssessmentPage initialScope={assessmentScope}/>, 'manager-assessment-section':<SectionAssessmentPage initialScope={assessmentScope}/>,
    'manager-yearly':<ManagerYearlyPage/>, 'manager-job-summary':<ManagerJobSummaryPage/>,
    'manager-people-directory':<ManagerDirectoryPage/>,
    'admin-home':<AdminHomePage onNavigate={onNavigate}/>, 'admin-employees':<AdminEmployeesPage/>,
    'admin-master-data':<AdminMasterDataPage/>, 'admin-wi-management':<AdminDocumentsPage/>,
    'admin-skill-audit':<AdminSkillAuditPage/>, 'admin-training-audit':<AdminTrainingAuditPage/>,
    'admin-reports':<AdminReportsPage/>, 'admin-settings':<AdminSettingsPage onNavigate={onNavigate}/>,
    'admin-permissions':<AdminPermissionsPage/>,
  };
  return pages[page]??<EmptyState>ไม่พบหน้าที่เลือก</EmptyState>;
}
