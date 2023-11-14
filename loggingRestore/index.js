// Read log file 
import fs from 'fs';
// import path from 'path';
import cron from 'node-cron';
// const logPath = path.join(__dirname, 'logs.log');

export const readLog = () => {
  try {
    return fs.readFileSync('/tmp/logs.log', 'utf-8');
  } catch (err) {
    // //console.log(err);
    return '';
  }
}

// Cron job to read log file every second
cron.schedule('* * * * * *', () => {
  //console.log(1)
  //console.log(readLog());
});