export interface User {
  id: string;
  age: number;
  username: string;
  hobbies: string[];
}

let users: User[] = [];

export const getAllUsers = () => users;

export const addUser = (user: User) => {
  users.push(user);

  return user;
};

export const getUserById = (id: string) => {
  return users.find((user) => user.id === id);
};

export const updateUser = (id: string, updatedUser: Partial<User>) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
  }

  return users[userIndex];
};

export const deleteUser = (id: string) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    return true;
  } else {
    return false;
  }
};
