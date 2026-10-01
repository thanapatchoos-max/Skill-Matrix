export const skillsMaster = [
  { id: 'QCW001-001', name: 'Circuit Assembly', department: 'QC' },
  { id: 'QCW001-002', name: 'Operator Line 2', department: 'QC' },
  { id: 'QCW002-001', name: 'Reporting', department: 'QC' },
  { id: 'QCW002-002', name: 'Data & Analysis', department: 'QC' },
];

export const skillTypesMaster = [
  { id: 'A', name: 'Circuit Connecting' },
  { id: 'B', name: 'Operator' },
  { id: 'C', name: 'Report' },
  { id: 'D', name: 'Analyze' },
];

export const employees = [
  { id: 'EMP001', initials: 'SC', name: 'Somchai Chaiyo', position: 'Senior Technician', department: 'QC' },
  { id: 'EMP002', initials: 'AK', name: 'Arunee Kittipong', position: 'Quality Engineer', department: 'QC' },
  { id: 'EMP003', initials: 'KP', name: 'Krit Phonsri', position: 'Technician', department: 'QC' },
  { id: 'EMP004', initials: 'NL', name: 'Narin Lertchai', position: 'Junior Engineer', department: 'QC' },
];

export const approvalRequests = [
  { id: 1, empName: 'Narin Lertchai', empId: 'EMP004', wi: 'QCW001-001', type: 'A', fromLevel: 0, toLevel: 1, reason: 'Passed Basic OJT Training (Oct 2026)', status: 'Pending', date: '2026-10-15' },
  { id: 2, empName: 'Krit Phonsri', empId: 'EMP003', wi: 'QCW002-002', type: 'D', fromLevel: 1, toLevel: 2, reason: 'Completed 20 Jobs independently with 0% Rework', status: 'Pending', date: '2026-10-18' },
];
