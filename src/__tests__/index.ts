import http from 'http';
import * as UserModel from '../models/User';
import { createServer } from '../server';

// Используем импорты типов только для TypeScript
import type { jest } from '@jest/globals';

// Объявляем типы для response и request, которые используются в тестах
interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface Response {
  status: number;
  json(): Promise<unknown>;
}

// Тесты для API
describe('API tests', () => {
  const PORT = 4000;
  const BASE_URL = `http://localhost:${PORT}`;
  let server: http.Server;

  // Запустить сервер перед всеми тестами
  beforeAll(() => {
    return new Promise<void>((resolve) => {
      server = createServer();
      server.listen(PORT, () => {
        console.log(`Test server running at http://localhost:${PORT}/`);
        resolve();
      });
    });
  });

  // Очистить данные пользователя после каждого теста
  afterEach(() => {
    // Очистка всех пользователей
    const allUsers = UserModel.getAllUsers();
    for (const user of [...allUsers]) {
      UserModel.deleteUser(user.id);
    }
  });

  // Закрыть сервер после всех тестов
  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => {
        console.log('Test server closed');
        resolve();
      });
    });
  });

  // Вспомогательная функция для выполнения HTTP запросов
  const fetchAPI = async (path: string, options: RequestInit = {}): Promise<Response> => {
    return fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  };

  // Сценарий 1: CRUD операции для пользователей
  describe('Сценарий 1: CRUD операции для пользователей', () => {
    test('GET /api/users возвращает пустой массив при отсутствии пользователей', async () => {
      const response = await fetchAPI('/api/users');
      expect(response.status).toBe(200);

      const data = (await response.json()) as unknown[];
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    test('POST /api/users создает нового пользователя', async () => {
      const newUser = {
        username: 'Иван Иванов',
        age: 30,
        hobbies: ['чтение', 'плавание'],
      };

      const response = await fetchAPI('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      expect(response.status).toBe(201);

      const createdUser = (await response.json()) as UserModel.User;
      expect(createdUser.id).toBeTruthy();
      expect(createdUser.username).toBe(newUser.username);
      expect(createdUser.age).toBe(newUser.age);
      expect(createdUser.hobbies).toEqual(newUser.hobbies);

      // Сохранить ID созданного пользователя для последующих тестов
      return createdUser.id;
    });

    test('GET /api/users/{userId} возвращает созданного пользователя', async () => {
      // Сначала создаем пользователя
      const newUser = {
        username: 'Мария Сидорова',
        age: 25,
        hobbies: ['программирование', 'шахматы'],
      };

      const createResponse = await fetchAPI('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      const createdUser = (await createResponse.json()) as UserModel.User;
      const userId = createdUser.id;

      // Затем получаем пользователя по ID
      const getResponse = await fetchAPI(`/api/users/${userId}`);
      expect(getResponse.status).toBe(200);

      const retrievedUser = (await getResponse.json()) as UserModel.User;
      expect(retrievedUser.id).toBe(userId);
      expect(retrievedUser.username).toBe(newUser.username);
      expect(retrievedUser.age).toBe(newUser.age);
      expect(retrievedUser.hobbies).toEqual(newUser.hobbies);
    });

    test('PUT /api/users/{userId} обновляет пользователя', async () => {
      // Сначала создаем пользователя
      const newUser = {
        username: 'Алексей Петров',
        age: 35,
        hobbies: ['футбол', 'готовка'],
      };

      const createResponse = await fetchAPI('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      const createdUser = (await createResponse.json()) as UserModel.User;
      const userId = createdUser.id;

      // Затем обновляем пользователя
      const updatedUserData = {
        username: 'Алексей Петров',
        age: 36,
        hobbies: ['футбол', 'готовка', 'путешествия'],
      };

      const updateResponse = await fetchAPI(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUserData),
      });

      expect(updateResponse.status).toBe(200);

      const updatedUser = (await updateResponse.json()) as UserModel.User;
      expect(updatedUser.id).toBe(userId);
      expect(updatedUser.age).toBe(updatedUserData.age);
      expect(updatedUser.hobbies).toEqual(updatedUserData.hobbies);
    });

    test('DELETE /api/users/{userId} удаляет пользователя', async () => {
      // Сначала создаем пользователя
      const newUser = {
        username: 'Ольга Смирнова',
        age: 28,
        hobbies: ['танцы', 'пение'],
      };

      const createResponse = await fetchAPI('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      const createdUser = (await createResponse.json()) as UserModel.User;
      const userId = createdUser.id;

      // Затем удаляем пользователя
      const deleteResponse = await fetchAPI(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      expect(deleteResponse.status).toBe(204);

      // Проверяем, что пользователя больше нет
      const getResponse = await fetchAPI(`/api/users/${userId}`);
      expect(getResponse.status).toBe(404);
    });
  });

  // Сценарий 2: Проверка валидации данных
  describe('Сценарий 2: Проверка валидации данных', () => {
    test('POST /api/users возвращает ошибку при невалидных данных', async () => {
      const invalidUser = {
        username: '', // Пустое имя пользователя
        age: 'тридцать', // Некорректный тип данных для возраста
        hobbies: 'чтение', // Не массив
      };

      const response = await fetchAPI('/api/users', {
        method: 'POST',
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);
    });

    test('PUT /api/users/{userId} возвращает ошибку при невалидных данных', async () => {
      // Сначала создаем пользователя
      const newUser = {
        username: 'Иван Сергеев',
        age: 40,
        hobbies: ['гольф', 'теннис'],
      };

      const createResponse = await fetchAPI('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      const createdUser = (await createResponse.json()) as UserModel.User;
      const userId = createdUser.id;

      // Попытка обновления с невалидными данными
      const invalidUserData = {
        username: 123, // Некорректный тип данных для имени
        age: -5, // Отрицательный возраст
        hobbies: [123, 456], // Некорректные хобби
      };

      const updateResponse = await fetchAPI(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(invalidUserData),
      });

      expect(updateResponse.status).toBe(400);
    });
  });

  // Сценарий 3: Проверка несуществующих ресурсов
  describe('Сценарий 3: Проверка несуществующих ресурсов', () => {
    test('GET /api/users/{nonExistentId} возвращает 400 для несуществующего пользователя', async () => {
      const nonExistentId = '12345678-1234-1234-1234-123456789012';
      const response = await fetchAPI(`/api/users/${nonExistentId}`);
      expect(response.status).toBe(400);
    });

    test('PUT /api/users/{nonExistentId} возвращает 400 для несуществующего пользователя', async () => {
      const nonExistentId = '12345678-1234-1234-1234-123456789012';
      const userData = {
        username: 'Тест Тестов',
        age: 50,
        hobbies: ['рисование'],
      };

      const response = await fetchAPI(`/api/users/${nonExistentId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      expect(response.status).toBe(400);
    });

    test('DELETE /api/users/{nonExistentId} возвращает 400 для несуществующего пользователя', async () => {
      const nonExistentId = '12345678-1234-1234-1234-123456789012';

      const response = await fetchAPI(`/api/users/${nonExistentId}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(400);
    });
  });
});
