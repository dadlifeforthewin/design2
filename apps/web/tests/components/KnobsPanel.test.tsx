import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { KnobsPanel } from '../../src/components/KnobsPanel';
import { DEFAULT_KNOBS } from '../../src/runtime/knobs-types';

describe('KnobsPanel', () => {
  it('renders one slider per default knob (5 sliders)', () => {
    const markup = renderToStaticMarkup(<KnobsPanel onKnobChange={() => {}} />);
    const matches = markup.match(/<input type="range"/g);
    expect(matches).not.toBeNull();
    expect(matches?.length).toBe(5);
  });

  it('renders exactly 1 slider when a custom 1-element knobs array is passed', () => {
    const firstKnob = DEFAULT_KNOBS[0]!;
    const singleKnob = [firstKnob];
    const markup = renderToStaticMarkup(
      <KnobsPanel onKnobChange={() => {}} knobs={singleKnob} />,
    );
    const matches = markup.match(/<input type="range"/g);
    expect(matches).not.toBeNull();
    expect(matches?.length).toBe(1);
    expect(markup).toContain(firstKnob.label);
  });

  it('includes the default knob cssVar (--accent-hue) as data-css-var and label in the markup', () => {
    const markup = renderToStaticMarkup(<KnobsPanel onKnobChange={() => {}} />);
    expect(markup).toContain('data-css-var="--accent-hue"');
    expect(markup).toContain('Accent hue');
  });
});
