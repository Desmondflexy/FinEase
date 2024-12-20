import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import path from 'path';
import { homeRouter, appRouter } from './routes';
import cookieParser from 'cookie-parser';
import { connectDb } from './config';
import dotenv from 'dotenv';

dotenv.config();
connectDb();

const port = process.env.PORT || '3000';
const app = express();
app.listen(port, () => {
    console.log(`App is running on port ${port} in ${process.env.NODE_ENV} mode`);
});

app.use(cors({ origin: true, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', homeRouter);
app.use('/', appRouter);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
