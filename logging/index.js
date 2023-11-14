import cron from 'node-cron';
import express from 'express';
import { LogService } from './LogService.js';
import { processLog } from './processFileController.js';
import router from './logRoutes.js';
import { handleError } from './errorHandler.js';


const logService = LogService.getInstance();

// Cron job to process log file every hour
// cron.schedule('0 * * * *', () => {
//   processLog();
// });
cron.schedule('*/10 * * * * *', () => {
  //console.log('running a task every 1 minute');
  processLog();
});

// Initialise LogService
logService.initialise()
.then(() => {
  const app = express();
  const port = 3000;

  app.get('/', (req, res) => {
    res.send('Health Check Working at logService');
  });
  app.use('/logs', router);
  app.use(handleError);

  app.listen(port, (req, res) => {
    //console.log(`Log Service listening at http://${process.env.HOST}:${port}`);
  });
})
.catch(err => {
  //console.log(err);
  process.exit(1);
});



