console.log(process.env.NODE_ENV);

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

// 因為package.json無法註解所以寫在這裡
// 總之就是在debug那邊新增start及dev語法(?)
// 可以使用「npm start」「npm test」可以自動執行該行內容
// 但是dev需要+run：「npm run dev」

// 新增「SET NODE_ENV="       "」，卡開發端或者正式端，方便在開發時候做切換查看，可以載入各種OS系統(寫法不同的因故)，以&&做連接，也可以寫不同的.env檔案進行仔載入