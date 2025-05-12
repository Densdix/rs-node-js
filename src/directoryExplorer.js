import { createInterface } from "readline";
import { homedir } from "os";
import { processDirectoryCommands } from "./commands/directoryNavigation.js";
import { handleDocumentOperations } from "./commands/documentHandler.js";
import { retrieveSystemDetails } from "./commands/systemInfo.js";
import { generateFileChecksum } from "./commands/checksumGenerator.js";
import { manageDataCompression } from "./commands/archiveTools.js";

const consoleInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let workingDirectory = homedir();

export function initializeDirectoryExplorer(clientIdentifier) {
  displayCurrentLocation();
  consoleInterface.prompt();

  consoleInterface.on("line", async (commandInput) => {
    if (commandInput.trim() === ".exit") {
      consoleInterface.close();
      return;
    }

    try {
      const [action, ...parameters] = commandInput.trim().split(" ");

      switch (action) {
        case "up":
        case "cd":
        case "ls":
          workingDirectory = await processDirectoryCommands(action, parameters, workingDirectory);
          break;
        case "cat":
        case "add":
        case "rn":
        case "cp":
        case "mv":
        case "rm":
          await handleDocumentOperations(action, parameters, workingDirectory);
          break;
        case "os":
          await retrieveSystemDetails(parameters);
          break;
        case "hash":
          await generateFileChecksum(parameters, workingDirectory);
          break;
        case "compress":
        case "decompress":
          await manageDataCompression(action, parameters, workingDirectory);
          break;
        default:
          console.log("Unrecognized command");
      }
    } catch (error) {
      console.log("Command execution failed");
    }

    displayCurrentLocation();
    consoleInterface.prompt();
  });

  consoleInterface.on("close", () => {
    console.log(`Session ended. Thanks for using Directory Explorer, ${clientIdentifier}!`);
    process.exit(0);
  });
  
  function displayCurrentLocation() {
    console.log(`Current location: ${workingDirectory}`);
  }
}
