import { useId } from 'react';
import type { ReactNode } from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/** A single layout for page filters, sized by the available content width. */
export function FilterBar({ title = 'ตัวกรองข้อมูล', description, children, footer, onReset, resetLabel = 'ล้างตัวกรอง' }: {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onReset?: () => void;
  resetLabel?: string;
}) {
  const id = useId();
  return <section aria-labelledby={id} className="filter-panel rounded-2xl border border-slate-200 bg-white shadow-sm print:hidden">
    <div className="filter-heading">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Filter size={18} aria-hidden="true"/></span>
        <div className="min-w-0"><h2 id={id} className="text-sm font-bold leading-6 text-slate-800">{title}</h2>{description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}</div>
      </div>
      {onReset && <button type="button" onClick={onReset} className="filter-reset"><RotateCcw size={14} aria-hidden="true"/>{resetLabel}</button>}
    </div>
    <div className="filter-fields">{children}</div>
    {footer && <div className="filter-footer">{footer}</div>}
  </section>;
}

export function FilterToggle({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return <label className={`filter-toggle ${checked ? 'filter-toggle-active' : ''}`}>
    <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/>
    <span>{children}</span>
  </label>;
}
