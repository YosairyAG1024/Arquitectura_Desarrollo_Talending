import "dotenv/config";
import express from 'express'; //para el servidor
import { healthCheck } from './controllers/health.controller.js';
import {  register, login } from './controllers/auth.controller.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.get("/api/health", healthCheck);
app.use('/api/auth/', authRouter);

const port = 1234;

const server = app.listen(port, () => {
    console.log(`Listening on port ${ server.address().port}`);
});

server.on('close', () => {
    console.log('El servidor se ha cerrado');
});

server.on('error', (error) => {
    console.error('Error del servidor:', error);
});