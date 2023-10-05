import Logger from "./BaseLogger";
import { Request } from "express";
import geoIp from "geoip-country";
import requestIP from "request-ip";

class AuditLogger extends Logger {
  private additionalAttributes: string[] = [];

  constructor(
    logGroup: string,
    additionalAttributes: string[],
    retentionPolicy: number = 30,
  ) {
    super(process.env.NODE_ENV === "production", logGroup, retentionPolicy);
    this.additionalAttributes = additionalAttributes;
  }

  public logRequest(status: number, details: any, req: Request) {
    let ip = requestIP.getClientIp(req)?.replace("::ffff:", "");
    let country = "unknown";
    if (ip) {
      console.log(ip);
      const lookup = geoIp.lookup(ip);
      console.log(lookup);
      if (lookup) country = lookup.country;
    }

    const message = `[${status}] ${req.method} ${req.path}, ip: ${ip}, country: ${country}, userAgent: ${req.headers["user-agent"]}`;
    try {
      const additionalInfo = this.retrieveAdditionalInfo(
        JSON.parse(details || "{}"),
      );
      if (status === 200) {
        this.log("info", message, additionalInfo);
      } else if (status === 304) {
        throw new Error("Resource hasn't changed, reading from cache");
      } else {
        this.log("error", message, additionalInfo);
      }
    } catch (err) {
      this.log(
        "error",
        message,
        JSON.stringify({
          error: (err as Error).message,
        }),
      );
    }
  }

  retrieveAdditionalInfo(body: any) {
    let additionalInfo = this.additionalAttributes.reduce((acc, curr) => {
      if (body[curr]) {
        return { ...acc, [curr]: body[curr] };
      }
      return acc;
    }, {});
    return JSON.stringify(additionalInfo);
  }
}

export default AuditLogger;
