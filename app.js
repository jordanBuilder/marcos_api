require('dotenv').config({path:`${process.cwd()}/.env`});
const express = require('express');

const app = express();


const authRouter = require('./routes/authRoute');

app.get('/',(req, res)=>{
    res.status(200).json({status: 'succcess', message: 'Jordan Building ...'})
});

// al routes will be here

app.use('/api/v1/auth', authRouter);

app.use('*', (req, res, next)=>{
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
})
const PORT = process.env.APP_PORT || 3000;
app.listen(process.env.APP_PORT, ()=>{
    console.log('Server up and running ', PORT);
})