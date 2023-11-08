import Logger from "./Logger";
import { Request } from "express";
import geoIp from "geoip-country";
import requestIP from "request-ip";

class AuditLogger {
  private retentionPolicy: number = 30;
  private logGroup: string = "";
  private logger: Logger;

  constructor(
    logGroup: string,
    retentionPolicy: number = 30,
  ) {
    this.logGroup = logGroup;
    this.retentionPolicy = retentionPolicy;
    this.logger = Logger.getInstance();
  }

  public logRequest(
    status: number,
    details: any,
    req: Request,
    originalIP: string,
    userId: string,
  ) {
    let ip = originalIP || '';
    // let ip = requestIP.getClientIp(req)?.replace("::ffff:", "");
    let country = "unknown";
    if (ip.length > 0) {
      console.log(ip);
      const lookup = geoIp.lookup(ip);
      console.log(lookup);
      if (lookup) country = lookup.country;
    }

    const message = `[${status}]\t${req.method}\t${req.path}`;
    const additionalInfo = JSON.stringify({
      logGroup:this.logGroup,
      retentionPolicy: this.retentionPolicy,
      userId,
      message: details,
      userAgent: req.headers["user-agent"],
      ip,
      country,
    })
    if (status === 200) {
      this.logger.log("info", message, additionalInfo);
    } else {
      this.logger.log("error", message, additionalInfo);
    }
  }
}

export default AuditLogger;
