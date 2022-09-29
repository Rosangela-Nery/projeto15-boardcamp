import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import boardroutes from './routes/boardroutes.js';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use(boardroutes);

server.listen(4000, () => {
    console.log("Server open in 4000")
});