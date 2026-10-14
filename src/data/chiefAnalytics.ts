import { ACTORS, bangkokYear, visibleEmployees } from './phase1Core';
import type { SkillState } from './phase1Core';
import { managerAnalytics } from './managerAnalytics';
import { bangkokDate } from './trainingCore';
import type { TrainingRequest } from './trainingCore';

export function chiefAnalytics(state: SkillState, training: TrainingRequest[], now = new Date()) {
  const scopedState = { ...state, snapshots: state.snapshots.map(snapshot => ({ ...snapshot, employees: visibleEmployees(snapshot.employees,'chief') })) };
  const data = managerAnalytics(scopedState, training, { year: bangkokYear(now), department: ACTORS.chief.department, onDuty: true });
  const today = bangkokDate(now);
  const requests = training.filter(r => r.department === ACTORS.chief.department && data.employees.some(employee=>employee.id===r.employeeId));
  const people = data.assessment.people.map(person => ({
    id: person.employee.id, name: person.employee.name.replace(/^(นาย|นางสาว|นาง)/, ''),
    needsTraining: person.rows.filter(r => r.level < 2).length,
    independent: person.rows.filter(r => r.level === 2).length,
    trainers: person.rows.filter(r => r.level === 3).length,
  })).sort((a, b) => b.needsTraining - a.needsTraining);
  const awaitingReview = requests.filter(r => r.status === 'requested');
  const readyToEvaluate = requests.filter(r => r.status === 'scheduled' && !!r.scheduledDate && r.scheduledDate <= today);
  const upcoming = requests.filter(r => r.status === 'scheduled' && !!r.scheduledDate && r.scheduledDate > today);
  const followUp = requests.filter(r => ['failed', 'rejected-manager'].includes(r.status));
  const stages = [
    { stage: 'รอตรวจคำขอ', count: awaitingReview.length, color: '#f59e0b', page: 'chief-training-requests' },
    { stage: 'ถึงวัน / รอประเมิน', count: readyToEvaluate.length, color: '#ef4444', page: 'chief-training-evaluation' },
    { stage: 'นัดอบรมล่วงหน้า', count: upcoming.length, color: '#38bdf8', page: 'chief-training-evaluation' },
    { stage: 'รอรับรองผล', count: requests.filter(r => r.status === 'pending-manager').length, color: '#6366f1', page: 'chief-yearly' },
    { stage: 'รับรองแล้ว', count: requests.filter(r => r.status === 'approved').length, color: '#10b981', page: 'chief-yearly' },
    { stage: 'ควรทบทวนผล', count: followUp.length, color: '#f97316', page: 'chief-individual-scores' },
  ];
  const coverage = data.risk.slice(0, 6).map(row => ({ ...row, label: `${row.wiCode} · ${row.type}`, assigned: row.people }));
  const waiting = [...readyToEvaluate, ...awaitingReview, ...upcoming].slice(0, 6);
  return { ...data, people, stages, coverage, waiting, awaitingReview, readyToEvaluate, upcoming, followUp };
}
