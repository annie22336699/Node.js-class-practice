console.log(process.env.NODE_ENV);

require('dotenv').config();
const express=require('express');

const app=express();

// 使用ejs
app.set('view engine', 'ejs');

/*
// 動態內容寫在這裡，被讀取到也是會蓋掉後面的東西，一樣先後順序問題
app.get('/a.html', (req, res)=>{
    res.send(`<h2>動態內容</h2><p>${Math.random()}</p>`);
});
*/

// 讀取public資料夾內的東西
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('home', {name:'Cloud'});
});




// 這類型需要放在最後面，因有先後順序，放在前面讀完會直接執行，就找不到後面了
app.use((req, res)=>{
    res.status(404).send('<h2>error 404 找不到</h2>');
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

// 新增「SET NODE_ENV="       "」，卡開發端或者正式端，方便在開發時候做切換查看，可以載入各種OS系統(寫法不同的因故)，以&&做連接，也可以寫不同的.env檔案進行載入