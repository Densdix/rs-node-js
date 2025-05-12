import { EOL, cpus, homedir, userInfo, arch } from 'os';

export async function retrieveSystemDetails(parameters) {
  switch (parameters[0]) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;
    case '--cpus':
      displayProcessorInfo();
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--architecture':
      console.log(arch());
      break;
    default:
      throw new Error('Unknown system information request');
  }
}

function displayProcessorInfo() {
  const processors = cpus();
  console.log(`System has ${processors.length} processors`);
  
  processors.forEach((processor, idx) => {
    console.log(`Processor ${idx + 1}:`);
    console.log(`  Model: ${processor.model}`);
    console.log(`  Frequency: ${processor.speed / 1000} GHz`);
  });
}
