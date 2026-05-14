import React, { useState } from 'react';
import { DEFAULT_KNOBS, type KnobDef } from '../runtime/knobs-types';

export interface KnobChangePayload {
  cssVar: string;
  value: string;
}

export interface KnobsPanelProps {
  onKnobChange: (p: KnobChangePayload) => void;
  knobs?: KnobDef[];
}

export function KnobsPanel({ onKnobChange, knobs = DEFAULT_KNOBS }: KnobsPanelProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(knobs.map(k => [k.cssVar, k.defaultValue])),
  );

  function handleChange(knob: KnobDef, raw: string) {
    const num = Number(raw);
    setValues(v => ({ ...v, [knob.cssVar]: num }));
    const value = knob.unit ? `${num}${knob.unit}` : String(num);
    onKnobChange({ cssVar: knob.cssVar, value });
  }

  return (
    <div
      data-testid="knobs-panel"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 280,
        background: 'rgba(20,20,22,0.92)',
        color: '#fff',
        padding: 16,
        borderRadius: 12,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 12 }}>Knobs</div>
      {knobs.map(knob => (
        <div key={knob.cssVar} style={{ marginBottom: 10 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>{knob.label}</span>
            <span style={{ opacity: 0.6 }}>{values[knob.cssVar]}{knob.unit}</span>
          </label>
          <input
            type="range"
            min={knob.min}
            max={knob.max}
            step={knob.step}
            value={values[knob.cssVar]}
            data-css-var={knob.cssVar}
            onChange={e => handleChange(knob, e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
}
