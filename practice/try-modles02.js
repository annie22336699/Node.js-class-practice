const Product = require('./../models/Product');

let p2;
(async ()=>{
    // 這邊是察看哪一筆資料，例如下方是第三筆
    p2 = await Product.findOne(3);
    console.log(p2);

    // 修改資料
    const r = await p2.update({author:'登登登'})
    console.log(r);

    process.exit();
})();
