import { FilterBar } from '../components/FilterBar';
import { useState } from 'react';
import { CheckSquare, Check, X, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { bangkokYear, employeesForYear } from '../data/phase1Core';
import type { SkillLevel, Adjustment, SkillChange } from '../data/phase1Core';
import { decideSkillAdjustment, useSkillState } from '../data/phase1Store';
import { buttonClass, EmptyState, Field, inputClass, LevelBadge, panelClass } from '../components/Phase1Shared';
import { formatDate, skillLabel } from '../lib/phase1Format';
import { Avatar } from '../components/Avatar';

export default function SkillApprovals({ userRole, title = 'อนุมัติการปรับคะแนนสกิล' }: { userRole: string; title?: string }) {
  const state = useSkillState();
  const [status, setStatus] = useState(userRole === 'admin' ? 'ALL' : 'pending');
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  // Track Manager's customized scores before approving: { [adjustmentId]: { [skillKey]: SkillLevel } }
  const [adjustedScores, setAdjustedScores] = useState<Record<string, Record<string, SkillLevel>>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (userRole !== 'manager' && userRole !== 'admin') {
    return <EmptyState>หน้านี้สำหรับผู้จัดการและผู้ดูแลระบบ</EmptyState>;
  }

  const requests = state.adjustments.filter(a => status === 'ALL' || a.status === status).slice().reverse();
  const employees = employeesForYear(state, bangkokYear());

  function getEffectiveScore(adjId: string, change: SkillChange): SkillLevel {
    return adjustedScores[adjId]?.[change.key] ?? change.after;
  }

  function handleScoreChange(adjId: string, skillKey: string, score: SkillLevel) {
    setAdjustedScores(prev => ({
      ...prev,
      [adjId]: {
        ...(prev[adjId] ?? {}),
        [skillKey]: score,
      },
    }));
  }

  function countModifications(adjustment: Adjustment): number {
    return adjustment.changes.filter(c => {
      const effective = getEffectiveScore(adjustment.id, c);
      const proposed = c.proposedAfter !== undefined ? c.proposedAfter : c.after;
      return effective !== proposed;
    }).length;
  }

  function decide(id: string, decision: 'approved' | 'rejected') {
    setError('');
    setMessage('');
    try {
      const adj = requests.find(r => r.id === id);
      let managerScores: Record<string, SkillLevel> | undefined = undefined;

      if (decision === 'approved' && adj) {
        managerScores = {};
        adj.changes.forEach(c => {
          managerScores![c.key] = getEffectiveScore(id, c);
        });
      }

      decideSkillAdjustment('manager', id, decision, remarks[id] ?? '', managerScores);
      setMessage(
        decision === 'approved'
          ? 'อนุมัติแล้ว คะแนนใน Skill Matrix, Yearly Skill และ Job Summary อัปเดตแล้ว'
          : 'ไม่อนุมัติคำขอ คะแนนเดิมยังคงอยู่'
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <CheckSquare />
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ตรวจสอบระดับที่หัวหน้างานเสนอ สามารถปรับแก้คะแนน 0–3 ได้โดยตรงก่อนกดยืนยันอนุมัติ
          </p>
        </div>
      </div>

      <FilterBar title="ตัวกรองคำขอปรับคะแนน" onReset={() => setStatus(userRole === 'admin' ? 'ALL' : 'pending')}>
        <Field label="สถานะคำขอ">
          <select className={inputClass} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="pending">รออนุมัติ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="rejected">ไม่อนุมัติ</option>
            <option value="ALL">ทั้งหมด</option>
          </select>
        </Field>
      </FilterBar>

      {userRole === 'admin' && (
        <p className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          ผู้ดูแลระบบดูรายการได้ ผู้จัดการเป็นผู้อนุมัติและปรับแก้คะแนน
        </p>
      )}

      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-50 p-4 text-emerald-800">{message}</p>}

      {!requests.length ? (
        <EmptyState>ไม่มีคำขอในสถานะที่เลือก</EmptyState>
      ) : (
        requests.map(a => {
          const targetEmployee = employees.find(e => e.id === a.employeeId);
          const targetName = targetEmployee?.name ?? a.employeeId;
          const isPending = a.status === 'pending';
          const canEdit = isPending && userRole === 'manager';
          const modCount = isPending ? countModifications(a) : 0;

          return (
            <article key={a.id} className={`${panelClass} p-6 space-y-4`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar src={targetEmployee?.avatarUrl} name={targetName} size="md" />
                  <div>
                    <h2 className="font-bold text-slate-800">{targetName}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {a.employeeId} · ปี {a.year} · ผู้เสนอ {a.submittedName} · {formatDate(a.submittedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      a.status === 'pending'
                        ? 'bg-blue-100 text-blue-800'
                        : a.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {a.status === 'pending' ? 'รออนุมัติ' : a.status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}
                  </span>
                </div>
              </div>

              {/* Table with separated columns: 'คะแนนที่หัวหน้าเสนอมา' and 'คะแนนสุดท้ายที่ Manager อนุมัติ' */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase">
                    <tr>
                      <th className="p-3">W/I – ประเภท</th>
                      <th className="p-3 text-center">คะแนนก่อนปรับ</th>
                      <th className="p-3 text-center bg-blue-50/60 text-blue-900 border-x border-slate-200">
                        คะแนนที่หัวหน้าเสนอมา
                      </th>
                      <th className="p-3 text-center bg-emerald-50/60 text-emerald-900">
                        คะแนนสุดท้ายที่ Manager อนุมัติ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {a.changes.map(c => {
                      const proposedScore = c.proposedAfter !== undefined ? c.proposedAfter : c.after;
                      const currentScore = getEffectiveScore(a.id, c);
                      const isModified = currentScore !== proposedScore;

                      return (
                        <tr key={c.key} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3 font-mono font-medium text-slate-800">
                            {skillLabel(c.key)}
                          </td>
                          <td className="p-3 text-center">
                            <LevelBadge level={c.before} />
                          </td>
                          <td className="p-3 text-center bg-blue-50/30 border-x border-slate-200">
                            <LevelBadge level={proposedScore} />
                          </td>
                          <td className="p-3 text-center bg-emerald-50/30">
                            {canEdit ? (
                              <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                                {([0, 1, 2, 3] as SkillLevel[]).map(lvl => {
                                  const isSelected = currentScore === lvl;
                                  const isOrig = proposedScore === lvl;

                                  let activeClasses = 'bg-slate-700 text-white';
                                  if (lvl === 3) activeClasses = 'bg-emerald-600 text-white ring-2 ring-emerald-300';
                                  else if (lvl === 2) activeClasses = 'bg-blue-600 text-white ring-2 ring-blue-300';
                                  else if (lvl === 1) activeClasses = 'bg-amber-600 text-white ring-2 ring-amber-300';

                                  return (
                                    <button
                                      key={lvl}
                                      type="button"
                                      onClick={() => handleScoreChange(a.id, c.key, lvl)}
                                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                        isSelected
                                          ? `${activeClasses} shadow-xs`
                                          : 'text-slate-600 hover:bg-slate-100'
                                      }`}
                                      title={isOrig ? `Level ${lvl} (หัวหน้าเสนอ)` : `ปรับแก้เป็น Level ${lvl}`}
                                    >
                                      {lvl}
                                    </button>
                                  );
                                })}
                                {isModified && (
                                  <span className="ml-1.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 shrink-0">
                                    แก้จาก L{proposedScore}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center gap-2">
                                <LevelBadge level={c.after} />
                                {c.proposedAfter !== undefined && c.proposedAfter !== c.after && (
                                  <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                    ปรับจาก L{c.proposedAfter}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Notification if manager modified scores before approval */}
              {canEdit && modCount > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                  <SlidersHorizontal size={15} className="shrink-0 text-amber-600" />
                  <span>
                    มีการปรับเปลี่ยนคะแนน <strong>{modCount} ทักษะ</strong> จากที่หัวหน้าเสนอมา (คะแนนนี้จะถูกบันทึกจริงเมื่อกดปุ่มอนุมัติ)
                  </span>
                </div>
              )}

              <div className="space-y-1 text-xs text-slate-600">
                <p><strong>เหตุผล:</strong> {a.reason}</p>
                <p><strong>หลักฐานอ้างอิง:</strong> {a.evidence || 'ไม่ได้ระบุ'}</p>
              </div>

              {a.status === 'pending' && userRole === 'manager' ? (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <Field label="ความเห็นผู้จัดการ (จำเป็นเมื่อไม่อนุมัติ)">
                    <textarea
                      className={inputClass}
                      rows={2}
                      maxLength={2000}
                      value={remarks[a.id] ?? ''}
                      onChange={e => setRemarks({ ...remarks, [a.id]: e.target.value })}
                      placeholder="ระบุข้อเสนอแนะ หรือเหตุผลในการปรับแก้/ไม่อนุมัติคะแนน..."
                    />
                  </Field>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => decide(a.id, 'rejected')}
                      className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                      ไม่อนุมัติ
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(a.id, 'approved')}
                      className={buttonClass}
                    >
                      <Check size={16} />
                      {modCount > 0 ? `อนุมัติคะแนน (บันทึก ${modCount} รายการที่ปรับแก้)` : 'อนุมัติคะแนน'}
                    </button>
                  </div>
                </div>
              ) : (
                a.reviewedAt && (
                  <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                    ผู้พิจารณา {a.reviewedName} · {formatDate(a.reviewedAt)} · {a.remark || 'ไม่มีความเห็นเพิ่มเติม'}
                  </p>
                )
              )}
            </article>
          );
        })
      )}
    </div>
  );
}
