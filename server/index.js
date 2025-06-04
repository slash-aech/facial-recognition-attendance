const express = require('express');
const cors = require('cors')
const db = require('./config/dbconfig');

const userRouters = require('./routers/userRouters')

const app = express();
app.use(cors())
app.use(express.json());

app.use('/', userRouters);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
