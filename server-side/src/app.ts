import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import router from './routes';
import database from './models';
import cookieParser from 'cookie-parser';

dotenv.config();

database.connect()

const port = process.env.PORT || 3000;
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

app.use('/', router.index);
app.use('/account', router.users);
app.use('/auth', router.auth);
app.use('/transaction', router.transaction);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
