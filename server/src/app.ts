import express from 'express';
import config from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/apiRoutes.js';
const app = express();

app.use(express.json());

// api routes 
// todo: implement Access-Control-Allow-Origin
app.use(apiRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
