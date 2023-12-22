import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';


import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const MONGO_URL = 'mongodb+srv://equipe4:equipe4winners@appcarte.gtk5evw.mongodb.net/?retryWrites=true&w=majority';

const dbAndServerStart = async (): Promise<void> => {
    
    try {
        mongoose.Promise = Promise;
        await mongoose.connect(MONGO_URL);

        server.listen(8080, () => {
            console.log("Le serveur est en marche");
        })
    } catch (error) {
        console.log(error);
    }
    

}

dbAndServerStart();

app.use('/', router());