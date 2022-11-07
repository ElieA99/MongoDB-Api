import * as dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import { connectToDatabase } from './database'
import { employeesRouter } from './employee.routes';

dotenv.config();
const {DB_URI} = process.env

if(!DB_URI){
    console.error('No DB_UI')
    process.exit(1);
}

connectToDatabase(DB_URI)
.then(()=>{
    const app = express();
    app.use(cors());
    app.use('/employees',employeesRouter)
    app.listen(5200,()=>{console.log('Server is listening on Port 5200')})
})
.catch(error=>console.error(error));
