import { join, resolve, parse } from "path";
import { readdir, stat } from "fs/promises";

export async function processDirectoryCommands(action, parameters, workingDirectory) {
  switch (action) {
    case "up":
      return navigateToParentDirectory(workingDirectory);
    case "cd":
      return switchToDirectory(parameters[0], workingDirectory);
    case "ls":
      await showDirectoryContents(workingDirectory);
      return workingDirectory;
    default:
      throw new Error("Invalid directory command");
  }
}

function navigateToParentDirectory(workingDirectory) {
  const parentLocation = resolve(workingDirectory, "..");
  if (parentLocation === workingDirectory) {
    console.log("Already at the root level, cannot go higher.");
    return workingDirectory;
  }
  return parentLocation;
}

async function switchToDirectory(targetPath, workingDirectory) {
  const destinationPath = resolve(workingDirectory, targetPath);
  try {
    const pathInfo = await stat(destinationPath);
    if (!pathInfo.isDirectory()) {
      throw new Error("Target is not a directory");
    }
    return destinationPath;
  } catch (err) {
    throw new Error(`Directory access error: ${err.message}`);
  }
}

async function showDirectoryContents(workingDirectory) {
  const entries = await readdir(workingDirectory);
  const contentsDetails = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(workingDirectory, entry);
      const pathInfo = await stat(fullPath);
      return {
        name: entry,
        category: pathInfo.isDirectory() ? "folder" : "file",
      };
    }),
  );

  contentsDetails.sort((entryA, entryB) => {
    if (entryA.category !== entryB.category) {
      return entryA.category === "folder" ? -1 : 1;
    }
    return entryA.name.localeCompare(entryB.name);
  });

  console.table(contentsDetails);
}
