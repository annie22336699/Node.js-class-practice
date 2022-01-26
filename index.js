require('dotenv').config();
const express=require('express');

const app=express();

app.get('/',(req, res)=>{
    res.send('<h2>Hello</h2>');
})

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`server started: ${port} - `, new Date());
    console.log(`http://localhost:${port}`);
})