import type {
  Field,
  ExpectedResult,
} from './test-data.js';

interface AssertionContext {
  vars: {
    field?: Field;
    expected?: ExpectedResult;
  };
}

interface AssertionResult {
  pass: boolean;
  score: number;
  reason: string;
}

export default function validateField(
  output: unknown,
  context: AssertionContext
): AssertionResult {
  const { field, expected } = context.vars;
  const text = String(output).toLowerCase();

  let progressed = false;
  let stayedOnField = false;

  switch (field) {
    case 'address':
      progressed = /\bpostcode\b/.test(text);

      stayedOnField =
        /\baddress\b/.test(text) ||
        /\bfirst line\b/.test(text) ||
        /\bhouse number\b/.test(text) ||
        /\bbuilding name\b/.test(text) ||
        /\bstreet\b/.test(text) ||
        /\broad\b/.test(text) ||
        /\bproperty\b/.test(text) ||
        /\bwhere do you live\b/.test(text);

      break;

    case 'postcode':
      progressed =
        /\bdate of birth\b/.test(text) ||
        /\bdob\b/.test(text);

      stayedOnField =
        /\bpostcode\b/.test(text) ||
        /\bpostal code\b/.test(text) ||
        /\bfull postcode\b/.test(text) ||
        /\bcomplete postcode\b/.test(text) ||
        /\brepeat.*postcode\b/.test(text) ||
        /\bcan you give me.*postcode\b/.test(text) ||
        /\bcan you confirm.*postcode\b/.test(text);

      break;

    case 'dob':
      progressed =
        /\bthank you\b/.test(text) ||
        /\bthanks\b/.test(text) ||
        /\beverything i need\b/.test(text) ||
        /\ball the information\b/.test(text) ||
        /\ball the details\b/.test(text);

      stayedOnField =
        /\bdate of birth\b/.test(text) ||
        /\bdob\b/.test(text) ||
        /\bbirth date\b/.test(text) ||
        /\bbirthday\b/.test(text) ||
        /\bday.*month.*year\b/.test(text) ||
        /\bfull date\b/.test(text) ||
        /\bcomplete date\b/.test(text) ||
        /\byear of birth\b/.test(text) ||
        /\brepeat.*date\b/.test(text) ||
        /\bcan you give me.*date\b/.test(text) ||
        /\bcan you confirm.*date\b/.test(text);

      break;

    default:
      return {
        pass: false,
        score: 0,
        reason: `Unknown field: ${field}`,
      };
  }

  let pass: boolean;

  if (expected === 'accept') {
    pass = progressed;
  } else if (expected === 'reject') {
    pass = !progressed && stayedOnField;
  } else {
    return {
      pass: false,
      score: 0,
      reason: `Unknown expected value: ${expected}`,
    };
  }

  return {
    pass,
    score: pass ? 1 : 0,
    reason: pass
      ? `${field}: correctly ${expected}`
      : expected === 'accept'
        ? `${field}: expected accept, but model did not progress`
        : `${field}: expected reject, but model ${
            progressed
              ? 'progressed'
              : 'did not stay on the same field'
          }`,
  };
}