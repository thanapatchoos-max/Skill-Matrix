import { useSyncExternalStore } from 'react';
import { initialState, proposeAdjustment, reviewAdjustment, saveEmployeeProfile } from './phase1Core';
import type { Employee, Role, SkillState } from './phase1Core';
import { populateSkillDemo } from './demoData';

const KEY = 'daihen.skill-matrix.phase1.v1';
const listeners = new Set<() => void>();
let storageError = '';
function readState(): SkillState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const populated = populateSkillDemo(initialState());
      localStorage.setItem(KEY, JSON.stringify(populated));
      return populated;
    }
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1 || !Array.isArray(parsed.snapshots) || !Array.isArray(parsed.adjustments))
      throw new Error('Invalid saved state');
    const populated = populateSkillDemo(parsed);
    if (populated !== parsed) localStorage.setItem(KEY, JSON.stringify(populated));
    return populated;
  } catch {
    storageError = 'ไม่สามารถอ่านข้อมูลที่บันทึกได้ กรุณาตรวจสอบพื้นที่จัดเก็บของเบราว์เซอร์';
    return initialState();
  }
}
let state = readState();
function persist(next: SkillState) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); }
  catch { throw new Error('บันทึกไม่สำเร็จ กรุณาตรวจสอบพื้นที่จัดเก็บของเบราว์เซอร์แล้วลองใหม่'); }
  state = next;
  storageError = '';
  listeners.forEach(listener => listener());
}
function refresh() {
  state = readState();
  listeners.forEach(listener => listener());
}
window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) refresh(); });
export function useSkillState() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => state, () => state);
}
export function getStorageError() { return storageError; }
export function submitSkillAdjustment(role: Role, employeeId: string, proposed: Record<string, number>, reason: string, evidence: string) {
  if (storageError) throw new Error(storageError);
  const latest = readState();
  if (storageError) throw new Error(storageError);
  persist(proposeAdjustment(latest, role, employeeId, proposed, reason, evidence));
}
export function decideSkillAdjustment(role: Role, id: string, decision: 'approved' | 'rejected', remark: string) {
  if (storageError) throw new Error(storageError);
  const latest = readState();
  if (storageError) throw new Error(storageError);
  persist(reviewAdjustment(latest, role, id, decision, remark));
}
export function saveSkillEmployee(role: Role, profile: Pick<Employee, 'id' | 'name' | 'position' | 'department'> & { assignedSkills: string[] }) {
  if (storageError) throw new Error(storageError);
  const latest=readState();
  if (storageError) throw new Error(storageError);
  persist(saveEmployeeProfile(latest,role,profile));
}
