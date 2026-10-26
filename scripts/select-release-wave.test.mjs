import test from 'node:test';
import assert from 'node:assert/strict';
import { selectReleaseWave } from './select-release-wave.mjs';
const waves = [
  { wave: 1, date: '2026-09-27', pillars: ['shirt'] },
  { wave: 2, date: '2026-09-29', pillars: ['shoe'] },
  { wave: 13, date: '2026-10-27', pillars: ['shirt', 'shoe'] },
];
test('staged revisions wait for their new release date', () => {
  assert.equal(selectReleaseWave(waves, '2026-10-26', new Set(['shirt', 'shoe'])), undefined);
});
test('reused slugs select wave 13 rather than completed wave 1', () => {
  assert.equal(selectReleaseWave(waves, '2026-10-27', new Set(['shirt', 'shoe'])), 13);
});
test('no pending release after staged files are published', () => {
  assert.equal(selectReleaseWave(waves, '2026-10-27', new Set()), undefined);
});
test('distinct overdue waves keep their original order', () => {
  assert.equal(selectReleaseWave(waves.slice(0, 2), '2026-10-27', new Set(['shirt', 'shoe'])), 1);
});
