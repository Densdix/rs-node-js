import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.useFakeTimers();

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const axiosClient = {
      get: jest.fn().mockResolvedValueOnce({ data: 'response' }),
    };
    const axiosCreateMock = (axios.create as jest.Mock).mockReturnValueOnce(
      axiosClient,
    );
    await throttledGetDataFromApi('/query');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    axiosCreateMock.mockRestore();
  });

  test('should perform request to correct provided url', async () => {
    const axiosClient = {
      get: jest.fn().mockResolvedValueOnce({ data: 'response' }),
    };
    const axiosCreateMock = (axios.create as jest.Mock).mockReturnValueOnce(
      axiosClient,
    );
    await throttledGetDataFromApi('/query');
    await jest.advanceTimersByTimeAsync(5500);
    expect(axiosClient.get).toHaveBeenCalledWith('/query');
    axiosCreateMock.mockRestore();
  });

  test('should return response data', async () => {
    const axiosClient = {
      get: jest.fn().mockResolvedValueOnce({ data: 'response' }),
    };
    const axiosCreateMock = (axios.create as jest.Mock).mockReturnValueOnce(
      axiosClient,
    );
    const result = await throttledGetDataFromApi('/query');
    expect(result).toEqual('response');
    axiosCreateMock.mockRestore();
  });
});
