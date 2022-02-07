const express = require('express');

const router = express.Router();

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