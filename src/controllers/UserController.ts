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

export function addControllerUser(req: http.IncomingMessage, res: http.ServerResponse) {
  let user: User;
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const newUser: User = { id: uuidv4(), ...JSON.parse(body) };
    user = addUser(newUser);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  });
}

export function updateControllerUser(id: string, req: http.IncomingMessage, res: http.ServerResponse): void {
  const users = getAllUsers();
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const updatedUser: User = JSON.parse(body);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      const user = updateUser(id, updatedUser);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
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
