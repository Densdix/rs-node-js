import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { resolve } from 'path';
import { pipeline } from 'stream/promises';

export async function manageDataCompression(operation, parameters, workingDirectory) {
  if (parameters.length !== 2) {
    throw new Error('Compression requires exactly two parameters: source and destination paths');
  }

  const inputFilePath = resolve(workingDirectory, parameters[0]);
  const outputFilePath = resolve(workingDirectory, parameters[1]);

  const inputStream = createReadStream(inputFilePath);
  const outputStream = createWriteStream(outputFilePath);

  if (operation === 'compress') {
    const compressionProcessor = createBrotliCompress();
    await pipeline(inputStream, compressionProcessor, outputStream);
  } else if (operation === 'decompress') {
    const decompressionProcessor = createBrotliDecompress();
    await pipeline(inputStream, decompressionProcessor, outputStream);
  } else {
    throw new Error('Unsupported compression operation');
  }
}
