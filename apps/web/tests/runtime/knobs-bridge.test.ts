import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { injectKnobsBridge } from '../../src/runtime/knobs-bridge';

describe('injectKnobsBridge', () => {
  it('injects a script tag with data-od-knobs-bridge attribute', () => {
    const doc = '<html><body><h1>hi</h1></body></html>';
    const out = injectKnobsBridge(doc, { initialKnobs: null });
    expect(out).toContain('data-od-knobs-bridge');
    expect(out).toContain('<script');
    expect(out).toContain('</body>');
  });

  it('preserves the original doc content', () => {
    const doc = '<html><body><h1>hi</h1></body></html>';
    const out = injectKnobsBridge(doc, { initialKnobs: null });
    expect(out).toContain('<h1>hi</h1>');
  });

  it('serializes initialKnobs into the injected script', () => {
    const doc = '<html><body></body></html>';
    const out = injectKnobsBridge(doc, { initialKnobs: { '--accent-hue': '200' } });
    expect(out).toContain('"--accent-hue"');
    expect(out).toContain('"200"');
  });

  it('applies initialKnobs CSS variables on boot via JSDOM evaluation', async () => {
    const doc = '<!doctype html><html><head></head><body></body></html>';
    const out = injectKnobsBridge(doc, { initialKnobs: { '--accent-hue': '200' } });

    const dom = new JSDOM(out, { runScripts: 'dangerously' });
    // JSDOM fires DOMContentLoaded asynchronously; wait one microtask cycle.
    await new Promise<void>((resolve) => {
      if (dom.window.document.readyState !== 'loading') resolve();
      else dom.window.document.addEventListener('DOMContentLoaded', () => resolve());
    });
    const value = dom.window.document.documentElement.style.getPropertyValue('--accent-hue');
    expect(value).toBe('200');
  });

  it('applies od:knobs:set postMessage via JSDOM evaluation', () => {
    const doc = '<!doctype html><html><head></head><body></body></html>';
    const out = injectKnobsBridge(doc, { initialKnobs: null });

    const dom = new JSDOM(out, { runScripts: 'dangerously' });
    const win = dom.window as unknown as Window & typeof globalThis;

    // Dispatch a postMessage to the iframe window to simulate host control
    win.dispatchEvent(
      new win.MessageEvent('message', {
        data: { type: 'od:knobs:set', cssVar: '--accent-hue', value: '42' },
      }),
    );

    const value = win.document.documentElement.style.getPropertyValue('--accent-hue');
    expect(value).toBe('42');
  });
});
