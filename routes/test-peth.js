const express = require('express');
const res = require('express/lib/response'); 
const db= require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');

const router = express.Router();

// 為了處理react添加的form表單圖片上傳
router.get('/myform/:sid', async (req, res)=>{
    const sid = parseInt(req.params.sid) || 0;
    const [rs] = await db.query(`SELECT account,avatar,nickname FROM admins WHERE sid=${sid}`);

    res.json(rs);
});
router.put('/myform/:sid', async ()=>{

});

// 自訂的middleware
router.use((req, res, next)=>{
    res.locals.aaa += ' yeaaaaa';
    next();
})

// 02
router.get('/', (req, res)=>{
    res.send('測試前綴添加路徑用的根目錄');
});

// 02
router.get('/:p1?/:p2?', (req, res)=>{
    let {params, url, originalUrl, baseUrl}=req;
    res.json({params, url, originalUrl, baseUrl, 'locals.aaa':res.locals.aaa});
});

// 01
router.get('/test-peth/:p1?/:p2?', (req, res)=>{
    res.json(req.params);
});

module.exports = router;