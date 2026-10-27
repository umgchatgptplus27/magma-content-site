import test from "node:test";
import assert from "node:assert/strict";
import { parseSavedMeasurements, measurementDifference } from "../src/lib/size-compare.mjs";

test("invalid saved measurements cannot break calculator rendering", () => {
  for (const raw of ["null", "[]", "1", '"text"', "{", '{"shirt":null}', '{"shirt":{"chest":null}}', '{"shirt":{"chest":{"mine":54,"target":"56"}}}']) {
    assert.deepEqual(parseSavedMeasurements(raw), {}, raw);
  }
  const saved = { shirt: { chest: { mine: "54", target: "56" } }, trouser: { waist: { mine: "42.5", target: "" } } };
  assert.deepEqual(parseSavedMeasurements(JSON.stringify(saved)), saved);
});

test("difference matches displayed tenth-centimetre precision", () => {
  assert.equal(measurementDifference(54, 56), 2);
  assert.equal(measurementDifference(61, 60), -1);
  assert.equal(measurementDifference(54.1, 54.2), 0.1);
  assert.equal(Math.abs(measurementDifference(54, 53.99)), 0);
  assert.equal(measurementDifference(54, 54.01), 0);
});
