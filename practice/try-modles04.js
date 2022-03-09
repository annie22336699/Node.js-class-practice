const Product = require('./../models/Product');

let p4;
(async ()=>{
    // 刪除
    p4 = await Product.findOne(26)
    console.log(await p4.remove());

    process.exit();
})();
