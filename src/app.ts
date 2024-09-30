import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import ProductsRouters from './routes/ProductsRouters';
import multer from 'multer';

dotenv.config();
const app = express();
const upload = multer(); // Configure multer for handling multipart/form-data


// Add body-parsing middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Initialize the router and use it
app.use('/api/product',upload.none(), ProductsRouters.init());


export default app;
