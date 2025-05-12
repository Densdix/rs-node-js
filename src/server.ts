import http from 'http';
import dotenv from 'dotenv';
import {
  addControllerUser,
  deleteControllerUser,
  getControllerAllUsers,
  getControllerUserById,
  updateControllerUser,
} from './controllers/UserController';
import { isValidUUIDv4 } from './utils/uuidValidator';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  // Welcome route
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify('Welcome to the API!'));
  }

  //Get all users
  else if (req.method === 'GET' && (req.url === '/users' || req.url === '/users/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const allUsers = getControllerAllUsers();
    res.end(JSON.stringify(allUsers));
  }
  //Get user by id
  else if (req.method === 'GET' && req.url?.startsWith('/users/')) {
    const id = req.url.split('/')[2];

    if (!isValidUUIDv4(id)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid user ID format');
      return;
    }

    const user = getControllerUserById(id);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  }

  //Create user
  else if (req.method === 'POST' && req.url === '/users') {
    addControllerUser(req, res);
  } //Update user
  else if (req.method === 'PUT' && req.url?.startsWith('/users/')) {
    const id = req.url.split('/')[2];

    if (!isValidUUIDv4(id)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid user ID format');
      return;
    }

    updateControllerUser(id, req, res);
  }
  //Delete user
  else if (req.method === 'DELETE' && req.url?.startsWith('/users/')) {
    const id = req.url.split('/')[2];

    if (!isValidUUIDv4(id)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid user ID format');
      return;
    }

    deleteControllerUser(id, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
