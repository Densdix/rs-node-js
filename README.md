Application CRUD API on noodejs

## Preparing for cross-check

#### Clone repo

```
git clone https://github.com/Densdix/rs-node-js
change branch to simple-crud-api
```

#### Change folder

```
cd rs-node-js
```

#### Install dependencies

```
npm install
```

#### Create .env file in root folder (you can choose any number)

```
PORT=4000
```

#### Run in development mode

```
npm run start:dev
```

#### Run in production mode

```
npm run start:prod
```

#### Run in multi-process mode with load balancer

```
npm run start:multi
```

---

## Opportunities

#### Get all users

```
method: get
address: localhost:4000/api/users
```

#### Add one user

```
method: post
address: localhost:4000/api/users
body: {
    "username": "Javascriptoslav",
    "age": 28,
    "hobbies": ["travels"]
}
```

#### Get user

```
method: get
address: localhost:4000/api/users/${userID}
```

#### Update user

```
method: put
address: localhost:4000/api/users/${userID}
body: {
    "username": "test name2",
    "age": 100,
    "hobbies": ["travels"]
}
```

#### Delete user

```
method: delete
address: localhost:4000/api/users/${userID}
```

---

## Horizontal Scaling

При запуске в многопроцессном режиме (`npm run start:multi`), приложение работает следующим образом:

1. Создаётся балансировщик нагрузки на порту, указанном в переменной окружения PORT (по умолчанию 4000)
2. Запускаются рабочие процессы на последовательных портах (PORT+1, PORT+2, и т.д.) в количестве (CPU-1)
3. Балансировщик распределяет запросы между рабочими процессами, используя алгоритм Round-robin
4. Данные хранятся в памяти процесса и синхронизируются между всеми рабочими процессами через сообщения от основного процесса

Пример с PORT=4000 и 4 CPU:

- Балансировщик нагрузки работает на localhost:4000/api
- Рабочие процессы работают на:
  - localhost:4001/api
  - localhost:4002/api
  - localhost:4003/api
- Запросы распределяются последовательно между рабочими процессами
