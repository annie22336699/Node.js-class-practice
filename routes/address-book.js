const express= require('express');
const db= require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');     // 沒有要處理圖檔，但是送表單需要用他進行處理

const router = express.Router(); 

// 更改與api分開形式
async function getListData(req, res){
    // 頁數的部分
    const perPage =5; // 每頁呈現資料數(一頁幾筆)
    let page= req.query.page ? parseInt(req.query.page) :1;  // 用戶看第幾頁
    // 如果小於第一頁則跳到預設頁(第一頁)
    if(page<1){
        return res.redirect('/address-book/list');
    }

    // 搜尋的部分
    const conditions={};  // 傳到ejs的條件
    let search = req.query.search ? req.query.search : '';
    // search = search.trim();  // 去頭尾空白，但也可以直接接在上面做處理
    let sqlWhere = ' WHERE 1 ';   // 因為是要直接寫進去的SQL語法，首尾空白須注意。讓他為true的意思
    if(search){
        // 如果search有值(為true)
        sqlWhere += ` AND \`name\` LIKE ${db.escape('%'+search+'%')} `
        // https://github.com/mysqljs/mysql：escape()
        conditions.search = search;
    }

    // 輸出
    const output={
        perPage, 
        page, 
        totalRows:0, 
        totalPages:0, 
        rows:[], 
        conditions, 
    };

    const t_sql= `SELECT COUNT(1) num FROM address_book ${sqlWhere} `;
    // return res.send(t_sql); // 除錯用
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    // let totalPages = 0;
    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;
        // 如果大於第後頁則跳到最後頁
        if(page> output.totalPages){
            return res.redirect(`/address-book/list?page=${output.totalPages}`);
        }

        const sql= `SELECT * FROM \`address_book\` ${sqlWhere} LIMIT ${perPage*(page-1)}, ${perPage} `;
        // page-1大概是因為從0開始計
        const [rs2]= await db.query(sql);
        // 在這裡先把日期顯示處理掉，僅影響前端顯示
        rs2.forEach(el=>{
            if(el.birthday !== null){
                el.birthday = res.locals.toDateString(el.birthday);
            }else{
                el.birthday = '尚未輸入生日';
            };
        });
        output.rows=rs2; 
    };
    return output; 
}

// 列表頁面
router.get('/list', async(req, res)=>{
    res.render('address-book/list', await getListData(req, res));
})
router.get('/api/list', async(req, res)=>{
    res.json(await getListData(req, res));
})

// add頁面
router.get('/add', async (req, res)=>{
    res.render('address-book/add');
});

// 使用multipart/form-data的方式傳送
router.post('/add2', upload.none(), async (req, res)=>{
    // upload.none()是作為中繼器(?)掛上去
    res.json(req.body);
});

// 使用application/x-www-form-urlencoded
// application/json的方式傳送
router.post('/add', async (req, res)=>{
    // res.json(req.body);
    const output={
        success: false, 
        error:'',
    }
/*
    // 比較不好的作法，差異在如果表單有新增欄位，就會因為次序跑掉而出錯
    const sql = 'INSERT INTO address_book SET ?';
    const obj = {...req.body, created_at: new Date()};

    const [result] = await db.query(sql, [obj]);
*/

    // 較傳統(佳?)的做法，比照PHP當時候的設置，一欄位就抓一個欄位進行輸出
    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?,NOW())";
    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday  || null,
        req.body.address,
    ]);

    console.log(result);
    res.json(result);
});


// 刪除功能
router.get('/delete/:sid', async (req, res)=>{
    // req.get('Referer');
    const sql = "DELETE FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);
    // res.redirect('/address-book/list');
    res.redirect(req.headers['referer']);
})

// 修改功能
// 接收
router.get('/edit/:sid', async (req, res)=>{

    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);

    if(! result.length){
        return res.redirect('/address-book/list');
    }
    res.render('address-book/edit', result[0]);
})
// 傳送修改值
router.post('/edit/:sid', async (req, res)=>{
    // console.log('req.get:',req.get('Referer'));
    // req.get('Referer');
    const output = {
        success: false,
        error: ''
    };
    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    const [result] = await db.query(sql, [req.body, req.params.sid]);
    
    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;
    console.log(req.query.params);
    res.json(output);
    // console.log('req.headers:',req.headers['referer']);
    // res.redirect(req.headers['referer']);
});

/*
router.get('/list', async(req, res)=>{
    const perPage =5; // 每頁呈現資料數(一頁幾筆)
    let page= req.query.page ? parseInt(req.query.page) :1;  // 用戶看第幾頁
    // 如果小於第一頁則跳到預設頁(第一頁)
    if(page<1){
        return res.redirect('/address-book/list');
    }

    // 輸出
    const output={
        perPage, 
        page, 
        totalRows:0, 
        totalPages:0, 
        rows:[], 
    };

    const t_sql= "SELECT COUNT(1) num FROM address_book";
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    let totalPages = 0;
    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;
        // 如果大於第後頁則跳到最後頁
        if(page> output.totalPages){
            return res.redirect(`/address-book/list?page=${output.totalPages}`);
        }

        const sql= `SELECT * FROM \`address_book\` LIMIT ${perPage*(page-1)}, ${perPage} `;
        // page-1大概是因為從0開始計
        const [rs2]= await db.query(sql); 
        output.rows=rs2; 

    };

    // res.json(output);  // 輸出成json形式(類似api)
    // res.render('address-book/list', output);  // 在網頁內渲染list.ejs
})
*/
module.exports = router;