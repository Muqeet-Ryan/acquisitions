import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { timestamp } from 'drizzle-orm/gel-core';

import authRoutes from '#routes/auth.routes.js';
import usersRoutes from '#routes/users.routes.js';
import securityMiddleware from '#middlewares/security.middleware.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser());
app.use(cors());
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);
app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Acquisions!');
  res.status(200).json('Hello from Acquision API');
});


app.get('/api', (req, res) => {
  res.status(200).json('Acquision API is running');
});

app.get('/health', (req,res) => {
  res.status(200).json({status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);


export default app;
