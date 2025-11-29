import dotenv from 'dotenv';
dotenv.config();
import app from './server.js'
import connection from './database.js';

connection()

