import AuditLogger from "./AuditLogger";
import { config } from "../../config/config";
const { RententionPolicy } = config;

// Instantiate audit loggers with different log groups
const userAuditLogger = new AuditLogger(
  "user-audit-log",
  RententionPolicy.User,
);
const pointsAuditLogger = new AuditLogger(
  "points-audit-log",
  RententionPolicy.Points,
);
const makerCheckerAuditLogger = new AuditLogger(
  "maker-checker-audit-log",
  RententionPolicy.MakerChecker,
);

// Export AuditLoggers
export { userAuditLogger, pointsAuditLogger, makerCheckerAuditLogger };
