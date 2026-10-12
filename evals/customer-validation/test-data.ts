export type Field = 'address' | 'postcode' | 'dob';
export type ExpectedResult = 'accept' | 'reject';

export interface TestData {
  field: Field;
  value: string;
  expected: ExpectedResult;
}

const testData: TestData[] = [
  // --------------------
  // ADDRESS
  // --------------------

  // Accept
  {
    field: 'address',
    value: 'Five Oxford Street',
    expected: 'accept',
  },
  {
    field: 'address',
    value: 'Flat two, ten High Road',
    expected: 'accept',
  },
  {
    field: 'address',
    value: 'West Cottage',
    expected: 'accept',
  },

  // Reject
  {
    field: 'address',
    value: 'Flat 2',
    expected: 'reject',
  },
  {
    field: 'address',
    value: 'somewhere on Oxford Street',
    expected: 'reject',
  },

  // --------------------
  // POSTCODE
  // --------------------

  // Accept
  {
    field: 'postcode',
    value: 'CW10 0AB',
    expected: 'accept',
  },
  {
    field: 'postcode',
    value: 'C W 1 0 0 A B',
    expected: 'accept',
  },
  {
    field: 'postcode',
    value: 'see W 10 zero A B',
    expected: 'accept',
  },

  // Reject
  {
    field: 'postcode',
    value: 'CW10',
    expected: 'reject',
  },
  {
    field: 'postcode',
    value: "I don't know",
    expected: 'reject',
  },

  // --------------------
  // DOB
  // --------------------

  // Accept
  {
    field: 'dob',
    value: '01/01/94',
    expected: 'accept',
  },
  {
    field: 'dob',
    value: '1st January 94',
    expected: 'accept',
  },
  {
    field: 'dob',
    value: '1 1 90',
    expected: 'accept',
  },

  // Reject
  {
    field: 'dob',
    value: '1994',
    expected: 'reject',
  },
  {
    field: 'dob',
    value: "I'm 32",
    expected: 'reject',
  },
];

export default testData;