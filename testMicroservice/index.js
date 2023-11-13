// Sample API endpoint

const express = require('express');
const app = express();
const port = 3000;
const host = '0.0.0.0';

// JSON middleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }));


app.get('/:id', (req, res) => {
  console.log(req.params.id);
  console.log(req.headers)
  console.log(req.headers.userid)
  console.log(req.headers.companyid)
  res.send({
    logInfo: "this is a sample log",
    userId: req.headers.userid,
    companyid: req.headers.companyid,
    role: 'admin',
    email: 'admin@example.com',
  });
});

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
