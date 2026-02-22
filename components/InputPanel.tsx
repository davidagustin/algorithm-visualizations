'use client';

import React from 'react';
import { InputField } from '@/lib/types';

interface InputPanelProps {
  fields: InputField[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onSubmit: () => void;
}

export default function InputPanel({
  fields,
  values,
  onChange,
  onSubmit,
}: InputPanelProps) {
  function handleFieldChange(field: InputField, rawValue: string) {
    const newValues = { ...values };

    switch (field.type) {
      case 'array':
      case 'tree': {
        // Parse comma-separated values into number array
        const parsed = rawValue
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== '')
          .map((s) => {
            if (s === 'null') return null;
            const n = Number(s);
            return isNaN(n) ? s : n;
          });
        newValues[field.name] = parsed;
        break;
      }
      case 'number': {
        const n = Number(rawValue);
        newValues[field.name] = isNaN(n) ? 0 : n;
        break;
      }
      case 'string': {
        newValues[field.name] = rawValue;
        break;
      }
    }

    onChange(newValues);
  }

  function getDisplayValue(field: InputField): string {
    const val = values[field.name];
    if (val === undefined || val === null) return '';
    if (Array.isArray(val)) return val.join(', ');
    return String(val);
  }

  function handleResetDefaults() {
    const defaults: Record<string, unknown> = {};
    for (const field of fields) {
      defaults[field.name] = field.defaultValue;
    }
    onChange(defaults);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
        Custom Input
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              {field.label}
            </label>
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={getDisplayValue(field)}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={field.placeholder || ''}
              className="w-full px-3 py-2 text-sm font-mono bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors duration-200"
            />
            {field.helperText && (
              <span className="text-xs text-[var(--text-muted)]">
                {field.helperText}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-110"
          style={{ background: 'var(--gradient-brand)' }}
        >
          Run
        </button>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-overlay)] transition-all duration-200"
        >
          Reset to Default
        </button>
      </div>
    </form>
  );
}
