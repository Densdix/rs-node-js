import cluster from 'cluster';
import http from 'http';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const BASE_PORT = parseInt(process.env.PORT || '4000', 10);
const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
const numWorkers = numCPUs - 1 || 1;

if (cluster.isPrimary) {
  console.log(`Мастер-процесс ${process.pid} запущен`);
  console.log(`Запуск ${numWorkers} воркеров`);

  const loadBalancer = http.createServer((req, res) => {
    const workerIndex =
      cluster.workers && Object.keys(cluster.workers).length > 0 ? (currentWorkerIndex++ % numWorkers) + 1 : 1;

    const workerPort = BASE_PORT + workerIndex;

    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    console.log(`Балансировщик: перенаправление запроса с ${BASE_PORT} на порт ${workerPort}`);

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error(`Ошибка прокси-запроса: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Внутренняя ошибка сервера');
    });

    req.pipe(proxyReq);
  });

  let currentWorkerIndex = 0;

  loadBalancer.listen(BASE_PORT, () => {
    console.log(`Балансировщик запущен на http://localhost:${BASE_PORT}/`);
  });

  for (let i = 1; i <= numWorkers; i++) {
    cluster.fork({ WORKER_ID: i, PORT: BASE_PORT + i });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Воркер ${worker.process.pid} завершился с кодом ${code} и сигналом ${signal}`);
    console.log('Запуск нового воркера...');
    cluster.fork({ WORKER_ID: worker.id, PORT: BASE_PORT + worker.id });
  });
} else {
  const workerPort = process.env.PORT;
  const workerId = process.env.WORKER_ID;

  console.log(`Воркер ${process.pid} (ID: ${workerId}) запущен и слушает порт ${workerPort}`);

  import('./server');
}
