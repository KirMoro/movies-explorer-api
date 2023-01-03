import express from 'express';
import bodyParser from 'body-parser';
import process from 'process';
import mongoose from 'mongoose';
import { constants } from 'http2';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { router } from './routes/index.js';

// HELMET + RATE LIMITS

const { PORT = 3000 } = process.env;

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());
app.options('*', cors());

dotenv.config();
const config = dotenv.config({
  path: path
    .resolve(process.env.NODE_ENV === 'production' ? '.env' : '.env.common'),
})
  .parsed;

app.set('config', config);

mongoose.set({ runValidators: true });
mongoose.connect(process.env.DB_URL);
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const status = err.status || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = status === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Неизвестная ошибка' : err.message;
  res.status(status).send({ message });
  next();
});

app.listen(PORT);
