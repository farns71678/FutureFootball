import cors from 'cors';
import express from 'express';
import config from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/apiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();

app.use(express.json());

if (config.nodeEnv === 'development') {
  app.use(cors());
}

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
