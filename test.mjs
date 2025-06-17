import { process } from './process.mjs';

const tests = [
  {
    store: [{ size: 2, quantity: 1 }],
    order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
    expected: {
      isPossible: true,
      mismatches: 1,
    },
  },
  {
    store: [{ size: 3, quantity: 1 }],
    order: [{ id: 102, size: [1, 2], masterSize: "s1" }],
    expected: {
      isPossible: false,
    },
  },
  {
    store: [{ size: 2, quantity: 4 }],
    order: [
      { id: 101, size: [2] },
      { id: 102, size: [1, 2], masterSize: "s2" },
    ],
    expected: {
      isPossible: true,
      mismatches: 0,
    },
  },
  {
    store: [
      { size: 1, quantity: 1 },
      { size: 2, quantity: 2 },
      { size: 3, quantity: 1 },
    ],
    order: [
      { id: 100, size: [1] },
      { id: 101, size: [2] },
      { id: 102, size: [2, 3], masterSize: "s1" },
      { id: 103, size: [1, 2], masterSize: "s2" },
    ],
    expected: {
      isPossible: true,
      mismatches: 1,
    },
  },
];

tests.forEach((test, i) => {
  const result = process(test.store, test.order);
  const passed =
    (result === false && test.expected.isPossible === false) ||
    (result !== false &&
      test.expected.isPossible === true &&
      result.mismatches === test.expected.mismatches);
  
  console.log(`Test #${i + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  if (!passed) {
    console.log('Expected:', test.expected);
    console.log('Got:', result);
  }
});
