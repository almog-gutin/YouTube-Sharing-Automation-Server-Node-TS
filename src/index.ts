import dotenv from 'dotenv';
import config from 'config';

const NODE_ENV: string = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config({ path: '.env' });

const PORT: string | number = config.get('PORT');

import app from './app';
app.listen(PORT, (): void => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
