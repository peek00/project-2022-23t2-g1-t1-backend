// Create a Class for the Logger
import { createLogger, format, transports } from 'winston';
import WinstonCloudwatch, { CloudwatchTransportOptions } from 'winston-cloudwatch';
import { config } from "../../config/config";
const { CloudWatchConfigPartial } = config;
const { combine, timestamp, printf, colorize } = format;

interface Message{
  level: string;
  message: string;
  additionalInfo: string;
}

class Logger {
  private logger: any;

  public constructor(production: boolean, logGroup: string, retentionPolicy: number = 30) {
    if (production) {
      const cloudwatchConfig = {
        ...CloudWatchConfigPartial,
        logGroupName: logGroup,
        logStreamName: `${logGroup}-${process.env.NODE_ENV}`,
        messageFormatter: ({ level, message, additionalInfo }: Message) =>
          `[${level}] : ${message} \nDetails: ${additionalInfo}`,
        retentionInDays: retentionPolicy,
      };
      this.logger = new WinstonCloudwatch(cloudwatchConfig as CloudwatchTransportOptions);
    } else {
      this.logger = createLogger({
        format: combine(
          colorize(), 
          timestamp(), 
          printf(({ level, message, additionalInfo }) => {
            return `[${level}] : ${message} \nDetails: ${additionalInfo}`;
          })),
        transports: [new transports.Console()],
      });
    }
  }

  public log(level: string, message: string, addedInfo: any) {
    let additionalInfo = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...JSON.parse(addedInfo),
    })
    if (level === 'info') {
      this.logger.info(message, { additionalInfo });
    }
    else if (level === 'error') {
      this.logger.error(message, { additionalInfo });
    }
  }
}

export default Logger;