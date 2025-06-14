const express = require('express');
const cors = require('cors')
const faceRouter = require('./routers/faceRouter')
const db = require('./config/dbconfig');
const bodyParser = require('body-parser');
const protectedRoute = require('./routers/protectedRoutes');

const userRouters = require('./routers/userRouters')

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', userRouters);
app.use('/face', faceRouter);
app.use('/api', protectedRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
