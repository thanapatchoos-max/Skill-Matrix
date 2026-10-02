export type OjtStatus = 
  | 'REQUESTED' 
  | 'ACCEPTED_BY_CHIEF' 
  | 'SCORED' 
  | 'SUBMITTED_TO_MANAGER' 
  | 'APPROVED' 
  | 'REJECTED';

export interface OjtWorkflowRecord {
  id: string;
  requestDate: string;
  employeeId: string;
  employeeName: string;
  department: string;
  wiCode: string;
  wiName: string;
  skillType: string;
  
  // Chief Approval
  chiefId?: string;
  chiefName?: string;
  acceptedDate?: string;

  // Exam Results
  examDate?: string;
  theoryScore?: number;
  practicalScore?: number;
  examResult?: 'passed' | 'failed';

  // Manager Approval
  managerId?: string;
  managerName?: string;
  approvalDate?: string;
  managerRemark?: string;

  status: OjtStatus;
}

// Initial mock data with some examples
export const OJT_WORKFLOW_DB: OjtWorkflowRecord[] = [
  {
    id: 'REQ-001',
    requestDate: '2026-10-01',
    employeeId: 'EMP001',
    employeeName: 'นายสมชาย ใจดี',
    department: 'QC Section',
    wiCode: 'QCW002-001',
    wiName: 'การตรวจสอบรอยเชื่อมและจุดยึดโครงสร้างหม้อแปลง',
    skillType: 'C',
    status: 'REQUESTED'
  }
];

export const addOjtRequest = (record: OjtWorkflowRecord) => {
  OJT_WORKFLOW_DB.unshift(record);
};

export const updateOjtRequest = (id: string, updates: Partial<OjtWorkflowRecord>) => {
  const idx = OJT_WORKFLOW_DB.findIndex(r => r.id === id);
  if (idx !== -1) {
    OJT_WORKFLOW_DB[idx] = { ...OJT_WORKFLOW_DB[idx], ...updates };
  }
};
