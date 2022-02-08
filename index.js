console.log(process.env.NODE_ENV);

require('dotenv').config();
const express=require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);

const moment = require('moment-timezone');
const multer = require('multer');
const db = require('./modules/connect-db');
const gdb = require('./modules/connect-gdb');
const sessionStore = new MysqlStore({}, db);

const app=express();

// 使用ejs
app.set('view engine', 'ejs');

/*
// 動態內容寫在這裡，被讀取到也是會蓋掉後面的東西，一樣先後順序問題
app.get('/a.html', (req, res)=>{
    res.send(`<h2>動態內容</h2><p>${Math.random()}</p>`);
});
*/

// Top-level middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
// 讀取public資料夾內的東西
app.use(express.static('public'));

app.use(session({
    saveUninitialized:false,
    resave: false, 
    secret:'jnrgntrh541h54yt4hty484thy4j84hj64tejhsdgf51gf102vdb',
    store: sessionStore,
    cookie:{
        maxAge: 1200000
    }
}));

// 自訂的頂層middleware
app.use((req, res, next)=>{
    res.locals.aaa='被看到了';
    next();
});

app.get('/', (req, res)=>{
    res.render('home', {name:'Cloud'});
});

app.get('/a/b', (req, res)=>{
    res.render('home', {name:'Cloud'});
});
// 這個自我感覺是尾綴不同的時候，引用檔案進來因為所在層級不同導致BS及FA出問題
// 後來聽影片發現想法有誤，是因為他是相對位置

app.get('/json-sales', (req, res)=>{
    // req.query.orderByCol=age;
    // req.query.orderByRule=desc;
    const sales =require('./data/sales');
    // console.log(sales);
    // res.send(sales[0].name);
    res.render('json-sales', {sales});
    // 甚麼時候要用這個阿...?
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
    // 可以拿去網址輸入：http://localhost:3001/try-qs?a[age]=10&a[grnder]=male&b=john
});

app.post('/try-post', (req, res)=>{
    res.json(req.body);
})

app.get('/my-params1/:name?/:age?', (req, res)=>{
    res.json(req.params);
})

// 摳講義的
app.get(/^\/hi\/?/, (req, res)=>{
    let result = {
        url : req.url
    };
    result.split = req.url.split('/');
    res.json(result);
    });

// 多補充的
app.get(['/xxx', '/yyy'], (req, res)=>{
    res.json({x:'y', url: req.url});
});

// 講義範例
app.get(/^\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res)=>{
    let u = req.url.slice(1);  // 取誇號內的數字去掉該量(?)
    // u = u.split('?')[0];  // 以問號切割後取第一個字串
    // u = u.split('-').join('');  // 以-切開後以空字串接起來
    res.send(u);
    });

// ↑改寫
app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/i, (req, res)=>{
    let u = req.url.split('?')[0];
    u = u.slice(3);
    // 用空字串取代掉所有的 -
    u = u.replace(/-/g, '');  // u = u.split('-').join('');

    res.json({mobile: u});
});

// 以引用方式找網址
// app.use( require('./routes/test-peth') );  // 01
// http://localhost:3001/test-peth/ccc/5d5
app.use('/testPath', require('./routes/test-peth') );  // 02

// session設定
app.get('/try-session', (req, res)=>{
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json(req.session);  // 拿來除錯用的樣子
});

// 測試moment-timezone(moment.js, Day.js相同用法)
app.get('/try-moment', (req, res)=>{
    const newMoment= 'YYYY-MM-DD HH:mm:ss';
    res.json({
        當前時間 : moment().format(newMoment),
        倫敦時間 : moment().tz('Europe/London').format(newMoment),
        東京時間 : moment().tz('Asia/Tokyo').format(newMoment),
        cookie失效時間 : moment(req.session.cookie.expires).format(newMoment),
        cookie倫敦失效時間 : moment(req.session.cookie.expires).tz('Europe/London').format(newMoment),
    });
})

// 資料庫連線測試
app.get('/try-db', async(req, res)=>{
    const sql = "SELECT * FROM address_book LIMIT 5"; 
    const [rs, fields]= await db.query(sql);

    res.json(rs);
    // res.json([rs, fields]);
});

// 小組資料庫連線測試
app.get('/try-group-db', async(req, res)=>{
    const sql = "SELECT * FROM classic_product LIMIT 5"; 
    const [rs, fields]= await gdb.query(sql);

    res.json([rs]);
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