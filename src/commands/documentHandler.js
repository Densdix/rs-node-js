import { createReadStream, createWriteStream } from "fs";
import { unlink, rename, writeFile, stat, access } from "fs/promises";
import { join, resolve, basename } from "path";
import { pipeline } from "stream/promises";

export async function handleDocumentOperations(action, parameters, workingDirectory) {
  switch (action) {
    case "cat":
      return displayFileContents(parameters[0], workingDirectory);
    case "add":
      return createEmptyFile(parameters[0], workingDirectory);
    case "rn":
      return renameExistingFile(parameters[0], parameters[1], workingDirectory);
    case "cp":
      return duplicateFile(parameters[0], parameters[1], workingDirectory);
    case "mv":
      return relocateFile(parameters[0], parameters[1], workingDirectory);
    case "rm":
      return deleteFile(parameters[0], workingDirectory);
    default:
      throw new Error("Unsupported file operation");
  }
}

async function displayFileContents(filePath, workingDirectory) {
  const absolutePath = resolve(workingDirectory, filePath);
  return new Promise((resolvePromise, rejectPromise) => {
    const fileStream = createReadStream(absolutePath);
    fileStream.on("error", (err) => {
      rejectPromise(err);
    });

    fileStream.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    fileStream.on("end", () => {
      resolvePromise();
    });
  });
}

async function createEmptyFile(fileName, workingDirectory) {
  const absolutePath = join(workingDirectory, fileName);
  try {
    await access(absolutePath);
    throw new Error("A file with this name already exists");
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeFile(absolutePath, "");
    } else {
      throw err;
    }
  }
}

async function renameExistingFile(oldFilePath, newFileName, workingDirectory) {
  const sourceAbsolutePath = resolve(workingDirectory, oldFilePath);
  const targetAbsolutePath = join(workingDirectory, newFileName);
  await rename(sourceAbsolutePath, targetAbsolutePath);
}

async function duplicateFile(sourcePath, destinationPath, workingDirectory) {
  try {
    const sourceAbsolutePath = resolve(workingDirectory, sourcePath);
    let destAbsolutePath = resolve(workingDirectory, destinationPath);

    try {
      await stat(sourceAbsolutePath);
    } catch (err) {
      throw new Error(`Source file not found: ${sourcePath}`);
    }

    try {
      const destInfo = await stat(destAbsolutePath);

      if (destInfo.isDirectory()) {
        destAbsolutePath = join(destAbsolutePath, basename(sourceAbsolutePath));
      }
    } catch (err) {}

    const sourceStream = createReadStream(sourceAbsolutePath);
    const destinationStream = createWriteStream(destAbsolutePath);

    await pipeline(sourceStream, destinationStream);
  } catch (err) {
    console.error(`Copy failed: ${err.message}`);
    throw err;
  }
}

async function relocateFile(sourcePath, destinationPath, workingDirectory) {
  try {
    const sourceAbsolutePath = resolve(workingDirectory, sourcePath);
    let destAbsolutePath = resolve(workingDirectory, destinationPath);

    try {
      await stat(sourceAbsolutePath);
    } catch (err) {
      throw new Error(`Source file not found: ${sourcePath}`);
    }

    try {
      const destInfo = await stat(destAbsolutePath);

      if (destInfo.isDirectory()) {
        destAbsolutePath = join(destAbsolutePath, basename(sourceAbsolutePath));
      }
    } catch (err) {}

    try {
      await rename(sourceAbsolutePath, destAbsolutePath);
    } catch (err) {
      if (err.code === "EXDEV") {
        await duplicateFile(sourcePath, destinationPath, workingDirectory);
        await deleteFile(sourcePath, workingDirectory);
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error(`Move failed: ${err.message}`);
    throw err;
  }
}

async function deleteFile(filePath, workingDirectory) {
  const absolutePath = resolve(workingDirectory, filePath);
  await unlink(absolutePath);
}
