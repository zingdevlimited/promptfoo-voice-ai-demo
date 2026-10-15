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
    value: 'SW1A 1AA',
    expected: 'accept',
  },
  {
    field: 'postcode',
    value: 'S W 1 A 1 A A',
    expected: 'accept',
  },
  {
    field: 'postcode',
    value: 'ess W one A one double A',
    expected: 'accept',
  },

  // Reject
  {
    field: 'postcode',
    value: 'SW1A',
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