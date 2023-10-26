import { LogService } from "./LogService.js";

export const getAllLogs = async (req, res, next) => {
  try {
    const logOptions = {};
    if (req.query.logGroup) {
      logOptions.logGroup = req.query.logGroup;
    }
    if (req.query.timestamp) {
      logOptions.timestamp = req.query.timestamp;
    }
    if (req.query.timeStampRange) {
      logOptions.timeStampRange = req.query.timeStampRange;
    }
    console.log(logOptions)
    const logs = await LogService.getInstance().getLogs(logOptions);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

