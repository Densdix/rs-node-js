import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream/promises';

export async function generateFileChecksum(parameters, workingDirectory) {
  if (parameters.length !== 1) {
    throw new Error('Incorrect parameter count: checksum requires a single file path');
  }

  const targetFilePath = resolve(workingDirectory, parameters[0]);
  const checksumGenerator = createHash('sha256');
  const fileDataStream = createReadStream(targetFilePath);

  await pipeline(fileDataStream, checksumGenerator);
  console.log(checksumGenerator.digest('hex'));
}
