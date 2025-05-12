import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  let callback: jest.Mock;
  let timeout: number;

  beforeAll(() => {
    jest.useFakeTimers();
    callback = jest.fn();
    timeout = 3000;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spyOnTimeout = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);

    expect(spyOnTimeout).toHaveBeenCalledWith(callback, timeout);
    spyOnTimeout.mockRestore();
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    const interval = 1000;

    const spyOnSetInterval = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);
    expect(spyOnSetInterval).toHaveBeenCalledWith(callback, interval);
    spyOnSetInterval.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const times = 5;
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(interval * times);
    expect(callback).toHaveBeenCalledTimes(times);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'index.ts';
    const fullPath = '/path/index.ts';

    (join as jest.Mock).mockReturnValue(fullPath);
    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'index.ts';

    (join as jest.Mock).mockReturnValue('/path/index.ts');
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'index.ts';
    const fileContent = 'Hi!';

    (join as jest.Mock).mockReturnValue('/path/index.ts');
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(fileContent));
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);
  });
});
