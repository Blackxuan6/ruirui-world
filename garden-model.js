/* Pure state rules shared by the garden and its regression tests. */
(() => {
  'use strict';
  const kinds = ['peach', 'cloud', 'star'];
  const empty = () => Array.from({ length: 3 }, () => ({ kind: 'peach', stage: 0 }));
  function normalize(value) {
    if (!Array.isArray(value)) return empty();
    return empty().map((fallback, i) => {
      const pot = value[i];
      if (!pot || !kinds.includes(pot.kind) || !Number.isInteger(pot.stage) || pot.stage < 0 || pot.stage > 3) return fallback;
      return { kind: pot.kind, stage: pot.stage };
    });
  }
  function water(value, index, kind) {
    const result = normalize(value);
    if (!Number.isInteger(index) || index < 0 || index > 2 || !kinds.includes(kind)) return result;
    if (result[index].stage === 0) result[index].kind = kind;
    result[index].stage = Math.min(3, result[index].stage + 1);
    return result;
  }
  globalThis.RuiruiGardenModel = Object.freeze({ kinds, empty, normalize, water });
})();
