import { ProxyController } from "./ProxyController";
import { userAuditLogger, pointsAuditLogger, makerCheckerAuditLogger} from "../../services/Logger";
import { config } from "../../config/config";
const { ProxyPaths } = config

const userProxy = new ProxyController(ProxyPaths.userProxy, "/api/user", userAuditLogger);
const pointsProxy = new ProxyController(ProxyPaths.pointsProxy, "/api/points", pointsAuditLogger);
const makerCheckerProxy = new ProxyController(ProxyPaths.makerCheckerProxy, "/api/maker-checker", makerCheckerAuditLogger);

export { userProxy, pointsProxy, makerCheckerProxy };