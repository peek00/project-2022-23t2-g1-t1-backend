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
  res.send({
    userId: req.params.id || 'default',
    role: 'admin',
    email: 'admin@example.com',
  });
});

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});
