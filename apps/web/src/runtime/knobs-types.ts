export type KnobValues = Record<string, string>;

export interface KnobDef {
  cssVar: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

export interface KnobsMessage {
  type: 'od:knobs:set';
  cssVar: string;
  value: string;
}

export const DEFAULT_KNOBS: KnobDef[] = [
  { cssVar: '--accent-hue', label: 'Accent hue', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 200 },
  { cssVar: '--accent-sat', label: 'Accent saturation', min: 0, max: 100, step: 1, unit: '%', defaultValue: 65 },
  { cssVar: '--spacing-unit', label: 'Spacing unit', min: 4, max: 24, step: 1, unit: 'px', defaultValue: 8 },
  { cssVar: '--font-size-scale', label: 'Type scale', min: 0.8, max: 1.4, step: 0.05, unit: '', defaultValue: 1 },
  { cssVar: '--radius', label: 'Corner radius', min: 0, max: 32, step: 1, unit: 'px', defaultValue: 6 },
];
