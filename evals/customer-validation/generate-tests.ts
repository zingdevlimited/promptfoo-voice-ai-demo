import testData, {
  type Field,
  type ExpectedResult,
} from './test-data.ts';

interface GeneratedTest {
  description: string;
  vars: {
    userMessage: string;
    field?: Field;
    expected?: ExpectedResult;
  };
  metadata: {
    conversationId: string;
  };
  assert?: Array<{
    type: 'javascript';
    value: string;
    metric: string;
  }>;
}

function addTurn(
  tests: GeneratedTest[],
  conversationId: string,
  description: string,
  userMessage: string
): void {
  tests.push({
    description,
    vars: {
      userMessage,
    },
    metadata: {
      conversationId,
    },
  });
}

export default async function generateTests(): Promise<GeneratedTest[]> {
  const tests: GeneratedTest[] = [];

  testData.forEach((test, index) => {
    const conversationId = `${test.field}-${index + 1}`;

    // Consent has already been requested when the conversation begins.
    addTurn(
      tests,
      conversationId,
      `${test.field} ${index + 1} - consent`,
      'Yes'
    );

    // Postcode and DOB require a valid address first.
    if (test.field === 'postcode' || test.field === 'dob') {
      addTurn(
        tests,
        conversationId,
        `${test.field} ${index + 1} - valid address`,
        '5 Oxford Street'
      );
    }

    // DOB also requires a valid postcode.
    if (test.field === 'dob') {
      addTurn(
        tests,
        conversationId,
        `${test.field} ${index + 1} - valid postcode`,
        'CW10 0AB'
      );
    }

    // Actual field being evaluated.
    tests.push({
      description: `${test.field} - ${test.value} - expected ${test.expected}`,
      vars: {
        userMessage: test.value,
        field: test.field,
        expected: test.expected,
      },
      metadata: {
        conversationId,
      },
      assert: [
        {
          type: 'javascript',
          value: 'file://field-validation.ts',
          metric: 'FieldValidation',
        },
      ],
    });
  });

  return tests;
}