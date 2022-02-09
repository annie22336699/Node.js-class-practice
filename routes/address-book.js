const express= require('express');
const db= require('./../modules/connect-db');

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
        // 在這裡先把日期顯示處理掉
        rs2.forEach(el=>{
            el.birthday = res.locals.toDateString(el.birthday);
        });
        output.rows=rs2; 
    };
    return output; 
}

router.get('/list', async(req, res)=>{
    res.render('address-book/list', await getListData(req, res));
})
router.get('/api/list', async(req, res)=>{
    res.json(await getListData(req, res));
})


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