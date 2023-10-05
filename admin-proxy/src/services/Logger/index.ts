import AuditLogger from "./AuditLogger";
import { config } from "../../config/config";
const { AdditionalInfo, RententionPolicy } = config;

// Instantiate audit loggers with different log groups
const userAuditLogger = new AuditLogger(
  "user-audit-log",
  AdditionalInfo.User,
  RententionPolicy.User,
);
const pointsAuditLogger = new AuditLogger(
  "points-audit-log",
  AdditionalInfo.Points,
  RententionPolicy.Points,
);
const makerCheckerAuditLogger = new AuditLogger(
  "maker-checker-audit-log",
  AdditionalInfo.MakerChecker,
  RententionPolicy.MakerChecker,
);

// Export AuditLoggers
// module.exports = { userAuditLogger, pointsAuditLogger, makerCheckerAuditLogger };
export { userAuditLogger, pointsAuditLogger, makerCheckerAuditLogger };
