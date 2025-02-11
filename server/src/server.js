import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRouter from './routes/auth.route.js'
import { requestLimiter } from './utils/rateLimit.utils.js';

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(requestLimiter);

app.get('/', (req, res) => {
    res.status(200).json({ message : 'Hello from backend!'});
});

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server is running...');
});