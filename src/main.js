import { initializeDirectoryExplorer } from './directoryExplorer.js';

const inputParams = process.argv.slice(2)[0];

let clientIdentifier;

if (inputParams && inputParams.startsWith('--username=')) {
  clientIdentifier = inputParams.split('=')[1];
} else {
  clientIdentifier = 'anonymous visitor';
}

console.log(`Greetings! Directory Explorer is ready, ${clientIdentifier}!`);

initializeDirectoryExplorer(clientIdentifier);

process.on('SIGINT', () => {
    console.log(`Session ended. Thanks for using Directory Explorer, ${clientIdentifier}!`);
    process.exit();
});
 