// set-db-host.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const envPath = path.join(__dirname, '.env');
let envFile = fs.readFileSync(envPath, 'utf8');

envFile = envFile.replace(/(DATABASE_HOST=).*/, `$1localhost`);

fs.writeFileSync(envPath, envFile);
