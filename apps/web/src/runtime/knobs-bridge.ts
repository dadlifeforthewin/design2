import type { KnobValues } from './knobs-types';

function injectBeforeBodyEnd(doc: string, script: string): string {
  const idx = doc.lastIndexOf('</body>');
  if (idx === -1) return doc + script;
  return doc.slice(0, idx) + script + doc.slice(idx);
}

export function injectKnobsBridge(
  doc: string,
  options: { initialKnobs: KnobValues | null } = { initialKnobs: null },
): string {
  const initial = options.initialKnobs
    ? JSON.stringify(options.initialKnobs)
    : 'null';
  const script = `<script data-od-knobs-bridge>(function(){
  var current = ${initial};
  function applyOne(cssVar, value){
    if (!cssVar || typeof cssVar !== 'string') return;
    document.documentElement.style.setProperty(cssVar, String(value));
  }
  function applyAll(values){
    if (!values || typeof values !== 'object') return;
    Object.keys(values).forEach(function(k){ applyOne(k, values[k]); });
  }
  window.addEventListener('message', function(ev){
    var data = ev && ev.data;
    if (!data || data.type !== 'od:knobs:set') return;
    applyOne(data.cssVar, data.value);
    if (!current) current = {};
    current[data.cssVar] = data.value;
  });
  function boot(){ if (current) applyAll(current); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();</script>`;
  return injectBeforeBodyEnd(doc, script);
}
