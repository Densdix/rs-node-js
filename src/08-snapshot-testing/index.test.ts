import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const values = ['a', 'b'];
    const expectedLinkedList = {
      value: 'a',
      next: {
        value: 'b',
        next: {
          value: null,
          next: null,
        },
      },
    };
    const generatedLinkedList = generateLinkedList(values);
    expect(generatedLinkedList).toStrictEqual(expectedLinkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const testString = 'This is test string.';
    const values = testString.split('');
    const generatedLinkedList = generateLinkedList(values);
    expect(generatedLinkedList).toMatchSnapshot();
  });
});
