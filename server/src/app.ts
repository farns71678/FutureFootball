import express from 'express';
import config from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/apiRoutes.js';
const app = express();
const port = process.env.PORT || 3300;

app.use(express.json());

// api routes
app.use(apiRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server listening on port ${config.port}`);
});
