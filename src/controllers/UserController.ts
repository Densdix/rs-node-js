import { addUser, deleteUser, getAllUsers, updateUser } from '../models/User';
import type { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';

export function getControllerAllUsers(): User[] {
  return getAllUsers();
}

export function getControllerUserById(id: string): User | undefined {
  const users = getAllUsers();

  return users.find((user) => user.id === id);
}

function validateUserData(userData: any): { isValid: boolean; message?: string } {
  if (!userData) {
    return { isValid: false, message: 'Request body is empty' };
  }

  if (typeof userData.username !== 'string' || !userData.username.trim()) {
    return { isValid: false, message: 'username is required and must be a non-empty string' };
  }

  if (typeof userData.age !== 'number' || isNaN(userData.age)) {
    return { isValid: false, message: 'age is required and must be a number' };
  }

  if (!Array.isArray(userData.hobbies)) {
    return { isValid: false, message: 'hobbies must be an array' };
  }

  if (userData.hobbies.some((hobby: any) => typeof hobby !== 'string')) {
    return { isValid: false, message: 'all hobbies must be strings' };
  }

  return { isValid: true };
}

export function addControllerUser(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const userData = JSON.parse(body);
      const validation = validateUserData(userData);

      if (!validation.isValid) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(validation.message);
        return;
      }

      const newUser: User = { id: uuidv4(), ...userData };
      const user = addUser(newUser);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON format');
    }
  });
}

export function updateControllerUser(id: string, req: http.IncomingMessage, res: http.ServerResponse): void {
  const users = getAllUsers();
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const updatedUserData = JSON.parse(body);
      const validation = validateUserData(updatedUserData);

      if (!validation.isValid) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(validation.message);
        return;
      }

      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        const user = updateUser(id, updatedUserData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON format');
    }
  });
}

export function deleteControllerUser(id: string, res: http.ServerResponse): void {
  const isDeleted = deleteUser(id);

  if (isDeleted) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('User not found');
  }
}
