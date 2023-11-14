import { LogService } from "./LogService.js";

const parseTime = (timeString) => {
  try {
    //console.log(timeString);
    const time = Date.parse(timeString);
    //console.log(time);
    return time;
  } catch (error) {
    throw new Error("Invalid time format");
  }
}

export const getAllLogs = async (req, res, next) => {
  try {
    const logOptions = {
      limit: 20,
      order: 'ASC' // ASC || DESC
    };
    if (req.query.logGroup) {
      logOptions.logGroup = req.query.logGroup;
    }
    if (req.query.startTime) {
      logOptions.startTime = parseTime(req.query.startTime);
    }
    if (req.query.endTime) {
      logOptions.endTime = parseTime(req.query.endTime);
    }
    if (req.query.limit) {
      logOptions.limit = req.query.limit;
    }
    if (req.query.offsetId) {
      logOptions.offsetId = req.query.offsetId;
    }
    if (req.query.order) {
      logOptions.order = req.query.order;
    }
    if (req.query.userId) {
      logOptions.userId = req.query.userId;
    }
    
    //console.log(logOptions)
    const logs = await LogService.getInstance().getLogs(logOptions);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

export const getAllLogGroups = async (req, res, next) => {
  try {
    const logGroups = await LogService.getInstance().getLogGroups();
    res.status(200).json(logGroups);
  } catch (error) {
    next(error);
  }
}

