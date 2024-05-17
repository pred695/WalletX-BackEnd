const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend origin
    credentials: true,
    exposedHeaders: ["set-cookie"],
  };
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const userRoutes = require('./Routes/userRoutes');
const itemRoutes = require('./Routes/itemRoutes');
const connect = () => {
    try{
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server is running on port ${process.env.SERVER_PORT}`)
        })
    }catch(err){
        console.log(err);
    }
};

connect();
app.use(userRoutes);
app.use(itemRoutes);
