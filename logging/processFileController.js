import fs from 'fs';
import { LogService } from './LogService.js';

export const readLogFile = (logFileName) => {
  const log = fs.readFileSync(`/tmp/${logFileName}`, { encoding: 'utf8'});
  return log;
}

const deleteLogFile = (logFileName) => {
  fs.unlinkSync(`/tmp/${logFileName}`);
  return
}

const getOldLogFiles = () => {
  const logFiles = fs.readdirSync('/tmp');
  console.log("Reading FileDir: ", logFiles);
  const curDate = new Date();
  // Return a list of old log files
  return logFiles.filter((logFile) => {
    if (logFile.startsWith('logs-') && logFile.endsWith('.log')) {
      let extractDate = new Date(logFile.split('logs-')[1].split('.log')[0].replace(':', '-')+":00");
      console.log(extractDate);
      // If log file is older than 1 hour
      if (curDate - extractDate > 3600000) {
        return true;
      } else {
        return false;
      }
    }
  });
}

export const processLog = async () => {
  // const curDate = new Date();
  // Format of log file: logs-YYYY-MM-DD:HH:MM.log
  // const logFileName = `logs-${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}:${curDate.getHours()}:${curDate.getMinutes()}.log`;
  const logFiles = getOldLogFiles();
  await Promise.all(logFiles.map(async (logFileName) => {
    // Get old log files
    try {
      const log = readLogFile(logFileName);
      const logRecords = parseLogFile(log);
      await Promise.all(logRecords.map(async (r) => {
        const logGroup = r.logGroup;
        const retentionPolicy = r.retentionPolicy;
        // Remove log group and retention policy from r
        delete r.logGroup;
        delete r.retentionPolicy;
        // Upload Logs to DynamoDB
        await LogService.getInstance().uploadLogs(retentionPolicy, logGroup, r);
      }));
      deleteLogFile(logFileName);
    } catch (error) {
      console.error(error);
    }
  }));
  console.log('Log Processing Done');
}

export const parseLogFile = (log) => {
  // Parse log file
  const logRecords = [];
  const logLines = log.trim().split('\n');
  

  // SAMPLE:
  // [info]  [200]   GET     /User/getUser {"timestamp":"2023-10-25T17:47:14.787Z","logGroup":"user-audit-log","retentionPolicy":30,"userId":"1","message":"{\"firstName\":\"test\",\"lastName\":\"test\",\"email\":\"test@gmail.com\",\"fullName\":\"test test\",\"role\":null,\"userId\":\"ea59eec7-32c3-493b-a162-27ada8f52ad7\"}","userAgent":"PostmanRuntime/7.34.0","ip":"172.28.0.1","country":"unknown"}
  console.log(logLines);
  
  logLines.forEach((logLine) => {
    try {
      // logLine = logLine.trim();
      const logLineParts = logLine.split('\t');
      console.log(logLineParts)
      let logRecord = {};
      logRecord.level = logLineParts[0].slice(1, -1);
      logRecord.statusCode = logLineParts[1].slice(1, -1);
      logRecord.method = logLineParts[2];
      logRecord.path = logLineParts[3];
      const details = JSON.parse(logLineParts[4]);
      logRecord = { ...logRecord, ...details };
      logRecords.push(logRecord);
    } catch (error) {
      console.log(error);
    }
  });

  return logRecords;
}

export const readLogs = () => {
  const curDate = new Date();
  // Format of log file: logs-YYYY-MM-DD:HH:MM.log
  const logFileName = `logs-${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDate()}:${curDate.getHours()}:${curDate.getMinutes()}.log`;
  const log = readLogFile(logFileName);
  console.log(log);
  const logRecords = parseLogFile(log);
  console.log(logRecords);
}