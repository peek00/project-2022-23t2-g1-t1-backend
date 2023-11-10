// Create a Class for the Logger
import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

export class Logger {
  private static instance: Logger;
  private logger: any;

  private constructor() {
    this.createLogger();
  }

  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  public createLogger(): void {
    // Get name of the log file based on timestamp
    const curDate = new Date();
    // Format of log file: logs-YYYY-MM-DD:HH.log
    const logFileName = `logs-${curDate.toUTCString()}.log`;
    console.log("Creating logger for", logFileName);
    this.logger = createLogger({
      format: combine(
        // colorize(),
        timestamp(),
        printf(({ level, message, additionalInfo }) => {
          return `[${level}]\t${message}\t${additionalInfo}`;
        }),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: `/tmp/${logFileName}`, options:{
          flags: 'a+',
          encoding: 'utf8',
        } })],
    });
  }

  public log(level: string, message: string, addedInfo: any) {
    let additionalInfo = JSON.stringify({
      timestamp: new Date().toUTCString(),
      ...JSON.parse(addedInfo),
    });
    try {
      if (level === "info") {
        console.log("Logging info", message, additionalInfo)
        this.logger.info(message, { additionalInfo });
      } else if (level === "error") {
        this.logger.error(message, { additionalInfo });
      }
    } catch (err) {
      // Handle when logger fails
      console.log("Logger failed", err);
    }
  }
}

export default Logger;
