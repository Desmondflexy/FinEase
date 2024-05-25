import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import connectDB from './services/database';
import cors from 'cors';
import path from 'path';
import indexRouter from './routes';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import transactionRouter from './routes/transaction';

dotenv.config();

connectDB();

const port = process.env.PORT || 3000;
const app = express();
app.listen(port, () => {
    console.log(`App is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

app.use(cors({ origin: true, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/account', usersRouter);
app.use('/auth', authRouter);
app.use('/transaction', transactionRouter);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
