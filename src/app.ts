import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';

import apiRouter from './routers/api.router';

const app: Application = express();

app.use(express.json());

const NODE_ENV = process.env.NODE_ENV || 'development';
const whitelist: string[] = [];
const corsOptions: CorsOptions = {
    origin: function (origin = '', callback) {
        if (whitelist.indexOf(origin) !== -1) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(NODE_ENV === 'development' ? cors() : cors(corsOptions));

app.get('/', (req: Request, res: Response) => res.send(200));

app.use('/api', apiRouter);

export default app;
