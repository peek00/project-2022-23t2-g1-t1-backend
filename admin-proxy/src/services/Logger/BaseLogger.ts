// Create a Class for the Logger
import { createLogger, format, transports } from "winston";
import WinstonCloudwatch, {
  CloudwatchTransportOptions,
} from "winston-cloudwatch";
import { config } from "../../config/config";
const { CloudWatchConfigPartial } = config;
const { combine, timestamp, printf, colorize } = format;
import AWS from "aws-sdk";

AWS.config.update(config.AWSConfig);

interface Message {
  level: string;
  message: string;
  additionalInfo: string;
}

class Logger {
  private logger: any;

  public constructor(
    production: boolean,
    logGroup: string,
    retentionPolicy: number = 30,
  ) {
    if (production) {
      console.log("Cloudwatch config", CloudWatchConfigPartial);
      const cloudwatchConfig = {
        ...CloudWatchConfigPartial,
        logGroupName: logGroup,
        logStreamName: `${new Date().toISOString().split("T")[0]}`,
        ensureLogGroup: true,
        messageFormatter: ({ level, message, additionalInfo }: Message) =>
          `[${level}] : ${message} \nDetails: ${additionalInfo}`,
        retentionInDays: retentionPolicy,
      };
      this.logger = createLogger({
        transports: [
          new WinstonCloudwatch(
            cloudwatchConfig as CloudwatchTransportOptions,
          ),
          new transports.File({ filename: "/tmp/logs.log"}), //Only for when cloudwatch is not working
        ],
      });
    } else {
      this.logger = createLogger({
        format: combine(
          colorize(),
          timestamp(),
          printf(({ level, message, additionalInfo }) => {
            return `[${level}] : ${message} \nDetails: ${additionalInfo}`;
          }),
        ),
        transports: [
          new transports.Console(),
          new transports.File({ filename: "/tmp/logs.log" })],
      });
    }
  }

  public log(level: string, message: string, addedInfo: any) {
    let additionalInfo = JSON.stringify({
      timestamp: new Date().toISOString(),
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
